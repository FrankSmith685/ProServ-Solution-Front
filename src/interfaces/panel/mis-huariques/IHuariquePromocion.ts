
import type { MenuCategoria } from "./IHuariqueMenu";
// Promoción Modal
export interface PropsPromocionModal {
  open: boolean;
  initialData?: Promocion | null;
  menu: MenuCategoria[];
  onClose: () => void;
  onSave: (promo: Promocion) => void;
}

export interface PromocionItem {
  id: string;
  nombre: string;
  cantidad: number;
  precio: number;
}

export interface PropsPromocionesContent {
  promociones: Promocion[];
  loading: boolean;
  createPromocion: (promo: Promocion) => void;
  updatePromocion: (id: string, data: Partial<Promocion>) => void;
  deletePromocion: (id: string) => void;
  menu: MenuCategoria[];
}



export type PromocionTipo =
  | "combo"
  | "precio_fijo"
  | "porcentaje"
  | "dos_por_uno";

export interface Promocion {
  id: string;
  titulo: string;
  descripcion?: string;
  tipo: PromocionTipo;
  items?: string[];
  precioPromo?: number;
  porcentajeDescuento?: number;
  fechaInicio?: string;
  fechaFin?: string;
  horaInicio?: string;
  horaFin?: string;
  limite?: number;
  usados?: number;
  destacada?: boolean;
  tags?: string[];
  activa: boolean;
  imagen: File | string | null;
}
