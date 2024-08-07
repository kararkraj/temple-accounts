import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonAlert, AlertController, LoadingController } from '@ionic/angular/standalone';
import { Temple } from 'src/app/interfaces/temple';
import { RouterLink } from '@angular/router';
import { TempleService } from 'src/app/services/temple.service';

@Component({
  selector: 'app-temples',
  templateUrl: './temples.page.html',
  styleUrls: ['./temples.page.scss'],
  standalone: true,
  imports: [IonAlert, IonButton, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCol, IonIcon, RouterLink]
})
export class TemplesPage implements OnInit {

  temples: Temple[] = [];

  constructor(
    private templeService: TempleService,
    private alertController: AlertController,
    private loader: LoadingController
  ) { }

  ngOnInit() {
    this.getAllTemples();
  }
  getAllTemples() {
    this.templeService.getAllTemples().then(temples => this.temples = temples)
  }

  async presentDeleteTempleAlert(temple: Temple) {
    const alert = await this.alertController.create({
      header: 'Confirm delete',
      subHeader: 'Are you sure you want to delete the following record?',
      message: 'Temple name: ' + temple.name,
      buttons: [
        {
          text: 'No, Cancel',
          role: 'cancel',
          handler: () => { },
        },
        {
          text: 'Yes, Delete',
          role: 'confirm',
          handler: async () => {
            const loader = await this.loader.create({ message: 'Deleting temple...' });
            await loader.present();
            await this.templeService.deleteTemple(temple.id)
            loader.dismiss();
            this.getAllTemples();
          },
        },
      ],
    });
    await alert.present();
  }

}
