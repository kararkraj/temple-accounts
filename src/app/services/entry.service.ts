import { Injectable } from '@angular/core';
import { Entry, EntryAdd, EntryRequest } from '../interfaces/entry';
import { STORAGE_KEYS } from '../storage.config';
import { StorageService } from './storage.service';
import { TempleService } from './temple.service';
import { CharityTypeService } from './charity-type.service';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(
    private storage: StorageService,
    private templeService: TempleService,
    private charityTypeService: CharityTypeService,
    private fireStore: Firestore,
    private auth: Auth
  ) {
    this.getEntries();
  }

  async getEntries(): Promise<Entry[]> {
    const entries = await this.storage.get(STORAGE_KEYS.ENTRY.entries);

    // If entries is null then it is not yet fetched from server.
    //  Hence, fetch entries from server and store it locally. This will happen only one time during the session.
    if (entries === null) {
      const q = query(collection(this.fireStore, "entries"), where("createdBy", "==", this.auth.currentUser?.uid));
      const querySnapshot = await getDocs(q);
      const entriesFromServer = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Entry[];

      await this.storage.set(STORAGE_KEYS.ENTRY.entries, entriesFromServer);
      return entriesFromServer;
    } else {
      return entries;
    }
  }

  async getEntryById(entryId: string): Promise<Entry> {
    const entries = await this.getEntries() as Entry[];
    const entry = entries.find(entry => entry.id === entryId);
    if (entry) {
      return entry;
    } else {
      // Firestore throws permission-denied error when unknown temple id is queried.
      // Hence, implemented the same in custom flow.
      throw ({ code: 'permission-denied' });
    }
  }

  async addEntry(entry: EntryAdd): Promise<Entry> {
    const isoDateTime = new Date().toISOString();
    const entryReq: EntryRequest = {
      ...entry,
      createdAt: isoDateTime,
      updatedAt: isoDateTime,
      createdBy: this.auth.currentUser?.uid as string
    };
    const doc = await addDoc(collection(this.fireStore, 'entries'), entryReq);

    const newEntry: Entry = { id: doc.id, ...entryReq };
    const entries = await this.getEntries();
    entries.push(newEntry);
    await this.storage.set(STORAGE_KEYS.ENTRY.entries, entries);

    return newEntry;
  }

  async updateEntry(entryId: string, updatedFields: Partial<EntryAdd>): Promise<Entry> {
    const entryRef = doc(this.fireStore, 'entries', entryId);
    const entryReq: Partial<EntryRequest> = {
      updatedAt: new Date().toISOString(),
      ...updatedFields
    }
    await updateDoc(entryRef, entryReq);

    const entries = await this.getEntries() as Entry[];
    const index = entries.findIndex(entry => entry.id === entryId);
    entries[index] = { ...entries[index], ...updatedFields };
    this.storage.set(STORAGE_KEYS.ENTRY.entries, entries);

    return entries[index];
  }

  async deleteEntry(entryId: string): Promise<Entry> {
    await deleteDoc(doc(this.fireStore, 'entries', entryId));

    const entries = await this.getEntries();
    const index = entries.findIndex((entry: Entry) => entry.id === entryId);
    const deletedEntry = entries.splice(index, 1)[0];
    this.storage.set(STORAGE_KEYS.ENTRY.entries, entries);

    return deletedEntry;
  }

  getTemples() {
    return this.templeService.getAllTemples();
  }

  getCharityTypes() {
    return this.charityTypeService.getCharityTypes();
  }
}
