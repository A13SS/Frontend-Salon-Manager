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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    this.esCliente = this.user?.rol === 'CLIENTE';
    this.esProfesional = this.user?.rol === 'PROFESIONAL';
    this.esAdmin = this.user?.rol === 'ADMIN';
  }
}