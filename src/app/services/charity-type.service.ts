import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';
import { CharityType } from 'src/app/interfaces/charityType';
import { StorageService } from 'src/app/services/storage.service';
import { STORAGE_KEYS } from 'src/app/storage.config';

@Injectable({
  providedIn: 'root'
})
export class CharityTypeService {

  charityTypesUpdatedSignal: WritableSignal<number> = signal(0);

  constructor(
    private storage: StorageService
  ) { }

  getCharityTypes(): Promise<CharityType[]> {
    return this.storage.get(STORAGE_KEYS.CHARITY_TYPES.charityTypes);
  }

  addCharityType(charityType: CharityType): Observable<CharityType> {
    return new Observable(observer => {
      Promise.all([
        this.storage.get(STORAGE_KEYS.CHARITY_TYPES.lastStoredId),
        this.getCharityTypes()
      ]).then(result => {
        const id = result[0] + 1;
        const newCharityType: CharityType = { ...charityType, id }
        result[1].push(newCharityType);
        Promise.all([
          this.storage.set(STORAGE_KEYS.CHARITY_TYPES.charityTypes, result[1]),
          this.storage.set(STORAGE_KEYS.CHARITY_TYPES.lastStoredId, newCharityType.id)
        ]).then(result => {
          this.triggerCharityTypesUpdatedSignal();
          observer.next(newCharityType);
          observer.complete();
        });
      })
    });
  }

  getCharityTypeById(charityTypeId: number): Observable<CharityType> {
    return new Observable(observer => {
      this.getCharityTypes().then(charityTypes => {
        const charityType = charityTypes.find(charityType => charityType.id === charityTypeId);
        charityType ? observer.next(charityType) : observer.error("Service Id not found.");
        observer.complete();
      });
    });
  }

  updateCharityType(updatedCharityType: CharityType): Observable<CharityType> {
    return new Observable(observer => {
      this.getCharityTypes().then(charityTypes => {
        const index = charityTypes.findIndex(charityType => charityType.id === updatedCharityType.id);
        charityTypes[index] = updatedCharityType;
        this.storage.set(STORAGE_KEYS.CHARITY_TYPES.charityTypes, charityTypes).then(res => {
          observer.next(updatedCharityType);
          this.triggerCharityTypesUpdatedSignal();
          observer.complete();
        });
      });
    });
  }

  deleteService(serviceId: number): Observable<CharityType> {
    return new Observable(observer => {
      this.getCharityTypes().then(charityTypes => {
        const index = charityTypes.findIndex(charityType => charityType.id === serviceId);
        const deletedService = charityTypes.splice(index, 1)[0];
        this.storage.set(STORAGE_KEYS.CHARITY_TYPES.charityTypes, charityTypes).then(res => {
          this.triggerCharityTypesUpdatedSignal();
          observer.next(deletedService);
          observer.complete();
        });
      });
    });
  }

  triggerCharityTypesUpdatedSignal() {
    this.charityTypesUpdatedSignal.update(count => ++count);
  }
}
