import { Injectable, signal, WritableSignal } from '@angular/core';
import { Entry } from '../interfaces/entry';
import { Observable } from 'rxjs';
import { STORAGE_KEYS } from '../storage.config';
import { StorageService } from './storage.service';
import { TempleService } from './temple.service';
import { CharityTypeService } from './charity-type.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  public entriesUpdatedSignal: WritableSignal<number> = signal(0);

  constructor(
    private storage: StorageService,
    private templeService: TempleService,
    private charityTypeService: CharityTypeService
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

  getEntryById(entryId: number): Observable<Entry> {
    return new Observable(observer => {
      this.storage.get(STORAGE_KEYS.ENTRY.entries).then((entries: Entry[]) => {
        const entry = entries.find(entry => entry.id === entryId);
        entry ? observer.next(entry) : observer.error('Entry Id not found.');
        observer.complete();
      });
    });
  }

  async getEntryNextId() {
    return await this.storage.get(STORAGE_KEYS.ENTRY.lastStoredId) + 1;
  }

  updateEntry(entry: Entry): Observable<Entry> {
    const id = entry.id;
    return new Observable(observer => {
      this.storage.get(STORAGE_KEYS.ENTRY.entries).then((entries: Entry[]) => {
        const index = entries.findIndex(entry => entry.id === id);
        entries[index] = entry;
        this.storage.set(STORAGE_KEYS.ENTRY.entries, entries).then(() => {
          observer.next(entry);
          this.triggerEntriesUpdatedEvent();
          observer.complete();
        });
      });
    });
  }

  deleteEntry(entryId: number): Observable<Entry> {
    return new Observable(observer => {
      this.storage.get(STORAGE_KEYS.ENTRY.entries).then(entries => {
        const index = entries.findIndex((entry: Entry) => entry.id === entryId);
        const deletedEntry = entries.splice(index, 1)[0];
        this.storage.set(STORAGE_KEYS.ENTRY.entries, entries).then(() => {
          observer.next(deletedEntry);
          this.triggerEntriesUpdatedEvent();
          observer.complete();
        });
      });
    });
  }

  getTemples() {
    return this.templeService.getAllTemples();
  }

  getTemplesUpdatedSignal() {
    return this.templeService.templesUpdatedSignal();
  }

  getCharityTypes() {
    return this.charityTypeService.getCharityTypes();
  }

  getCharityTypesUpdatedSignal() {
    return this.charityTypeService.charityTypesUpdatedSignal();
  }
}
