import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getters para acceder a los controles del formulario
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

  try {
  const { email, password } = this.loginForm.value;
  await this.authService.login(email, password);
  this.toastService.success('¡Bienvenido de vuelta! 👋');
  setTimeout(() => {
    this.router.navigate(['/dashboard']);
  }, 500);
} catch (error: any) {
      
      // Manejo de errores de Firebase
      switch (error.code) {
        case 'auth/user-not-found':
          this.errorMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          this.errorMessage = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          this.errorMessage = 'Email inválido';
          break;
        case 'auth/invalid-credential':
          this.errorMessage = 'Credenciales inválidas';
          break;
        default:
          this.errorMessage = 'Error al iniciar sesión. Intenta de nuevo.';
      }
    }
  }

  // Login con Google
async onGoogleLogin() {
  this.isLoading = true;
  this.errorMessage = '';

  try {
    await this.authService.loginWithGoogle();
    this.toastService.success('¡Bienvenido! 🎉');
    setTimeout(() => {
      this.router.navigate(['/dashboard']);
    }, 500);
  } catch (error: any) {
    this.isLoading = false;
    this.errorMessage = 'Error al iniciar sesión con Google. Intenta de nuevo.';
  }
}
}