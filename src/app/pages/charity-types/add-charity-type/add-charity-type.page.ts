import { Component, Input, numberAttribute, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonRow, IonBackButton, IonItemGroup, IonItem, IonGrid, IonCol, IonButton, LoadingController, IonInput } from '@ionic/angular/standalone';
import { ToasterService } from 'src/app/services/toaster.service';
import { CharityTypesService } from '../charity-types.service';

@Component({
  selector: 'app-add-charity-type',
  templateUrl: './add-charity-type.page.html',
  styleUrls: ['./add-charity-type.page.scss'],
  standalone: true,
  imports: [IonButton, IonCol, IonGrid, IonItem, IonItemGroup, IonBackButton, IonRow, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, ReactiveFormsModule, IonInput]
})
export class AddCharityTypePage implements OnInit {

  // Below variable is used in EditCharityTypePage
  @Input({ transform: numberAttribute }) charityTypeId!: number;

  title: string = "Add Service";
  charityTypeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public charityTypeService: CharityTypesService,
    public loading: LoadingController,
    public toaster: ToasterService
  ) {
    this.charityTypeForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9 ]+")]],
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
  }

  async onSubmit() {
    if (this.charityTypeForm.valid) {
      const loading = await this.loading.create({ message: "Adding service..." });
      await loading.present();
      this.charityTypeService.addCharityType(this.charityTypeForm.getRawValue()).subscribe({
        next: charityType => {
          this.resetForm();
          loading.dismiss();
          this.toaster.presentToast({ message: "Service added successfully", color: "success" })
        },
        error: err => loading.dismiss()
      });
    } else {
      this.charityTypeForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.charityTypeForm.reset();
  }

}
