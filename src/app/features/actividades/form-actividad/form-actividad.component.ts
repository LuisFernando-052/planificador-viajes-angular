import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ActividadesService } from '../../../core/services/actividades.service';
import { Actividad } from '../../../core/models/actividad.model';

@Component({
  selector: 'app-form-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-actividad.component.html',
  styleUrl: './form-actividad.component.css'
})
export class FormActividadComponent implements OnInit {
  private fb = inject(FormBuilder);
  private actividadesService = inject(ActividadesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  actividadForm: FormGroup;
  viajeId: string = '';
  actividadId: string | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  categorias = [
    { value: 'transporte', label: '🚗 Transporte', icon: '🚗' },
    { value: 'alojamiento', label: '🏨 Alojamiento', icon: '🏨' },
    { value: 'comida', label: '🍽️ Comida', icon: '🍽️' },
    { value: 'entretenimiento', label: '🎭 Entretenimiento', icon: '🎭' },
    { value: 'otros', label: '📌 Otros', icon: '📌' }
  ];

  constructor() {
    this.actividadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
      costo: ['', [Validators.required, Validators.min(0)]],
      categoria: ['transporte', Validators.required]
    });
  }

  ngOnInit() {
    // Obtener viajeId de la URL
    this.viajeId = this.route.snapshot.queryParamMap.get('viajeId') || '';
    this.actividadId = this.route.snapshot.paramMap.get('id');

    if (!this.viajeId) {
      this.errorMessage = 'ID de viaje no encontrado';
      setTimeout(() => this.router.navigate(['/viajes']), 2000);
      return;
    }

    if (this.actividadId) {
      this.isEditMode = true;
      this.cargarActividad();
    }
  }

  cargarActividad() {
    if (!this.actividadId) return;

    this.actividadesService.getActividadById(this.actividadId).subscribe({
      next: (actividad) => {
        if (actividad) {
          const fecha = new Date(actividad.fecha).toISOString().split('T')[0];
          
          this.actividadForm.patchValue({
            nombre: actividad.nombre,
            descripcion: actividad.descripcion,
            fecha: fecha,
            hora: actividad.hora,
            costo: actividad.costo,
            categoria: actividad.categoria
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar actividad:', error);
        this.errorMessage = 'Error al cargar la actividad';
      }
    });
  }

  get nombre() { return this.actividadForm.get('nombre'); }
  get descripcion() { return this.actividadForm.get('descripcion'); }
  get fecha() { return this.actividadForm.get('fecha'); }
  get hora() { return this.actividadForm.get('hora'); }
  get costo() { return this.actividadForm.get('costo'); }
  get categoria() { return this.actividadForm.get('categoria'); }

  async onSubmit() {
    if (this.actividadForm.invalid) {
      this.actividadForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const formData = {
        ...this.actividadForm.value,
        viajeId: this.viajeId
      };

      if (this.isEditMode && this.actividadId) {
        await this.actividadesService.updateActividad(this.actividadId, formData);
        this.successMessage = '¡Actividad actualizada exitosamente!';
      } else {
        await this.actividadesService.addActividad(formData);
        this.successMessage = '¡Actividad creada exitosamente!';
      }

      setTimeout(() => {
        this.router.navigate(['/viajes', this.viajeId]);
      }, 1500);

    } catch (error: any) {
      this.isLoading = false;
      this.errorMessage = 'Error al guardar la actividad. Intenta de nuevo.';
      console.error('Error:', error);
    }
  }

  volver() {
    this.router.navigate(['/viajes', this.viajeId]);
  }
}