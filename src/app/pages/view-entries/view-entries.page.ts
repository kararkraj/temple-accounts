import { Component, EffectRef, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';
import { Entry } from 'src/app/interfaces/entry';
import { DataService } from 'src/app/services/data.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-entries',
  templateUrl: './view-entries.page.html',
  styleUrls: ['./view-entries.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonMenuButton, RouterLink]
})
export class ViewEntriesPage implements OnInit {

  entries: Entry[] = [];
  updatedEntriesEffect: EffectRef = effect(() => {
    this.dataService.entriesUpdatedSignal();
    this.getEntries();
  });

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void { }

  getEntries() {
    this.dataService.getEntries().then((entries: Entry[]) => this.entries = entries);
  }

}
