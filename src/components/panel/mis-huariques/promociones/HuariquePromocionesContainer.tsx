import type { FC } from "react";
import { HuariqueWizardProgress } from "../HuariqueWizardProgress";
import { HuariqueHeader } from "../HuariqueHeader";
import { MenuWizardActions } from "../menu/MenuWizardActions";
import { useHuariquePromociones } from "@/hooks/panel/mis-huariques/useHuariquePromociones";
import { HuariquePromocionesContent } from "./HuariquePromocionesContent";

export const HuariquePromocionesContainer: FC = () => {
  const {
    promociones,
    menu,
    loading,
    createPromocion,
    updatePromocion,
    deletePromocion,
    status,
    save,
    isValid,
  } = useHuariquePromociones();

  return (
    <div className="w-full space-y-10">

      <HuariqueWizardProgress />

      <HuariqueHeader
        title="Promociones"
        description="Crea combos, descuentos o promociones especiales (opcional)"
        status={status}
      />

      <HuariquePromocionesContent
        promociones={promociones}
        loading={loading}
        createPromocion={createPromocion}
        updatePromocion={updatePromocion}
        deletePromocion={deletePromocion}
        menu={menu}
      />

      <MenuWizardActions
        loading={loading}
        save={save}
        isValid={isValid}
      />
    </div>
  );
};