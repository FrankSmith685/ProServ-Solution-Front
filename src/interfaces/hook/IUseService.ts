/* eslint-disable @typescript-eslint/no-explicit-any */
/* ================== MODELOS ================== */

export interface Subcategoria {
  cod_subcategoria: number;
  nombre: string;
  descripcion?: string | null;
}

export interface Categoria {
  cod_categoria: number;
  nombre: string;
  descripcion?: string | null;
}

export interface Servicio {
  cod_servicio: string;
  nombre: string;
  descripcion: string | null;
  estado: boolean;
  fechaRegistro: string;
  abierto24h: boolean;
  horaInicio: string | null;
  horaFin: string | null;
  delivery: boolean;
  archivado: boolean;
  subcategoria?: Subcategoria | null;
  
}

/* ================== RESPONSES ================== */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ServiciosActivosResponse {
  total: number;
  servicios: Servicio[];
}

/* ================== PAYLOADS ================== */

export interface CreateServicePayload {
  SERV_Nombre: string;
  SERV_Descripcion?: string;
  SERV_Precio?: number;
  SUBC_Id: number;
}

export interface UpdateServicePayload {
  SERV_Nombre?: string;
  SERV_Descripcion?: string;
  SERV_Estado?: boolean;
  SERV_Abierto24h?: boolean;
  SERV_HoraInicio?: string;
  SERV_HoraFin?: string;
  SERV_Delivery?: boolean;
  SUBC_Id?: number;
}

export interface ToggleArchivePayload {
  archivado: boolean;
  servicioIds: string | string[];
}

/* ================== CALLBACK ================== */

export type ServiceCallback<T = any> = (response: {
  success: boolean;
  message?: string;
  data?: T;
}) => void;

/* ================== HOOK ================== */

export interface UseService {
  getMisServicios: () => Promise<Servicio[]>;
  getServicioById: (id: string) => Promise<Servicio | null>;
  getServiciosActivos: () => Promise<ServiciosActivosResponse | null>;
  getServiciosPremium: () => Promise<Servicio[]>;
  getServiciosChevere: () => Promise<Servicio[]>;
  createServicio: (
    payload: CreateServicePayload,
    callback?: ServiceCallback<Servicio>
  ) => Promise<void>;
  updateServicio: (
    id: string,
    payload: UpdateServicePayload,
    callback?: ServiceCallback<Servicio>
  ) => Promise<void>;
  toggleArchiveServicio: (
    payload: ToggleArchivePayload,
    callback?: ServiceCallback
  ) => Promise<void>;
}

type TipoHorario = "normal" | "24h";

export interface Service {
  nombre: string;
  descripcion: string;
  categoria: string;
  subcategoria: string;
  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia?: string | null;
  lat: number;
  lng: number;
  tipoHorario: TipoHorario;
  horaInicio: string | null;
  horaFin: string | null;
  diasAtencion: string[];
  delivery: boolean;
  ubicacionInicializada?: boolean;
  ubicacionEditada?: boolean;
  logo?: File | string | null;
  portada?: File | string | null;
  galeria?: (File | string)[];
}
