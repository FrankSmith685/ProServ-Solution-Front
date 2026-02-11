// ===============================
// Constantes globales
// ===============================
const BASE_URL = "https://mappidevbucket.s3.us-east-1.amazonaws.com/";
const DEFAULT_PIN_URL =
  "https://cdn-icons-png.flaticon.com/64/684/684908.png";

// ===============================
// Tipado común
// ===============================
interface SubcategoriaMapIcon {
  cod_subcategoria?: number;
  cod_categoria?: number;
  descripcion?: string | null;
}

// ===============================
// Mapas de iconos
// ===============================

// Subcategorías (normal)
const SUBCATEGORIA_MAP: Record<number, string> = {
  1: "mapp_300", // Licorería
  2: "mapp_301", // Restobar
  7: "mapp_292", // Chancho al palo
  29: "mapp_297", // Pollería
  21: "mapp_296", // Cevichería
  22: "mapp_298", // Chifa
  19: "mapp_294", // Panadería
};

// Subcategorías (seleccionado)
const SUBCATEGORIA_SELECTED_MAP: Record<number, string> = {
  1: "mapp_638", // Licorería
  2: "mapp_641", // Restobar
  7: "mapp_636", // Chancho al palo
  29: "mapp_640", // Pollería
  21: "mapp_635", // Cevichería
  22: "mapp_637", // Chifa
  19: "mapp_639", // Panadería
};

// Categorías (normal)
const CATEGORIA_MAP: Record<number, string> = {
  1: "mapp_299", // Restaurantes
  2: "mapp_293", // Comida al paso
  3: "mapp_295", // Postres y café
  4: "mapp_300", // Bar
  5: "default",  // Otros
};

// Categorías (seleccionado)
const CATEGORIA_SELECTED_MAP: Record<number, string> = {
  1: "mapp_634", // Restaurantes
  2: "mapp_632", // Comida al paso
  3: "mapp_633", // Postres y café
  4: "mapp_638", // Bar
};

// ===============================
// Imagen normal (no seleccionada)
// ===============================
export function getSubcategoriaImage(
  subcategoria?: SubcategoriaMapIcon | null
): string {
  if (!subcategoria) return DEFAULT_PIN_URL;

  // Subcategoría específica
  if (
    subcategoria.cod_subcategoria &&
    SUBCATEGORIA_MAP[subcategoria.cod_subcategoria]
  ) {
    return BASE_URL + SUBCATEGORIA_MAP[subcategoria.cod_subcategoria];
  }

  // Categoría padre
  if (
    subcategoria.cod_categoria &&
    CATEGORIA_MAP[subcategoria.cod_categoria]
  ) {
    const icon = CATEGORIA_MAP[subcategoria.cod_categoria];
    return icon === "default" ? DEFAULT_PIN_URL : BASE_URL + icon;
  }

  // Default
  return DEFAULT_PIN_URL;
}

// ===============================
// Imagen de subcategoría SELECCIONADA
// ===============================
export function getSelectedSubcategoriaImage(
  subcategoria?: SubcategoriaMapIcon | null
): string {
  if (!subcategoria) return DEFAULT_PIN_URL;

  // Subcategoría específica seleccionada
  if (
    subcategoria.cod_subcategoria &&
    SUBCATEGORIA_SELECTED_MAP[subcategoria.cod_subcategoria]
  ) {
    return BASE_URL + SUBCATEGORIA_SELECTED_MAP[subcategoria.cod_subcategoria];
  }

  // Categoría padre seleccionada
  if (
    subcategoria.cod_categoria &&
    CATEGORIA_SELECTED_MAP[subcategoria.cod_categoria]
  ) {
    return BASE_URL + CATEGORIA_SELECTED_MAP[subcategoria.cod_categoria];
  }

  // Default
  return DEFAULT_PIN_URL;
}
