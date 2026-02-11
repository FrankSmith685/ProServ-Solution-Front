import { CustomButton } from "@/components/ui/kit/CustomButton";
import { validateHuariqueStep } from "@/helpers/panel/mi-huarique/validateHuariqueStep";
import { useHuariqueWizard } from "@/hooks/panel/mis-huariques/useHuariqueWizard";
import { useAppState } from "@/hooks/useAppState";
import type { HuariqueStep, HuariqueTab, HuariqueWizardActionsProps } from "@/interfaces/panel/mis-huariques/IHuarique";
import { useLocation, useNavigate } from "react-router-dom";
// Pasos del wizard principal
const HUARIQUE_STEPS: readonly HuariqueStep[] = [
  "info",
  "imagenes",
  "menu",
  "promociones",
  "publicacion"
];
// Valida si el paso existe en el wizard
const isHuariqueStep = (value: string): value is HuariqueStep => {
  return HUARIQUE_STEPS.includes(value as HuariqueStep);
};
// Acciones del wizard de Huarique
export const HuariqueWizardActions = ({ loading, isValidByTab, save,quickSave}: HuariqueWizardActionsProps) => {
  // Wizard principal
  const wizard = useHuariqueWizard();
  // Estado global
  const {
    serviceSteep, 
    serviceSteepInfo, 
    setServiceSteepInfo, 
    activeInfoTab, 
    setActiveInfoTab,
    wizardStack,
    setWizardStack,
    setActiveEmpresaTab,
    user
  } = useAppState();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const rawStep = pathname.split("/").at(-1);

  if (!rawStep || !isHuariqueStep(rawStep)) {
    return null;
  }

  const step = rawStep;
  // Valida si puede continuar
  const canContinue =
    step === "info"
      ? true
      : validateHuariqueStep(step, serviceSteep);


  const prevStep = wizard.getPrevStep(step);
  const nextStep = wizard.getNextStep(step);

  const isInfoStep = step === "info";

  // Orden de tabs internos
  const TAB_ORDER: HuariqueTab[] = [
    "info",
    "ubicacion",
    "horario",
    "servicios",
  ];

  const currentIndex = TAB_ORDER.indexOf(activeInfoTab);

  const isCurrentTabValid = isInfoStep
    ? isValidByTab[activeInfoTab]
    : canContinue;

  const isLastInfoTab =
    isInfoStep && currentIndex === TAB_ORDER.length - 1;

  // Acción volver
  const onBack = () => {
    if (isInfoStep && currentIndex > 0) {
      setActiveInfoTab(TAB_ORDER[currentIndex - 1]);
      return;
    }
    if (wizardStack.length > 0) {
      const last = wizardStack[wizardStack.length - 1];
      setWizardStack(wizardStack.slice(0, -1));

      if (last.view === "empresa") {
        setActiveEmpresaTab(last.tab);
        navigate("/panel/mi-huarique/empresa");
        return;
      }
      if (last.view === "info") {
        setActiveInfoTab(last.tab);
        navigate("/panel/mi-huarique/info");
        return;
      }
    }
    if (prevStep) {
      navigate(`/panel/mi-huarique/${prevStep}`);
    }
  };


  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
      <CustomButton
        text="Anterior"
        variant="secondary"
        onClick={onBack}
        disabled={
          isInfoStep
            ? currentIndex === 0 && !user?.tieneEmpresa
            : !prevStep
        }
        fullWidth
        fontSize="14px"
        className="sm:w-auto"
        size="md"
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
        loading={loading}
        disabled={
          !isCurrentTabValid || loading
        }
        onClick={async () => {
          if (isInfoStep) {
            if (!isCurrentTabValid) return;

            const nextIndex = currentIndex + 1;

            console.log(nextIndex);
            console.log(TAB_ORDER.length);

            if (nextIndex < TAB_ORDER.length) {
              console.log(TAB_ORDER[nextIndex]);
              setActiveInfoTab(TAB_ORDER[nextIndex]);

              if (serviceSteepInfo < nextIndex) {
                setServiceSteepInfo(nextIndex);
              }

              if (quickSave) {
              await quickSave();
            }

              return;
            }
            if (save) {
              await save();
            }

            navigate("/panel/mi-huarique/imagenes");
            return;
          }
          if (nextStep) {
            navigate(`/panel/mi-huarique/${nextStep}`);
          }
        }}
      />
    </div>
  );
};
