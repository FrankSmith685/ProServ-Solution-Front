import type { CuentaVinculada } from "@/interfaces/panel/mis-datos/ISeguridad";
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
