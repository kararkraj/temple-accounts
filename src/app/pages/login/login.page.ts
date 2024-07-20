import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonInput, IonIcon, IonCheckbox, IonAlert } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular/standalone';
import { LoginData } from 'src/app/interfaces/login-data';
import { ToasterService } from 'src/app/services/toaster.service';
import { Auth, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonAlert, IonCheckbox, IonIcon, 
    FormsModule,
    IonButton,
    IonCol,
    IonRow,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonInput
  ]
})
export class LoginPage implements OnInit {

  login: LoginData = { username: '', password: '', rememberMe: false };

  constructor(
    private router: Router,
    private loader: LoadingController,
    private toaster: ToasterService,
    private auth: Auth
  ) { }

  async ngOnInit() {
    const loader = await this.loader.create();
    await loader.present();
    const unsubscribe = this.auth.onAuthStateChanged(user => {
      unsubscribe();
      if (user) {
        this.router.navigate(['tabs']);
      }
      loader.dismiss();
    });
  }

  async onLogin(form: NgForm) {
    const loader = await this.loader.create({ message: "Logging in..." })
    loader.present();
    await this.auth.setPersistence(this.login.rememberMe ? browserLocalPersistence : browserSessionPersistence);
    signInWithEmailAndPassword(this.auth, this.login.username, this.login.password).then(user => {
      this.toaster.presentToast({ message: 'Login successful.', color: "success" })
      this.router.navigate(['tabs'], { replaceUrl: true });
      loader.dismiss();
    }).catch(err => {
      console.log(err);
      this.toaster.presentToast({ message: `Error: ${err.code}`, color: 'danger' });
      loader.dismiss();
      form.resetForm();
    });
  }

  onSignup() {
    this.router.navigateByUrl('/register');
  }

}
