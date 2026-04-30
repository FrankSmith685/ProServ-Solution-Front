import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  Box,
} from "@mui/material";
import { memo, type FC } from "react";

import type { CustomTableProps } from "@/interfaces/ui/kit/ICustomTable";
import { tableStyles } from "@/shared/design/table";

const resolveAlign = (
  align?: "left" | "center" | "right"
): "left" | "center" | "right" => {
  if (align === "center" || align === "right") return align;
  return "left";
};

const CustomTableComponent: FC<CustomTableProps> = ({
  headers,
  data = [],
  rows = data.length || 5,
  columns = headers.length,
  loading = false,
  columnWidths = [],
  columnAlignments = [],
  emptyText = "No hay registros disponibles",
  maxHeight = 420,
  minWidth = 700,
  stickyHeader = true,
  stickyLastColumn = false,
  stickyLastColumnRight = 0,
  allowCellOverflow = false,
  containerOverflowX = "auto",
  containerOverflowY = "auto",
}) => {
  const hasData = data.length > 0;
  const lastColumnIndex = headers.length - 1;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100%",
        overflow: "visible",
        position: "relative",
      }}
    >
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          ...tableStyles.container,
          maxHeight,
          overflowX: containerOverflowX,
          overflowY: containerOverflowY,
          position: "relative",
        }}
      >
        <Table
          stickyHeader={stickyHeader}
          sx={{
            ...tableStyles.table,
            minWidth,
            overflow: "visible",
          }}
          aria-label="custom table"
        >
          <TableHead>
            <TableRow sx={tableStyles.headRow}>
              {headers.map((header, index) => {
                const isStickyActionColumn =
                  stickyLastColumn && index === lastColumnIndex;

                return (
                  <TableCell
                    key={`${header}-${index}`}
                    align={resolveAlign(columnAlignments[index])}
                    sx={{
                      ...tableStyles.headCell,
                      width: columnWidths[index] ?? "auto",
                      minWidth:
                        typeof columnWidths[index] !== "undefined"
                          ? columnWidths[index]
                          : 140,
                      position: isStickyActionColumn ? "sticky" : "static",
                      right: isStickyActionColumn ? stickyLastColumnRight : "auto",
                      zIndex: isStickyActionColumn ? 6 : tableStyles.headCell?.zIndex,
                      backgroundColor: "var(--color-surface, #fff)",
                      boxShadow: isStickyActionColumn
                        ? "-8px 0 18px -14px rgba(0,0,0,0.18)"
                        : "none",
                    }}
                  >
                    {header}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? Array.from({ length: rows }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-row-${rowIndex}`} sx={tableStyles.bodyRow}>
                    {Array.from({ length: columns }).map((_, colIndex) => {
                      const isStickyActionColumn =
                        stickyLastColumn && colIndex === lastColumnIndex;

                      return (
                        <TableCell
                          key={`skeleton-cell-${rowIndex}-${colIndex}`}
                          align={resolveAlign(columnAlignments[colIndex])}
                          sx={{
                            ...tableStyles.skeletonCell,
                            position: isStickyActionColumn ? "sticky" : "static",
                            right: isStickyActionColumn ? stickyLastColumnRight : "auto",
                            zIndex: isStickyActionColumn ? 3 : "auto",
                            backgroundColor: "var(--color-surface, #fff)",
                            boxShadow: isStickyActionColumn
                              ? "-8px 0 18px -14px rgba(0,0,0,0.14)"
                              : "none",
                          }}
                        >
                          <Skeleton
                            variant="rounded"
                            height={24}
                            sx={{
                              bgcolor: "hsl(var(--color-border) / 0.35)",
                              borderRadius: "8px",
                            }}
                          />
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              : hasData
                ? data.map((row, rowIndex) => (
                    <TableRow key={`row-${rowIndex}`} sx={tableStyles.bodyRow}>
                      {row.map((cell, colIndex) => {
                        const isStickyActionColumn =
                          stickyLastColumn && colIndex === lastColumnIndex;

                        return (
                          <TableCell
                            key={`cell-${rowIndex}-${colIndex}`}
                            align={resolveAlign(columnAlignments[colIndex])}
                            sx={{
                              ...tableStyles.bodyCell,
                              width: columnWidths[colIndex] ?? "auto",
                              minWidth:
                                typeof columnWidths[colIndex] !== "undefined"
                                  ? columnWidths[colIndex]
                                  : 140,
                              overflow: allowCellOverflow ? "visible" : "hidden",
                              position: isStickyActionColumn ? "sticky" : "relative",
                              right: isStickyActionColumn ? stickyLastColumnRight : "auto",
                              zIndex: isStickyActionColumn ? 2 : 1,
                              backgroundColor: "var(--color-surface, #fff)",
                              boxShadow: isStickyActionColumn
                                ? "-8px 0 18px -14px rgba(0,0,0,0.14)"
                                : "none",
                              verticalAlign: "middle",
                            }}
                          >
                            {cell}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                : (
                  <TableRow>
                    <TableCell colSpan={columns} sx={tableStyles.emptyCell}>
                      {emptyText}
                    </TableCell>
                  </TableRow>
                )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export const CustomTable = memo(CustomTableComponent);