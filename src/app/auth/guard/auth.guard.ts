import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { STORAGE_KEYS } from 'src/app/storage.config';

export const authGuard: CanActivateFn = async (route, state) => {
  const storage = inject(StorageService);
  const router = inject(Router);
  
  const isAuthenticated = await storage.get(STORAGE_KEYS.AUTH.isAuthenticated);
  return isAuthenticated ? true : router.parseUrl('login');
};
