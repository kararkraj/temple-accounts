import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonSelect, IonSelectOption, IonInput, IonButtons, IonMenuButton, IonNote, IonItem, IonText } from '@ionic/angular/standalone';
import { Platform } from "@ionic/angular";
import { StorageService } from 'src/app/services/storage.service';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Directory, Filesystem, WriteFileResult } from '@capacitor/filesystem';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { Entry } from 'src/app/interfaces/entry';
import { DataService } from 'src/app/services/data.service';
import { CharietyType } from 'src/app/interfaces/chariety-type';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-add-entry',
  templateUrl: './add-entry.page.html',
  styleUrls: ['./add-entry.page.scss'],
  standalone: true,
  imports: [IonText,
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButtons,
    IonMenuButton,
    IonNote,
    IonItem
  ]
})
export class AddEntryPage implements OnInit {

  addEntryForm: FormGroup;
  name: string;
  title: string;
  sevaId: number | undefined;
  sevas: CharietyType[] = charietyTypes;

  constructor(
    public platform: Platform,
    private storage: StorageService,
    private dataService: DataService,
    private formBuilder: FormBuilder
  ) {
    this.name = "";
    this.title = "";
    this.sevaId = undefined;
    this.addEntryForm = this.formBuilder.group({
      title: [null, [Validators.required]],
      name: [null, [Validators.required, Validators.maxLength(100), Validators.pattern("[a-zA-Z0-9 ]+")]],
      service: [null, [Validators.required]],
    })
  }

  ngOnInit() {
  }

  async onSubmit() {
    this.addEntryForm.markAllAsTouched();
    if (this.addEntryForm.valid) {
      console.log(this.addEntryForm.value);
      const id = await this.storage.get('lastStoredId') + 1;
      const entry: Entry = {
        id,
        name: this.addEntryForm.value.name,
        payment: this.addEntryForm.value.service.payment,
        sevaName: this.addEntryForm.value.service.sevaName
      }
      this.dataService.addEntry(entry).subscribe(res => {
        // this.downloadPDFReceipt();
      });
    } else {
      console.log(this.addEntryForm.valid);
    }
  }

  downloadPDFReceipt() {
    return new Promise((resolve, reject) => {
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        pdfMake.createPdf(this.getDocDefinition()).download(`${this.name}`);
        resolve(true);
      } else {
        pdfMake.createPdf(this.getDocDefinition()).getDataUrl((res: string) => {
          Filesystem.writeFile({
            path: `${this.name}.pdf`,
            data: res,
            directory: Directory.Documents
          }).then((res: WriteFileResult) => {
            const fileOpenerOptions: FileOpenerOptions = {
              filePath: res.uri,
              contentType: 'application/pdf',
              openWithDefault: true,
            };
            FileOpener.open(fileOpenerOptions)
              .then(res => resolve(true))
              .catch(e => {
                console.log('Error opening file', e);
                reject(e);
              });
          });
        });
      }
    });
  }

  getDocDefinition(): TDocumentDefinitions {
    const { name: sevaName, payment, paymentInWords } = this.sevas.find(seva => seva.id === this.sevaId) as CharietyType;
    return {
      header: {
        columns: [
          {
            text: 'Receipt No: 1',
            margin: [10, 10, 0, 0],
          },
          {
            text: `Date: ${getCurrentDate()}`,
            margin: [0, 10, 10, 0],
            alignment: 'right'
          }
        ]
      },
      content: [
        {
          text: ['Sri Chamundeshwari temple\n', 'Chamundi Hill, Mysuru, Karnataka 570010'],
          margin: [0, 0, 0, 0],
          alignment: 'center',
          style: 'header'
        },
        {
          text: `Received from Sri. ${this.name} a sum of Rs. ${payment} (Rs. ${paymentInWords}) towards ${sevaName}.`,
          style: 'subheader',
          margin: [0, 20, 0, 0]
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true
        },
        subheader: {
          fontSize: 14
        }
      },
      footer: {
        columns: [
          {
            text: 'For committee',
            margin: [20, -75, 0, 0],
            alignment: 'left'
          }
        ]
      }
    }
  }

}

function getCurrentDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm: number | string = today.getMonth() + 1; // Months start at 0!
  let dd: number | string = today.getDate();

  if (dd < 10) dd = '0' + dd;
  if (mm < 10) mm = '0' + mm;

  return dd + '-' + mm + '-' + yyyy;
}

export const charietyTypes: CharietyType[] = [
  {
    id: 1,
    name: "Seva 1 - 101",
    payment: 101,
    paymentInWords: 'One hundred and one'
  },
  {
    id: 2,
    name: "Seva 2 - 501",
    payment: 501,
    paymentInWords: 'Five hundred and one'
  },
  {
    id: 3,
    name: "Seva 3 - 1001",
    payment: 1001,
    paymentInWords: 'One thousand and one'
  }
];