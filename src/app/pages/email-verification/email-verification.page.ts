import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonText, IonButtons, IonMenuButton, LoadingController } from '@ionic/angular/standalone';
import { Auth, reload, sendEmailVerification, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.page.html',
  styleUrls: ['./email-verification.page.scss'],
  standalone: true,
  imports: [IonButtons, IonText, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton]
})
export class EmailVerificationPage implements OnInit {

  email: string = "";

  constructor(
    private auth: Auth,
    private router: Router,
    private toaster: ToasterService,
    private loader: LoadingController
  ) { }

  ngOnInit() {
    const user = this.auth.currentUser;
    if (user && user.emailVerified) {
      this.router.navigate(['tabs'], { replaceUrl: true });
    }
    this.email = this.auth.currentUser?.email as string;
  }

  async confirmEmailVerification() {
    const loader = await this.loader.create({ message: "Verifying email..." });
    await loader.present();
    reload(this.auth.currentUser as User).then(() => {
      if (this.auth.currentUser?.emailVerified) {
        loader.message = "Email verified successfully."
        setTimeout(() => {
          this.router.navigate(['tabs/add-entry']);
          loader.dismiss();
        }, 2000);
      } else {
        this.toaster.presentToast({ message: 'Email is not yet verified. Please click on the verification link sent to your Email id.', color: 'danger' });
        loader.dismiss();
      }
    });
  }

  async resendVerificationLinkEmail() {
    const loader = await this.loader.create({ message: "Sending email..." });
    await loader.present();
    sendEmailVerification(this.auth.currentUser as User).then(() => {
      this.toaster.presentToast({ message: 'Verification email is sent successfully. Please click on the verification link sent to your Email id.', color: 'success' });
    }).catch(err => {
      this.toaster.presentToast({ message: 'Please wait for some time before you can send another verification email.', color: 'danger' });
    }).finally(() => loader.dismiss());
  }

}
