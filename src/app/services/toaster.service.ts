import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor(
    private toastController: ToastController
  ) { }

  async presentToast({
    message,
    color = undefined,
    duration = 5000,
    position = 'bottom'
  }: ToasterArgs) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: position,
      color: color
    });

    await toast.present();
  }
}

type TOASTER_COLORS = "danger" | "dark" | "light" | "medium" | "primary" | "secondary" | "success" | "tertiary" | "warning" | string | undefined;
type TOASTER_POSITIONS = "bottom" | "middle" | "top";

interface ToasterArgs {
  message: string;
  color?: TOASTER_COLORS;
  position?: TOASTER_POSITIONS;
  duration?: number;
}