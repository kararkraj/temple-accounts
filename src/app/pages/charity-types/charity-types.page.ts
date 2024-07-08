import { Component, effect, EffectRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonButtons, IonButton, IonIcon, IonRow, IonCol, AlertController, LoadingController, IonMenuButton } from '@ionic/angular/standalone';
import { CharityType } from 'src/app/interfaces/charityType';
import { CharityTypesService } from './charity-types.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-charity-types',
  templateUrl: './charity-types.page.html',
  styleUrls: ['./charity-types.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonIcon, IonButton, IonButtons, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, RouterLink]
})
export class CharityTypesPage implements OnInit {

  charityTypes!: CharityType[];
  charityTypesUpdatedEffect: EffectRef = effect(() => {
    this.charityTypesService.charityTypesUpdatedSignal();
    this.getCharityTypes();
  });

  constructor(
    private charityTypesService: CharityTypesService,
    private alertController: AlertController,
    private loader: LoadingController
  ) { }

  ngOnInit() { }

  getCharityTypes() {
    this.charityTypesService.getCharityTypes().then(charityTypes => this.charityTypes = charityTypes);
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
          handler: () => this.deletecharityType(charityType.id),
        },
      ],
    });
    await alert.present();
  }

  async deletecharityType(charityTypeId: number) {
    const loader = await this.loader.create({ message: 'Deleting temple...' });
    await loader.present();
    this.charityTypesService.deleteService(charityTypeId).subscribe({ next: () => loader.dismiss(), error: err => loader.dismiss() });
  }

}
