import { Routes } from '@angular/router';
import { canActivate, canActivateChild } from './auth/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.routes').then(m => m.TABS_ROUTES),
    canActivate: [canActivate],
    canActivateChild: [canActivateChild]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/my-profile/my-profile.page').then(m => m.MyProfilePage),
    canActivate: [canActivate]
  },
  {
    path: 'email-verification',
    loadComponent: () => import('./pages/email-verification/email-verification.page').then( m => m.EmailVerificationPage),
    canActivate: [canActivate]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: "tabs/add-entry",
  },
];
