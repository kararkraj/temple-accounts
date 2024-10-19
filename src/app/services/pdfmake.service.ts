import { Injectable } from '@angular/core';
import { FileOpener, FileOpenerOptions } from '@capacitor-community/file-opener';
import { Directory, Filesystem, WriteFileResult } from '@capacitor/filesystem';
import { Platform } from "@ionic/angular";
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { EntryForList } from '../interfaces/entry';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfmakeService {

  constructor(
    public platform: Platform
  ) { }

  generateAndDownloadPDF(data: EntryForList) {
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

  getDocDefinition(data: EntryForList): TDocumentDefinitions {
    return {
      header: {
        columns: [
          {
            text: `${data.id}\n ${this.getFormattedDate(data.createdAt)}`,
            margin: [10, 10, 0, 0],
            alignment: 'center'
          }
        ]
      },
      content: [
        {
          text: [`${data.templeName}\n`, data.templeAddress],
          margin: [0, 10, 0, 0],
          alignment: 'center',
          style: 'header'
        },
        {
          text: `Received from ${data.title} ${data.name} a sum of Rs. ${data.serviceAmount} (Rs.${this.numberToWords(data.serviceAmount)}) towards ${data.serviceName}.`,
          style: 'subheader',
          margin: [0, 20, 0, 0]
        }
      ],
      styles: {
        header: {
          fontSize: 14,
          bold: true
        },
        subheader: {
          fontSize: 12
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

  getFormattedDate(dateString: string) {
    const createdDate = new Date(dateString);
    const yyyy = createdDate.getFullYear();
    let mm: number | string = createdDate.getMonth() + 1; // Months start at 0!
    let dd: number | string = createdDate.getDate();
    let hh: number | string = createdDate.getHours();
    let mn: number | string = createdDate.getMinutes();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    return dd + '-' + mm + '-' + yyyy + ' ' + hh + ':' + mn;
  }

  numberToWords(number: number): string {

    var NS = [
      { value: 10000000, str: "Crore" },
      { value: 100000, str: "Lakh" },
      { value: 1000, str: "Thousand" },
      { value: 100, str: "Hundred" },
      { value: 90, str: "Ninety" },
      { value: 80, str: "Eighty" },
      { value: 70, str: "Seventy" },
      { value: 60, str: "Sixty" },
      { value: 50, str: "Fifty" },
      { value: 40, str: "Forty" },
      { value: 30, str: "Thirty" },
      { value: 20, str: "Twenty" },
      { value: 19, str: "Nineteen" },
      { value: 18, str: "Eighteen" },
      { value: 17, str: "Seventeen" },
      { value: 16, str: "Sixteen" },
      { value: 15, str: "Fifteen" },
      { value: 14, str: "Fourteen" },
      { value: 13, str: "Thirteen" },
      { value: 12, str: "Twelve" },
      { value: 11, str: "Eleven" },
      { value: 10, str: "Ten" },
      { value: 9, str: "Nine" },
      { value: 8, str: "Eight" },
      { value: 7, str: "Seven" },
      { value: 6, str: "Six" },
      { value: 5, str: "Five" },
      { value: 4, str: "Four" },
      { value: 3, str: "Three" },
      { value: 2, str: "Two" },
      { value: 1, str: "One" }
    ];

    var result = '';
    for (var n of NS) {
      if (number >= n.value) {
        if (number <= 99) {
          result += n.str;
          number -= n.value;
          if (number > 0) result += ' ';
        } else {
          var t = Math.floor(number / n.value);
          // console.log(t);
          var d = number % n.value;
          if (d > 0) {
            return this.numberToWords(t) + ' ' + n.str + ' ' + this.numberToWords(d);
          } else {
            return this.numberToWords(t) + ' ' + n.str;
          }

        }
      }
    }
    return result;
  }
}
