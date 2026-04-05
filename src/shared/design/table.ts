import type { SxProps, Theme } from "@mui/material/styles";

interface TableStyles {
  container: SxProps<Theme>;
  table: SxProps<Theme>;
  headRow: SxProps<Theme>;
  headCell: SxProps<Theme>;
  bodyRow: SxProps<Theme>;
  bodyCell: SxProps<Theme>;
  emptyCell: SxProps<Theme>;
  skeletonCell: SxProps<Theme>;
}

export const tableStyles: TableStyles = {
  container: {
    width: "100%",
    maxWidth: "100%",
    overflowX: "auto",
    overflowY: "auto",
    borderRadius: "16px",
    border: "1px solid hsl(var(--color-border))",
    backgroundColor: "var(--color-surface)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },

  table: {
    width: "100%",
    minWidth: 700,
    borderCollapse: "separate",
    borderSpacing: 0,
    backgroundColor: "transparent",
  },

  headRow: {
    backgroundColor: "hsl(var(--color-primary) / 0.08)",
  },

  headCell: {
    position: "sticky",
    top: 0,
    zIndex: 2,
    fontWeight: 700,
    fontSize: "0.875rem",
    color: "var(--color-text)",
    backgroundColor: "var(--color-surface-soft-light)",
    borderBottom: "1px solid hsl(var(--color-border))",
    whiteSpace: "nowrap",
    px: 2,
    py: 1.75,
  },

  bodyRow: {
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "hsl(var(--color-primary) / 0.06)",
    },
    "&:last-child td": {
      borderBottom: "none",
    },
  },

  bodyCell: {
    fontSize: "0.9375rem",
    color: "var(--color-text)",
    borderBottom: "1px solid hsl(var(--color-border) / 0.7)",
    backgroundColor: "transparent",
    verticalAlign: "middle",
    px: 2,
    py: 1.5,
    wordBreak: "break-word",
  },

  emptyCell: {
    textAlign: "center",
    py: 5,
    px: 2,
    color: "var(--color-text-muted)",
    fontSize: "0.95rem",
    borderBottom: "none",
  },

  skeletonCell: {
    borderBottom: "1px solid hsl(var(--color-border) / 0.7)",
    px: 2,
    py: 1.5,
  },
};