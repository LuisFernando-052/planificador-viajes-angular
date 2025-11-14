import { Injectable, inject, signal } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  user,
  User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private router = inject(Router);
  
  user$ = user(this.auth);
  currentUserSig = signal<User | null | undefined>(undefined);

  constructor() {
    this.user$.subscribe(user => {
      this.currentUserSig.set(user);
    });
  }

  // Registro de usuario
  async register(email: string, password: string): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return;
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  // Login de usuario
  async login(email: string, password: string): Promise<void> {
    try {
      const credential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.auth.currentUser !== null;
  }
}