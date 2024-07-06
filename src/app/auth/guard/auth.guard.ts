import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { STORAGE_KEYS } from 'src/app/storage.config';
import { ToasterService } from 'src/app/services/toaster.service';

export const canActivate: CanActivateFn = async (route, state) => {
  const storage = inject(StorageService);
  const router = inject(Router);

  const isAuthenticated = await storage.get(STORAGE_KEYS.AUTH.isAuthenticated);
  return isAuthenticated ? true : router.parseUrl('login');
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
