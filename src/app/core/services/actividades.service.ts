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
    const q = query(
      this.actividadesCollection,
      where('viajeId', '==', viajeId),
      orderBy('fecha', 'asc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((actividades: any[]) =>
        actividades.map(actividad => ({
          ...actividad,
          fecha: actividad.fecha?.toDate(),
          createdAt: actividad.createdAt?.toDate()
        }))
      )
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
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Usuario no autenticado');

    const nuevaActividad = {
      ...actividad,
      userId,
      completada: false,
      fecha: Timestamp.fromDate(new Date(actividad.fecha)),
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(this.actividadesCollection, nuevaActividad);

    // Actualizar el gasto total del viaje
    await this.actualizarGastoViaje(actividad.viajeId);

    return docRef.id;
  }

  // Actualizar una actividad
  async updateActividad(id: string, actividad: Partial<Actividad>): Promise<void> {
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
    const actividadDoc = doc(this.firestore, `actividades/${id}`);
    await deleteDoc(actividadDoc);

    // Recalcular gasto del viaje
    await this.actualizarGastoViaje(viajeId);
  }

  // Marcar actividad como completada
  async toggleCompletada(id: string, completada: boolean): Promise<void> {
    const actividadDoc = doc(this.firestore, `actividades/${id}`);
    return updateDoc(actividadDoc, { completada });
  }

  // Calcular y actualizar el gasto total del viaje
  private async actualizarGastoViaje(viajeId: string): Promise<void> {
    const actividades = await new Promise<Actividad[]>((resolve) => {
      this.getActividadesByViaje(viajeId).subscribe(acts => resolve(acts));
    });

    const gastoTotal = actividades.reduce((total, act) => total + act.costo, 0);
    await this.viajesService.actualizarGastoActual(viajeId, gastoTotal);
  }
}