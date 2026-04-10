import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracionMin: number;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  private apiUrl = '/api/servicios';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(this.apiUrl);
  }

  listarActivos(): Observable<Servicio[]> {
    return this.http.get<Servicio[]>(`${this.apiUrl}/activos`);
  }
}