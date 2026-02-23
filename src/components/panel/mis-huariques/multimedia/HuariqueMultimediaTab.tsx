// import type { HuariqueImagenesForm } from "@/hooks/panel/mis-huariques/useHuariqueMultimediaForm";
import UploadLogoServicio from "./tabs/UploadLogoServicio";
import UploadPortadaServicio from "./tabs/UploadPortadaServicio";
import UploadGaleriaServicio from "./tabs/UploadGaleriaServicio";
import type { HuariqueMultimediaForm } from "@/hooks/panel/mis-huariques/useHuariqueMultimediaForm";

interface Props {
  form: HuariqueMultimediaForm;
  onLogo: (file: File | null) => void;
  onPortada: (file: File | null) => void;
  onAddGaleria: (file: File) => void;
  onRemoveGaleria: (index: number) => void;
}


export const HuariqueMultimediaTab = ({
  form,
  onLogo,
  onPortada,
  onAddGaleria,
  onRemoveGaleria,
}: Props) => {
  return (
    <div className="space-y-12">

      <UploadLogoServicio
        logo={form.logo}
        onChange={onLogo}
      />

      <UploadPortadaServicio portada={form.portada} onChange={onPortada} />

      <UploadGaleriaServicio
        galeria={form.galeria}
        onAdd={onAddGaleria}
        onRemove={onRemoveGaleria}
      />

    </div>
  );
};
