import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButtons, IonMenuButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonMenuButton]
})
export class RegisterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
