import { Routes } from '@angular/router';
import { canActivateAuthenticatedRoutes, canActivateChild, canActivateUnAuthenticatedRoutes } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
    canActivate: [canActivateUnAuthenticatedRoutes]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.page').then(m => m.RegisterPage),
    canActivate: [canActivateUnAuthenticatedRoutes]
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
    canActivate: [canActivateUnAuthenticatedRoutes]
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password/reset-password.page').then(m => m.ResetPasswordPage),
    canActivate: [canActivateUnAuthenticatedRoutes]
  },
  {
    path: 'account-actions',
    loadComponent: () => import('./pages/account-actions/account-actions.page').then( m => m.AccountActionsPage)
  },
  {
    path: 'tabs',
    loadChildren: () => import('./pages/tabs/tabs.routes').then(m => m.TABS_ROUTES),
    canActivate: [canActivateAuthenticatedRoutes],
    canActivateChild: [canActivateChild]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/my-profile/my-profile.page').then(m => m.MyProfilePage),
    canActivate: [canActivateAuthenticatedRoutes]
  },
  {
    path: 'email-verification',
    loadComponent: () => import('./pages/email-verification/email-verification.page').then(m => m.EmailVerificationPage),
    canActivate: [canActivateAuthenticatedRoutes]
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: "tabs/add-entry",
  }
];
