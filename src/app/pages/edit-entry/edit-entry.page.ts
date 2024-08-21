import { Component, Input } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonItem, IonSelectOption, IonSegment, IonInput, IonSegmentButton, IonLabel, IonButton, IonSelect, IonBackButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { AddEntryPage } from '../add-entry/add-entry.page';
import { ReactiveFormsModule } from '@angular/forms';
import { Entry, EntryAdd } from 'src/app/interfaces/entry';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './../add-entry/add-entry.page.html',
  styleUrls: ['./../add-entry/add-entry.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonItem, IonSelectOption, IonSegment, IonInput, IonSegmentButton, IonLabel, IonButton, IonSelect, IonBackButton, IonGrid, IonRow, IonCol]
})
export class EditEntryPage extends AddEntryPage {

  @Input({ required: true }) entryId!: string;
  entry!: Entry;

  override ngOnInit(): void {
    this.title = 'Edit entry';
    this.isEdit = true;
  }

  override async ionViewWillEnter() {
    await this.getTemples();
    await this.getCharityTypes();
    this.entry = await this.entryService.getEntryById(this.entryId);

    this.resetForm();
  }

  override async onSubmit() {
    if (this.entryForm.valid && this.entryForm.dirty) {
      const loader = await this.loader.create({ message: 'Updating entry...' });
      await loader.present();

      const charityType = this.entryForm.get('charityType')?.value;
      const temple = this.entryForm.get('temple')?.value;

      let entry: Partial<EntryAdd> = {}
      this.entryForm.get('title')?.dirty ? entry.title = this.entryForm.get('title')?.value : null;
      this.entryForm.get('name')?.dirty ? entry.name = this.entryForm.get('name')?.value : null;
      if (this.entryForm.get('temple')?.dirty) {
        entry.templeName = temple.name;
        entry.templeAddress = temple.address;
        entry.templeId = temple.id;
      }
      if (this.entryForm.get('charityType')?.dirty) {
        entry.charityTypeId = this.ionSegment.value === "custom" ? '' : charityType.id;
      }
      // charityTypeAmount: this.ionSegment.value === "custom" ? this.entryForm.get('charityTypeAmount')?.value : charityType.amount,
      // charityTypeName: this.ionSegment.value === "custom" ? this.entryForm.get('charityTypeName')?.value : charityType.name,

      try {
        this.entry = await this.entryService.updateEntry(this.entryId, entry);
        this.resetForm();
        this.toaster.presentToast({ message: 'Entry was updated successfully.', color: 'success' });
        this.pdfService.generateAndDownloadPDF(this.entry);
      } catch (e: any) {
        this.toaster.presentToast({ message: `Error: ${e.code}`, color: 'danger' });
        console.error("Error updating document: ", e);
      } finally {
        this.resetForm();
        loader.dismiss();
      }
    } else if (!this.entryForm.valid) {
      this.entryForm.markAllAsTouched();
    } else {
      await this.toaster.presentToast({ message: "Nothing to update.", color: "success" });
    }
  }

  patchTemple() {
    let selectedTemple = this.temples.find(temple => temple.id === this.entry.templeId);
    if (!selectedTemple) {
      selectedTemple = {
        id: this.entry.templeId,
        address: this.entry.templeAddress,
        name: this.entry.templeName,
        createdAt: '',
        createdBy: '',
        updatedAt: ''
      }
      this.temples = [selectedTemple];
      this.entryForm.get('temple')?.disable();
    }
    this.entryForm.get('temple')?.patchValue(selectedTemple);
  }

  patchCharityType() {
    let charityType = this.charityTypes.find(charityType => charityType.id === this.entry.charityTypeId);
    const isPresetAndDeleted = this.entry.charityTypeId && !charityType;
    const selectedSegment = isPresetAndDeleted || charityType ? 'preset' : 'custom';
    this.ionSegment.writeValue(selectedSegment);
    this.onSegmentChange(selectedSegment);
    if (isPresetAndDeleted) {
      this.ionSegment.setDisabledState(true);
      this.charityTypes = [{
        id: this.entry.charityTypeId,
        createdAt: '',
        createdBy: '',
        updatedAt: '',
        amount: this.entry.charityTypeAmount,
        name: this.entry.charityTypeName
      }];
      this.entryForm.get('charityType')?.patchValue(this.charityTypes[0]);
      this.entryForm.get('charityType')?.disable();
    } else {
      if (charityType) {
        this.entryForm.get('charityType')?.patchValue(charityType);
      } else {
        this.entryForm.get('charityTypeName')?.patchValue(this.entry.charityTypeName);
        this.entryForm.get('charityTypeAmount')?.patchValue(this.entry.charityTypeAmount);
      }
    }
  }

  override resetForm() {
    this.patchTemple();
    this.patchCharityType();
    this.entryForm.patchValue({
      title: this.entry.title,
      name: this.entry.name
    });
  }

}
