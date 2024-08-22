import { Injectable } from '@angular/core';
import { Entry, EntryAdd, EntryRequest, EntryResponse } from '../interfaces/entry';
import { STORAGE_KEYS } from '../storage.config';
import { StorageService } from './storage.service';
import { TempleService } from './temple.service';
import { CharityTypeService } from './charity-type.service';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from '@angular/fire/firestore';
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
      const q = query(collection(this.fireStore, "entries"), where("createdBy", "==", this.auth.currentUser?.uid), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const entriesFromServer = querySnapshot.docs.map(doc => (this.transformEntry(doc.id, doc.data() as EntryResponse))) as Entry[];

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
    const entryReq: EntryRequest = {
      ...entry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: this.auth.currentUser?.uid as string
    };
    const newEntryId = (await addDoc(collection(this.fireStore, 'entries'), entryReq)).id;
    const newEntryFromServer = (await getDoc(doc(this.fireStore, 'entries', newEntryId))).data() as EntryResponse;

    const newEntry = this.transformEntry(newEntryId, newEntryFromServer)
    newEntry.id = newEntryId;

    const entries = await this.getEntries();
    entries.unshift(newEntry);
    await this.storage.set(STORAGE_KEYS.ENTRY.entries, entries);

    return newEntry;
  }

  async updateEntry(entryId: string, updatedFields: Partial<EntryAdd>): Promise<Entry> {
    const entryRef = doc(this.fireStore, 'entries', entryId);
    const entryReq: Partial<EntryRequest> = {
      updatedAt: serverTimestamp(),
      ...updatedFields
    }
    await updateDoc(entryRef, entryReq);

    const updatedEntryFromServer = (await getDoc(doc(this.fireStore, 'entries', entryId))).data() as EntryResponse;
    const updatedEntry = this.transformEntry(entryId, updatedEntryFromServer);

    const entries = await this.getEntries() as Entry[];
    const index = entries.findIndex(entry => entry.id === entryId);
    entries[index] = updatedEntry;
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

  transformEntry(entryId: string, entryFromServer: EntryResponse): Entry {
    return {
      id: entryId,
      createdAt: new Date(entryFromServer.createdAt.seconds * 1000).toISOString(),
      updatedAt: new Date(entryFromServer.updatedAt.seconds * 1000).toISOString(),
      createdBy: entryFromServer.createdBy,
      name: entryFromServer.name,
      title: entryFromServer.title,
      templeId: entryFromServer.templeId,
      templeName: entryFromServer.templeName,
      templeAddress: entryFromServer.templeAddress,
      charityTypeId: entryFromServer.charityTypeId,
      charityTypeName: entryFromServer.charityTypeName,
      charityTypeAmount: entryFromServer.charityTypeAmount
    };
  }


}
