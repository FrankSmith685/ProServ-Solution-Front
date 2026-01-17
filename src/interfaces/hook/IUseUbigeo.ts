export type Departamento = string;
export type Provincia = string;
export type Distrito = string;

export interface UbigeoCoords {
  lat: number;
  lng: number;
}

export interface UbigeoByCoords {
  dep: string;
  prov: string;
  dist: string;
  direccion: string;
}

export interface UbigeoByCodigo {
  departamento: string;
  provincia: string;
  distrito: string;
}

export interface AddressSearchResult {
  label: string;
  lat: number;
  lng: number;
}

export interface AddressByCoords {
  direccion: string;
}


export interface UseUbigeo {
  getDepartamentos(): Promise<Departamento[]>;
  getProvincias(departamento: string): Promise<Provincia[]>;
  getDistritos(departamento: string, provincia: string): Promise<Distrito[]>;

  getUbigeoByCoords(lat: number, lng: number): Promise<UbigeoByCoords | null>;
  getCoordsByUbigeo(
    dep: string,
    prov: string,
    dist: string
  ): Promise<UbigeoCoords | null>;

  getCodUbigeo(
    dep: string,
    prov: string,
    dist: string
  ): Promise<string | null>;

  getUbigeoByCodigo(
    codigo: string
  ): Promise<UbigeoByCodigo | null>;

  searchAddress(
    query: string,
    dep: string,
    dist: string
  ): Promise<AddressSearchResult[]>;

  getAddressByCoords(
    lat: number,
    lng: number
  ): Promise<string | null>;
}
