import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonRow, IonBackButton, IonItemGroup, IonItem, IonGrid, IonCol, IonButton, LoadingController, IonInput } from '@ionic/angular/standalone';
import { AddCharityTypePage } from '../add-charity-type/add-charity-type.page';
import { CharityType, CharityTypeRequest } from 'src/app/interfaces/charityType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-charity-type',
  templateUrl: './../add-charity-type/add-charity-type.page.html',
  styleUrls: ['./../add-charity-type/add-charity-type.page.scss'],
  standalone: true,
  imports: [IonButton, IonCol, IonGrid, IonItem, IonItemGroup, IonBackButton, IonRow, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, ReactiveFormsModule, IonInput]
})
export class EditCharityTypePage extends AddCharityTypePage implements OnInit {

  router = inject(Router);
  charityType!: CharityType;

  override async ngOnInit() {
    this.title = "Edit Service";
    try {
      this.charityType = await this.charityTypeService.getCharityTypeById(this.charityTypeId);
      this.resetForm();
    } catch (err: any) {
      this.toaster.presentToast({ message: err.code, color: "danger" });
      this.router.navigate(['tabs'], { replaceUrl: true });
    }
  }

  override async onSubmit(): Promise<void> {
    if (this.charityTypeForm.valid && this.charityTypeForm.dirty) {

      const updatedFields: Partial<CharityTypeRequest> = {};
      this.charityTypeForm.get('name')?.dirty ? updatedFields.name = this.charityTypeForm.get('name')?.value : null;
      this.charityTypeForm.get('amount')?.dirty ? updatedFields.amount = this.charityTypeForm.get('amount')?.value : null;

      try {
        const charityType = await this.charityTypeService.updateCharityType(this.charityTypeId, updatedFields);
        this.charityType = {
          ...this.charityType,
          ...charityType
        }
        this.toaster.presentToast({ message: "Service was updated successfully.", color: "success" });
      } catch (e: any) {
        this.toaster.presentToast({ message: `Error: ${e.code}`, color: 'danger' });
        console.error("Error updating document: ", e);
      } finally {
        this.resetForm();
      }
    } else if (this.charityTypeForm.valid) {
      this.toaster.presentToast({ message: "Nothing to update." });
    } else {
      this.charityTypeForm.markAllAsTouched();
    }
  }

  override resetForm(): void {
    this.charityTypeForm.reset(this.charityType);
  }
}