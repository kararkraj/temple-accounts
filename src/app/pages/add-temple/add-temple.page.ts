import { Component, Input, OnInit, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9 ]+")]],
      address: [null, [Validators.required, Validators.maxLength(500), Validators.pattern("^[a-zA-Z0-9 \n.,-]*$")]]
    });
  }

  ngOnInit(): void {

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

  resetForm(temple?: Temple) {
    this.templeForm.reset(temple ? temple : null);
  }

}
