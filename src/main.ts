import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './app/services/storage.service';
import { initializeApp as initializeApp_alias, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { getRemoteConfig, provideRemoteConfig } from '@angular/fire/remote-config';

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
    provideFirestore(() => getFirestore()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => getRemoteConfig())
  ],
});
