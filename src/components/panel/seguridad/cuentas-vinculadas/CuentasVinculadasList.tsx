import type { CuentaVinculada } from "@/hooks/panel/mis-datos/seguridad/useCuentasVinculadas";
import { CuentaVinculadaItem } from "./CuentaVinculadaItem";

interface Props {
  cuentas: CuentaVinculada[];
  loadingProveedor: CuentaVinculada["proveedor"] | null;
  onToggle: (proveedor: CuentaVinculada["proveedor"]) => void;
}

export const CuentasVinculadasList = ({
  cuentas,
  loadingProveedor,
  onToggle,
}: Props) => {
  return (
    <section className="space-y-4">
      {cuentas.map(cuenta => (
        <CuentaVinculadaItem
          key={cuenta.proveedor}
          cuenta={cuenta}
          loadingProveedor={loadingProveedor}
          onToggle={onToggle}
        />
      ))}
    </section>
  );
};
