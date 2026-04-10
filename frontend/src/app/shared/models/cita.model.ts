export interface Cita {
  id: number;
  clienteId: number;
  clienteNombre: string;
  profesionalId: number;
  profesionalNombre: string;
  servicioId: number;
  servicioNombre: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  atendido: boolean;
  alergias?: string;
  observaciones?: string;
}

export interface CrearCitaRequest {
  clienteId: number;
  profesionalId: number;
  servicioId: number;
  fechaInicio: string;
  alergias?: string;
  observaciones?: string;
}