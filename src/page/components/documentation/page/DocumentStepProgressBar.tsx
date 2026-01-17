import { useState, type FC } from "react";
import { DocumentComponent } from "../components/DocumentComponent";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";

import { CustomStepProgressBar } from "@/components/ui/navigation/CustomStepProgressBar";
import type { DocumentStepProgressBarState } from "@/interfaces/ui/documents/IDocumentStepProgressBar";

const stepsMock = [
  { label: "Datos", path: "/form/datos" },
  { label: "Detalle", path: "/form/detalle" },
  { label: "Confirmación", path: "/form/confirmacion" },
];

const DocumentStepProgressBar: FC = () => {
  const [state] = useState<DocumentStepProgressBarState>({
    currentPath: "/form/detalle",
  });

  const props: PropItem[] = [
    { name: "steps", description: "Pasos del progreso", type: "StepItem[]", required: true },
    { name: "currentPath", description: "Ruta / paso activo", type: "string", required: true },
    { name: "maxStep", description: "Máximo paso permitido", type: "number", defaultValue: "1" },
  ];

  return (
    <DocumentComponent
      name="Custom Step Progress Bar"
      description="Barra de progreso de pasos con estados activo, completado y pendiente."
      props={props}
      preview={
        <div className="w-full max-w-2xl">
          <CustomStepProgressBar
            steps={stepsMock}
            currentPath={state.currentPath}
            maxStep={3}
          />
        </div>
      }
    />
  );
};

export default DocumentStepProgressBar;
