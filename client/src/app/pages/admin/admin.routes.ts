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
    path: 'statics',
    loadComponent: () => import('./pages/statics/statics').then(m => m.Statics)
  }
]