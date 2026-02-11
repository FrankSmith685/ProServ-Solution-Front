import CustomSimpleMapa from "@/components/ui/map/CustomSimpleMap";
import { getSelectedSubcategoriaImage } from "@/helpers/getCategoria";
import type { PropsMapPicker } from "@/interfaces/panel/mis-huariques/IHuarique";

// Selector de ubicación en el mapa
export const HuariqueMapPicker = ({
  lat,
  lng,
  subcategoria,
  onChange,
}: PropsMapPicker) => {

  const safeLat = lat ?? -12.0464; // Latitud por defecto (Lima)
  const safeLng = lng ?? -77.0428; // Longitud por defecto (Lima)

  const iconUrl = getSelectedSubcategoriaImage(subcategoria); // Ícono según subcategoría

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-secondary">
        Ubicación en el mapa
      </h3>

      <div className="h-64 rounded-xl overflow-hidden border border-gray-300">
        <CustomSimpleMapa
          lat={safeLat}
          lng={safeLng}
          zoom={18}
          customIcon={iconUrl}
          onMove={(newLat, newLng) => {
            onChange(newLat, newLng);
          }}
        />
      </div>

      <p className="text-xs text-gray-500">
        Arrastra el marcador para ajustar la ubicación exacta
      </p>

      <p className="text-xs text-gray-400">
        Lat: {safeLat.toFixed(6)} | Lng: {safeLng.toFixed(6)}
      </p>
    </div>
  );
};
