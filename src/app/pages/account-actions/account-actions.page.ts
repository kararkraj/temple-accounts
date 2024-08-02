import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonRouterOutlet, LoadingController, IonMenuButton } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { applyActionCode, Auth, reload, signOut } from '@angular/fire/auth';
import { ToasterService } from 'src/app/services/toaster.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-actions',
  templateUrl: './account-actions.page.html',
  styleUrls: ['./account-actions.page.scss'],
  standalone: true,
  imports: [IonRouterOutlet, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton]
})
export class AccountActionsPage implements OnInit {

  enableRouterOutlet: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loader: LoadingController,
    private auth: Auth,
    private toaster: ToasterService
  ) { }

  async ngOnInit() {
    const loader = await this.loader.create({ message: 'Checking mode...' });
    await loader.present();

    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (Object.keys(queryParams).length > 0 &&
      queryParams['apiKey'] === environment.firebase.apiKey &&
      queryParams['oobCode']) {

      this.enableRouterOutlet = true;
      switch (queryParams['mode']) {
        case "resetPassword":
          loader.dismiss();
          this.router.navigateByUrl(`reset-password?oobCode=${queryParams['oobCode']}`);
          break;

        case "verifyEmail":
          loader.message = 'Verifying email...';
          try {
            await applyActionCode(this.auth, queryParams['oobCode']);
            if (this.auth.currentUser) {
              await reload(this.auth.currentUser);
              this.toaster.presentToast({ message: 'Email is verified successfully.', color: 'success' });
            } else {
              this.toaster.presentToast({ message: 'Email is verified successfully. Please login to continue.', color: 'success' });
            }
          } catch (err: any) {
            this.toaster.presentToast({ message: err.code, color: 'danger' });
          } finally {
            this.router.navigate(['login'], { replaceUrl: true });
            loader.dismiss();
          }
          break;

        case "verifyAndChangeEmail":
          loader.message = 'Verifying new email...';
          try {
            await applyActionCode(this.auth, queryParams['oobCode']);
            await signOut(this.auth);
            this.toaster.presentToast({ message: 'Email is verified successfully. Please login to continue.', color: 'success' });
          } catch (err: any) {
            this.toaster.presentToast({ message: err.code, color: 'danger' });
          } finally {
            this.router.navigate(['login'], { replaceUrl: true });
            loader.dismiss();
          }
      }

    } else {
      this.router.navigate(['login'], { replaceUrl: true });
    }
  }

}
