import { CustomButton } from "@/components/ui/kit/CustomButton";
import { validateHuariqueStep } from "@/helpers/panel/mi-huarique/validateHuariqueStep";
import { useHuariqueWizard } from "@/hooks/panel/mis-huariques/useHuariqueWizard";
import { useAppState } from "@/hooks/useAppState";
import type { EmpresaTab } from "@/interfaces/panel/mis-huariques/IHuarique";
import type { HuariqueWizardActionsProps } from "@/interfaces/panel/mis-huariques/IHuariqueEmpresa";
import { useLocation, useNavigate } from "react-router-dom";

// Tipos derivados del wizard
type WizardReturn = ReturnType<typeof useHuariqueWizard>;
type HuariqueStep = Parameters<WizardReturn["getNextStep"]>[0];
// Pasos del wizard de huarique
const HUARIQUE_STEPS = [
  "empresa",
  "info",
  "multimedia",
  "menu",
  "promociones",
  "publicacion",
] as const satisfies readonly HuariqueStep[];
// Valida si el paso es válido
const isHuariqueStep = (value: string): value is HuariqueStep =>
  HUARIQUE_STEPS.includes(value as HuariqueStep);

// Orden de tabs de empresa
const TAB_ORDER: readonly EmpresaTab[] = ["info", "ubicacion"];
// Acciones del wizard de empresa
export const EmpresaWizardActions = ({
  loading,
  isValidByTab,
  save,
}: HuariqueWizardActionsProps) => {
  // Wizard principal
  const wizard = useHuariqueWizard();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  // Estado global del wizard
  const {
    serviceSteep,
    setActiveInfoTab,
    serviceSteepEmpresa,
    setServiceSteepEmpresa,
    activeEmpresaTab,
    setActiveEmpresaTab,
    setWizardStack,
    wizardStack,
    user
  } = useAppState();
  // Paso actual desde la URL
  let rawStep = pathname.split("/").at(-1);
  rawStep = rawStep === "empresa" ? "info" : "empresa";
  // Paso inválido
  if (!rawStep || !isHuariqueStep(rawStep)) {
    return null;
  }
  const step = rawStep;
  const isInfoStep = step === "info";

  // Valida si se puede continuar
  const canContinue =
    isInfoStep ? true : validateHuariqueStep(step, serviceSteep, user?.profileType ?? 'empresa');
  // Pasos anterior y siguiente
  const prevStep = wizard.getPrevStep(step);
  const nextStep = wizard.getNextStep(step);
  // Estado del tab actual
  const currentIndex = TAB_ORDER.indexOf(activeEmpresaTab);
  const isLastInfoTab =
    isInfoStep && currentIndex === TAB_ORDER.length - 1;
  // Validación del tab actual
  const isCurrentTabValid = isInfoStep
    ? isValidByTab[activeEmpresaTab]
    : canContinue;
  // Acción: volver
  const handlePrev = () => {
    if (isInfoStep && currentIndex > 0) {
      setActiveEmpresaTab(TAB_ORDER[currentIndex - 1]);
      return;
    }

    if (prevStep) {
      navigate(`/panel/mi-huarique/${prevStep}`);
    }
  };
  // Acción: continuar
  const handleNext = async () => {
    if (isInfoStep) {
      if (!isCurrentTabValid) return;

      const nextIndex = currentIndex + 1;
      
      if (nextIndex < TAB_ORDER.length) {
        setActiveEmpresaTab(TAB_ORDER[nextIndex]);

        if (serviceSteepEmpresa < nextIndex) {
          setServiceSteepEmpresa(nextIndex);
        }

        return;
      }
      // Guarda y continúa al wizard principal
      if (save) {
        await save();
        setWizardStack([
          ...wizardStack,
          { view: "empresa", tab: activeEmpresaTab },
        ]);
      }
      // Avanza al siguiente paso del wizard  
      navigate("/panel/mi-huarique/info");
      setActiveInfoTab("info");
      return;
    }

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
        disabled={
          isInfoStep
            ? currentIndex === 0
            : !prevStep
        }
        onClick={handlePrev}
      />

      <CustomButton
        text={
          isInfoStep && !isLastInfoTab
            ? "Siguiente sección"
            : "Siguiente"
        }
        variant="primary"
        fullWidth
        size="md"
        fontSize="14px"
        loading={serviceSteep === 0 && loading}
        disabled={
          serviceSteep === 0
            ? !isCurrentTabValid || loading
            : !canContinue || !nextStep
        }
        onClick={handleNext}
      />
    </div>
  );
};
