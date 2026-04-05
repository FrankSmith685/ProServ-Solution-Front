import type { ReactNode } from "react";

export type TableCellValue = string | number | ReactNode;

export interface CustomTableProps {
  headers: string[];
  data?: TableCellValue[][];
  rows?: number;
  columns?: number;
  loading?: boolean;
  columnWidths?: Array<string | number>;
  emptyText?: string;
  maxHeight?: number | string;
  minWidth?: number | string;
  stickyHeader?: boolean;
}