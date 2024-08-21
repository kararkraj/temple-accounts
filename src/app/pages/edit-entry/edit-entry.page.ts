import { Component, Input } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonItem, IonSelectOption, IonInput, IonLabel, IonButton, IonSelect, IonBackButton, IonGrid, IonRow, IonCol, LoadingController } from '@ionic/angular/standalone';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Entry } from 'src/app/interfaces/entry';
import { EntryService } from 'src/app/services/entry.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { PdfmakeService } from 'src/app/services/pdfmake.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-edit-entry',
  templateUrl: './edit-entry.page.html',
  styleUrls: ['./edit-entry.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonItem, IonSelectOption, IonInput, IonLabel, IonButton, IonSelect, IonBackButton, IonGrid, IonRow, IonCol, AsyncPipe]
})
export class EditEntryPage {

  entryForm: FormGroup;
  title: string = 'Edit entry';
  @Input({ required: true }) entryId!: string;
  entry!: Entry;

  constructor(
    private entryService: EntryService,
    private loader: LoadingController,
    private toaster: ToasterService,
    private pdfService: PdfmakeService
  ) {
    this.entryForm = new FormGroup({
      title: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required, Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9 ]+")])
    });
  }

  async ngOnInit() {
    this.entry = await this.entryService.getEntryById(this.entryId);
    this.resetForm();
  }

  async onSubmit() {
    if (this.entryForm.valid && this.entryForm.dirty) {
      const loader = await this.loader.create({ message: 'Updating entry...' });
      await loader.present();

      let entry: Partial<{ name: string, title: string }> = {}
      this.entryForm.get('title')?.dirty ? entry.title = this.entryForm.get('title')?.value : null;
      this.entryForm.get('name')?.dirty ? entry.name = this.entryForm.get('name')?.value : null;

      try {
        this.entry = await this.entryService.updateEntry(this.entryId, entry);
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

  resetForm() {
    this.entryForm.patchValue(this.entry);
  }

}
