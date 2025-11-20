import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViajesService } from '../../../core/services/viajes.service';
import { Viaje } from '../../../core/models/viaje.model';

@Component({
  selector: 'app-lista-viajes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-viajes.component.html',
  styleUrl: './lista-viajes.component.css'
})
export class ListaViajesComponent implements OnInit {
  private viajesService = inject(ViajesService);
  private router = inject(Router);

  viajes: Viaje[] = [];
  viajesFiltrados: Viaje[] = [];
  isLoading: boolean = true;
  
  // Filtros
  searchTerm: string = '';
  filtroEstado: string = 'todos';
  ordenamiento: string = 'fecha-desc';

  // Para confirmación de eliminación
  viajeAEliminar: Viaje | null = null;
  showDeleteModal: boolean = false;

  ngOnInit() {
    this.cargarViajes();
  }

  cargarViajes() {
    this.viajesService.getViajesByUser().subscribe({
      next: (viajes) => {
        this.viajes = viajes;
        this.aplicarFiltros();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar viajes:', error);
        this.isLoading = false;
      }
    });
  }

  aplicarFiltros() {
    let resultado = [...this.viajes];

    // Filtrar por búsqueda (destino o descripción)
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      resultado = resultado.filter(v => 
        v.destino.toLowerCase().includes(term) || 
        v.descripcion.toLowerCase().includes(term)
      );
    }

    // Filtrar por estado
    if (this.filtroEstado !== 'todos') {
      resultado = resultado.filter(v => v.estado === this.filtroEstado);
    }

    // Ordenar
    switch (this.ordenamiento) {
      case 'fecha-desc':
        resultado.sort((a, b) => new Date(b.fechaInicio).getTime() - new Date(a.fechaInicio).getTime());
        break;
      case 'fecha-asc':
        resultado.sort((a, b) => new Date(a.fechaInicio).getTime() - new Date(b.fechaInicio).getTime());
        break;
      case 'destino-asc':
        resultado.sort((a, b) => a.destino.localeCompare(b.destino));
        break;
      case 'destino-desc':
        resultado.sort((a, b) => b.destino.localeCompare(a.destino));
        break;
      case 'presupuesto-desc':
        resultado.sort((a, b) => b.presupuesto - a.presupuesto);
        break;
      case 'presupuesto-asc':
        resultado.sort((a, b) => a.presupuesto - b.presupuesto);
        break;
    }

    this.viajesFiltrados = resultado;
  }

  onSearchChange() {
    this.aplicarFiltros();
  }

  onFiltroEstadoChange() {
    this.aplicarFiltros();
  }

  onOrdenamientoChange() {
    this.aplicarFiltros();
  }

  verDetalle(id: string | undefined) {
    if (id) {
      this.router.navigate(['/viajes', id]);
    }
  }

  editarViaje(id: string | undefined, event: Event) {
    event.stopPropagation();
    if (id) {
      this.router.navigate(['/viajes/editar', id]);
    }
  }

  confirmarEliminar(viaje: Viaje, event: Event) {
    event.stopPropagation();
    this.viajeAEliminar = viaje;
    this.showDeleteModal = true;
  }

  cancelarEliminar() {
    this.viajeAEliminar = null;
    this.showDeleteModal = false;
  }

  async eliminarViaje() {
    if (!this.viajeAEliminar?.id) return;

    try {
      await this.viajesService.deleteViaje(this.viajeAEliminar.id);
      this.showDeleteModal = false;
      this.viajeAEliminar = null;
      // Los datos se actualizarán automáticamente por el Observable
    } catch (error) {
      console.error('Error al eliminar viaje:', error);
      alert('Error al eliminar el viaje');
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

  calcularDias(fechaInicio: Date, fechaFin: Date): number {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }
}