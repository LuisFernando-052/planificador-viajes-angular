import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ViajesService } from '../../../core/services/viajes.service';
import { Viaje } from '../../../core/models/viaje.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-form-viaje',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './form-viaje.component.html',
  styleUrl: './form-viaje.component.css'
})
export class FormViajeComponent implements OnInit {
  private fb = inject(FormBuilder);
  private viajesService = inject(ViajesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  viajeForm: FormGroup;
  isEditMode: boolean = false;
  viajeId: string | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor() {
    this.viajeForm = this.fb.group({
      destino: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      presupuesto: ['', [Validators.required, Validators.min(1)]],
      estado: ['planificado', Validators.required],
      imagenUrl: ['']
    }, {
      validators: this.fechasValidator
    });
  }

  ngOnInit() {
    // Verificar si es modo edición
    this.viajeId = this.route.snapshot.paramMap.get('id');
    
    if (this.viajeId) {
      this.isEditMode = true;
      this.cargarViaje();
    }
  }

  // Validador personalizado para fechas
  fechasValidator(group: FormGroup) {
    const fechaInicio = group.get('fechaInicio')?.value;
    const fechaFin = group.get('fechaFin')?.value;

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (fin <= inicio) {
        return { fechaInvalida: true };
      }
    }

    return null;
  }

  cargarViaje() {
    if (!this.viajeId) return;

    this.viajesService.getViajeById(this.viajeId).subscribe({
      next: (viaje) => {
        if (viaje) {
          // Convertir fechas a formato YYYY-MM-DD para el input
          const fechaInicio = new Date(viaje.fechaInicio).toISOString().split('T')[0];
          const fechaFin = new Date(viaje.fechaFin).toISOString().split('T')[0];

          this.viajeForm.patchValue({
            destino: viaje.destino,
            descripcion: viaje.descripcion,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
            presupuesto: viaje.presupuesto,
            estado: viaje.estado,
            imagenUrl: viaje.imagenUrl || ''
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar viaje:', error);
        this.errorMessage = 'Error al cargar el viaje';
      }
    });
  }

  // Getters para los campos
  get destino() { return this.viajeForm.get('destino'); }
  get descripcion() { return this.viajeForm.get('descripcion'); }
  get fechaInicio() { return this.viajeForm.get('fechaInicio'); }
  get fechaFin() { return this.viajeForm.get('fechaFin'); }
  get presupuesto() { return this.viajeForm.get('presupuesto'); }
  get estado() { return this.viajeForm.get('estado'); }
  get imagenUrl() { return this.viajeForm.get('imagenUrl'); }

async onSubmit() {
  if (this.viajeForm.invalid) {
    this.viajeForm.markAllAsTouched();
    this.toastService.warning('Por favor completa todos los campos correctamente');
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';
  this.successMessage = '';

  try {
    const formData = this.viajeForm.value;

    if (this.isEditMode && this.viajeId) {
      // Actualizar viaje existente
      await this.viajesService.updateViaje(this.viajeId, formData);
      this.toastService.success('¡Viaje actualizado exitosamente! 🎉');
    } else {
      // Crear nuevo viaje
      await this.viajesService.addViaje(formData);
      this.toastService.success('¡Viaje creado exitosamente! ✈️');
    }

    // Redirigir después de 800ms
    setTimeout(() => {
      this.router.navigate(['/viajes']);
    }, 800);

  } catch (error: any) {
    this.isLoading = false;
    this.toastService.error('Error al guardar el viaje. Intenta de nuevo.');
    console.error('Error:', error);
  }
}

  calcularDias(): number {
    const inicio = this.fechaInicio?.value;
    const fin = this.fechaFin?.value;

    if (inicio && fin) {
      const fechaInicio = new Date(inicio);
      const fechaFin = new Date(fin);
      const diferencia = fechaFin.getTime() - fechaInicio.getTime();
      return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
    }

    return 0;
  }
}