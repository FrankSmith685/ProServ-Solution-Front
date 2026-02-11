/* eslint-disable react-hooks/exhaustive-deps */
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { HuariqueMapPicker } from "../../HuariqueMapPicker";
import { useUbigeo } from "@/hooks/useUbigeo";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "@/hooks/useLocationHooks/useLocation";
import type { AddressOptionEmpresa, HuariqueEmpresaFormProps, SelectOptionEmpresa } from "@/interfaces/panel/mis-huariques/IHuariqueEmpresa";

// Tab que maneja la ubicación de la empresa: departamento, provincia, distrito, dirección y coordenadas en el mapa
export const EmpresaUbicacionTab: React.FC<HuariqueEmpresaFormProps> = ({ form, onChange }) => {
  // Coordenadas actuales obtenidas desde el hook de ubicación
  const { lat, lng } = useLocation();
  // Funciones para manejar ubigeo, direcciones y coordenadas
  const {
    getUbigeoByCoords,
    getDepartamentos,
    getProvincias,
    getDistritos,
    getCoordsByUbigeo,
    getAddressByCoords,
    searchAddress,
  } = useUbigeo();
  // Listas de opciones para selects
  const [departamentos, setDepartamentos] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<string[]>([]);
  // Opciones de autocompletado para direcciones
  const [addressOptions, setAddressOptions] = useState<AddressOptionEmpresa[]>([]);
  // Indica si se está buscando una dirección
  const [isSearchingAddress, setIsSearchingAddress] = useState<boolean>(false);
  // Evita volver a obtener el ubigeo por coordenadas más de una vez
  const hasFetchedUbigeo = useRef<boolean>(false);
  // Evita sobrescribir coordenadas iniciales
  const hasSetInitialCoords = useRef<boolean>(false);
  // Controla la inicialización del ubigeo (deps/prov/dist)
  const hasInitializedUbigeo = useRef<boolean>(false);
  // Identifica si la dirección fue escrita manualmente
  const isManualAddressChange = useRef<boolean>(false);
  // Asigna coordenadas iniciales al formulario si aún no existen
  useEffect(() => {
    if (!lat || !lng) return;
    if (hasSetInitialCoords.current) return;
    if (form.lat && form.lng) return;

    hasSetInitialCoords.current = true;
    onChange("lat", lat);
    onChange("lng", lng);
  }, [lat, lng]);
  // Obtiene ubigeo (dep/prov/dist/dirección) a partir de coordenadas
  useEffect(() => {
    if (!lat || !lng) return;
    if (hasFetchedUbigeo.current) return;
    hasFetchedUbigeo.current = true;
    const fetchUbigeo = async () => {
      try {
        const ubigeo = await getUbigeoByCoords(lat, lng);
        if (!ubigeo) return;

        onChange("departamento", ubigeo.dep);
        onChange("provincia", ubigeo.prov);
        onChange("distrito", ubigeo.dist);
        onChange("direccion", ubigeo.direccion ?? "");
        isManualAddressChange.current = false;
      } catch (err) {
        console.warn("No se pudo obtener el ubigeo:", err);
      }
    };
    fetchUbigeo();
  }, [lat, lng]);
// Carga inicial de departamentos
  useEffect(() => {
    getDepartamentos().then(setDepartamentos);
  }, [getDepartamentos]);
  // Carga provincias cuando se selecciona un departamento
  useEffect(() => {
    if (hasInitializedUbigeo.current) return;
    if (!form.departamento) return;
    getProvincias(form.departamento).then(setProvincias);
  }, [form.departamento]);
  // Carga distritos cuando se selecciona una provincia
  useEffect(() => {
    if (hasInitializedUbigeo.current) return;
    if (!form.departamento || !form.provincia) return;
    getDistritos(form.departamento, form.provincia).then(dists => {
      setDistritos(dists);
      hasInitializedUbigeo.current = true;
    });
  }, [form.departamento, form.provincia]);
  // Búsqueda de direcciones cuando el usuario escribe manualmente
  useEffect(() => {
    if (!isManualAddressChange.current) return;
    if (!form.direccion || form.direccion.length < 4) {
      setAddressOptions([]);
      return;
    }
    if (!form.departamento || !form.distrito) return;
    if (form.direccion.includes("+")) return;
    const timeout = setTimeout(async () => {
      setIsSearchingAddress(true);
      const results = await searchAddress(
        form.direccion,
        form.departamento,
        form.distrito
      );
      setAddressOptions(results);
      setIsSearchingAddress(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [form.direccion]);
  // Limpia opciones cuando deja de ser cambio manual
  useEffect(() => {
    if (!isManualAddressChange.current) {
      setAddressOptions([]);
    }
  }, [isManualAddressChange.current]);
  //Opciones para Selected 
  const departamentoOptions: SelectOptionEmpresa[] = departamentos.map(dep => ({
    value: dep,
    label: dep,
  }));

  const provinciaOptions: SelectOptionEmpresa[] = provincias.map(prov => ({
    value: prov,
    label: prov,
  }));

  const distritoOptions: SelectOptionEmpresa[] = distritos.map(dist => ({
    value: dist,
    label: dist,
  }));

 // Cambio de departamento
  const handleDepartamentoChange = async (dep: string) => {
    setProvincias([]);
    setDistritos([]);
    hasInitializedUbigeo.current = false;
    onChange("departamento", dep);
    onChange("provincia", "");
    onChange("distrito", "");
    const provs = await getProvincias(dep);
    setProvincias(provs);
    if (!provs.length) return;
    const firstProv = provs[0];
    onChange("provincia", firstProv);
    const dists = await getDistritos(dep, firstProv);
    setDistritos(dists);
    if (!dists.length) return;
    const firstDist = dists[0];
    onChange("distrito", firstDist);
    const coords = await getCoordsByUbigeo(dep, firstProv, firstDist);
    if (!coords) return;
    onChange("lat", coords.lat);
    onChange("lng", coords.lng);
    const address = await getAddressByCoords(coords.lat, coords.lng);
    if (address) onChange("direccion", address);
  };
  // Cambio de provincia
  const handleProvinciaChange = async (prov: string) => {
    setDistritos([]);
    onChange("provincia", prov);
    onChange("distrito", "");
    const dists = await getDistritos(form.departamento, prov);
    setDistritos(dists);
    if (!dists.length) return;
    const firstDist = dists[0];
    onChange("distrito", firstDist);
    const coords = await getCoordsByUbigeo(
      form.departamento,
      prov,
      firstDist
    );
    if (!coords) return;
    onChange("lat", coords.lat);
    onChange("lng", coords.lng);
    const address = await getAddressByCoords(coords.lat, coords.lng);
    if (address) onChange("direccion", address);
  };
  // Cambio de distrito
  const handleDistritoChange = async (dist: string) => {
    onChange("distrito", dist);
    if (!form.departamento || !form.provincia) return;
    const coords = await getCoordsByUbigeo(
      form.departamento,
      form.provincia,
      dist
    );
    if (!coords) return;

    onChange("lat", coords.lat);
    onChange("lng", coords.lng);

    const address = await getAddressByCoords(coords.lat, coords.lng);
    if (address) onChange("direccion", address);
  };
  // Sincroniza todo el ubigeo cuando se mueve el marcador del mapa
  const syncUbigeoFromCoords = async (lat: number, lng: number) => {
    const ubigeo = await getUbigeoByCoords(lat, lng);
    if (!ubigeo) return;

    hasInitializedUbigeo.current = false;
    setProvincias([]);
    setDistritos([]);

    onChange("departamento", ubigeo.dep);
    onChange("provincia", ubigeo.prov);
    onChange("distrito", ubigeo.dist);
    onChange("direccion", ubigeo.direccion ?? "");

    const provs = await getProvincias(ubigeo.dep);
    setProvincias(provs);

    const dists = await getDistritos(ubigeo.dep, ubigeo.prov);
    setDistritos(dists);

    hasInitializedUbigeo.current = true;
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="space-y-1">
        <h3 className="text-sm md:text-base font-semibold text-secondary">
          Ubicación
        </h3>
        <p className="text-xs md:text-sm text-gray-600">
          Define la ubicación de la empresa que brindará los servicios para asociarlos correctamente y mostrarlos en el mapa.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-6 space-y-4 md:space-y-5">
        <p className="text-xs md:text-sm text-gray-600">
          Indica la dirección donde opera la empresa. Esta se usará como referencia para tus servicios.
        </p>
        <p className="text-[11px] md:text-xs text-gray-500">
          • Asegúrate de que la dirección y el marcador correspondan a la ubicación real de la empresa
        </p>

        {/* UBIGEO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-2">
            <CustomSelected
              label="Departamento"
              placeholder="Seleccione un departamento"
              value={form.departamento}
              options={departamentoOptions}
              fullWidth
              onChange={e =>{
                handleDepartamentoChange(String(e.target.value))
              }
                
              }
            />
            <p className="text-[11px] text-gray-500">
              • Región o departamento
            </p>
          </div>

          <div className="space-y-2">
            <CustomSelected
              label="Provincia"
              placeholder="Seleccione una provincia"
              value={form.provincia}
              options={provinciaOptions}
              disabled={!form.departamento}
              fullWidth
              onChange={e =>{
                handleProvinciaChange(String(e.target.value))
              }
              }
            />
            {!form.departamento ? (
              <p className="text-[11px] text-gray-400">
                • Selecciona un departamento
              </p>
            ) : (
              <p className="text-[11px] text-gray-500">
                • Provincia correspondiente
              </p>
            )}
          </div>

          <div className="space-y-2 md:col-span-2">
            <CustomSelected
              label="Distrito"
              placeholder="Seleccione un distrito"
              value={form.distrito}
              options={distritoOptions}
              disabled={!form.provincia}
              fullWidth
              onChange={e =>{
                handleDistritoChange(String(e.target.value))
              }
                
              }
            />
            {!form.provincia ? (
              <p className="text-[11px] text-gray-400">
                • Selecciona una provincia
              </p>
            ) : (
              <p className="text-[11px] text-gray-500">
                • Distrito donde se ubica
              </p>
            )}
          </div>
        </div>

        {/* DIRECCIÓN */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pt-2">
          <div className="space-y-2 relative">
            <CustomInput
              label="Dirección exacta"
              value={form.direccion}
              onChange={e => {
                isManualAddressChange.current = true;
                onChange("direccion", e.target.value);
              }}
              fullWidth
              required
            />

            {isSearchingAddress && (
              <p className="text-xs text-gray-400">
                Buscando direcciones…
              </p>
            )}

            {addressOptions.length > 0 && (
              <div className="absolute z-50 w-full bg-white border rounded-xl shadow-md max-h-56 overflow-auto">
                {addressOptions.map((opt, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => {
                      onChange("direccion", opt.label);
                      onChange("lat", opt.lat);
                      onChange("lng", opt.lng);
                      setAddressOptions([]);
                      isManualAddressChange.current = false;
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            <p className="text-[11px] text-gray-500">
              • Calle, avenida, número o referencia clara
            </p>
          </div>

          <div className="space-y-2">
            <CustomInput
              label="Referencia"
              value={form.referencia}
              onChange={e => onChange("referencia", e.target.value)}
              fullWidth
            />
            <p className="text-[11px] text-gray-500">
              • Opcional (ej: frente al mercado, al costado de…)
            </p>
          </div>
        </div>
      </div>

      {/* MAPA */}
      <div className="w-full">
        <HuariqueMapPicker
          lat={form.lat}
          lng={form.lng}
          subcategoria={null}
          onChange={async (lat, lng) => {
            onChange("lat", lat);
            onChange("lng", lng);
            isManualAddressChange.current = false;
            await syncUbigeoFromCoords(lat, lng);
          }}
        />
      </div>
    </div>
  );
};
