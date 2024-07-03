import { Component, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonRow, IonCol, IonButton, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular/standalone';
import { LoginData } from 'src/app/interfaces/login-data';
import { AuthService } from 'src/app/auth/auth.service';
import { ToasterService } from 'src/app/services/toaster.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
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

  login: LoginData = { username: '', password: '' };
  isToastOpen: boolean = false;
  loginEvent: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private router: Router,
    private loader: LoadingController,
    private authService: AuthService,
    private toaster: ToasterService
  ) { }

  ngOnInit() {
  }

  onLogin(form: NgForm) {
    this.loader.create({ message: "Logging in..." }).then(loader => {
      loader.present();
      this.authService.login(this.login).subscribe({
        next: (res: string) => {
          this.toaster.presentToast({ message: res, color: "success" }).then(() => {
            loader.dismiss();
            this.loginEvent.emit(true);
            this.router.navigate(['tabs'], { replaceUrl: true });
          });
        },
        error: (err: string) => {
          this.toaster.presentToast({ message: err, color: "danger" }).then(() => {
            loader.dismiss();
            form.resetForm();
          });
        }
      });
    });
  }

  onSignup() {
    this.router.navigateByUrl('/register');
  }

}
