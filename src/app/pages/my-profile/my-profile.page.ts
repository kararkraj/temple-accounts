import { Component, OnInit, ViewChild } from '@angular/core';
import { Auth, deleteUser, EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile, User, UserCredential, verifyBeforeUpdateEmail } from '@angular/fire/auth';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonMenuButton, IonAvatar, IonGrid, IonRow, IonCol, IonInput, IonButton, LoadingController, IonModal, IonItem, IonNote } from '@ionic/angular/standalone';
import { ToasterService } from 'src/app/services/toaster.service';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  standalone: true,
  imports: [IonNote, FormsModule, IonItem, IonModal, IonButton, ReactiveFormsModule, IonInput, IonCol, IonRow, IonGrid, IonAvatar, IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton]
})
export class MyProfilePage implements OnInit {

  myProfileForm: FormGroup;
  user: User;
  @ViewChild(IonModal) modal!: IonModal;

  role?: string;
  modalMessage?: string;

  updatePasswordForm: FormGroup;

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
    this.updatePasswordForm = new FormGroup({
      newPassword: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(99)]),
      confirmNewPassword: new FormControl(null, [Validators.required, Validators.maxLength(99)]),
    }, { validators: this.checkPasswordMatch });
  }

  ngOnInit() {
  }

  async onSubmit() {
    if (this.myProfileForm.pristine) {
      this.toaster.presentToast({ message: 'Nothing to update.', color: 'danger' });
    } else if (this.myProfileForm.valid) {
      const loader = await this.loader.create({ message: 'Updating profile... ' });
      await loader.present();

      try {
        if (this.myProfileForm.get('displayName')?.dirty) {
          await updateProfile(this.user, { displayName: this.myProfileForm.get('displayName')?.value });
          this.toaster.presentToast({ message: 'Profile is updated successfully.', color: 'success' });
        }
        // if (this.myProfileForm.get('email')?.dirty) {
        //   this.openModal('updateEmail');
        // }
      } catch (e: any) {
        console.log(e);
        this.toaster.presentToast({ message: `Error: ${e.code}`, color: 'danger' });
      } finally {
        loader.dismiss();
      }

    } else {
      this.myProfileForm.markAllAsTouched();
    }
  }

  resetForm() {
    this.myProfileForm.reset({ ...this.user });
    this.disableEmailEdit();
  }

  async deleteAccount() {
    const loader = await this.loader.create({ message: 'Deleting user... ' });
    await loader.present();
    deleteUser(this.user).then(() => {
      this.toaster.presentToast({ message: 'Account deleted.', color: 'success' });
      this.router.navigate(['login'], { replaceUrl: true });
      loader.dismiss();
    });
  }

  async updateEmail() {
    const loader = await this.loader.create({ message: 'Sending verification email... ' });
    await loader.present();

    verifyBeforeUpdateEmail(this.user, this.myProfileForm.get('email')?.value).then(res => {
      console.log(res);
      this.toaster.presentToast({ message: 'Please click on the verification link sent to new email to complete the process.', color: 'success' });
    }).catch(err => {
      this.toaster.presentToast({ message: `Error: ${err.code}`, color: 'danger' });
    }).finally(() => {
      loader.dismiss();
    });
  }

  openModal(role: string, message: string) {
    this.role = role;
    this.modalMessage = message;
    this.modal.present();
  }

  onWillDismiss(event: CustomEvent<OverlayEventDetail<UserCredential>>) {
    switch (this.role) {
      case 'delete':
        this.deleteAccount();
        break;
      case 'updateEmail':
        this.updateEmail();
        break;
      case 'updatePassword':
        this.updatePassword();
        break;
    }
  }

  cancel() {
    this.role = 'cancel';
    this.modal.dismiss('cancel');
  }

  async reAuthWithPassword() {
    if (this.reAuthPassword) {
      const loader = await this.loader.create({ message: 'Authenticating with email and password...' });
      await loader.present();

      try {
        const authCredential = EmailAuthProvider.credential(this.user.email as string, this.reAuthPassword);
        await reauthenticateWithCredential(this.user, authCredential);
        this.modal.dismiss();
      } catch (err: any) {
        this.toaster.presentToast({ message: `Error: ${err.code}`, color: 'danger' });
      } finally {
        loader.dismiss();
      }
    } else {
      this.toaster.presentToast({ message: `Password is required`, color: 'danger' });
    }
  }

  enableEmailEdit() {
    this.myProfileForm.get('email')?.enable();
  }

  disableEmailEdit() {
    this.myProfileForm.get('email')?.disable();
  }

  async onUpdatePasswordFormSubmit() {
    if (this.updatePasswordForm.valid) {
      this.openModal('updatePassword', 'Please re-authenticate to confirm password update.');
    } else {
      this.updatePasswordForm.markAllAsTouched();
    }
  }

  async updatePassword() {
    const loader = await this.loader.create({ message: 'Updating password...' });
    await loader.present();
    updatePassword(this.user, this.updatePasswordForm.get('newPassword')?.value).then(res => {
      this.toaster.presentToast({ message: `Password is updated successfully.`, color: 'success' });
    }).catch(err => {
      this.toaster.presentToast({ message: `Error: ${err.code}`, color: 'danger' });
    }).finally(() => {
      this.updatePasswordForm.reset();
      loader.dismiss();
    });
  }

  checkPasswordMatch: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const password = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmNewPassword')?.value;

    const isValid = !password || !confirmPassword || password === confirmPassword;

    return isValid ? null : { isPasswordMisMatch: true };
  }

}
