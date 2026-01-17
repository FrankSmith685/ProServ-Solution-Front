export type UserRole = "comensal" | "vendedor";

export interface UserTipo {
  cod_tipo_usuario: number;
  descripcion: UserRole;
}

export interface AppUser {
  cod_usuario: string;
  nombre: string;
  apellido: string;
  correo: string;
  fotoPerfil: string | null;
  tipo_usuario: UserTipo[];

  tieneEmpresa: boolean;
  tieneServicio: boolean;
  serviciosActivos: number;
  planActivo: string | null;
}
