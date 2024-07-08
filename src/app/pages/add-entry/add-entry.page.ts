import { Component, EffectRef, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSelect, IonSelectOption, IonInput, IonButtons, IonMenuButton, IonNote, IonItem, IonText } from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import { DataService } from 'src/app/services/data.service';
import { Temple } from 'src/app/interfaces/temple';
import { PdfmakeService } from 'src/app/services/pdfmake.service';
import { TempleService } from 'src/app/interfaces/templeService';


@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.page.html',
  styleUrls: ['./add-entry.page.scss'],
  standalone: true,
  imports: [IonText,
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
  temples!: Temple[];
  templeServices!: TempleService[];
  updatedTemplesEffect: EffectRef = effect(() => {
    this.dataService.templesUpdatedSignal();
    this.getTemples();
  });

  constructor(
    private storage: StorageService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private pdfService: PdfmakeService
  ) {
    this.entryForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9 ]+")]],
      temple: [null, [Validators.required]],
      templeService: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.entryForm.controls["templeService"].disable();
    this.getTemples();
  }

  getTemples() {
    this.dataService.getTemples().then(temples => {
      this.temples = temples;
      if (this.temples.length === 1) {
        this.entryForm.patchValue({ temple: this.temples[0] });
      }
    });
  }

  async onSubmit() {
    this.entryForm.markAllAsTouched();
    if (this.entryForm.valid) {
      console.log(this.entryForm.value);
      const id = await this.storage.get('lastStoredId') + 1;
      this.dataService.addEntry({ id, ...this.entryForm.getRawValue() }).subscribe(res => {
        this.pdfService.generateAndDownloadPDF(res);
      });
    } else {
      console.log(this.entryForm.valid);
    }
  }

  onTempleSelection(event: any) {
    this.entryForm.controls["templeService"].enable();
  }

}