import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViajesService } from '../../../core/services/viajes.service';
import { ActividadesService } from '../../../core/services/actividades.service';
import { Viaje } from '../../../core/models/viaje.model';
import { Actividad } from '../../../core/models/actividad.model';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-detalle-viaje',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-viaje.component.html',
  styleUrl: './detalle-viaje.component.css'
})
export class DetalleViajeComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private viajesService = inject(ViajesService);
  private actividadesService = inject(ActividadesService);

  viaje: Viaje | null = null;
  actividades: Actividad[] = [];
  isLoading: boolean = true;
  viajeId: string | null = null;

  // Para el modal de eliminar viaje
  showDeleteViajeModal: boolean = false;

  // Para el modal de eliminar actividad
  showDeleteActividadModal: boolean = false;
  actividadAEliminar: Actividad | null = null;

  ngOnInit() {
    this.viajeId = this.route.snapshot.paramMap.get('id');
    
    if (this.viajeId) {
      this.cargarDatos();
    } else {
      this.router.navigate(['/viajes']);
    }
  }

  cargarDatos() {
    if (!this.viajeId) return;

    // Cargar viaje y actividades simultáneamente
    combineLatest([
      this.viajesService.getViajeById(this.viajeId),
      this.actividadesService.getActividadesByViaje(this.viajeId)
    ]).subscribe({
      next: ([viaje, actividades]) => {
        this.viaje = viaje || null;
        this.actividades = actividades;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar datos:', error);
        this.isLoading = false;
      }
    });
  }

  calcularDias(): number {
    if (!this.viaje) return 0;
    const inicio = new Date(this.viaje.fechaInicio);
    const fin = new Date(this.viaje.fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
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

  getCategoriaIcon(categoria: string): string {
    const iconos: { [key: string]: string } = {
      'transporte': '🚗',
      'alojamiento': '🏨',
      'comida': '🍽️',
      'entretenimiento': '🎭',
      'otros': '📌'
    };
    return iconos[categoria] || '📌';
  }

  getActividadesPorCategoria() {
    const categorias = ['transporte', 'alojamiento', 'comida', 'entretenimiento', 'otros'];
    return categorias.map(cat => ({
      categoria: cat,
      total: this.actividades.filter(a => a.categoria === cat).reduce((sum, a) => sum + a.costo, 0)
    })).filter(item => item.total > 0);
  }

  async toggleCompletada(actividad: Actividad) {
    if (!actividad.id) return;

    try {
      await this.actividadesService.toggleCompletada(actividad.id, !actividad.completada);
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
    }
  }

  confirmarEliminarActividad(actividad: Actividad, event: Event) {
    event.stopPropagation();
    this.actividadAEliminar = actividad;
    this.showDeleteActividadModal = true;
  }

  cancelarEliminarActividad() {
    this.actividadAEliminar = null;
    this.showDeleteActividadModal = false;
  }

  async eliminarActividad() {
    if (!this.actividadAEliminar?.id || !this.viajeId) return;

    try {
      await this.actividadesService.deleteActividad(this.actividadAEliminar.id, this.viajeId);
      this.showDeleteActividadModal = false;
      this.actividadAEliminar = null;
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      alert('Error al eliminar la actividad');
    }
  }

  confirmarEliminarViaje() {
    this.showDeleteViajeModal = true;
  }

  cancelarEliminarViaje() {
    this.showDeleteViajeModal = false;
  }

  async eliminarViaje() {
    if (!this.viajeId) return;

    try {
      await this.viajesService.deleteViaje(this.viajeId);
      this.router.navigate(['/viajes']);
    } catch (error) {
      console.error('Error al eliminar viaje:', error);
      alert('Error al eliminar el viaje');
    }
  }

  editarViaje() {
    if (this.viajeId) {
      this.router.navigate(['/viajes/editar', this.viajeId]);
    }
  }
}