export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  email: string;
  rol: string;
  userId: number;
  nombre: string;
}

export interface RegistroRequest {
  email: string;
  password: string;
  nombre: string;
  telefono: string;
}