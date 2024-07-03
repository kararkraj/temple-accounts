import { Injectable, WritableSignal, signal } from '@angular/core';
import { Entry } from '../interfaces/entry';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { Temple } from '../interfaces/temple';
import { STORAGE_KEYS } from '../storage.config';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public entriesUpdatedSignal: WritableSignal<number> = signal(0);
  public templesUpdatedSignal: WritableSignal<number> = signal(0);

  constructor(
    private storage: StorageService
  ) { }

  addEntry(entry: Entry): Observable<Entry> {
    return new Observable((observer) => {
      this.storage.get(STORAGE_KEYS.ENTRY.entries).then(entries => {
        entries.push(entry);
        this.storage.set(STORAGE_KEYS.ENTRY.entries, entries);
        this.storage.set(STORAGE_KEYS.ENTRY.lastStoredId, entry.id);
        observer.next(entry);
        this.triggerEntriesUpdatedEvent();
        observer.complete();
      });
    });
  }

  getEntries(): Promise<Entry[]> {
    return this.storage.get(STORAGE_KEYS.ENTRY.entries);
  }

  triggerEntriesUpdatedEvent() {
    this.entriesUpdatedSignal.update((value: number) => ++value);
  }

  addTemple(temple: Temple): Observable<Temple> {
    return new Observable(observer => {
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
        console.log(temples);
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
