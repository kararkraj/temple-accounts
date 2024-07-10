import { Component, EffectRef, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoadingController, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSelect, IonSelectOption, IonInput, IonButtons, IonMenuButton, IonNote, IonItem, IonText, IonItemDivider, IonItemGroup, IonLabel, IonSegment, IonSegmentButton, IonIcon, IonTabButton, IonTabBar, IonTabs } from '@ionic/angular/standalone';
import { Temple } from 'src/app/interfaces/temple';
import { PdfmakeService } from 'src/app/services/pdfmake.service';
import { CharityType } from 'src/app/interfaces/charityType';
import { EntryService } from 'src/app/services/entry.service';
import { Entry } from 'src/app/interfaces/entry';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.page.html',
  styleUrls: ['./add-entry.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonSegmentButton, IonSegment, IonLabel, IonItemGroup, IonItemDivider, IonText,
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButtons,
    IonMenuButton,
    IonNote,
    IonItem
  ]
})
export class AddEntryPage implements OnInit {

  entryForm: FormGroup;
  temples: Temple[] = [];
  charityTypes: CharityType[] = [];
  currentSegment: string = "preset";
  updatedTemplesEffect: EffectRef = effect(() => {
    this.entryService.getTemplesUpdatedSignal();
    this.getTemples();
  });
  updatedCharityTypesEffect: EffectRef = effect(() => {
    this.entryService.getCharityTypesUpdatedSignal();
    this.getCharityTypes();
  });

  constructor(
    private entryService: EntryService,
    private formBuilder: FormBuilder,
    private pdfService: PdfmakeService,
    public loader: LoadingController,
    private toaster: ToasterService
  ) {
    this.entryForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9 ]+")]],
      temple: [null, [Validators.required]],
      charityType: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.getTemples();
    this.getCharityTypes();
  }

  getTemples() {
    this.entryService.getTemples().then(temples => {
      this.temples = temples;
      if (this.temples.length === 1) {
        this.entryForm.patchValue({ temple: this.temples[0] });
      }
    });
  }

  getCharityTypes() {
    this.entryService.getCharityTypes().then(charityTypes => {
      this.charityTypes = charityTypes;
      if (this.charityTypes.length === 1) {
        this.entryForm.patchValue({ charityType: this.charityTypes[0] });
      }
    });
  }

  async onSubmit() {
    if (this.entryForm.valid) {
      const loader = await this.loader.create({ message: 'Adding temple...' });
      await loader.present();

      const id = await this.entryService.getEntryNextId();
      const createdOn = new Date().toISOString();
      this.entryService.addEntry({ ...this.entryForm.getRawValue(), id, createdOn }).subscribe(res => {
        this.pdfService.generateAndDownloadPDF(res);
        this.resetForm();
        loader.dismiss();
      });
    } else {
      this.entryForm.markAllAsTouched();
    }
  }

  onTempleSelection(event: any) {
  }

  onCharityTypeSelection(event: any) {
  }

  onSegmentChange(event: any) {
    const currentSegment = event.target.value;
    if (currentSegment === "custom") {
      this.entryForm.removeControl("charityType");
      this.entryForm.addControl("charityType", this.formBuilder.group({
        name: [null, [Validators.required, Validators.min(1)]],
        amount: [null, [Validators.required, Validators.min(1)]]
      }));
    } else {
      if (this.charityTypes.length === 0) {
        this.toaster.presentToast({ message: "No preset services found. Go to Services => Add Service to add preset services.", color: "danger", duration: 5000 });
      }
      this.entryForm.removeControl("charityType");
      this.entryForm.addControl("charityType", new FormControl(null, [Validators.required]));
      if (this.charityTypes.length === 1) {
        this.entryForm.patchValue({ charityType: this.charityTypes[0] })
      }
    }
    this.currentSegment = currentSegment;
  }

  resetForm() {
    let defaultValue: Partial<Entry> = {};
    if (this.temples.length === 1) {
      defaultValue.temple = this.temples[0];
    }
    this.entryForm.reset(defaultValue);
  }

}