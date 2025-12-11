import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.css'
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs();
      });
    
    // Cargar breadcrumbs iniciales
    this.breadcrumbs = this.createBreadcrumbs();
  }

  createBreadcrumbs(): Breadcrumb[] {
    const url = this.router.url;
    const breadcrumbs: Breadcrumb[] = [
      { label: '🏠 Inicio', url: '/dashboard' }
    ];

    if (url.includes('/viajes')) {
      breadcrumbs.push({ label: '🧳 Mis Viajes', url: '/viajes' });
      
      if (url.includes('/nuevo')) {
        breadcrumbs.push({ label: '➕ Nuevo Viaje', url: url });
      } else if (url.includes('/editar')) {
        breadcrumbs.push({ label: '✏️ Editar Viaje', url: url });
      } else if (url.match(/\/viajes\/[a-zA-Z0-9]+$/) && !url.includes('/nuevo')) {
        breadcrumbs.push({ label: '📋 Detalle', url: url });
      }
    }

    if (url.includes('/actividades')) {
      breadcrumbs.push({ label: '🎯 Actividad', url: url });
      
      if (url.includes('/nueva')) {
        breadcrumbs.push({ label: '➕ Nueva Actividad', url: url });
      } else if (url.includes('/editar')) {
        breadcrumbs.push({ label: '✏️ Editar Actividad', url: url });
      }
    }

    return breadcrumbs;
  }
}