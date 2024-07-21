import { Component, OnInit } from '@angular/core';
import { Auth, confirmPasswordReset } from '@angular/fire/auth';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, LoadingController, IonInput, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonNote } from '@ionic/angular/standalone';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonNote, IonButton, IonCol, IonRow, IonButtons, ReactiveFormsModule, IonContent, IonHeader, IonTitle, IonToolbar, IonInput, IonMenuButton]
})
export class ResetPasswordPage implements OnInit {

  resetPasswordForm: FormGroup;

  constructor(
    private loader: LoadingController,
    private auth: Auth,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToasterService
  ) {
    this.resetPasswordForm = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(99)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.maxLength(99)]),
    }, { validators: this.checkPasswordMatch });
  }

  async ngOnInit() {
    // if query parameters are valid then proceed
    // else navigate to login page because the query parameters are invalid
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (Object.keys(queryParams).length > 0 &&
      queryParams['mode'] === "resetPassword" &&
      queryParams['apiKey'] === environment.firebase.apiKey &&
      queryParams['oobCode']) {
    } else {
      this.router.navigate(['login'], { replaceUrl: true });
    }
  }

  async confirmResetPassword() {
    if (this.resetPasswordForm.valid) {
      const loader = await this.loader.create({ message: "Updating password..." });
      await loader.present();
      const oobCode = this.activatedRoute.snapshot.queryParams['oobCode'];
      confirmPasswordReset(this.auth, oobCode, this.resetPasswordForm.get('password')?.value).then(() => {
        this.toaster.presentToast({ message: 'Password is reset successfully.', color: 'success' });
        this.router.navigate(['login'], { replaceUrl: true });
      }).catch(err => {
        console.log(err);
        this.toaster.presentToast({ message: `Error: ${err.code}`, color: 'danger' });
        this.router.navigate(['login'], { replaceUrl: true });
      }).finally(() => loader.dismiss());
    } else if (this.resetPasswordForm.hasError('isPasswordMisMatch')) {
      this.toaster.presentToast({ message: 'Password and confirm password do not match.', color: 'danger' });
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
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
