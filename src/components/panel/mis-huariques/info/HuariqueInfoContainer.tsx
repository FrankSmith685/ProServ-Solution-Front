import { HuariqueWizardProgress } from "@/components/panel/mis-huariques/HuariqueWizardProgress";
import { HuariqueWizardActions } from "@/components/panel/mis-huariques/info/HuariqueWizardActions";
import { useHuariqueInfoForm } from "@/hooks/panel/mis-huariques/useHuariqueInfoForm";
import { HuariqueHeader } from "../HuariqueHeader";
import { HuariqueTabs } from "./HuariqueTabs";
import { HuariqueInfoTab } from "./tabs/HuariqueInfoTab";
import { HuariqueUbicacionTab } from "./tabs/HuariqueUbicacionTab";
import { HuariqueHorarioTab } from "./tabs/HuariqueHorarioTab";
import { HuariqueServiciosTab } from "./tabs/HuariqueServiciosTab";
import { useAppState } from "@/hooks/useAppState";

export const HuariqueInfoContainer = () => {
  const {
    form,
    update,
    save,
    loading,
    status,
    isValidByTab,
    quickSave
  } = useHuariqueInfoForm();

  const {
    activeInfoTab,
  } = useAppState();

  return (
    <div className="w-full space-y-10">
      <HuariqueWizardProgress />

      <HuariqueHeader
        title="Información del Huarique"
        description="Completa esta información para poder publicar tu huarique"
        status={status}
      />

      <HuariqueTabs />

      <div className="bg-white rounded-3xl p-6 space-y-6">

        {activeInfoTab === "info" && (
          <HuariqueInfoTab form={form} onChange={update} />
        )}

        {activeInfoTab === "ubicacion" && (
          <HuariqueUbicacionTab form={form} onChange={update} />
        )}

        {activeInfoTab === "horario" && (
          <HuariqueHorarioTab form={form} onChange={update} />
        )}

        {activeInfoTab === "servicios" && (
          <HuariqueServiciosTab form={form} onChange={update} />
        )}
      </div>

      <HuariqueWizardActions
        loading={loading}
        isValidByTab={isValidByTab}
        save={save}
        quickSave={quickSave}
      />
    </div>
  );
};
