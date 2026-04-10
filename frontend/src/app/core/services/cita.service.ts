import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita, CrearCitaRequest } from '../../shared/models/cita.model';

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = '/api/citas';

  constructor(private http: HttpClient) {}

  crearCita(request: CrearCitaRequest): Observable<Cita> {
    return this.http.post<Cita>(`${this.apiUrl}/crear`, request);
  }

  getCitasPorCliente(clienteId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/cliente/${clienteId}`);
  }

  getCitasPorProfesional(profesionalId: number): Observable<Cita[]> {
    return this.http.get<Cita[]>(`${this.apiUrl}/profesional/${profesionalId}`);
  }

  cancelarCita(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/cancelar`, {});
  }

  confirmarCita(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/confirmar`, {});
  }

  marcarAtendida(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/atender`, {});
  }

  eliminarCita(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}