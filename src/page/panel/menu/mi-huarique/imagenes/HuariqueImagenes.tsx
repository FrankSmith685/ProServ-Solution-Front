import { HuariqueWizardProgress } from "@/components/panel/mis-huariques/HuariqueWizardProgress";

export const HuariqueImagenesPage = () => {
  return (
    <div className="space-y-6">
      <HuariqueWizardProgress/>
      <h1 className="text-xl font-semibold">Imágenes del Huarique</h1>

      <section>
        <h2 className="font-medium mb-2">Imagen principal *</h2>
        <input type="file" />
      </section>

      <section>
        <h2 className="font-medium mb-2">Galería</h2>
        <input type="file" multiple />
      </section>
    </div>
  );
};
