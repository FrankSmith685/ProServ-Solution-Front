import { HuariqueWizardProgress } from "@/components/panel/mis-huariques/HuariqueWizardProgress";
import { HuariqueHeader } from "../HuariqueHeader";
import { HuariqueMultimediaTab } from "./HuariqueMultimediaTab";
import { useHuariqueMultimediaForm } from "@/hooks/panel/mis-huariques/useHuariqueMultimediaForm";
import { MultimediaWizardActions } from "./MultimediaWizardActions";

export const HuariqueMultimediaContainer = () => {
  const {
    form,
    loading,
    updateLogo,
    updatePortada,
    addGaleria,
    removeGaleria,
    save,
    status,
    isValid,
  } = useHuariqueMultimediaForm();

  return (
    <div className="w-full space-y-10">
      <HuariqueWizardProgress />

      <HuariqueHeader
        title="Multimedia del Huarique"
        description="Sube imágenes, audio y otros recursos multimedia que representen tu servicio y atraigan a los clientes."
        status={status}
      />

      <div className="bg-white rounded-3xl p-6 space-y-6">
        <HuariqueMultimediaTab
          form={form}
          onLogo={updateLogo}
          onPortada={updatePortada}
          onAddGaleria={addGaleria}
          onRemoveGaleria={removeGaleria}
        />
      </div>

      <MultimediaWizardActions
        loading={loading}
        isValid={isValid}
        save={save}
      />
    </div>
  );
};
