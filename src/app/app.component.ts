import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonRouterOutlet, IonSplitPane, IonContent, IonMenu, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonToggle, IonButton, IonAlert, LoadingController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { prismOutline, happyOutline, logInOutline, personAddOutline, moonOutline, hammerOutline, logOutOutline, person, listCircleOutline, addCircleOutline, trashOutline, createOutline, eyeOutline, addOutline, settingsOutline, codeWorkingOutline, downloadOutline, alertCircleOutline } from 'ionicons/icons';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonAlert, IonButton,
    FormsModule,
    RouterLink,
    RouterLinkActive,
    IonContent,
    IonSplitPane,
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonList,
    IonListHeader,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonToggle,
  ],
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
    private router: Router
  ) {
    addIcons({ prismOutline, happyOutline, logInOutline, personAddOutline, moonOutline, hammerOutline, logOutOutline, person, listCircleOutline, addCircleOutline, trashOutline, createOutline, eyeOutline, addOutline, settingsOutline, codeWorkingOutline, downloadOutline, alertCircleOutline });
  }

  async ngOnInit() {
    this.auth.onAuthStateChanged(user => this.isAuthenticated = user ? true : false);
  }

  async logout() {
    const loader = await this.loader.create({ message: "Logging out.." });
    await loader.present();
    this.auth.signOut().then(() => {
      this.router.navigate(['/login'], { replaceUrl: true });
      this.loader.dismiss();
    });
  }

  openTutorial() { }
}
