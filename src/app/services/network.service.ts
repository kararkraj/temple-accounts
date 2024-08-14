import { Injectable } from '@angular/core';
import { ConnectionStatus, Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  constructor() { }

  /**
 * Resolves with `ConnectionStatus` instance if internet connectivity is active.
 *
 * @throws If internet connection is not active.
 * @returns A Promise resolved with `ConnectionStatus` instance if the internet connection is active.
 */
  async isNetworkConnected(): Promise<ConnectionStatus> {
    const networkStatus = await Network.getStatus();
    if (networkStatus.connected) {
      return networkStatus;
    } else {
      throw ({
        ...networkStatus,
        code: 'Network error. Please check your internet connection and try again.'
      });
    }
  }
}
