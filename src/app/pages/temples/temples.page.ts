import { Component, OnInit, effect } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonIcon, IonButton, IonAlert, AlertController } from '@ionic/angular/standalone';
import { Temple } from 'src/app/interfaces/temple';
import { RouterLink } from '@angular/router';
import { TempleService } from 'src/app/services/temple.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-temples',
  templateUrl: './temples.page.html',
  styleUrls: ['./temples.page.scss'],
  standalone: true,
  imports: [IonAlert, IonButton, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonCol, IonIcon, RouterLink]
})
export class TemplesPage implements OnInit {

  temples: Temple[] | null = [];
  templesEffect = effect(() => {
    this.temples = this.templeService.temples();
  });

  constructor(
    private templeService: TempleService,
    private alertController: AlertController,
    private toaster: ToasterService
  ) { }

  ngOnInit() {
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
            this.deleteTemple(temple.id);
          },
        },
      ],
    });
    await alert.present();
  }

  async deleteTemple(templeId: string) {
    try {
      await this.templeService.deleteTemple(templeId);
      await this.toaster.presentToast({ message: 'Temple was deleted successfully.', color: 'success' });
    } catch (e: any) {
      await this.toaster.presentToast({ message: e.code, color: 'danger' });
    }
  }

}
