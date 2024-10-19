import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSelect, IonSelectOption, IonInput, IonButtons, IonMenuButton, IonNote, IonItem, IonText, IonItemDivider, IonItemGroup, IonLabel, IonSegment, IonSegmentButton, IonIcon, IonTabButton, IonTabBar, IonTabs, IonBackButton, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { Temple } from 'src/app/interfaces/temple';
import { PdfmakeService } from 'src/app/services/pdfmake.service';
import { CharityType } from 'src/app/interfaces/charityType';
import { EntryService } from 'src/app/services/entry.service';
import { EntryAdd } from 'src/app/interfaces/entry';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.page.html',
  styleUrls: ['./add-entry.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonBackButton, IonTabs, IonTabBar, IonTabButton, IonIcon, IonSegmentButton, IonSegment, IonLabel, IonItemGroup, IonItemDivider, IonText, ReactiveFormsModule, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonInput, IonButtons, IonMenuButton, IonNote, IonItem]
})
export class AddEntryPage implements OnInit {

  title: string = 'Add entry';
  isEdit: boolean = false;

  entryForm: FormGroup;
  temples: Temple[] = [];
  charityTypes: CharityType[] = [];
  @ViewChild('ionSegment') ionSegment!: IonSegment;

  constructor(
    public entryService: EntryService,
    private formBuilder: FormBuilder,
    public pdfService: PdfmakeService,
    public loader: LoadingController,
    public toaster: ToasterService
  ) {
    this.entryForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9 ]+")]],
      templeId: [null, [Validators.required]],
      charityType: [null, [Validators.required]],
      charityTypeName: [null, [Validators.required, Validators.maxLength(50)]],
      charityTypeAmount: [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getTemples();
    this.getCharityTypes();
  }

  async getTemples() {
    this.temples = await this.entryService.getTemples()
    if (this.temples.length === 1) {
      this.entryForm.patchValue({ templeId: this.temples[0].id });
    }
  }

  async getCharityTypes() {
    this.charityTypes = await this.entryService.getCharityTypes();

    // By default, preset segment is selected and if no preset service exists then error toaster should be shown.
    // Hence the below function is called.
    this.onPresetServiceSelection();

    // If charity types is available, then select preset else select custom segment segment
    this.charityTypes.length > 0 ? this.ionSegment.writeValue("preset") : this.ionSegment.writeValue("custom");
    this.onSegmentChange(this.ionSegment.value);
  }

  async onSubmit() {
    if (this.entryForm.valid) {
      const charityType = this.entryForm.get('charityType')?.value;

      let entry: EntryAdd = {
        title: this.entryForm.get('title')?.value,
        name: this.entryForm.get('name')?.value,
        serviceId: this.ionSegment.value === "custom" ? '' : charityType.id,
        serviceAmount: this.ionSegment.value === "custom" ? this.entryForm.get('charityTypeAmount')?.value : charityType.amount,
        serviceName: this.ionSegment.value === "custom" ? this.entryForm.get('charityTypeName')?.value : charityType.name,
      }

      try {
        const templeId = this.entryForm.get('templeId')?.value;
        const entryRes = await this.entryService.addEntry(entry, templeId);
        this.toaster.presentToast({ message: 'Entry was added successfully.', color: 'success' });

        const temple = this.temples.find(temple => temple.id === templeId) as Temple;
        this.pdfService.generateAndDownloadPDF({ 
          ...entryRes,
          templeAddress: temple?.address,
          templeName: temple?.name
        });
      } catch (e: any) {
        this.toaster.presentToast({ message: `Error: ${e.code}`, color: 'danger' });
        console.error("Error adding document: ", e);
      } finally {
        this.resetForm();
      }
    } else {
      this.entryForm.markAllAsTouched();
    }
  }

  onTempleSelection(event: any) {
  }

  onCharityTypeSelection(event: any) {
  }

  onSegmentChange(currentSegment: any) {
    if (currentSegment === "custom") {
      this.onCustomServiceSelection();
    } else {
      this.onPresetServiceSelection();
    }
  }

  onPresetServiceSelection() {
    if (this.charityTypes.length === 0) {
      this.toaster.presentToast({ message: "No preset services found. Go to Services => Add Service to add preset services.", color: "danger", duration: 5000 });
    }
    this.entryForm.get("charityTypeName")?.disable();
    this.entryForm.get("charityTypeAmount")?.disable();

    this.entryForm.get("charityType")?.enable();
    this.entryForm.get('charityType')?.reset();

    if (this.charityTypes.length === 1) {
      this.entryForm.patchValue({ charityType: this.charityTypes[0] })
    }
  }

  onCustomServiceSelection() {
    this.entryForm.get('charityType')?.disable();

    this.entryForm.get("charityTypeName")?.enable();
    this.entryForm.get("charityTypeAmount")?.enable();
  }

  resetForm() {
    let defaultValue: { temple?: any, charityType?: any } = {};

    this.temples.length === 1 ? defaultValue.temple = this.temples[0] : null;
    this.charityTypes.length === 1 ? defaultValue.charityType = this.charityTypes[0] : null;

    this.entryForm.reset(defaultValue);
  }

}