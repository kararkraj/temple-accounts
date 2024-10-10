import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonRouterOutlet, IonSplitPane, IonContent, IonMenu, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonToggle, IonButton, IonAlert, LoadingController, MenuController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { prismOutline, happyOutline, logInOutline, personAddOutline, moonOutline, hammerOutline, logOutOutline, person, listCircleOutline, addCircleOutline, trashOutline, createOutline, eyeOutline, addOutline, settingsOutline, codeWorkingOutline, downloadOutline, alertCircleOutline, refreshOutline, logoFacebook, logoGoogle, lockClosedOutline, arrowForward } from 'ionicons/icons';
import { Auth } from '@angular/fire/auth';
import { StorageService } from './services/storage.service';
import { TempleService } from './services/temple.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonAlert, IonButton, FormsModule, RouterLink, RouterLinkActive, IonContent, IonSplitPane, IonApp, IonRouterOutlet, IonMenu, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonToggle],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  public dark: boolean = false;
  public isAuthenticated: boolean = false;

  appPages = [
    {
      title: 'Add Entry',
      url: '/tabs/add-entry',
      icon: 'person-add-outline'
    },
    {
      title: 'Entries',
      url: '/tabs/entries',
      icon: 'list-circle-outline'
    },
    {
      title: 'Temples',
      url: '/tabs/temples',
      icon: 'prism-outline'
    },
    {
      title: 'Services',
      url: '/tabs/services',
      icon: 'settings-outline'
    }
  ];

  logoutAlertButtons = [{
    text: 'No, cancel',
    role: 'cancel',
    handler: () => { },
  },
  {
    text: 'Yes, logout',
    role: 'confirm',
    handler: () => {
      this.logout();
    },
  },]

  constructor(
    private auth: Auth,
    private loader: LoadingController,
    private router: Router,
    private storage: StorageService,
    private menu: MenuController,
    private templeService: TempleService
  ) {
    addIcons({ prismOutline, happyOutline, logInOutline, personAddOutline, moonOutline, hammerOutline, logOutOutline, person, listCircleOutline, addCircleOutline, trashOutline, createOutline, eyeOutline, addOutline, settingsOutline, codeWorkingOutline, downloadOutline, alertCircleOutline, refreshOutline, logoFacebook, logoGoogle, lockClosedOutline, arrowForward });
  }

  async ngOnInit() {
    this.auth.onAuthStateChanged(user => this.isAuthenticated = user ? true : false);
  }

  async logout() {
    const loader = await this.loader.create({ message: "Logging out.." });
    await loader.present();
    this.auth.signOut().then(() => {
      this.storage.resetStorage();
      this.templeService.onLogout();
      this.router.navigate(['/login'], { replaceUrl: true });
      this.loader.dismiss();
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }
}
