import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { AlreadyLoggedInGuard } from './guards/already-logged-in.guard';
import { RoleGuard } from './guards/role.guard';


export const routes: Routes = [
  {
    path: '',
    // canActivate: [AuthGuard],
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: '', redirectTo: 'jobs', pathMatch: 'full' },
      {
        path: 'jobs',
        // canActivate: [AuthGuard],
        children: [
          { path: '', loadComponent: () => import('./pages/jobs/jobs.component').then(m => m.JobsComponent) },
          { path: 'new', canActivate: [AuthGuard], loadComponent: () => import('./pages/job-form/job-form.component').then(m => m.JobFormComponent) },
          { path: 'edit/:id', canActivate: [AuthGuard], loadComponent: () => import('./pages/job-form/job-form.component').then(m => m.JobFormComponent) },
          { path: ':id', loadComponent: () => import('./pages/job-details/job-details.component').then(m => m.JobDetailsComponent) },
        ],
      },
      { path: 'employer/dashboard', canActivate: [AuthGuard, RoleGuard(['employer'])], loadComponent: () => import('./pages/employer-dashboard/employer-dashboard.component').then(m => m.EmployerDashboardComponent) },
      { path: 'admin/dashboard', canActivate: [AuthGuard, RoleGuard(['admin'])], loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
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

