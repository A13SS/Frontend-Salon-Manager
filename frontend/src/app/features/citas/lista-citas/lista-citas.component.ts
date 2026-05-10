import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CitaService } from '../../../core/services/cita.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cita } from '../../../shared/models/cita.model';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-citas',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './lista-citas.component.html',
  styleUrls: ['./lista-citas.component.scss'],
})
export class ListaCitasComponent implements OnInit {
  citas: Cita[] = [];
  loading = true;
  errorMessage = '';
  user: any = null;
  fechaBusqueda: string = '';

  citaSeleccionada: any = null;

  constructor(
    private citaService: CitaService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.cargarCitas();
  }

  cargarCitas(): void {
    this.loading = true;
    this.errorMessage = '';

    const userId = this.user?.userId;
    const userRol = this.user?.rol;

    if (!userId || !userRol) {
      this.errorMessage = 'No se encontró usuario autenticado.';
      this.citas = [];
      this.loading = false;
      return;
    }

    if (userRol === 'CLIENTE') {
      this.citaService.getCitasPorCliente(userId).subscribe({
        next: (data) => {
          this.citas = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar las citas';
          this.loading = false;
        },
      });
    } else {
      this.citaService.getCitasPorProfesional(userId).subscribe({
        next: (data) => {
          this.citas = data;
          this.loading = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al cargar las citas';
          this.loading = false;
        },
      });
    }
  }

  buscarPorFecha(): void {
    if (!this.fechaBusqueda) return;
    this.loading = true;
    this.errorMessage = '';
    this.citaService.getCitasPorFecha(this.fechaBusqueda).subscribe({
      next: (data) => {
        this.citas = data;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error al buscar citas por fecha';
        this.loading = false;
      },
    });
  }

  limpiarFecha(): void {
    this.fechaBusqueda = '';
    this.cargarCitas();
  }

  confirmarCita(id: number): void {
    if (confirm('¿Confirmar esta cita?')) {
      this.citaService.confirmarCita(id).subscribe({
        next: () => {
          this.cargarCitas();
        },
        error: (error) => {
          alert('Error al confirmar la cita');
        },
      });
    }
  }

  marcarAtendida(id: number): void {
    if (confirm('¿Marcar cita como atendida?')) {
      this.citaService.marcarAtendida(id).subscribe({
        next: () => {
          this.cargarCitas();
        },
        error: (error) => {
          alert('Error al marcar como atendida');
        },
      });
    }
  }

  eliminarCita(id: number): void {
    if (confirm('¿Eliminar esta cita permanentemente?')) {
      this.citaService.eliminarCita(id).subscribe({
        next: () => {
          this.cargarCitas();
        },
        error: (error) => {
          alert('Error al eliminar la cita');

          setTimeout(() => {
            this.cargarCitas();
          }, 200);
        },
      });
    }
  }

  cancelarCita(id: number): void {
    if (confirm('¿Estás seguro de cancelar esta cita?')) {
      this.citaService.cancelarCita(id).subscribe({
        next: () => {
          this.cargarCitas();
        },
        error: (error) => {
          alert('Error al cancelar la cita');
        },
      });
    }
  }

  verDetalle(cita: any): void {
    this.citaSeleccionada = { ...cita }; //Copia de la cita para evitar referencias
  }

  cerrarDetalle(): void {
    this.citaSeleccionada = null;
  }

  getEstadoClass(estado: string): string {
    switch (estado) {
      case 'PENDIENTE':
        return 'badge bg-warning text-dark';
      case 'CONFIRMADA':
        return 'badge bg-primary';
      case 'ATENDIDA':
        return 'badge bg-success';
      case 'CANCELADA':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}
