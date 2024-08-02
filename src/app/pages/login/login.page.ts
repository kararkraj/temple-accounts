import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonInput, IonIcon, IonCheckbox, IonAlert, IonGrid } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular/standalone';
import { ToasterService } from 'src/app/services/toaster.service';
import { Auth, browserLocalPersistence, browserSessionPersistence, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonGrid, IonAlert, IonCheckbox, IonIcon,
    ReactiveFormsModule,
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

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private loader: LoadingController,
    private toaster: ToasterService,
    private auth: Auth
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, Validators.maxLength(99)]),
      password: new FormControl(null, [Validators.required, Validators.maxLength(99)]),
      rememberMe: new FormControl(false)
    });
  }

  ngOnInit() {
  }

  async onLogin() {
    if (this.loginForm.valid) {
      const loader = await this.loader.create({ message: "Logging in..." });
      await loader.present();
      const loginForm = this.loginForm.getRawValue();
      await this.auth.setPersistence(loginForm.rememberMe ? browserLocalPersistence : browserSessionPersistence);
      signInWithEmailAndPassword(this.auth, loginForm.username, loginForm.password).then(user => {
        this.toaster.presentToast({ message: 'Login successful.', color: "success" })
        this.router.navigate(['tabs'], { replaceUrl: true });
      }).catch(err => {
        console.log(err);
        this.toaster.presentToast({ message: `Error: ${err.code}`, color: 'danger' });
      }).finally(() => {
        loader.dismiss();
        this.loginForm.reset();
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  goToRegister() {
    this.router.navigateByUrl('/register');
  }

}
