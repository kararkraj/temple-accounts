import { Component, OnInit } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRow, IonCol, IonButton, LoadingController, IonInput } from '@ionic/angular/standalone';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonButton, IonCol, IonRow, IonContent, IonHeader, IonTitle, IonToolbar, IonInput]
})
export class ForgotPasswordPage implements OnInit {

  forgotPasswordForm: FormGroup;

  constructor(
    private loader: LoadingController,
    private auth: Auth,
    private toaster: ToasterService
  ) {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email, Validators.minLength(5)]),
    });
  }

  ngOnInit() {
  }

  async sendResetPasswordLink() {
    if (this.forgotPasswordForm.valid) {
      const loader = await this.loader.create({ message: "Sending email..." });
      await loader.present();
      // This function does not throw error when email does not exist
      sendPasswordResetEmail(this.auth, this.forgotPasswordForm.value.email).then(res => {
        this.toaster.presentToast({ message: "Reset password link is sent to your registered email id.", color: 'success' });
        this.forgotPasswordForm.reset();
      }).finally(() => loader.dismiss());
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

}
