import { Injectable, signal, WritableSignal } from '@angular/core';
import { StorageService } from './storage.service';
import { Temple } from '../interfaces/temple';
import { Observable } from 'rxjs';
import { STORAGE_KEYS } from '../storage.config';
import { addDoc, collection, deleteDoc, doc, DocumentReference, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TempleService {

  public templesUpdatedSignal: WritableSignal<number> = signal(0);

  constructor(
    private storage: StorageService,
    private fireStore: Firestore,
    private auth: Auth
  ) { }

  async addTemple(temple: { name: string, address: string }): Promise<DocumentReference> {
    const isoDateTime = new Date().toISOString();
    const templeReq: Partial<Temple> = {
      name: temple.name,
      address: temple.address,
      createdAt: isoDateTime,
      createdBy: this.auth.currentUser?.uid as string,
      updatedAt: isoDateTime
    }
    return await addDoc(collection(this.fireStore, "temples"), templeReq);
  }

  async getAllTemples(): Promise<Temple[]> {
    const q = query(collection(this.fireStore, "temples"), where("createdBy", "==", this.auth.currentUser?.uid));
    const querySnapshot = await getDocs(q)
    const temples = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    await this.storage.set(STORAGE_KEYS.TEMPLE.temples, temples);

    return await this.storage.get(STORAGE_KEYS.TEMPLE.temples);
  }

  getTempleById(templeId: number): Observable<Temple> {
    return new Observable(observer => {
      this.storage.get(STORAGE_KEYS.TEMPLE.temples).then((temples: Temple[]) => {
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

  async deleteTemple(templeId: string): Promise<void> {
    return await deleteDoc(doc(this.fireStore, "temples", templeId));
  }

  triggerTemplesUpdatedEvent() {
    this.templesUpdatedSignal.update((value: number) => ++value);
  }
}
