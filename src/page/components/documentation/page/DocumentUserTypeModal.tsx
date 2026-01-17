import { useState, type FC } from "react";
import { DocumentComponent } from "../components/DocumentComponent";
import type { PropItem } from "@/interfaces/ui/documents/IDocumentComponents";
import { CustomButton } from "@/components/ui/kit/CustomButton";
// import { UserTypeModal } from "@/components/modals/UserTypeModal";
import type { DocumentUserTypeModalState } from "@/interfaces/ui/documents/IDocumentUserTypeModal";
import UserTypeModal from "@/components/modals/UserTypeModal";

const DocumentUserTypeModal: FC = () => {
  const [state, setState] = useState<DocumentUserTypeModalState>({
    open: false,
  });

  const props: PropItem[] = [
    { name: "isOpen", description: "Controla la visibilidad", type: "boolean", required: true },
    { name: "onClose", description: "Cierra el modal", type: "() => void", required: true },
    { name: "onSelectType", description: "Retorna el rol elegido", type: `(type: "comensal" | "vendedor") => void`, required: true },
  ];

  return (
    <DocumentComponent
      name="User Type Modal"
      description="Modal para seleccionar el tipo de usuario (Comensal o Emprendedor). UI moderna, Glass y totalmente responsive."
      props={props}
      preview={
        <>
          <CustomButton
            text="Abrir Modal"
            onClick={() => setState({ open: true })}
          />

          <UserTypeModal
            isOpen={state.open}
            onClose={() => setState({ open: false })}
            onSelectType={(type) => alert(`Seleccionaste: ${type}`)}
          />
        </>
      }
    />
  );
};

export default DocumentUserTypeModal;
