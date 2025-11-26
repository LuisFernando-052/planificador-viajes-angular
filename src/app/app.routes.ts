import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Ruta por defecto - redirige al dashboard
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  
  // Rutas públicas (sin protección)
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  
  // Rutas protegidas (requieren autenticación)
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'viajes',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/viajes/lista-viajes/lista-viajes.component').then(m => m.ListaViajesComponent)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./features/viajes/form-viaje/form-viaje.component').then(m => m.FormViajeComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./features/viajes/form-viaje/form-viaje.component').then(m => m.FormViajeComponent)
      },
      {
        path: ':id',
        loadComponent: () => import('./features/viajes/detalle-viaje/detalle-viaje.component').then(m => m.DetalleViajeComponent)
      }
    ]
  },
  {
    path: 'actividades',
    canActivate: [authGuard],
    children: [
      {
        path: 'nueva',
        loadComponent: () => import('./features/actividades/form-actividad/form-actividad.component').then(m => m.FormActividadComponent)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./features/actividades/form-actividad/form-actividad.component').then(m => m.FormActividadComponent)
      }
    ]
  },
  
  // Página 404 - Ruta no encontrada
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];