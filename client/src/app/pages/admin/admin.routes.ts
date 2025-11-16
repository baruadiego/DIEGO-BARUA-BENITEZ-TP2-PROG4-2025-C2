import { Routes } from '@angular/router';
export const adminRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'users',
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users').then(m => m.Users)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/admin-register/admin-register').then(m => m.AdminRegister)
  },
  {
    path: 'stats',
    loadComponent: () => import('./pages/statistics/statistics').then(m => m.statistics)
  }
]