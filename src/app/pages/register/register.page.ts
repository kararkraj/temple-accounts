import { Component, OnInit } from '@angular/core';
import { Auth, browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, sendEmailVerification, signOut, updateProfile } from '@angular/fire/auth';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonMenuButton, IonInput, IonButton, IonCol, IonRow, IonItem, IonNote, IonList, IonText, LoadingController, IonCheckbox, IonAlert, IonGrid } from '@ionic/angular/standalone';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonGrid, IonAlert, IonCheckbox, IonText, IonList, IonNote, IonItem, IonRow, IonCol, IonButton, IonInput, IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  registerForm: FormGroup;

  constructor(
    private router: Router,
    private toaster: ToasterService,
    private auth: Auth,
    private loader: LoadingController
  ) {
    this.registerForm = new FormGroup({
      displayName: new FormControl(null, [Validators.required, Validators.minLength(2), Validators.maxLength(99), Validators.pattern("[a-zA-Z0-9 ]+")]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(5)]),
      password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(99)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.maxLength(99)]),
      rememberMe: new FormControl(false)
    }, { validators: this.checkPasswordMatch });
  }

  ngOnInit() {
  }

  get() {
    return this.registerForm.controls;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const loader = await this.loader.create({ message: "Registering..." });
      loader.present();
      const registerData = this.registerForm.getRawValue();
      try {
        await this.auth.setPersistence(registerData.rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const user = await createUserWithEmailAndPassword(this.auth, registerData.email, registerData.password);
        await updateProfile(user.user, { displayName: registerData.displayName });
        await sendEmailVerification(user.user);
        await signOut(this.auth);
        await this.toaster.presentToast({ message: `Please click on the verification link sent to your email: ${registerData.email}`, color: 'success' });
        this.registerForm.reset();
        this.router.navigate(['login'], { replaceUrl: true });
      } catch (e: any) {
        console.log(e);
        this.toaster.presentToast({ message: `Error: ${e.code}`, color: 'danger' });
      } finally {
        loader.dismiss();
      }
    } else {
      this.registerForm.markAllAsTouched();
      if (this.registerForm.hasError('isPasswordMisMatch')) {
        this.toaster.presentToast({ message: "Password and confirm password do not match.", color: 'danger' });
      }
    }
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

  checkPasswordMatch: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    const isValid = !password || !confirmPassword || password === confirmPassword;

    return isValid ? null : { isPasswordMisMatch: true };
  }
}
