import type { ReactNode } from "react";

export type TableCellValue = string | number | ReactNode;
export type TableColumnAlignment = "left" | "center" | "right";
export type TableOverflowValue = "auto" | "hidden" | "visible" | "scroll";

export interface CustomTableProps {
  headers: string[];
  data?: TableCellValue[][];
  rows?: number;
  columns?: number;
  loading?: boolean;
  columnWidths?: Array<string | number>;
  columnAlignments?: TableColumnAlignment[];
  emptyText?: string;
  maxHeight?: number | string;
  minWidth?: number | string;
  stickyHeader?: boolean;

  /**
   * Hace sticky la última columna.
   * Ideal para columna "Acciones".
   */
  stickyLastColumn?: boolean;

  /**
   * Offset derecho para sticky de la última columna.
   */
  stickyLastColumnRight?: number;

  /**
   * Permite overflow visible dentro de las celdas.
   * Útil para botones, badges o triggers visuales.
   */
  allowCellOverflow?: boolean;

  /**
   * Control fino del overflow del contenedor.
   */
  containerOverflowX?: TableOverflowValue;
  containerOverflowY?: TableOverflowValue;
}