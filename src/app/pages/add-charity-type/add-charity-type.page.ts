import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonRow, IonBackButton, IonItemGroup, IonItem, IonGrid, IonCol, IonButton, LoadingController, IonInput } from '@ionic/angular/standalone';
import { ToasterService } from 'src/app/services/toaster.service';
import { CharityTypeService } from 'src/app/services/charity-type.service';

@Component({
  selector: 'app-add-charity-type',
  templateUrl: './add-charity-type.page.html',
  styleUrls: ['./add-charity-type.page.scss'],
  standalone: true,
  imports: [IonButton, IonCol, IonGrid, IonItem, IonItemGroup, IonBackButton, IonRow, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, ReactiveFormsModule, IonInput]
})
export class AddCharityTypePage implements OnInit {

  // Below variable is used in EditCharityTypePage
  @Input({ required: true }) charityTypeId!: string;

  title: string = "Add Service";
  charityTypeForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public charityTypeService: CharityTypeService,
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

  onSubmit() {
    if (this.charityTypeForm.valid) {
      try {
        this.charityTypeService.addCharityType(this.charityTypeForm.getRawValue());
        this.toaster.presentToast({ message: 'Service was added successfully.', color: 'success' });
      } catch (e: any) {
        this.toaster.presentToast({ message: `Error: ${e.code}`, color: 'danger' });
        console.error("Error adding document: ", e);
      } finally {
        this.resetForm();
      }
    } else {
      this.charityTypeForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.charityTypeForm.reset();
  }

}
