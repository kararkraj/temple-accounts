import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { ToasterService } from 'src/app/services/toaster.service';
import { Auth } from '@angular/fire/auth';
import { TempleService } from '../services/temple.service';

export const canActivateAuthenticatedRoutes: CanActivateFn = async (route, state) => {
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
  const templeService = inject(TempleService);
  const router = inject(Router);
  const toaster = inject(ToasterService);

  const templesCount = await templeService.getTemplesCount();
  if (templesCount > 0 || state.url === '/tabs/temples/add') {
    return true;
  } else {
    await toaster.presentToast({ message: "Please add a temple to proceed!", color: "danger" });
    return router.parseUrl('tabs/temples/add');
  }
};

export const canActivateUnAuthenticatedRoutes: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const auth = inject(Auth);

  return new Promise(resolve => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      user ? resolve(router.parseUrl('tabs')) : resolve(true);
    });
  });

};