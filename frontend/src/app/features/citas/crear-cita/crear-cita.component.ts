import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CitaService } from '../../../core/services/cita.service';
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
  styleUrls: ['./crear-cita.component.scss']
})
export class CrearCitaComponent implements OnInit {
  citaData: CrearCitaRequest = {
    clienteId: 0,
    profesionalId: 0,
    servicioId: 0,
    fechaInicio: '',
    alergias: '',
    observaciones: ''
  };
  
  profesionales: Usuario[] = [];
  servicios: Servicio[] = [];
  fechaMinima: string = '';
  errorMessage = '';
  loading = false;
  loadingServicios = false;  //Loading para servicios
  loadingProfesionales = false;  //Loading para profesionales
  user: any;

  constructor(
    private citaService: CitaService,
    private usuarioService: UsuarioService,
    private servicioService: ServicioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.citaData.clienteId = this.user.userId;
    this.cargarProfesionales();
    this.cargarServicios();

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.fechaMinima = now.toISOString().slice(0, 16);
  }

  cargarProfesionales(): void {
    this.loadingProfesionales = true;
    this.usuarioService.listarTodos().subscribe({
      next: (data) => {
        this.profesionales = data.filter(u => u.rol === 'PROFESIONAL' && u.activo);
        this.loadingProfesionales = false;
      },
      error: (error) => {
        console.error('Error al cargar profesionales', error);
        this.loadingProfesionales = false;
      }
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
      }
    });
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
      }
    });
  }
}