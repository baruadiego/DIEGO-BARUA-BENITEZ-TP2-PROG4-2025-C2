import { Routes } from '@angular/router';
import { App } from './app';
import { isAuthGuard } from './common/guards/is-auth-guard';
import { Main } from './layouts/main/main';
import { Auth } from './layouts/auth/auth';

export const routes: Routes = [
  {
    path: '',
    component: App,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'redirect',
      },
      {
        path: '',
        canActivate: [isAuthGuard],
        component: Main,
        loadChildren: () => import('./layouts/main/main.routes').then((m) => m.mainRoutes)
      },
      {
        path: '',
        component: Auth,
        loadChildren: () => import('./layouts/auth/auth.routes').then((m) => m.routes)
      },
      {
        path: 'redirect',
        loadComponent: () => import('./pages/redirect/redirect').then((m) => m.Redirect),
      }
    ],
  },
];
