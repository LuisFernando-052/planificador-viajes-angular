import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);

  private lastScrollTop = 0; // Guarda la última posición del scroll

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    const navbar = document.getElementById('mainNavbar');

    if (!navbar) return;

    if (currentScroll > this.lastScrollTop) {
      // Usuario bajando → ocultar navbar
      navbar.classList.add('hide');
    } else {
      // Usuario subiendo → mostrar navbar
      navbar.classList.remove('hide');
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }

  async onLogout() {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
