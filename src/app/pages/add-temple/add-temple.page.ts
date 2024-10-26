import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonItem, IonIcon, IonLabel, IonItemDivider, IonItemGroup, IonGrid, IonRow, IonCol, IonBackButton, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { ToasterService } from 'src/app/services/toaster.service';
import { TempleService } from 'src/app/services/temple.service';

@Component({
  selector: 'app-add-temple',
  templateUrl: './add-temple.page.html',
  styleUrls: ['./add-temple.page.scss'],
  standalone: true,
  imports: [IonBackButton, IonCol, IonRow, IonGrid, ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonTextarea, IonInput, IonButtons, IonMenuButton, IonIcon, IonItem, IonItemGroup, IonItemDivider, IonLabel, IonSelect, IonSelectOption]
})
export class AddTemplePage implements OnInit {

  @Input() templeId!: string;
  canEdit: boolean = true;
  title: string = "Add Temple"
  templeForm: FormGroup<{
    name: FormControl;
    address: FormControl;
    roles: FormArray<FormGroup<{
      email: FormControl;
      role: FormControl;
    }>>
  }>;

  constructor(
    private formBuilder: FormBuilder,
    public templeService: TempleService,
    public toaster: ToasterService,
    private cdr: ChangeDetectorRef
  ) {
    this.templeForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9 ]+")]],
      address: [null, [Validators.required, Validators.maxLength(500), Validators.pattern("^[a-zA-Z0-9 \n.,-]*$")]],
      roles: this.formBuilder.array<FormGroup<{ email: FormControl; role: FormControl }>>([])
    });
  }

  ngOnInit(): void {
  }

  get roles() {
    return this.templeForm.controls.roles;
  }

  async onSubmit() {
    if (this.templeForm.valid) {
      try {
        const templeForm = this.templeForm.getRawValue();
        const roles: { [key: string]: string; } = {};
        templeForm.roles.forEach(role => roles[role.email] = role.role);
        let temple = {
          name: templeForm.name,
          address: templeForm.address,
          roles: roles
        }
        this.templeService.addTemple(temple);
        this.toaster.presentToast({ message: 'Temple was added successfully!', color: 'success' });
        this.resetForm();
      } catch (e: any) {
        this.toaster.presentToast({ message: `Error: ${e.code}`, color: 'danger' });
        console.error("Error adding document: ", e);
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

  addUser() {
    const emailForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.minLength(5)]],
      role: [null, Validators.required]
    });
    this.roles.push(emailForm);
  }

  deleteUser(index: number) {
    this.roles.removeAt(index);
  }

}
