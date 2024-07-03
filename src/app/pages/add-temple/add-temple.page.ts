import { Component, Input, OnInit, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonItem, IonIcon, LoadingController, IonLabel, IonItemDivider, IonItemGroup, IonGrid, IonRow, IonCol, IonBackButton } from '@ionic/angular/standalone';
import { DataService } from 'src/app/services/data.service';
import { Temple } from 'src/app/interfaces/temple';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-add-temple',
  templateUrl: './add-temple.page.html',
  styleUrls: ['./add-temple.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonCol, IonRow, IonGrid, CommonModule, ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonIcon, IonItem, IonItemGroup, IonItemDivider, IonLabel]
})
export class AddTemplePage implements OnInit {

  @Input({ transform: numberAttribute }) templeId!: number;
  canEdit: boolean = true;
  title: string = "Add Temple"
  templeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dataService: DataService,
    public loader: LoadingController,
    public toaster: ToasterService
  ) {
    this.templeForm = this.formBuilder.group({
      templeName: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9 ]+")]],
      templeAddress: [null, [Validators.required, Validators.maxLength(500), Validators.pattern("^[a-zA-Z0-9 \n.,-]*$")]],
      services: this.formBuilder.array([])
    });
    this.addNewService();
  }

  ngOnInit(): void {

  }

  get services() {
    return this.templeForm.get('services') as FormArray<FormGroup>;
  }

  async onSubmit() {
    if (this.templeForm.valid) {
      const loader = await this.loader.create({ message: 'Adding temple...' });
      await loader.present();

      const templeFormValue = this.templeForm.getRawValue();
      const id = await this.dataService.getTempleNextId();
      const temple: Temple = { id, ...templeFormValue };

      this.dataService.addTemple(temple).subscribe({
        next: (temple) => {
          this.toaster.presentToast({ message: 'Temple was added successfully!', color: 'success' });
          this.resetForm();
          loader.dismiss();
        }
      })
    } else {
      this.templeForm.markAllAsTouched();
    }
  }

  addNewService() {
    const servicesControl = this.services;
    const nextId = servicesControl.length + 1;
    servicesControl.push(this.getNewServiceFormGroup(nextId));
  }

  getNewServiceFormGroup(nextId: number) {
    return this.formBuilder.group({
      id: [nextId, [Validators.required]],
      serviceName: [null, [Validators.required, Validators.maxLength(30), Validators.pattern("[a-zA-Z0-9 ]+")]],
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  removeLastService(index: number) {
    this.services.removeAt(index);
  }

  resetForm() {
    this.templeForm.reset({ services: [{ id: 1 }] });
    for (let i = this.services.controls.length; i > 0; i--) {
      this.removeLastService(i);
    }
  }

}
