import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonTabButton, IonTabs, IonTabBar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: true,
  imports: [CommonModule, IonTabButton, IonIcon, IonTabBar, IonTabs]
})
export class TabsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
