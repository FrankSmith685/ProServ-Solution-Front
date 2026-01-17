import type { ReactNode } from "react";

export type TableCell = string | number | ReactNode;

export interface CustomTableProps {
  headers: string[];
  data?: TableCell[][];
  rows?: number;
  columns?: number;
  loading?: boolean;
  columnWidths?: string[];
  emptyText?: string;
}