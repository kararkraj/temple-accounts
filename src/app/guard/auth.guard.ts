import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { STORAGE_KEYS } from 'src/app/storage.config';
import { ToasterService } from 'src/app/services/toaster.service';
import { Auth } from '@angular/fire/auth';

export const canActivate: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  return new Promise(resolve => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      if (user) {
        const isEmailVerified = auth.currentUser?.emailVerified;
        if (!isEmailVerified) {
          return state.url === '/email-verification' ? resolve(true) : resolve(router.parseUrl('email-verification'));
        } else {
          return state.url === '/email-verification' ? resolve(router.parseUrl('tabs')) : resolve(true);
        }
      } else {
        return resolve(router.parseUrl('login'));
      }
    });
  });

};

export const canActivateChild: CanActivateChildFn = async (route, state) => {
  const storage = inject(StorageService);
  const router = inject(Router);
  const toaster = inject(ToasterService);

  const temples = await storage.get(STORAGE_KEYS.TEMPLE.temples);
  if (temples.length > 0 || state.url === '/tabs/temples/add') {
    return true;
  } else {
    await toaster.presentToast({ message: "Please add a temple to proceed!", color: "danger" });
    return router.parseUrl('tabs/temples/add');
  }
};
