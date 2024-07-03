import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DEFAULT_STORAGE_VALUES } from '../storage.config';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) { }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;

    // When the storage is instantiated for the first time, entries will be null and null value can cause errors.
    // Hence instantiate with initial values
    if (await this._storage.get('entries') === null) {
      this.resetStorage();
    }
  }

  public async set(key: string, value: any) {
    return await this._storage?.set(key, value);
  }

  public async get(key: string): Promise<any> {
    return await this._storage?.get(key);
  }

  public async resetStorage() {
    this._storage?.clear();
    for (const key in DEFAULT_STORAGE_VALUES) {
      await this._storage?.set(key, DEFAULT_STORAGE_VALUES[key]);
    }
  }
}
