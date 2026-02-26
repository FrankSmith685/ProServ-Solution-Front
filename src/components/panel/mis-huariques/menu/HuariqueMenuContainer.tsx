import type { FC } from "react";

import { HuariqueWizardProgress } from "../HuariqueWizardProgress";
import { HuariqueHeader } from "../HuariqueHeader";
import { MenuWizardActions } from "./MenuWizardActions";
import { useHuariqueMenu } from "@/hooks/panel/mis-huariques/useHuariqueMenu";
import { HuariqueMenuContent } from "./HuariqueMenuContent";

export const HuariqueMenuContainer: FC = () => {
  const {
    categorias,
    loading,
    createCategoria,
    updateCategoria,
    createItem,
    updateItem,
    deleteItem,
    status,
    save,
    isValid,
    reorderItems,
  } = useHuariqueMenu();

  return (
    <div className="w-full space-y-10">
      <HuariqueWizardProgress />

      <HuariqueHeader
        title="Carta / Menú"
        description="Agrega los platos que ofrecerá tu huarique (puedes hacerlo luego)"
        status={status}
      />

      <HuariqueMenuContent
        categorias={categorias}
        loading={loading}
        createCategoria={createCategoria}
        updateCategoria={updateCategoria}
        createItem={createItem}
        updateItem={updateItem}
        deleteItem={deleteItem}
        reorderItems={reorderItems}
      />

      <MenuWizardActions
        loading={loading}
        save={save}
        isValid={isValid}
      />
    </div>
  );
};