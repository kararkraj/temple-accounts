import { Injectable } from '@angular/core';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';
import { Directory, Filesystem, WriteFileResult } from '@capacitor/filesystem';
import { Platform } from "@ionic/angular";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfmakeService {

  constructor(
    public platform: Platform
  ) { }

  generateAndDownloadPDF(data: any) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
        pdfMake.createPdf(this.getDocDefinition(data)).download(`${data.name}`);
        resolve(true);
      } else {
        pdfMake.createPdf(this.getDocDefinition(data)).getDataUrl((res: string) => {
          Filesystem.writeFile({
            path: `${data.name}.pdf`,
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

  getDocDefinition(data: any): TDocumentDefinitions {
    return {
      header: {
        columns: [
          {
            text: 'Receipt No: 1',
            margin: [10, 10, 0, 0],
          },
          {
            text: `Date: ${this.getCurrentDate()}`,
            margin: [0, 10, 10, 0],
            alignment: 'right'
          }
        ]
      },
      content: [
        {
          text: [`${data.temple.templeName}\n`, data.temple.templeAddress],
          margin: [0, 0, 0, 0],
          alignment: 'center',
          style: 'header'
        },
        {
          text: `Received from Sri. ${data.name} a sum of Rs. ${data.templeService.amount} (Rs.) towards ${data.templeService.serviceName}.`,
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

  getCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm: number | string = today.getMonth() + 1; // Months start at 0!
    let dd: number | string = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '-' + mm + '-' + yyyy;
  }
}
