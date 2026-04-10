import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../shared/models/usuario.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {
  usuarios: Usuario[] = [];
  loading = true;
  currentUser: any;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.loading = true;
    this.usuarioService.listarTodos().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.loading = false;
      },
      error: (error) => {
        alert('Error al cargar usuarios');
        this.loading = false;
      }
    });
  }

  canChangeRole(usuario: Usuario): boolean {
    return this.currentUser?.rol === 'ADMIN' && usuario.id !== this.currentUser.userId;
  }

  cambiarRol(usuario: Usuario): void {
    if (confirm(`¿Cambiar rol de ${usuario.nombre} a ${usuario.rol}?`)) {
      this.usuarioService.cambiarRol(usuario.id, usuario.rol).subscribe({
        next: () => {
          alert('Rol actualizado correctamente');
        },
        error: (error) => {
          alert('Error al cambiar rol');
          this.cargarUsuarios();
        }
      });
    } else {
      this.cargarUsuarios();
    }
  }

  borrarLogico(usuario: Usuario): void {
    if (confirm(`¿Desactivar usuario ${usuario.nombre}?`)) {
      this.usuarioService.borrarLogico(usuario.id).subscribe({
        next: () => {
          alert('Usuario desactivado');
          this.cargarUsuarios();
        },
        error: (error) => {
          alert('Error al desactivar usuario');
        }
      });
    }
  }

  borrarFisico(usuario: Usuario): void {
    if (confirm(`¿ELIMINAR PERMANENTEMENTE a ${usuario.nombre}?`)) {
      this.usuarioService.borrarFisico(usuario.id).subscribe({
        next: () => {
          alert('Usuario eliminado permanentemente');
          this.cargarUsuarios();
        },
        error: (error) => {
          alert('Error al eliminar usuario');
        }
      });
    }
  }

  getRolClass(rol: string): string {
    switch (rol) {
        case 'ADMIN':
            return 'admin';
        case 'PROFESIONAL':
            return 'profesional';
        case 'CLIENTE':
            return 'cliente';
        default:
            return 'default';
    }
  }
}