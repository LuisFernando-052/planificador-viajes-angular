import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ViajesService } from '../../core/services/viajes.service';
import { AuthService } from '../../core/services/auth.service';
import { Viaje } from '../../core/models/viaje.model';
import { EstadoViajePipe } from '../../shared/pipes/estado-viaje.pipe';

interface Estadisticas {
  totalViajes: number;
  viajesPlanificados: number;
  viajesEnCurso: number;
  viajesCompletados: number;
  presupuestoTotal: number;
  gastoTotal: number;
  porcentajeGastado: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, EstadoViajePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private viajesService = inject(ViajesService);
  private authService = inject(AuthService);
  private router = inject(Router);

  viajes: Viaje[] = [];
  proximosViajes: Viaje[] = [];
  estadisticas: Estadisticas = {
    totalViajes: 0,
    viajesPlanificados: 0,
    viajesEnCurso: 0,
    viajesCompletados: 0,
    presupuestoTotal: 0,
    gastoTotal: 0,
    porcentajeGastado: 0
  };
  isLoading: boolean = true;
  userEmail: string = '';

  ngOnInit() {
    this.userEmail = this.authService.getCurrentUser()?.email || '';
    this.cargarDatos();
  }

  cargarDatos() {
    this.viajesService.getViajesByUser().subscribe({
      next: (viajes) => {
        this.viajes = viajes;
        this.calcularEstadisticas();
        this.obtenerProximosViajes();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar viajes:', error);
        this.isLoading = false;
      }
    });
  }

  calcularEstadisticas() {
    this.estadisticas.totalViajes = this.viajes.length;
    this.estadisticas.viajesPlanificados = this.viajes.filter(v => v.estado === 'planificado').length;
    this.estadisticas.viajesEnCurso = this.viajes.filter(v => v.estado === 'en-curso').length;
    this.estadisticas.viajesCompletados = this.viajes.filter(v => v.estado === 'completado').length;
    
    this.estadisticas.presupuestoTotal = this.viajes.reduce((sum, v) => sum + v.presupuesto, 0);
    this.estadisticas.gastoTotal = this.viajes.reduce((sum, v) => sum + v.gastoActual, 0);
    
    if (this.estadisticas.presupuestoTotal > 0) {
      this.estadisticas.porcentajeGastado = 
        (this.estadisticas.gastoTotal / this.estadisticas.presupuestoTotal) * 100;
    }
  }

  obtenerProximosViajes() {
    const hoy = new Date();
    this.proximosViajes = this.viajes
      .filter(v => v.estado !== 'completado' && v.estado !== 'cancelado')
      .filter(v => new Date(v.fechaInicio) >= hoy)
      .sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime())
      .slice(0, 3);
  }

  verDetalleViaje(id: string | undefined) {
    if (id) {
      this.router.navigate(['/viajes', id]);
    }
  }

  getEstadoClass(estado: string): string {
    const clases: { [key: string]: string } = {
      'planificado': 'estado-planificado',
      'en-curso': 'estado-en-curso',
      'completado': 'estado-completado',
      'cancelado': 'estado-cancelado'
    };
    return clases[estado] || '';
  }

  getEstadoTexto(estado: string): string {
    const textos: { [key: string]: string } = {
      'planificado': 'Planificado',
      'en-curso': 'En Curso',
      'completado': 'Completado',
      'cancelado': 'Cancelado'
    };
    return textos[estado] || estado;
  }
}