import { api } from "@/api/apiConfig";
import { handleApiError } from "@/api/apiError";
import { useCallback } from "react";

import type {
  UseUbigeo,
  Departamento,
  Provincia,
  Distrito,
  UbigeoByCoords,
  UbigeoCoords,
  AddressSearchResult,
  UbigeoByCodigo,
} from "@/interfaces/hook/IUseUbigeo";

export const useUbigeo = (): UseUbigeo => {

  const getDepartamentos = useCallback(async (): Promise<Departamento[]> => {
    try {
      const res = await api.get("/ubigeos/departamentos");
      return res.data.data ?? [];
    } catch (error) {
      console.error(handleApiError(error).message);
      return [];
    }
  }, []);

  const getProvincias = useCallback(
    async (departamento: string): Promise<Provincia[]> => {
      try {
        const res = await api.get(`/ubigeos/provincias/${departamento}`);
        return res.data.data ?? [];
      } catch (error) {
        console.error(handleApiError(error).message);
        return [];
      }
    },
    []
  );

  const getDistritos = useCallback(
    async (
      departamento: string,
      provincia: string
    ): Promise<Distrito[]> => {
      try {
        const res = await api.get(
          `/ubigeos/distritos/${departamento}/${provincia}`
        );
        return res.data.data ?? [];
      } catch (error) {
        console.error(handleApiError(error).message);
        return [];
      }
    },
    []
  );

  const getUbigeoByCoords = async (
    lat: number,
    lng: number
  ): Promise<UbigeoByCoords | null> => {
    try {
      const res = await api.get(
        `/ubigeos/obtener-ubigeo-por-coordenadas`,
        { params: { lat, lng } }
      );
      return res.data.data ?? null;
    } catch (error) {
      console.error(handleApiError(error).message);
      return null;
    }
  };

  const getCoordsByUbigeo = async (
    dep: string,
    prov: string,
    dist: string
  ): Promise<UbigeoCoords | null> => {
    try {
      const res = await api.get(
        `/ubigeos/obtener-coordenadas-por-ubigeo`,
        { params: { dep, prov, dist } }
      );
      return res.data.data ?? null;
    } catch (error) {
      console.error(handleApiError(error).message);
      return null;
    }
  };

  const getCodUbigeo = async (
    dep: string,
    prov: string,
    dist: string
  ): Promise<string | null> => {
    try {
      const res = await api.get(
        `/ubigeos/obtener-cod-ubigeo`,
        { params: { dep, prov, dist } }
      );
      return res.data.data?.cod_ubigeo ?? null;
    } catch (error) {
      console.error(handleApiError(error).message);
      return null;
    }
  };

  const getUbigeoByCodigo = async (
    codigo: string
  ): Promise<UbigeoByCodigo | null> => {
    try {
      const res = await api.get(
        `/ubigeos/obtener-ubigeo-por-codigo`,
        { params: { codigo } }
      );
      return res.data.data?.cod_ubigeo ?? null;
    } catch (error) {
      console.error(handleApiError(error).message);
      return null;
    }
  };

  const searchAddress = async (
    query: string,
    dep: string,
    dist: string
  ): Promise<AddressSearchResult[]> => {
    try {
      const res = await api.get(`/ubigeos/buscar-direcciones`, {
        params: { query, dep, dist },
      });
      return res.data.data ?? [];
    } catch (error) {
      console.error(handleApiError(error).message);
      return [];
    }
  };

  const getAddressByCoords = async (
    lat: number,
    lng: number
    ): Promise<string | null> => {
    try {
        const res = await api.get(
        `/ubigeos/obtener-direccion-por-coordenadas`,
        { params: { lat, lng } }
        );

        return res.data.data?.direccion ?? null;
    } catch (error) {
        console.error(handleApiError(error).message);
        return null;
    }
  };


  return {
    getDepartamentos,
    getProvincias,
    getDistritos,
    getUbigeoByCoords,
    getCoordsByUbigeo,
    getCodUbigeo,
    getUbigeoByCodigo,
    searchAddress,
    getAddressByCoords
  };
};
