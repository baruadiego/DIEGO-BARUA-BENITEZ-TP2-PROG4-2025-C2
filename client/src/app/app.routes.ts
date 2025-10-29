import { Routes } from '@angular/router';
import { App } from './app';
import { isAuthGuard } from './common/guards/is-auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: App,
    children: [
      {
        path: '',
        redirectTo: 'feed',
        pathMatch: 'full',
      },
      {
        path: 'feed',
        canActivate: [isAuthGuard],
        loadComponent: () => import('./pages/feed/feed').then((m) => m.Feed),
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then((m) => m.Register),
      },
      {
        path: 'profile',
        canActivate: [isAuthGuard],
        loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
      },
    ],
  },
];
