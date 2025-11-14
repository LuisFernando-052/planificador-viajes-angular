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
import { Viaje } from '../models/viaje.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  private viajesCollection = collection(this.firestore, 'viajes');

  // Obtener todos los viajes del usuario autenticado
  getViajesByUser(): Observable<Viaje[]> {
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) return new Observable(observer => observer.next([]));

    const q = query(
      this.viajesCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return collectionData(q, { idField: 'id' }).pipe(
      map((viajes: any[]) => 
        viajes.map(viaje => ({
          ...viaje,
          fechaInicio: viaje.fechaInicio?.toDate(),
          fechaFin: viaje.fechaFin?.toDate(),
          createdAt: viaje.createdAt?.toDate(),
          updatedAt: viaje.updatedAt?.toDate()
        }))
      )
    ) as Observable<Viaje[]>;
  }

  // Obtener un viaje por ID
  getViajeById(id: string): Observable<Viaje | undefined> {
    const viajeDoc = doc(this.firestore, `viajes/${id}`);
    return docData(viajeDoc, { idField: 'id' }).pipe(
      map((viaje: any) => {
        if (!viaje) return undefined;
        return {
          ...viaje,
          fechaInicio: viaje.fechaInicio?.toDate(),
          fechaFin: viaje.fechaFin?.toDate(),
          createdAt: viaje.createdAt?.toDate(),
          updatedAt: viaje.updatedAt?.toDate()
        };
      })
    ) as Observable<Viaje | undefined>;
  }

  // Crear un nuevo viaje
  async addViaje(viaje: Omit<Viaje, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const userId = this.authService.getCurrentUser()?.uid;
    if (!userId) throw new Error('Usuario no autenticado');

    const nuevoViaje = {
      ...viaje,
      userId,
      gastoActual: 0,
      fechaInicio: Timestamp.fromDate(new Date(viaje.fechaInicio)),
      fechaFin: Timestamp.fromDate(new Date(viaje.fechaFin)),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(this.viajesCollection, nuevoViaje);
    return docRef.id;
  }

  // Actualizar un viaje
  async updateViaje(id: string, viaje: Partial<Viaje>): Promise<void> {
    const viajeDoc = doc(this.firestore, `viajes/${id}`);
    const updateData: any = {
      ...viaje,
      updatedAt: Timestamp.now()
    };

    if (viaje.fechaInicio) {
      updateData.fechaInicio = Timestamp.fromDate(new Date(viaje.fechaInicio));
    }
    if (viaje.fechaFin) {
      updateData.fechaFin = Timestamp.fromDate(new Date(viaje.fechaFin));
    }

    return updateDoc(viajeDoc, updateData);
  }

  // Eliminar un viaje
  async deleteViaje(id: string): Promise<void> {
    const viajeDoc = doc(this.firestore, `viajes/${id}`);
    return deleteDoc(viajeDoc);
  }

  // Actualizar gasto actual del viaje
  async actualizarGastoActual(viajeId: string, nuevoGasto: number): Promise<void> {
    const viajeDoc = doc(this.firestore, `viajes/${viajeId}`);
    return updateDoc(viajeDoc, {
      gastoActual: nuevoGasto,
      updatedAt: Timestamp.now()
    });
  }
}