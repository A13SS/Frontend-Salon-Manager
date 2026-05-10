import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: any;
  esCliente = false;
  esProfesional = false;
  esAdmin = false;

  imagenes = ['modelodashboard1', 'modelodashboard2'];
  indiceActual = 0;
  imagenActual = 'modelodashboard1';
  intervalo: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.esCliente = this.user?.rol === 'CLIENTE';
    this.esProfesional = this.user?.rol === 'PROFESIONAL';
    this.esAdmin = this.user?.rol === 'ADMIN';
    this.iniciarCarrusel();
  }

  ngOnDestroy(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  iniciarCarrusel(): void {
    this.intervalo = setInterval(() => {
      this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
      this.imagenActual = this.imagenes[this.indiceActual];
    }, 4000);
  }

  imagenAnterior(): void {
      this.indiceActual = (this.indiceActual - 1 + this.imagenes.length) % this.imagenes.length;
      this.imagenActual = this.imagenes[this.indiceActual];
      this.reiniciarCarrusel();
  }

  imagenSiguiente(): void {
    this.indiceActual = (this.indiceActual + 1) % this.imagenes.length;
    this.imagenActual = this.imagenes[this.indiceActual];
    this.reiniciarCarrusel();
  }

  irAImagen(indice: number): void {
    this.indiceActual = indice;
    this.imagenActual = this.imagenes[this.indiceActual];
    this.reiniciarCarrusel();
  }

  reiniciarCarrusel(): void {
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
    this.iniciarCarrusel();
  }
}