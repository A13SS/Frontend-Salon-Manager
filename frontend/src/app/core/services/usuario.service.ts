import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../../shared/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = '/api/usuarios';

  constructor(private http: HttpClient) {}

  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  listarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

    buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  cambiarRol(id: number, nuevoRol: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/rol?nuevoRol=${nuevoRol}`, {}, 
      { responseType: 'text' });
  }

  borrarLogico(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/desactivar`, {}, 
      { responseType: 'text' });
  }

  borrarFisico(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, 
      { responseType: 'text' });
  }
}