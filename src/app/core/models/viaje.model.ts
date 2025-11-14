export interface Viaje {
  id?: string;
  userId: string;
  destino: string;
  descripcion: string;
  fechaInicio: Date;
  fechaFin: Date;
  presupuesto: number;
  gastoActual: number;
  estado: 'planificado' | 'en-curso' | 'completado' | 'cancelado';
  imagenUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}