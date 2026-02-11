/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, type FC } from "react";
import { HuariqueWizardProgress } from "@/components/panel/mis-huariques/HuariqueWizardProgress";
import { HuariqueHeader } from "../HuariqueHeader";
import { EmpresaInfoTab } from "./tabs/EmpresaInfoTab";
import { EmpresaUbicacionTab } from "./tabs/EmpresaUbicacionTab";
import { EmpresaTabs } from "./EmpresaTabs";
import { EmpresaWizardActions } from "./EmpresaWizardActions";
import { useAppState } from "@/hooks/useAppState";
import { useHuariqueEmpresaForm } from "@/hooks/panel/mis-huariques/useHuariqueEmpresaForm";
import type { EmpresaTab } from "@/interfaces/panel/mis-huariques/IHuarique";

// Contenedor principal del wizard de empresa
export const EmpresaInfoContainer: FC = () => {
  // Estado y acciones del formulario de empresa  
  const {
    form,
    update,
    save,
    loading,
    status,
    isValidByTab,
  } = useHuariqueEmpresaForm();
  // Estado global del wizard
  const {
    serviceSteepEmpresa,
    activeEmpresaTab,
    setActiveEmpresaTab,
  } = useAppState();
  // Sincroniza el tab activo con el paso actual
  useEffect(() => {
    const tabMap: EmpresaTab[] = [
      "info",
      "ubicacion",
    ];
    setActiveEmpresaTab(tabMap[serviceSteepEmpresa] ?? "info");
  }, []);

  return (
    <div className="w-full space-y-10">
      <HuariqueWizardProgress />

      <HuariqueHeader
        title="Información de la Empresa"
        description="Completa esta información para continuar con la publicación de tu huarique"
        status={status}
      />

      <EmpresaTabs />

      <div className="bg-white rounded-3xl p-6 space-y-6">
        {activeEmpresaTab === "info" && (
          <EmpresaInfoTab
            form={form}
            onChange={update}
          />
        )}

        {activeEmpresaTab === "ubicacion" && (
          <EmpresaUbicacionTab
            form={form}
            onChange={update}
          />
        )}
      </div>

      <EmpresaWizardActions
        loading={loading}
        isValidByTab={isValidByTab}
        save={save}
      />
    </div>
  );
};
