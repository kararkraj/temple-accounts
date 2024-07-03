import { Injectable } from '@angular/core';
import { LoginData } from '../interfaces/login-data';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from '../storage.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private storage: StorageService
  ) { }

  login(loginData: LoginData): Observable<string> {
    return new Observable(observer => {
      if (loginData.username === "admin" && loginData.password === "admin") {
        this.storage.set(STORAGE_KEYS.AUTH.isAuthenticated, true).then((isAuthenticated) => {
          observer.next("Login successful!");
          observer.complete();
        });
      } else {
        observer.error("Invalid credentials!");
        observer.complete();
      }
    });
  }

  logout(): Promise<any> {
    this.storage.resetStorage();
    return this.storage.set(STORAGE_KEYS.AUTH.isAuthenticated, false);
  }
}
