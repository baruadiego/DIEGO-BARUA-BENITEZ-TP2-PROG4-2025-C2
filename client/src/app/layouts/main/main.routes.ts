import { Routes } from '@angular/router';
export const mainRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'feed',
  },
  {
    path: 'feed',
    loadComponent: () => import('../../pages/feed/feed').then((m) => m.Feed),
  },
  {
    path: 'feed/trends',
    loadComponent: () => import('../../pages/feed/feed').then((m) => m.Feed),
  },
  {
    path: 'profile',

    loadComponent: () => import('../../pages/profile/profile').then((m) => m.Profile),
  },
  {
    path: 'new-post',
    loadComponent: () => import('../../pages/new-post/new-post').then((m) => m.NewPostComponent),
  },
  {
    path: 'admin',
    loadChildren: () => import('../../pages/admin/admin.routes').then((m) => m.adminRoutes),
  },
];
