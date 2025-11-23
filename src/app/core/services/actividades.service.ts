import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  doc,
  docData,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Actividad } from '../models/actividad.model';
import { AuthService } from './auth.service';
import { ViajesService } from './viajes.service';

@Injectable({
  providedIn: 'root'
})
export class ActividadesService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  private viajesService = inject(ViajesService);
  private actividadesCollection = collection(this.firestore, 'actividades');

  // Obtener todas las actividades de un viaje
  getActividadesByViaje(viajeId: string): Observable<Actividad[]> {
    console.log('🔍 Obteniendo actividades del viaje:', viajeId);
    
    const q = query(
      this.actividadesCollection,
      where('viajeId', '==', viajeId),
      orderBy('fecha', 'asc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((actividades: any[]) => {
        console.log('✅ Actividades recibidas:', actividades);
        return actividades.map(actividad => ({
          ...actividad,
          fecha: actividad.fecha?.toDate(),
          createdAt: actividad.createdAt?.toDate()
        }));
      })
    ) as Observable<Actividad[]>;
  }

  // Obtener una actividad por ID
  getActividadById(id: string): Observable<Actividad | undefined> {
    const actividadDoc = doc(this.firestore, `actividades/${id}`);
    return docData(actividadDoc, { idField: 'id' }).pipe(
      map((actividad: any) => {
        if (!actividad) return undefined;
        return {
          ...actividad,
          fecha: actividad.fecha?.toDate(),
          createdAt: actividad.createdAt?.toDate()
        };
      })
    ) as Observable<Actividad | undefined>;
  }

  // Crear una nueva actividad
  async addActividad(actividad: Omit<Actividad, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    console.log('🎯 Intentando crear actividad:', actividad);
    
    const userId = this.authService.getCurrentUser()?.uid;
    console.log('👤 UserId:', userId);
    
    if (!userId) {
      console.error('❌ Usuario no autenticado');
      throw new Error('Usuario no autenticado');
    }

    const nuevaActividad = {
      ...actividad,
      userId,
      completada: false,
      fecha: Timestamp.fromDate(new Date(actividad.fecha)),
      createdAt: Timestamp.now()
    };

    console.log('📦 Actividad a guardar en Firestore:', nuevaActividad);

    try {
      const docRef = await addDoc(this.actividadesCollection, nuevaActividad);
      console.log('✅ Actividad creada con ID:', docRef.id);

      // Actualizar el gasto total del viaje
      console.log('💰 Actualizando gasto del viaje...');
      await this.actualizarGastoViaje(actividad.viajeId);
      console.log('✅ Gasto del viaje actualizado');

      return docRef.id;
    } catch (error) {
      console.error('❌ Error al crear actividad:', error);
      throw error;
    }
  }

  // Actualizar una actividad
  async updateActividad(id: string, actividad: Partial<Actividad>): Promise<void> {
    console.log('📝 Actualizando actividad:', id, actividad);
    
    const actividadDoc = doc(this.firestore, `actividades/${id}`);
    const updateData: any = { ...actividad };

    if (actividad.fecha) {
      updateData.fecha = Timestamp.fromDate(new Date(actividad.fecha));
    }

    await updateDoc(actividadDoc, updateData);

    // Si se actualizó el costo, recalcular gasto del viaje
    if (actividad.costo !== undefined && actividad.viajeId) {
      await this.actualizarGastoViaje(actividad.viajeId);
    }
  }

  // Eliminar una actividad
  async deleteActividad(id: string, viajeId: string): Promise<void> {
    console.log('🗑️ Eliminando actividad:', id);
    
    const actividadDoc = doc(this.firestore, `actividades/${id}`);
    await deleteDoc(actividadDoc);

    // Recalcular gasto del viaje
    await this.actualizarGastoViaje(viajeId);
    console.log('✅ Actividad eliminada');
  }

  // Marcar actividad como completada
  async toggleCompletada(id: string, completada: boolean): Promise<void> {
    const actividadDoc = doc(this.firestore, `actividades/${id}`);
    return updateDoc(actividadDoc, { completada });
  }

  // Calcular y actualizar el gasto total del viaje
  private async actualizarGastoViaje(viajeId: string): Promise<void> {
    console.log('💰 Calculando gasto total del viaje:', viajeId);
    
    const actividades = await new Promise<Actividad[]>((resolve) => {
      this.getActividadesByViaje(viajeId).subscribe(acts => {
        console.log('📊 Actividades para calcular gasto:', acts);
        resolve(acts);
      });
    });

    const gastoTotal = actividades.reduce((total, act) => total + act.costo, 0);
    console.log('💵 Gasto total calculado:', gastoTotal);
    
    await this.viajesService.actualizarGastoActual(viajeId, gastoTotal);
  }
}