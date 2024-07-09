import { Injectable, signal, WritableSignal } from '@angular/core';
import { StorageService } from './storage.service';
import { Temple } from '../interfaces/temple';
import { Observable } from 'rxjs';
import { STORAGE_KEYS } from '../storage.config';

@Injectable({
  providedIn: 'root'
})
export class TempleService {

  public templesUpdatedSignal: WritableSignal<number> = signal(0);

  constructor(
    private storage: StorageService
  ) { }

  addTemple(temple: Temple): Observable<Temple> {
    return new Observable(observer => {
      this.getTempleNextId().then(templeId => {
        temple.id = templeId
        this.storage.get(STORAGE_KEYS.TEMPLE.temples).then(temples => {
          temples.push(temple);
          this.storage.set(STORAGE_KEYS.TEMPLE.temples, temples);
          this.storage.set(STORAGE_KEYS.TEMPLE.lastStoredId, temple.id).then(() => {
            observer.next(temple);
            this.triggerTemplesUpdatedEvent();
            observer.complete();
          });
        });
      });
    });
  }

  getTemples(): Promise<Temple[]> {
    return this.storage.get(STORAGE_KEYS.TEMPLE.temples);
  }

  getTempleById(templeId: number): Observable<Temple> {
    return new Observable(observer => {
      this.storage.get(STORAGE_KEYS.TEMPLE.temples).then((temples: Temple[]) => {
        const temple = temples.find(temple => temple.id === templeId);
        temple ? observer.next(temple) : observer.error('Temple Id not found.');
        observer.complete();
      });
    });
  }

  async getTempleNextId() {
    return await this.storage.get(STORAGE_KEYS.TEMPLE.lastStoredId) + 1;
  }

  updateTemple(temple: Temple): Observable<Temple> {
    const id = temple.id;
    return new Observable(observer => {
      this.storage.get(STORAGE_KEYS.TEMPLE.temples).then((temples: Temple[]) => {
        const index = temples.findIndex(temple => temple.id === id);
        temples.splice(index, 1);
        temples.splice(index, 0, temple);
        this.storage.set(STORAGE_KEYS.TEMPLE.temples, temples).then(() => {
          observer.next(temple);
          this.triggerTemplesUpdatedEvent();
          observer.complete();
        });
      });
    });
  }

  deleteTemple(templeId: number): Observable<Temple> {
    return new Observable(observer => {
      this.storage.get(STORAGE_KEYS.TEMPLE.temples).then(temples => {
        const index = temples.findIndex((temple: Temple) => temple.id === templeId);
        const deletedTemple = temples.splice(index, 1)[0];
        this.storage.set(STORAGE_KEYS.TEMPLE.temples, temples).then(() => {
          observer.next(deletedTemple);
          this.triggerTemplesUpdatedEvent();
          observer.complete();
        });
      });
    });
  }

  triggerTemplesUpdatedEvent() {
    this.templesUpdatedSignal.update((value: number) => ++value);
  }
}
