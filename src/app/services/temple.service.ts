import { Injectable, signal, WritableSignal } from '@angular/core';
import { Temple, TempleRequest } from '../interfaces/temple';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { NetworkService } from './network.service';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../storage.config';

@Injectable({
  providedIn: 'root'
})
export class TempleService {

  public templesUpdatedSignal: WritableSignal<number> = signal(0);

  constructor(
    private fireStore: Firestore,
    private auth: Auth,
    private network: NetworkService,
    private storage: StorageService
  ) { }

  async getAllTemples(): Promise<Temple[]> {
    const temples = await this.storage.get(STORAGE_KEYS.TEMPLE.temples);

    // If temples is null then it is not yet fetched from server.
    //  Hence, fetch temples from server and store it locally. This will happen only one time during the session.
    if (temples === null) {

      const q = query(collection(this.fireStore, "temples"), where("createdBy", "==", this.auth.currentUser?.uid));
      const querySnapshot = await getDocs(q);
      const templesFromServer = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Temple[];

      await this.storage.set(STORAGE_KEYS.TEMPLE.temples, templesFromServer);
      console.log(templesFromServer);
      return templesFromServer;

    } else {
      return temples;
    }
  }

  async getTempleById(templeId: string): Promise<Temple> {
    const temples = await this.storage.get(STORAGE_KEYS.TEMPLE.temples);
    const temple = temples.find((temple: Temple) => temple.id === templeId);
    if (temple) {
      return temple;
    } else {
      // Firestore throws permission-denied error when unknown temple id is queried.
      // Hence, implemented the same in custom flow.
      throw({ code: 'permission-denied' });
    }
  }

  async addTemple(temple: { name: string, address: string }): Promise<Temple> {
    try {
      await this.network.isNetworkConnected();
      const isoDateTime = new Date().toISOString();
      const templeReq: TempleRequest = {
        name: temple.name,
        address: temple.address,
        createdAt: isoDateTime,
        createdBy: this.auth.currentUser?.uid as string,
        updatedAt: isoDateTime
      }
      const doc = await addDoc(collection(this.fireStore, "temples"), templeReq);

      const newTemple = { ...templeReq, id: doc.id };
      const temples = await this.storage.get(STORAGE_KEYS.TEMPLE.temples);
      temples.push(newTemple);
      await this.storage.set(STORAGE_KEYS.TEMPLE.temples, temples);

      return newTemple;
    } catch (err) {
      throw (err);
    }
  }

  async updateTemple(templeId: string, updatedFields: Partial<TempleRequest>): Promise<Temple> {
    try {
      await this.network.isNetworkConnected();
      const templeRef = doc(this.fireStore, 'temples', templeId);
      await updateDoc(templeRef, updatedFields);

      const temples = await this.storage.get(STORAGE_KEYS.TEMPLE.temples);
      const index = temples.findIndex((temple: Temple) => temple.id === templeId);
      temples[index] = { ...temples[index], ...updatedFields };
      await this.storage.set(STORAGE_KEYS.TEMPLE.temples, temples);

      return temples[index];
    } catch (err) {
      throw (err);
    }
  }

  async deleteTemple(templeId: string): Promise<Temple> {
    try {
      await this.network.isNetworkConnected();
      await deleteDoc(doc(this.fireStore, "temples", templeId));

      const temples = await this.storage.get(STORAGE_KEYS.TEMPLE.temples) as Temple[];
      const index = temples.findIndex((temple: Temple) => temple.id === templeId);
      const deletedTemple = temples.splice(index, 1)[0];
      await this.storage.set(STORAGE_KEYS.TEMPLE.temples, temples);

      return deletedTemple;
    } catch (err) {
      throw (err);
    }
  }

  triggerTemplesUpdatedEvent() {
    this.templesUpdatedSignal.update((value: number) => ++value);
  }
}
