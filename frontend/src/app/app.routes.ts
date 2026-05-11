import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'registro', loadComponent: () => import('./features/auth/registro/registro.component').then(m => m.RegistroComponent) },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['CLIENTE', 'PROFESIONAL', 'ADMIN'] }
  },
  { 
    path: 'citas', 
    loadComponent: () => import('./features/citas/lista-citas/lista-citas.component').then(m => m.ListaCitasComponent),
    canActivate: [authGuard],
    data: { roles: ['CLIENTE', 'PROFESIONAL'] }
  },
  { 
    path: 'citas/crear', 
    loadComponent: () => import('./features/citas/crear-cita/crear-cita.component').then(m => m.CrearCitaComponent),
    canActivate: [authGuard],
    data: { roles: ['CLIENTE', 'PROFESIONAL'] }
  },
  { 
    path: 'citas/gestionar', 
    loadComponent: () => import('./features/citas/lista-citas/lista-citas.component').then(m => m.ListaCitasComponent),
    canActivate: [authGuard],
    data: { roles: ['PROFESIONAL'] }
  },
  { 
    path: 'usuarios', 
    loadComponent: () => import('./features/usuarios/usuarios.component').then(m => m.UsuariosComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'servicios', 
    loadComponent: () => import('./features/servicios/servicios.component').then(m => m.ServiciosComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN', 'PROFESIONAL'] }
  },
  { path: '**', redirectTo: '/login' }
];