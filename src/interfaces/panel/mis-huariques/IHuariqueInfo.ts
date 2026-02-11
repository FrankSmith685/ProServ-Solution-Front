// Tipo de horario del huarique
export type TipoHorario = "normal" | "24h";
// Modelo del formulario info del huarique
export interface HuariqueInfoForm {
  nombre: string;
  descripcion: string;

  categoria: string;
  subcategoria: string;

  departamento: string;
  provincia: string;
  distrito: string;
  direccion: string;
  referencia: string;

  lat: number;
  lng: number;

  tipoHorario: TipoHorario;
  horaInicio: string;
  horaFin: string;
  diasAtencion: string[];

  delivery: boolean;
}
// Props del componente formulario info
export interface HuariqueInfoFormProps {
  form: HuariqueInfoForm;
  onChange: <K extends keyof HuariqueInfoForm>(
    key: K,
    value: HuariqueInfoForm[K]
  ) => void;
}
// Días de atención disponibles
export const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] as const;
// Tipos de horario disponibles
export const TIPO_HORARIO: { value: TipoHorario; label: string }[] = [
  { value: "normal", label: "Horario definido" },
  { value: "24h", label: "Atiende 24 horas" },
];
// Arrays del form que pueden togglear valores
export type ToggleableArrays = "diasAtencion";