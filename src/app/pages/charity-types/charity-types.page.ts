import { Component, effect, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonButtons, IonButton, IonIcon, IonRow, IonCol, AlertController, IonMenuButton } from '@ionic/angular/standalone';
import { CharityType } from 'src/app/interfaces/charityType';
import { RouterLink } from '@angular/router';
import { CharityTypeService } from 'src/app/services/charity-type.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-charity-types',
  templateUrl: './charity-types.page.html',
  styleUrls: ['./charity-types.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonIcon, IonButton, IonButtons, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, RouterLink]
})
export class CharityTypesPage implements OnInit {

  charityTypes: CharityType[] = [];
  charityTypesEffect = effect(() => {
    this.charityTypes = this.charityTypeService.services();
  });

  constructor(
    private charityTypeService: CharityTypeService,
    private alertController: AlertController,
    private toaster: ToasterService
  ) { }

  ngOnInit() {
    this.charityTypeService.getCharityTypes();
  }

  async presentDeleteCharityTypeAlert(charityType: CharityType) {
    const alert = await this.alertController.create({
      header: 'Confirm delete',
      subHeader: 'Are you sure you want to delete the following record?',
      message: 'Service name: ' + charityType.name,
      buttons: [
        {
          text: 'No, Cancel',
          role: 'cancel',
          handler: () => { },
        },
        {
          text: 'Yes, Delete',
          role: 'confirm',
          handler: () => this.deleteCharityType(charityType.id),
        },
      ],
    });
    await alert.present();
  }

  async deleteCharityType(charityTypeId: string) {
    try {
      await this.charityTypeService.deleteCharityType(charityTypeId);
      await this.toaster.presentToast({ message: 'Service was deleted successfully.', color: 'success' });
    } catch (e: any) {
      await this.toaster.presentToast({ message: e.code, color: 'danger' });
    }
  }

}
