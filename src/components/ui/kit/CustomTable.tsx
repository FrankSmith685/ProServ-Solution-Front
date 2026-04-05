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

const CustomTableComponent: FC<CustomTableProps> = ({
  headers,
  data = [],
  rows = data.length || 5,
  columns = headers.length,
  loading = false,
  columnWidths = [],
  emptyText = "No hay registros disponibles",
  maxHeight = 420,
  minWidth = 700,
  stickyHeader = true,
}) => {
  const hasData = data.length > 0;

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          ...tableStyles.container,
          maxHeight,
        }}
      >
        <Table
          stickyHeader={stickyHeader}
          sx={{
            ...tableStyles.table,
            minWidth,
          }}
          aria-label="custom table"
        >
          <TableHead>
            <TableRow sx={tableStyles.headRow}>
              {headers.map((header, index) => (
                <TableCell
                  key={`${header}-${index}`}
                  sx={{
                    ...tableStyles.headCell,
                    width: columnWidths[index] ?? "auto",
                    minWidth:
                      typeof columnWidths[index] !== "undefined"
                        ? columnWidths[index]
                        : 140,
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading
              ? Array.from({ length: rows }).map((_, rowIndex) => (
                  <TableRow key={`skeleton-row-${rowIndex}`} sx={tableStyles.bodyRow}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                      <TableCell
                        key={`skeleton-cell-${rowIndex}-${colIndex}`}
                        sx={tableStyles.skeletonCell}
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
                    ))}
                  </TableRow>
                ))
              : hasData
                ? data.map((row, rowIndex) => (
                    <TableRow key={`row-${rowIndex}`} sx={tableStyles.bodyRow}>
                      {row.map((cell, colIndex) => (
                        <TableCell
                          key={`cell-${rowIndex}-${colIndex}`}
                          sx={{
                            ...tableStyles.bodyCell,
                            width: columnWidths[colIndex] ?? "auto",
                            minWidth:
                              typeof columnWidths[colIndex] !== "undefined"
                                ? columnWidths[colIndex]
                                : 140,
                          }}
                        >
                          {cell}
                        </TableCell>
                      ))}
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