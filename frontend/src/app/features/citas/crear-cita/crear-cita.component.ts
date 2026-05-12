import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CitaService, Hueco } from '../../../core/services/cita.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { ServicioService, Servicio } from '../../../core/services/servicio.service';
import { CrearCitaRequest } from '../../../shared/models/cita.model';
import { Usuario } from '../../../shared/models/usuario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-crear-cita',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './crear-cita.component.html',
  styleUrls: ['./crear-cita.component.scss'],
})
export class CrearCitaComponent implements OnInit {
  citaData: CrearCitaRequest = {
    clienteId: 0,
    profesionalId: 0,
    servicioId: 0,
    fechaInicio: '',
    alergias: '',
    observaciones: '',
  };

  profesionales: Usuario[] = [];
  servicios: Servicio[] = [];
  fechaMinima: string = '';
  errorMessage = '';
  loading = false;
  loadingServicios = false; //Loading para servicios
  loadingProfesionales = false; //Loading para profesionales
  user: any;

  huecosDisponibles: Hueco[] = [];
  fechaSeleccionada: string = '';
  successMessage = '';
  loadingHuecos = false;

  clientes: Usuario[] = [];

  constructor(
    private citaService: CitaService,
    private usuarioService: UsuarioService,
    private servicioService: ServicioService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    //Si es cliente, usa su propio ID
    if (this.user?.rol === 'CLIENTE') {
      this.citaData.clienteId = this.user.userId;
    }

    this.citaData.clienteId = this.user.userId;
    this.cargarProfesionales();
    this.cargarServicios();
    this.cargarClientes();

    //Establece la fecha minima a la de hoy
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.fechaMinima = now.toISOString().slice(0, 10);
  }

  cargarProfesionales(): void {
    this.loadingProfesionales = true;
    this.usuarioService.listarTodos().subscribe({
      next: (data) => {
        this.profesionales = data.filter((u) => u.rol === 'PROFESIONAL' && u.activo);
        this.loadingProfesionales = false;
      },
      error: (error) => {
        console.error('Error al cargar profesionales', error);
        this.loadingProfesionales = false;
      },
    });
  }

  cargarClientes(): void {
    if (this.user?.rol === 'CLIENTE') return; // No necesita cargar clientes si es un cliente autenticado

    this.usuarioService.listarTodos().subscribe({
      next: (data) => {
        this.clientes = data.filter((u) => u.rol === 'CLIENTE' && u.activo);
      },
      error: (error) => {
        console.error('Error al cargar clientes', error);
      },
    });
  }

  cargarServicios(): void {
    this.loadingServicios = true;
    //Cargar solo servicios activos desde la BD
    this.servicioService.listarActivos().subscribe({
      next: (data) => {
        this.servicios = data;
        this.loadingServicios = false;
      },
      error: (error) => {
        console.error('Error al cargar servicios', error);
        this.errorMessage = 'Error al cargar los servicios disponibles';
        this.loadingServicios = false;
      },
    });
  }

  //Carga los huecos cuando cambia la fecha
  onFechaChange(): void {
    if (this.fechaSeleccionada && this.citaData.profesionalId && this.citaData.servicioId) {
      this.cargarHuecosDisponibles();
    }
  }

  onProfesionalChange(): void {
    if (this.fechaSeleccionada && this.citaData.profesionalId && this.citaData.servicioId) {
      this.cargarHuecosDisponibles();
    }
  }

  onServicioChange(): void {
    if (this.fechaSeleccionada && this.citaData.profesionalId && this.citaData.servicioId) {
      this.cargarHuecosDisponibles();
    }
  }

  cargarHuecosDisponibles(): void {
    this.loadingHuecos = true;
    this.huecosDisponibles = [];
    this.errorMessage = '';

    this.citaService
      .getHuecosDisponibles(
        this.fechaSeleccionada,
        this.citaData.profesionalId,
        this.citaData.servicioId,
      )
      .subscribe({
        next: (huecos) => {
          this.huecosDisponibles = huecos;
          this.loadingHuecos = false;
        },
        error: (error) => {
          console.error('Error al cargar huecos:', error);
          this.errorMessage = error.error?.message || 'Error al cargar los huecos disponibles';
          this.loadingHuecos = false;
        },
      });
  }

  seleccionarHora(hora: string): void {
    if (!hora) return;

    //Combinar fecha y hora para el formato del backend
    this.citaData.fechaInicio = `${this.fechaSeleccionada}T${hora}:00`;
    this.successMessage = `Hora seleccionada: ${hora}`;
  }

  //Método para verificar si una hora está seleccionada
  estaHoraSeleccionada(hora: string): boolean {
    if (!this.citaData.fechaInicio || !this.fechaSeleccionada) {
      return false;
    }

    const horaCompletaEsperada = `${this.fechaSeleccionada}T${hora}:00`;
    return this.citaData.fechaInicio === horaCompletaEsperada;
  }

  onSubmit(): void {
    //Validaciones antes de enviar
    if (this.citaData.profesionalId === 0) {
      alert('Debe seleccionar un profesional');
      return;
    }
    if (this.citaData.servicioId === 0) {
      alert('Debe seleccionar un servicio');
      return;
    }
    if (!this.citaData.fechaInicio) {
      alert('Debe seleccionar una fecha y hora');
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.citaService.crearCita(this.citaData).subscribe({
      next: (response) => {
        this.loading = false;
        alert('Cita creada correctamente');
        this.router.navigate(['/citas']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || error.error || 'Error al crear la cita';
      },
    });
  }
}
