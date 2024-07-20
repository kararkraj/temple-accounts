import { Component, OnInit } from '@angular/core';
import { Auth, confirmPasswordReset, sendPasswordResetEmail } from '@angular/fire/auth';
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
  showVerificationLinkForm: boolean = true;

  constructor(
    private loader: LoadingController,
    private auth: Auth,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToasterService
  ) {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(5)]),
    });
  }

  async ngOnInit() {}

  async ionViewWillEnter() {
    const loader = await this.loader.create();
    await loader.present();
    const unsubscribe = this.auth.onAuthStateChanged(user => {
      unsubscribe();
      // If session already exists, then navigate to tabs page
      // else 
      //   if query parameters exist then user has landed to the page through email link.
      //      if query parameters are valid then show form with new password and confirm new password fields
      //      else navigate to login page because the query parameters are invalid
      //   else user has navigated by clicking on menu item and send verification link form should be shown.
      if (user) {
        this.router.navigate(['tabs'], { replaceUrl: true });
      } else {
        const queryParams = this.activatedRoute.snapshot.queryParams;
        if (Object.keys(queryParams).length > 0) {
          if (queryParams['mode'] === "resetPassword" &&
            queryParams['apiKey'] === environment.firebase.apiKey &&
            queryParams['oobCode']) {
            this.resetPasswordForm = new FormGroup({
              password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(99)]),
              confirmPassword: new FormControl(null, [Validators.required, Validators.maxLength(99)]),
            }, { validators: this.checkPasswordMatch });
            this.showVerificationLinkForm = false;
          } else {
            this.router.navigate(['login'], { replaceUrl: true });
          }
        } else {
          this.resetPasswordForm = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(5)]),
          });
          this.showVerificationLinkForm = true;
        }
      }
      loader.dismiss();
    });
  }

  async sendResetPasswordLink() {
    if (this.resetPasswordForm.valid) {
      const loader = await this.loader.create({ message: "Sending email..." });
      await loader.present();
      // This function does not throw error when email does not exist
      sendPasswordResetEmail(this.auth, this.resetPasswordForm.value.email).then(res => {
        this.toaster.presentToast({ message: "Reset password link is sent to your registered email id.", color: 'success' });
      }).finally(() => loader.dismiss());
    } else {
      this.resetPasswordForm.markAllAsTouched();
    }
  }

  async confirmResetPassword() {
    if (this.resetPasswordForm.valid) {
      const loader = await this.loader.create({ message: "Updating password..." });
      await loader.present();
      const oobCode = this.activatedRoute.snapshot.queryParams['oobCode'];
      confirmPasswordReset(this.auth, oobCode, this.resetPasswordForm.get('password')?.value).then(() => {
        this.toaster.presentToast({ message: 'Password is reset successfully.', color: 'success' });
      }).catch(err => {
        console.log(err);
        this.toaster.presentToast({ message: `Error: ${err.code}`, color: 'danger' });
      }).finally(() => loader.dismiss());
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
