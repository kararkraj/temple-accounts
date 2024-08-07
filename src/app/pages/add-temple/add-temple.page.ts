import { ChangeDetectorRef, Component, Input, OnInit, numberAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonItem, IonIcon, LoadingController, IonLabel, IonItemDivider, IonItemGroup, IonGrid, IonRow, IonCol, IonBackButton } from '@ionic/angular/standalone';
import { ToasterService } from 'src/app/services/toaster.service';
import { TempleService } from 'src/app/services/temple.service';

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
    public templeService: TempleService,
    public loader: LoadingController,
    public toaster: ToasterService,
    private cdr: ChangeDetectorRef
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
      const loader = await this.loader.create({ message: "Adding temple..." });
      loader.present();

      try {
        await this.templeService.addTemple(this.templeForm.getRawValue());
        this.toaster.presentToast({ message: 'Temple was added successfully!', color: 'success' });
      } catch (e: any) {
        this.toaster.presentToast({ message: `Error: ${e.code}`, color: 'danger' });
        console.error("Error adding document: ", e);
      } finally {
        this.resetForm();
        loader.dismiss();
      }

    } else {
      this.templeForm.markAllAsTouched();

      // detect changes is required because below issue: 
      // https://github.com/kararkraj/temple-accounts/issues/1
      this.cdr.detectChanges();
    }
  }

  resetForm() {
    this.templeForm.reset();

    // detect changes is required because below issue: 
    // https://github.com/kararkraj/temple-accounts/issues/1
    this.cdr.detectChanges();
  }

}
