import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, MenuController, IonIcon, Platform } from '@ionic/angular/standalone';
import { Router, RouterLink } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, RouterLink, NgClass]
})
export class TutorialPage implements OnInit {

  showSkip = true;
  isDesktop: boolean = true;

  constructor(
    public menu: MenuController,
    public router: Router,
    private storage: Storage,
    private platform: Platform 
  ) { }

  ngOnInit() {
    this.isDesktop = this.platform.is('desktop');
  }

  startApp() {
    this.router
      .navigateByUrl('/tabs/add-entry', { replaceUrl: true })
      .then(() => this.storage.set('ion_did_tutorial', true));
  }

  ionViewWillEnter() {
    this.storage.get('ion_did_tutorial').then(res => {
      if (res === true) {
        this.router.navigateByUrl('/tabs/add-entry', { replaceUrl: true });
      }
    });

    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }

}
