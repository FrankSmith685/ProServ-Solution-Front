import { CustomButton } from "@/components/ui/kit/CustomButton";
import { useHuariqueWizard } from "@/hooks/panel/mis-huariques/useHuariqueWizard";
import type { SimpleWizardActionsProps } from "@/interfaces/panel/mis-huariques/IHuarique";
import { useLocation, useNavigate } from "react-router-dom";

// Tipos del wizard
type WizardReturn = ReturnType<typeof useHuariqueWizard>;
type HuariqueStep = Parameters<WizardReturn["getNextStep"]>[0];

// Steps válidos
const HUARIQUE_STEPS = [
  "empresa",
  "info",
  "multimedia",
  "menu",
  "promociones",
  "publicacion",
] as const satisfies readonly HuariqueStep[];

const isHuariqueStep = (value: string): value is HuariqueStep =>
  HUARIQUE_STEPS.includes(value as HuariqueStep);

export const MenuWizardActions = ({
  loading,
  save,
}: SimpleWizardActionsProps) => {
  const wizard = useHuariqueWizard();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const rawStep = pathname.split("/").at(-1);

  if (!rawStep || !isHuariqueStep(rawStep)) return null;

  const step = rawStep;

  const prevStep = wizard.getPrevStep(step);
  const nextStep = wizard.getNextStep(step);

  const handlePrev = () => {
    if (prevStep) {
      navigate(`/panel/mi-huarique/${prevStep}`);
    }
  };

  const handleNext = async () => {
    // en el futuro aquí validarás que haya platos
    if (save) await save();

    if (nextStep) {
      navigate(`/panel/mi-huarique/${nextStep}`);
    }
  };

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
      <CustomButton
        text="Anterior"
        variant="secondary"
        fullWidth
        size="md"
        fontSize="14px"
        className="sm:w-auto"
        disabled={!prevStep}
        onClick={handlePrev}
      />

      <CustomButton
        text="Siguiente"
        variant="primary"
        fullWidth
        size="md"
        fontSize="14px"
        loading={loading}
        disabled={loading}
        onClick={handleNext}
      />
    </div>
  );
};