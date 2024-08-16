import { APP_INITIALIZER, enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './app/services/storage.service';
import { getApp, initializeApp as initializeApp_alias, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, provideFirestore } from '@angular/fire/firestore';
import { provideAppCheck, initializeAppCheck, ReCaptchaEnterpriseProvider } from '@angular/fire/app-check';

if (environment.production) {
  enableProdMode();
}

export function initializeApp(storage: StorageService) {
  return () => storage.init();
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ innerHTMLTemplatesEnabled: true }),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    Storage,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [StorageService],
    },
    provideFirebaseApp(() => initializeApp_alias({
      "projectId": environment.firebase.projectId,
      "appId": environment.firebase.appId,
      "storageBucket": environment.firebase.storageBucket,
      "apiKey": environment.firebase.apiKey,
      "authDomain": environment.firebase.authDomain,
      "messagingSenderId": environment.firebase.messagingSenderId,
      "measurementId": environment.firebase.measurementId
    })),
    provideAuth(() => getAuth()),
    provideAppCheck(() => (initializeAppCheck(getApp(), {
      provider: new ReCaptchaEnterpriseProvider('6Lc1UygqAAAAAMTofSdpYhD6mzw7kokYHuvZ5tCr'),
      isTokenAutoRefreshEnabled: true
    }))),
    provideFirestore(() => (initializeFirestore(getApp(), {
      localCache: persistentLocalCache()
    }))),
  ],
});
