import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.page.html',
  styleUrls: ['./my-profile.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton]
})
export class MyProfilePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
