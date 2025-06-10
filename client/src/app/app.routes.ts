import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AlreadyLoggedInGuard } from './guards/already-logged-in.guard';


export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'jobs', pathMatch: 'full' },
      { path: 'jobs', loadComponent: () => import('./pages/jobs/jobs.component').then(m => m.JobsComponent) }
    ],
  },
  {
    path: 'auth',
    canActivate: [AlreadyLoggedInGuard],
    children: [
      { path: 'login', loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'register', loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent) },

    ],
  },
  { path: '**', redirectTo: 'auth/login' },
];

