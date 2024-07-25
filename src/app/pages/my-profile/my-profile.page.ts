import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth, deleteUser, EmailAuthProvider, GoogleAuthProvider, OAuthCredential, reauthenticateWithCredential, signInWithPopup, User, UserCredential } from '@angular/fire/auth';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonMenuButton, IonAvatar, IonGrid, IonRow, IonCol, IonInput, IonButton, LoadingController, IonModal, IonItem } from '@ionic/angular/standalone';
import { ToasterService } from 'src/app/services/toaster.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  standalone: true,
  imports: [FormsModule, IonItem, IonModal, IonButton, ReactiveFormsModule, IonInput, IonCol, IonRow, IonGrid, IonAvatar, IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton]
})
export class MyProfilePage implements OnInit {

  myProfileForm: FormGroup;
  user: User;
  @ViewChild(IonModal) modal!: IonModal;

  reAuthPassword!: string;

  constructor(
    private auth: Auth,
    private toaster: ToasterService,
    private loader: LoadingController,
    private router: Router
  ) {
    this.user = this.auth.currentUser as User;
    this.myProfileForm = new FormGroup({
      photoURL: new FormControl(this.user.photoURL),
      displayName: new FormControl(this.user.displayName, [Validators.required, Validators.maxLength(99)]),
      email: new FormControl({ value: this.user.email, disabled: true }, [Validators.required, Validators.maxLength(99), Validators.email])
    });
  }

  ngOnInit() {
  }

  onSubmit() {

    if (this.myProfileForm.pristine) {
      this.toaster.presentToast({ message: 'Nothing to update.', color: 'danger' });
    } else if (this.myProfileForm.valid) {
      console.log(this.myProfileForm.getRawValue());
    } else {
      this.myProfileForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.myProfileForm.reset({ ...this.user });
  }

  async deleteAccount(userCredential: UserCredential) {
    const loader = await this.loader.create({ message: 'Deleting user... ' });
    await loader.present();
    deleteUser(this.user).then(() => {
      this.toaster.presentToast({ message: 'Account deleted.', color: 'success' });
      this.router.navigate(['login'], { replaceUrl: true });
      loader.dismiss();
    });
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail<UserCredential>>) {
    if (event.detail.role === 'credentials') {
      this.deleteAccount(event.detail.data as UserCredential);
    }
  }

  cancel() {
    this.modal.dismiss('cancel');
  }

  confirm() {
    this.modal.dismiss('confirm');
  }

  async reAuthWithGoogle() {
    const loader = await this.loader.create({ message: 'Authenticating with google...' });
    await loader.present();
    const provider = new GoogleAuthProvider();

    try {
      const userCred = await signInWithPopup(this.auth, provider);
      const authCredential = GoogleAuthProvider.credentialFromResult(userCred) as OAuthCredential;
      const reAuthUserCred = await reauthenticateWithCredential(this.user, authCredential);
      this.modal.dismiss(reAuthUserCred, 'credentials');
    } catch (err: any) {
      this.toaster.presentToast({ message: `Error: ${err.code}`, color: 'danger' });
    } finally {
      loader.dismiss();
    }
  }

  reAuthWithFacebook() {

  }

  async reAuthWithPassword() {
    const loader = await this.loader.create({ message: 'Authenticating with email and password...' });
    await loader.present();

    try {
      const authCredential = EmailAuthProvider.credential(this.user.email as string, this.reAuthPassword);
      const reAuthUserCred = await reauthenticateWithCredential(this.user, authCredential);
      this.modal.dismiss(reAuthUserCred, 'credentials');
    } catch (err: any) {
      this.toaster.presentToast({ message: `Error: ${err.code}`, color: 'danger' });
    } finally {
      loader.dismiss();
    }
  }

}
