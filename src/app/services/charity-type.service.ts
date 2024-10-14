import { Injectable, signal, WritableSignal } from '@angular/core';
import { Auth, Unsubscribe } from '@angular/fire/auth';
import { addDoc, collection, doc, Firestore, getDoc, onSnapshot, query, updateDoc, where } from '@angular/fire/firestore';
import { CharityType, CharityTypeRequest } from 'src/app/interfaces/charityType';

@Injectable({
  providedIn: 'root'
})
export class CharityTypeService {

  services: WritableSignal<CharityType[]> = signal([]);
  servicesListener: Unsubscribe | undefined;

  constructor(
    private fireStore: Firestore,
    private auth: Auth,
  ) { }

  async getCharityTypes(): Promise<CharityType[]> {
    if (!this.servicesListener) {
      return new Promise(resolve => {
        const q = query(
          collection(this.fireStore, 'services'),
          where('createdBy', '==', this.auth.currentUser?.uid),
          where('isActive', '==', true)
        );
        this.servicesListener = onSnapshot(q, querySnapshot => {
          const services = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CharityType[];
          this.services.set(services);
          resolve(services);
        });
      });
    } else {
      return this.services();
    }
  }

  async getCharityTypeById(serviceId: string): Promise<CharityType> {
    const serviceRef = doc(this.fireStore, 'services', serviceId);
    const docSnap = await getDoc(serviceRef);
    if (docSnap.exists()) {
      const service: CharityType = { id: docSnap.id, ...docSnap.data() } as CharityType;
      return service;
    } else {
      // Firestore throws permission-denied error when unknown temple id is queried.
      // Hence, implemented the same in custom flow.
      throw ({ code: 'permission-denied' });
    }
  }

  async addCharityType(charityType: { name: string, amount: number }): Promise<CharityType> {
    try {
      const isoDateTime = new Date().toISOString();
      const serviceReq: CharityTypeRequest = {
        name: charityType.name,
        amount: charityType.amount,
        createdBy: this.auth.currentUser?.uid as string,
        createdAt: isoDateTime,
        updatedAt: isoDateTime,
        isActive: true
      }

      const doc = await addDoc(collection(this.fireStore, "services"), serviceReq);

      const newService = { id: doc.id, ...serviceReq };
      return newService;
    } catch (err) {
      throw (err);
    }
  }

  async updateCharityType(serviceId: string, updatedFields: Partial<CharityTypeRequest>): Promise<Partial<CharityType>> {
    try {
      const serviceRef = doc(this.fireStore, 'services', serviceId);
      updatedFields.updatedAt = new Date().toISOString();
      await updateDoc(serviceRef, updatedFields);
      return updatedFields;
    } catch (err) {
      throw (err);
    }
  }

  async deleteCharityType(serviceId: string): Promise<Partial<CharityType>> {
    try {
      const updatedFields: { isActive: boolean } = { isActive: false };
      return await this.updateCharityType(serviceId, updatedFields);
    } catch (err) {
      throw (err);
    }
  }
}
