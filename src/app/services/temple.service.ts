import { Injectable, signal, WritableSignal } from '@angular/core';
import { Temple } from '../interfaces/temple';
import { addDoc, collection, deleteDoc, doc, DocumentReference, Firestore, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TempleService {

  public templesUpdatedSignal: WritableSignal<number> = signal(0);

  constructor(
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
    const temples = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Temple[];
    return temples;
  }

  async getTempleById(templeId: string): Promise<Temple> {
    return (await getDoc(doc(this.fireStore, 'temples', templeId))).data() as Temple;
  }

  async updateTemple(templeId: string, temple: Partial<Temple>): Promise<Partial<Temple>> {
    return new Promise(async (resolve, reject) => {
      try {
        const templeRef = doc(this.fireStore, 'temples', templeId);
        await updateDoc(templeRef, temple);
        resolve(temple);
      } catch (err) {
        reject(err);
      }
    });
  }

  async deleteTemple(templeId: string): Promise<void> {
    return await deleteDoc(doc(this.fireStore, "temples", templeId));
  }

  triggerTemplesUpdatedEvent() {
    this.templesUpdatedSignal.update((value: number) => ++value);
  }
}
