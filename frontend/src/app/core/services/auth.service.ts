import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { LoginRequest, LoginResponse, RegistroRequest } from '../../shared/models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://salon-manager-syu8.onrender.com/api/auth';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }
  
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          const user = {
            email: response.email,
            rol: response.rol,
            userId: response.userId,
            nombre: response.nombre
          };
          localStorage.setItem('user', JSON.stringify(user));
          
          //Notificar cambio de usuario
          this.currentUserSubject.next(user);
        })
      );
  }

  registro(data: RegistroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, data);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    //Notificar que no hay usuario
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user && user.rol === role;
  }
}