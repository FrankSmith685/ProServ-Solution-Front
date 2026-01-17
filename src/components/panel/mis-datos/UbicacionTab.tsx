/* eslint-disable react-hooks/set-state-in-effect */
import { type FC, useEffect, useState } from "react";
import type { SelectChangeEvent } from "@mui/material";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { FaMapMarkedAlt } from "react-icons/fa";
import { useUbigeo } from "@/hooks/useUbigeo";
import type { UbicacionTabProps } from "@/interfaces/panel/mis-datos/IMisDatos";

export const UbicacionTab: FC<UbicacionTabProps> = ({
  departamento,
  provincia,
  distrito,
  onChange,
}) => {
  const { getDepartamentos, getProvincias, getDistritos } = useUbigeo();

  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<string[]>([]);

  useEffect(() => {
    getDepartamentos().then(setDepartamentos);
  }, [getDepartamentos]);

  useEffect(() => {
    if (!departamento) {
      setProvincias([]);
      setDistritos([]);
      return;
    }

    getProvincias(departamento).then(setProvincias);
  }, [departamento, getProvincias]);

  useEffect(() => {
    if (!departamento || !provincia) {
      setDistritos([]);
      return;
    }

    getDistritos(departamento, provincia).then(setDistritos);
  }, [departamento, provincia, getDistritos]);


 const handleDepartamento = async (
    event: SelectChangeEvent<string | number>
  ) => {
    const dep = String(event.target.value);

    const provincias = await getProvincias(dep);
    const firstProvincia = provincias?.[0] ?? "";

    let firstDistrito = "";
    if (firstProvincia) {
      const distritos = await getDistritos(dep, firstProvincia);
      firstDistrito = distritos?.[0] ?? "";
    }

    onChange({
      departamento: dep,
      provincia: firstProvincia,
      distrito: firstDistrito,
    });
  };


  const handleProvincia = async (
    event: SelectChangeEvent<string | number>
  ) => {
    const prov = String(event.target.value);

    let firstDistrito = "";
    if (departamento) {
      const distritos = await getDistritos(departamento, prov);
      firstDistrito = distritos?.[0] ?? "";
    }

    onChange({
      provincia: prov,
      distrito: firstDistrito,
    });
  };

  const handleDistrito = (
    event: SelectChangeEvent<string | number>
  ) => {
    onChange({ distrito: String(event.target.value) });
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-secondary">
          <FaMapMarkedAlt className="text-primary" />
          <span>Ubicación</span>
        </div>

        <CustomSelected
          label="Departamento"
          value={departamento}
          onChange={handleDepartamento}
          options={departamentos.map(d => ({
            value: d,
            label: d,
          }))}
          fullWidth
        />

        <CustomSelected
          label="Provincia"
          value={provincia}
          onChange={handleProvincia}
          options={provincias.map(p => ({
            value: p,
            label: p,
          }))}
          disabled={!departamento}
          fullWidth
        />

        <CustomSelected
          label="Distrito"
          value={distrito}
          onChange={handleDistrito}
          options={distritos.map(d => ({
            value: d,
            label: d,
          }))}
          disabled={!provincia}
          fullWidth
        />
      </section>
    </div>
  );
};
