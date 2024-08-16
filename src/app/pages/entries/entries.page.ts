import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonRow, IonButton, IonIcon, IonGrid, IonCol, AlertController, LoadingController, IonMenuButton } from '@ionic/angular/standalone';
import { Entry } from 'src/app/interfaces/entry';
import { EntryService } from 'src/app/services/entry.service';
import { PdfmakeService } from 'src/app/services/pdfmake.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.page.html',
  styleUrls: ['./entries.page.scss'],
  standalone: true,
  imports: [IonCol, IonGrid, IonIcon, IonButton, IonRow, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton, RouterLink]
})
export class EntriesPage implements OnInit {

  entries: Entry[] = [];

  constructor(
    private entryService: EntryService,
    private alertController: AlertController,
    private loader: LoadingController,
    private pdfService: PdfmakeService,
    private toaster: ToasterService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getEntries();
  }

  getEntries() {
    this.entryService.getEntries().then(entries => this.entries = entries);
  }

  async presentDeleteEntryAlert(entry: Entry) {
    const alert = await this.alertController.create({
      header: 'Confirm delete',
      subHeader: 'Are you sure you want to delete the following record?',
      message: 'Entry name: ' + entry.name,
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
            const loader = await this.loader.create({ message: 'Deleting entry...' });
            await loader.present();
            await this.entryService.deleteEntry(entry.id);
            await this.toaster.presentToast({ message: 'Entry was deleted successfully.', color: 'success' });
            await loader.dismiss();
            this.getEntries();
          },
        },
      ],
    });
    await alert.present();
  }

  downloadReceipt(entry: Entry) {
    this.pdfService.generateAndDownloadPDF(entry);
  }

}