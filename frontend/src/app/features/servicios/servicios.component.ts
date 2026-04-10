import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServicioService, Servicio } from '../../core/services/servicio.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.scss']
})
export class ServiciosComponent implements OnInit {
  servicios: Servicio[] = [];
  loading = true;
  user: any;

  constructor(
    private servicioService: ServicioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.cargarServicios();
  }

  cargarServicios(): void {
    this.loading = true;
    const observable = (this.user?.rol === 'ADMIN' || this.user?.rol === 'PROFESIONAL')
      ? this.servicioService.listarTodos()
      : this.servicioService.listarActivos();

    observable.subscribe({
      next: (data) => {
        this.servicios = data;
        this.loading = false;
      },
      error: (error) => {
        alert('Error al cargar servicios');
        this.loading = false;
      }
    });
  }
}