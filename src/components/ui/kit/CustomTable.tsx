import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
} from "@mui/material";
import { memo, type FC } from "react";
import type { CustomTableProps } from "@/interfaces/ui/kit/ICustomTable";
import { tableStyles } from "@/shared/design/table";

const CustomTableComponent: FC<CustomTableProps> = ({
  headers,
  data = [],
  rows = data.length || 0,
  columns = headers.length,
  loading = false,
  columnWidths = [],
  emptyText = "No hay registros disponibles",
}) => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        ...tableStyles.container,
        overflowX: "auto",
        overflowY: "auto",
        maxHeight: 420,
        "@media (max-width: 600px)": {
          overflowX: "auto",
          overflowY: "auto",
        },
      }}
    >
      <Table
        sx={{
          tableLayout: "fixed",
          minWidth: 900,
        }}
      >
        {/* Header */}
        <TableHead>
          <TableRow sx={tableStyles.headRow}>
            {headers.map((header, index) => (
              <TableCell
                key={index}
                sx={{
                  ...tableStyles.headCell,
                  width: columnWidths[index] || "auto",
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        {/* Body */}
        <TableBody>
          {loading ? (
            Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex} sx={tableStyles.bodyCell}>
                    <Skeleton height={28} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                {row.map((cell, colIndex) => (
                  <TableCell
                    key={colIndex}
                    sx={{
                      ...tableStyles.bodyCell,
                      width: columnWidths[colIndex] || "auto",
                    }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns} sx={tableStyles.emptyCell}>
                {emptyText}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const CustomTable = memo(CustomTableComponent);
