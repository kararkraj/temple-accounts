import { Component, ComponentRef, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonApp, IonRouterOutlet, IonSplitPane, IonContent, IonMenu, IonList, IonListHeader, IonMenuToggle, IonItem, IonIcon, IonLabel, IonToggle, IonButton, IonAlert } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { prismOutline, happyOutline, logInOutline, personAddOutline, moonOutline, hammerOutline, logOutOutline, person, listCircleOutline, addCircleOutline, trashOutline, createOutline, eyeOutline, addOutline, settingsOutline, codeWorkingOutline } from 'ionicons/icons';
import { AuthService } from './auth/auth.service';
import { StorageService } from './services/storage.service';
import { LoginPage } from './pages/login/login.page';
import { Subscription } from 'rxjs';
import { STORAGE_KEYS } from './storage.config';

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
  private loginEventSubscription!: Subscription;

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
    handler: () => {},
  },
  {
    text: 'Yes, logout',
    role: 'confirm',
    handler: () => {
      this.logout();
    },
  },]

  constructor(
    private authService: AuthService,
    private router: Router,
    private storage: StorageService
  ) {
    addIcons({ prismOutline, happyOutline, logInOutline, personAddOutline, moonOutline, hammerOutline, logOutOutline, person, listCircleOutline, addCircleOutline, trashOutline, createOutline, eyeOutline, addOutline, settingsOutline, codeWorkingOutline });
  }

  async ngOnInit() {
    this.isAuthenticated = await this.storage.get(STORAGE_KEYS.AUTH.isAuthenticated);
  }

  logout() {
    this.authService.logout().then((isAuthenticated: boolean) => {
      this.isAuthenticated = isAuthenticated;
      this.router.navigate(['login'], { replaceUrl: true })
    });
  }

  openTutorial() { }

  subscribeToChildEvents(componentRef: ComponentRef<any>) {
    if (componentRef instanceof LoginPage) {
      this.loginEventSubscription = componentRef.loginEvent.subscribe(isAuthenticated => this.isAuthenticated = isAuthenticated);
    }
  }

  unsubscribeToChildEvents(componentRef: ComponentRef<any>) {
    if (componentRef instanceof LoginPage) {
      this.loginEventSubscription.unsubscribe();
    }
  }
}
