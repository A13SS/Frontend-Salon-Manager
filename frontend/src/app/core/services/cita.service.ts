import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cita, CrearCitaRequest } from '../../shared/models/cita.model';

export interface Hueco {
  hora: string;
  disponible: boolean;  // true = libre, false = ocupado
  estado: string;  // "LIBRE" o "OCUPADO"
}

@Injectable({
  providedIn: 'root'
})
export class CitaService {
  private apiUrl = 'https://salon-manager-syu8.onrender.com/api/citas';

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

  getCitasPorFecha(fecha: string): Observable<Cita[]> {
  return this.http.get<Cita[]>(`${this.apiUrl}/fecha?fecha=${fecha}T00:00:00`);
  }

  getHuecosDisponibles(fecha: string, profesionalId: number, servicioId: number): Observable<Hueco[]> {
    const params = new HttpParams()
      .set('fecha', fecha)
      .set('profesionalId', profesionalId.toString())
      .set('servicioId', servicioId.toString());
    
    return this.http.get<Hueco[]>(`${this.apiUrl}/huecos-disponibles`, { params });
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