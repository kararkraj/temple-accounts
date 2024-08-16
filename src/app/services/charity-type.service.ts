import { Injectable, signal, WritableSignal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, deleteDoc, doc, Firestore, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { CharityType, CharityTypeRequest } from 'src/app/interfaces/charityType';
import { StorageService } from 'src/app/services/storage.service';
import { STORAGE_KEYS } from 'src/app/storage.config';
import { NetworkService } from './network.service';

@Injectable({
  providedIn: 'root'
})
export class CharityTypeService {

  charityTypesUpdatedSignal: WritableSignal<number> = signal(0);

  constructor(
    private storage: StorageService,
    private fireStore: Firestore,
    private auth: Auth,
    private network: NetworkService
  ) { }

  async getCharityTypes(): Promise<CharityType[]> {
    const charityTypes = await this.storage.get(STORAGE_KEYS.CHARITY_TYPES.charityTypes);

    // If charityTypes is null then it is not yet fetched from server.
    //  Hence, fetch charityTypes from server and store it locally. This will happen only one time during the session.
    if (charityTypes === null) {
      const q = query(collection(this.fireStore, "charityTypes"), where("createdBy", "==", this.auth.currentUser?.uid));
      const querySnapshot = await getDocs(q);
      const charityTypesFromServer = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CharityType[];

      await this.storage.set(STORAGE_KEYS.CHARITY_TYPES.charityTypes, charityTypesFromServer);
      return charityTypesFromServer;
    } else {
      return charityTypes;
    }
  }

  async getCharityTypeById(charityTypeId: string): Promise<CharityType> {
    const charityTypes = await this.storage.get(STORAGE_KEYS.CHARITY_TYPES.charityTypes) as CharityType[];
    const charityType = charityTypes.find(charityType => charityType.id === charityTypeId);
    if (charityType) {
      return charityType;
    } else {
      // Firestore throws permission-denied error when unknown temple id is queried.
      // Hence, implemented the same in custom flow.
      throw ({ code: 'permission-denied' });
    }
  }

  async addCharityType(charityType: { name: string, amount: number }): Promise<CharityType> {
    try {
      await this.network.isNetworkConnected();
      const isoDateTime = new Date().toISOString();
      const charityTypeReq: CharityTypeRequest = {
        name: charityType.name,
        amount: charityType.amount,
        createdBy: this.auth.currentUser?.uid as string,
        createdAt: isoDateTime,
        updatedAt: isoDateTime
      }

      const doc = await addDoc(collection(this.fireStore, "charityTypes"), charityTypeReq);

      const newCharityType = { id: doc.id, ...charityTypeReq };
      const charityTypes = await this.storage.get(STORAGE_KEYS.CHARITY_TYPES.charityTypes);
      charityTypes.push(newCharityType);
      await this.storage.set(STORAGE_KEYS.CHARITY_TYPES.charityTypes, charityTypes);
      return newCharityType;
    } catch (err) {
      throw (err);
    }
  }

  async updateCharityType(charityTypeId: string, updatedFields: Partial<CharityTypeRequest>): Promise<CharityType> {
    try {
      await this.network.isNetworkConnected();
      const charityTypeRef = doc(this.fireStore, 'charityTypes', charityTypeId);
      updatedFields.updatedAt = new Date().toISOString();
      await updateDoc(charityTypeRef, updatedFields);

      const charityTypes = await this.storage.get(STORAGE_KEYS.CHARITY_TYPES.charityTypes) as CharityType[];
      const index = charityTypes.findIndex(charityType => charityType.id === charityTypeId);
      charityTypes[index] = { ...charityTypes[index], ...updatedFields };
      await this.storage.set(STORAGE_KEYS.CHARITY_TYPES.charityTypes, charityTypes);

      return charityTypes[index];
    } catch (err) {
      throw (err);
    }
  }

  async deleteCharityType(charityTypeId: string): Promise<CharityType> {
    try {
      await this.network.isNetworkConnected();
      await deleteDoc(doc(this.fireStore, 'charityTypes', charityTypeId));

      const charityTypes = await this.storage.get(STORAGE_KEYS.CHARITY_TYPES.charityTypes) as CharityType[];
      const index = charityTypes.findIndex(charityType => charityType.id === charityTypeId);
      const deletedCharityType = charityTypes.splice(index, 1)[0];
      await this.storage.set(STORAGE_KEYS.CHARITY_TYPES.charityTypes, charityTypes);

      return deletedCharityType;
    } catch (err) {
      throw (err);
    }
  }

  triggerCharityTypesUpdatedSignal() {
    this.charityTypesUpdatedSignal.update(count => ++count);
  }
}
