import { Component, EffectRef, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonAlert, AlertController, LoadingController } from '@ionic/angular/standalone';
import { Temple } from 'src/app/interfaces/temple';
import { DataService } from 'src/app/services/data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-temples',
  templateUrl: './view-temples.page.html',
  styleUrls: ['./view-temples.page.scss'],
  standalone: true,
  imports: [IonAlert, IonButton, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, IonCol, IonIcon, RouterLink]
})
export class ViewTemplesPage implements OnInit {

  temples: Temple[] = [];
  updatedTemplesEffect: EffectRef = effect(() => {
    this.dataService.templesUpdatedSignal();
    this.getTemples();
  });

  constructor(
    private dataService: DataService,
    private alertController: AlertController,
    private loader: LoadingController
  ) { }

  ngOnInit() {
  }

  getTemples() {
    this.dataService.getTemples().then(temples => this.temples = temples)
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
            this.dataService.deleteTemple(temple.id).subscribe({ next: () => loader.dismiss() });
          },
        },
      ],
    });
    await alert.present();
  }

}
