import { Injectable, signal, WritableSignal } from '@angular/core';
import { Temple, TempleRequest } from '../interfaces/temple';
import { addDoc, collection, doc, FieldPath, Firestore, getDoc, onSnapshot, query, updateDoc, where } from '@angular/fire/firestore';
import { Auth, Unsubscribe } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class TempleService {

  temples: WritableSignal<Temple[] | null> = signal(null);
  templesCount: number | undefined;
  templesListener: Unsubscribe | undefined;

  constructor(
    private fireStore: Firestore,
    private auth: Auth
  ) { }

  async getTemplesCount() {
    if (!this.templesCount) {
      return (await this.getAllTemples()).length;
    } else {
      return this.templesCount;
    }
  }

  async getAllTemples(): Promise<Temple[]> {
    if (!this.templesListener) {
      const fieldPath = new FieldPath('roles', this.auth.currentUser?.email as string);
      const q = query(
        collection(this.fireStore, "temples"),
        where(fieldPath, 'in', ['owner', 'admin', 'member', 'viewer']),
        where('isActive', '==', true)
      );
      return new Promise(resolve => {
        this.templesListener = onSnapshot(q, querySnapshot => {
          const temples = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Temple[];
          this.temples.set(temples);
          this.templesCount = temples.length;
          resolve(temples);
        });
      });
    } else {
      return this.temples() as Temple[];
    }
  }

  async getTempleById(templeId: string): Promise<Temple> {
    const templeRef = doc(this.fireStore, 'temples', templeId);
    const docSnap = await getDoc(templeRef);
    if (docSnap.exists()) {
      const temple: Temple = { id: docSnap.id, ...docSnap.data() } as Temple;
      return temple;
    } else {
      // Firestore throws permission-denied error when unknown temple id is queried.
      // Hence, implemented the same in custom flow.
      throw ({ code: 'permission-denied' });
    }
  }

  async addTemple(temple: { name: string, address: string }): Promise<Temple> {
    try {
      const isoDateTime = new Date().toISOString();
      const templeReq: TempleRequest = {
        name: temple.name,
        address: temple.address,
        createdAt: isoDateTime,
        createdBy: this.auth.currentUser?.uid as string,
        updatedAt: isoDateTime,
        isActive: true,
        roles: {
          [this.auth.currentUser?.email as string]: 'owner'
        }
      }
      const templeDoc = await addDoc(collection(this.fireStore, "temples"), templeReq);

      const newTemple = { ...templeReq, id: templeDoc.id };
      return newTemple;
    } catch (err) {
      throw (err);
    }
  }

  async updateTemple(templeId: string, updatedFields: Partial<TempleRequest>): Promise<Partial<Temple>> {
    try {
      updatedFields.updatedAt = new Date().toISOString();
      const templeRef = doc(this.fireStore, 'temples', templeId);
      await updateDoc(templeRef, updatedFields);
      return updatedFields;
    } catch (err) {
      throw (err);
    }
  }

  async deleteTemple(templeId: string): Promise<Partial<Temple>> {
    try {
      const updatedFields: { isActive: boolean } = { isActive: false };
      return await this.updateTemple(templeId, updatedFields);
    } catch (err) {
      throw (err);
    }
  }

  onLogout() {
    this.templesCount = undefined;
    this.temples.set(null);
    if (this.templesListener) {
      this.templesListener();
    }
    this.templesListener = undefined;
  }
}
