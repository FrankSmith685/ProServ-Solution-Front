import { useState, type FC } from "react";
import { DocumentComponent } from "../components/DocumentComponent";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomTable } from "@/components/ui/kit/CustomTable";
import type { DocumentTableState } from "@/interfaces/ui/documents/IDocumentTable";

const DocumentTable: FC = () => {
  const [state, setState] = useState<DocumentTableState>({
    loading: false,
  });

  const headers: string[] = ["Plan", "Precio", "Usuarios", "Estado"];

  const data = [
    ["Básico", "$10", 1, "Activo"],
    ["Pro", "$25", 5, "Activo"],
    ["Enterprise", "$99", "Ilimitado", "Pendiente"],
  ];

  const props: PropItem[] = [
    { name: "headers", description: "Encabezados de la tabla", type: "string[]", required: true },
    { name: "data", description: "Datos de la tabla", type: "(string | number | ReactNode)[][]" },
    { name: "loading", description: "Muestra skeletons", type: "boolean", defaultValue: "false" },
    { name: "rows", description: "Número de filas skeleton", type: "number" },
    { name: "columnWidths", description: "Ancho por columna", type: "string[]" },
    { name: "emptyText", description: "Texto cuando no hay datos", type: "string" },
  ];

  return (
    <DocumentComponent
      name="Tabla Personalizada"
      description="Tabla reutilizable con soporte para loading, skeletons, contenido dinámico y columnas configurables."
      props={props}
      controls={
        <div
          className="
          rounded-2xl
          border border-white/60
          bg-linear-to-br from-white/95 to-primary/5
          backdrop-blur
          shadow-[0_10px_30px_rgba(0,0,0,.06)]
          p-6
        "
        >
          <p className="text-xs font-bold text-gray-500 mb-3">
            Controles
          </p>

          <div className="flex flex-col gap-4">
            <CustomSwitch
              label="Loading"
              checked={state.loading}
              onChange={(e) =>
                setState(prev => ({ ...prev, loading: e.target.checked }))
              }
            />

            <CustomInput
              label="Empty text"
              value="No hay registros disponibles"
              disabled
              fullWidth
              onChange={() => {}}
            />
          </div>
        </div>
      }
      preview={
        <CustomTable
          headers={headers}
          data={state.loading ? [] : data}
          loading={state.loading}
          rows={3}
          columnWidths={["30%", "20%", "20%", "30%"]}
          emptyText="No hay registros disponibles"
        />
      }
    />
  );
};

export default DocumentTable;
