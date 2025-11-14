export interface Actividad {
  id?: string;
  viajeId: string;
  userId: string;
  nombre: string;
  descripcion: string;
  fecha: Date;
  hora: string;
  costo: number;
  categoria: 'transporte' | 'alojamiento' | 'comida' | 'entretenimiento' | 'otros';
  completada: boolean;
  createdAt: Date;
}