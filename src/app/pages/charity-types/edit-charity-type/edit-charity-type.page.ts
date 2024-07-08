import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonRow, IonBackButton, IonItemGroup, IonItem, IonGrid, IonCol, IonButton, LoadingController, IonInput } from '@ionic/angular/standalone';
import { AddCharityTypePage } from '../add-charity-type/add-charity-type.page';
import { CharityType } from 'src/app/interfaces/charityType';
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

  override ngOnInit() {
    this.title = "Edit Service";
    this.charityTypeService.getCharityTypeById(this.charityTypeId).subscribe({
      next: charityType => {
        this.charityType = charityType;
        this.resetForm();
      },
      error: err => {
        this.toaster.presentToast({ message: err, color: "danger" });
        this.router.navigate(['tabs/services'], { replaceUrl: true });
      }
    });
  }

  override async onSubmit(): Promise<void> {
    if (this.charityTypeForm.valid && this.charityTypeForm.dirty) {
      const loading = await this.loading.create({ message: "Updating service..." });
      await loading.present();
      this.charityTypeService.updateCharityType({ ...this.charityTypeForm.getRawValue(), id: this.charityTypeId }).subscribe({
        next: charityType => {
          this.charityType = charityType;
          this.resetForm();
          loading.dismiss();
          this.toaster.presentToast({ message: "Service updated successfully.", color: "success" });
        },
        error: err => loading.dismiss()
      });
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