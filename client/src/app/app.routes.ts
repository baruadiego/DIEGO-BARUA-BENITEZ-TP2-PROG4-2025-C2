import { Routes } from '@angular/router';
import { App } from './app';
import { isAuthGuard } from './common/guards/is-auth-guard';
import { Main } from './layouts/main/main';

export const routes: Routes = [
  {
    path: '',
    component: App,
    children: [
      {
        path: '',
        canActivate: [isAuthGuard],
        component: Main,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'feed',
          },
          {
            path: 'feed',
            loadComponent: () => import('./pages/feed/feed').then((m) => m.Feed),
          },
          {
            path: 'feed/trends',
            loadComponent: () => import('./pages/feed/feed').then((m) => m.Feed),
          },
          {
            path: 'profile',
            loadComponent: () => import('./pages/profile/profile').then((m) => m.Profile),
          },
          {
            path: 'new-post',
            loadComponent: () => import('./pages/new-post/new-post').then((m) => m.NewPostComponent),
          }
        ]
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then((m) => m.Login),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register/register').then((m) => m.Register),
      },
    ],
  },
];
