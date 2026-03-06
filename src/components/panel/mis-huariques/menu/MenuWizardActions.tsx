import { CustomButton } from "@/components/ui/kit/CustomButton";
import { useHuariqueWizard } from "@/hooks/panel/mis-huariques/useHuariqueWizard";
import type { SimpleWizardActionsProps } from "@/interfaces/panel/mis-huariques/IHuarique";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppState } from "@/hooks/useAppState";

// Tipos del wizard
type WizardReturn = ReturnType<typeof useHuariqueWizard>;
type HuariqueStep = Parameters<WizardReturn["getNextStep"]>[0];

export const MenuWizardActions = ({
  loading,
  save,
}: SimpleWizardActionsProps) => {

  const wizard = useHuariqueWizard();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { service } = useAppState();

  const hasMenu = (service?.menu?.length ?? 0) > 0;

  const HUARIQUE_STEPS: HuariqueStep[] = hasMenu
    ? [
        "empresa",
        "info",
        "multimedia",
        "menu",
        "promociones",
        "publicacion",
      ]
    : [
        "empresa",
        "info",
        "multimedia",
        "menu",
        "publicacion",
      ];

  const rawStep = pathname.split("/").at(-1);

  if (!rawStep || !HUARIQUE_STEPS.includes(rawStep as HuariqueStep)) {
    return null;
  }

  const step = rawStep as HuariqueStep;

  const prevStep = wizard.getPrevStep(step);
  const nextStep = wizard.getNextStep(step);

  const handlePrev = () => {
    if (prevStep) {
      navigate(`/panel/mi-huarique/${prevStep}`);
    }
  };

  const handleNext = async () => {

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