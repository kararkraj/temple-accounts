import { Injectable } from '@angular/core';
import { Entry, EntryAdd, EntryForList, EntryRequest } from '../interfaces/entry';
import { TempleService } from './temple.service';
import { CharityTypeService } from './charity-type.service';
import { addDoc, collection, doc, Firestore, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  constructor(
    private templeService: TempleService,
    private charityTypeService: CharityTypeService,
    private fireStore: Firestore,
    private auth: Auth
  ) { }

  async getEntries(): Promise<EntryForList[]> {
    const temples = await this.getTemples();
    const entryQueries = temples.map(temple => ({
      templeName: temple.name,
      templeAddress: temple.address,
      query: query(
        collection(this.fireStore, `temples/${temple.id}/entries`),
        where('isActive', '==', true)
      )
    }));

    let entries: EntryForList[] = [];
    for (let entryQuery of entryQueries) {
      const newEntries = ((await getDocs(entryQuery.query)).docs.map(doc => ({ id: doc.id, ...doc.data() })) as Entry[]).map(entry => ({
        ...entry,
        templeName: entryQuery.templeName,
        templeAddress: entryQuery.templeAddress
      }));
      entries = [...entries, ...newEntries];
    }
    return entries;
  }

  async getEntryById(entryId: string): Promise<Entry> {
    const entryRef = doc(this.fireStore, 'entries', entryId);
    const docSnap = await getDoc(entryRef);
    if (docSnap.exists()) {
      const entry: Entry = { id: docSnap.id, ...docSnap.data() } as Entry;
      return entry;
    } else {
      // Firestore throws permission-denied error when unknown temple id is queried.
      // Hence, implemented the same in custom flow.
      throw ({ code: 'permission-denied' });
    }
  }

  async addEntry(entry: EntryAdd, templeId: string): Promise<Entry> {
    const isoDateTime = new Date().toISOString();
    const entryReq: EntryRequest = {
      ...entry,
      createdAt: isoDateTime,
      updatedAt: isoDateTime,
      createdBy: this.auth.currentUser?.uid as string,
      isActive: true
    };
    const newEntryId = (await addDoc(collection(this.fireStore, `temples/${templeId}/entries`), entryReq)).id;
    return {
      ...entryReq,
      id: newEntryId
    }
  }

  async updateEntry(entryId: string, updatedFields: Partial<Entry>): Promise<Partial<Entry>> {
    const entryRef = doc(this.fireStore, 'temples/hlEzWnvn1pty1s0nzO3S/entries', entryId);
    const entryReq: Partial<EntryRequest> = {
      updatedAt: new Date().toISOString(),
      ...updatedFields
    }
    await updateDoc(entryRef, entryReq);
    return entryReq;
  }

  async deleteEntry(entryId: string): Promise<Partial<Entry>> {
    const updatedFields: Partial<EntryRequest> = {
      isActive: false
    }
    return await this.updateEntry(entryId, updatedFields);
  }

  getTemples() {
    return this.templeService.getAllTemples();
  }

  getCharityTypes() {
    return this.charityTypeService.getCharityTypes();
  }
}
