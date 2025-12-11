import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ActividadesService } from '../../../core/services/actividades.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-form-actividad',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // ✅ Quitamos RouterLink
  templateUrl: './form-actividad.component.html',
  styleUrl: './form-actividad.component.css'
})
export class FormActividadComponent implements OnInit {
  private fb = inject(FormBuilder);
  private actividadesService = inject(ActividadesService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);

  actividadForm: FormGroup;
  viajeId: string = '';
  actividadId: string | null = null;
  isEditMode: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  categorias = [
    { value: 'turismo', label: 'Turismo', icon: '🏛️' },
    { value: 'comida', label: 'Comida', icon: '🍽️' },
    { value: 'aventura', label: 'Aventura', icon: '🏔️' },
    { value: 'cultura', label: 'Cultura', icon: '🎭' },
    { value: 'entretenimiento', label: 'Diversión', icon: '🎉' },
    { value: 'compras', label: 'Compras', icon: '🛍️' },
    { value: 'transporte', label: 'Transporte', icon: '🚗' },
    { value: 'alojamiento', label: 'Alojamiento', icon: '🏨' },
  ];

  constructor() {
    this.actividadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      fecha: ['', Validators.required],
      horaNumero: ['', Validators.required],
      minutos: ['', Validators.required],
      periodo: ['', Validators.required],
      costo: [0, [Validators.required, Validators.min(0)]],
      categoria: ['turismo', Validators.required]
    });
  }

  ngOnInit() {
    // Obtener viajeId de la URL
    this.viajeId = this.route.snapshot.queryParamMap.get('viajeId') || '';
    this.actividadId = this.route.snapshot.paramMap.get('id');

    if (!this.viajeId) {
      this.toastService.error('ID de viaje no encontrado');
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
          
          // Convertir hora 24h a 12h con AM/PM
          const horaConvertida = this.convertirA12Horas(actividad.hora);
          
          this.actividadForm.patchValue({
            nombre: actividad.nombre,
            descripcion: actividad.descripcion,
            fecha: fecha,
            horaNumero: horaConvertida.hora,
            minutos: horaConvertida.minutos,
            periodo: horaConvertida.periodo,
            costo: actividad.costo,
            categoria: actividad.categoria
          });
        }
      },
      error: (error) => {
        console.error('Error al cargar actividad:', error);
        this.toastService.error('Error al cargar la actividad');
      }
    });
  }

  // Getters para validaciones
  get nombre() { return this.actividadForm.get('nombre'); }
  get descripcion() { return this.actividadForm.get('descripcion'); }
  get fecha() { return this.actividadForm.get('fecha'); }
  get horaNumero() { return this.actividadForm.get('horaNumero'); }
  get minutos() { return this.actividadForm.get('minutos'); }
  get periodo() { return this.actividadForm.get('periodo'); }
  get costo() { return this.actividadForm.get('costo'); }
  get categoria() { return this.actividadForm.get('categoria'); }

  /**
   * Convierte hora de formato 12h a 24h
   * Ejemplo: 02:30 PM -> 14:30
   */
  convertirA24Horas(hora12: string, minutos: string, periodo: string): string {
    let hora = parseInt(hora12);
    
    if (periodo === 'PM' && hora !== 12) {
      hora += 12;
    } else if (periodo === 'AM' && hora === 12) {
      hora = 0;
    }
    
    const horaStr = hora.toString().padStart(2, '0');
    return `${horaStr}:${minutos}`;
  }

  /**
   * Convierte hora de formato 24h a 12h con AM/PM
   * Ejemplo: 14:30 -> { hora: '02', minutos: '30', periodo: 'PM' }
   */
  convertirA12Horas(hora24: string): { hora: string, minutos: string, periodo: string } {
    const [horaStr, minutosStr] = hora24.split(':');
    let hora = parseInt(horaStr);
    let periodo = 'AM';
    
    if (hora >= 12) {
      periodo = 'PM';
      if (hora > 12) {
        hora -= 12;
      }
    } else if (hora === 0) {
      hora = 12;
    }
    
    return {
      hora: hora.toString().padStart(2, '0'),
      minutos: minutosStr,
      periodo: periodo
    };
  }

  async onSubmit() {
    if (this.actividadForm.invalid) {
      this.actividadForm.markAllAsTouched();
      this.toastService.warning('Por favor completa todos los campos correctamente');
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      const formValue = this.actividadForm.value;
      
      // Convertir la hora a formato 24h para guardar
      const hora24 = this.convertirA24Horas(
        formValue.horaNumero,
        formValue.minutos,
        formValue.periodo
      );

      const actividadData = {
        nombre: formValue.nombre,
        descripcion: formValue.descripcion,
        fecha: formValue.fecha,
        hora: hora24,
        costo: parseFloat(formValue.costo),
        categoria: formValue.categoria,
        completada: false, // ✅ Agregamos la propiedad completada
        viajeId: this.viajeId
      };

      if (this.isEditMode && this.actividadId) {
        await this.actividadesService.updateActividad(this.actividadId, actividadData);
        this.toastService.success('¡Actividad actualizada exitosamente! 🎯');
      } else {
        await this.actividadesService.addActividad(actividadData);
        this.toastService.success('¡Actividad creada exitosamente! 🎉');
      }

      setTimeout(() => {
        this.router.navigate(['/viajes', this.viajeId]);
      }, 800);

    } catch (error: any) {
      this.isLoading = false;
      this.toastService.error('Error al guardar la actividad. Intenta de nuevo.');
      console.error('Error:', error);
    }
  }

  volver() {
    this.router.navigate(['/viajes', this.viajeId]);
  }
}