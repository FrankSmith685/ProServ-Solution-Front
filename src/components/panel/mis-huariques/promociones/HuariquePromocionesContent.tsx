import { useState } from "react";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomChip } from "@/components/ui/kit/CustomChip";
import { FaPlus, FaEdit, FaTrash, FaBan, FaTag, FaStar, FaCalendarAlt } from "react-icons/fa";
import { PromocionModal } from "./components/PromocionModal";
import type { Promocion, PropsPromocionesContent } from "@/interfaces/panel/mis-huariques/IHuariquePromocion";

export const HuariquePromocionesContent = ({
  promociones,
  loading,
  createPromocion,
  updatePromocion,
  deletePromocion,
  menu,
}: PropsPromocionesContent) => {
  const [editingPromocion, setEditingPromocion] = useState<Promocion | null>(null);
  const [creating, setCreating] = useState<boolean>(false);

  const openCreate = (): void => {
    setCreating(true);
    setEditingPromocion(null);
  };

  const openEdit = (promo: Promocion): void => {
    setEditingPromocion(promo);
    setCreating(false);
  };

  const closeModal = (): void => {
    setCreating(false);
    setEditingPromocion(null);
  };

  const getImageSrc = (imagen: string | File | null): string | undefined => {
    if (!imagen) return undefined;

    if (typeof imagen === "string") {
      return imagen;
    }

    return URL.createObjectURL(imagen);
  };

  if (loading === true) {
    return (
      <div className="bg-white rounded-3xl p-6">
        <p className="text-sm text-gray-500">Cargando promociones...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 space-y-10">
      {!promociones.length && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center space-y-5">
          <h3 className="text-lg font-semibold text-gray-900">
            No tienes promociones creadas
          </h3>

          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Las promociones te ayudan a aumentar ventas y destacar productos estratégicos.
          </p>

          <CustomButton
            text="Crear promoción"
            icon={<FaPlus />}
            variant="primary"
            onClick={openCreate}
          />
        </div>
      )}

      {!!promociones.length && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Promociones
            </h2>
            <p className="text-sm text-gray-500">
              Administra descuentos y campañas activas
            </p>
          </div>

          <CustomButton
            text="Nueva promoción"
            icon={<FaPlus />}
            variant="primary"
            className="w-full sm:w-auto"
            onClick={openCreate}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {promociones.map((promo) => {
          const precioPromo = promo.precioPromo ?? 0;
          const tags = promo.tags ?? [];

          return (
            <div
              key={promo.id}
              className="
                bg-white
                rounded-2xl
                border border-gray-200
                shadow-sm
                hover:shadow-xl
                transition-all duration-300
                overflow-hidden
                flex flex-col
              "
            >
              <div className="relative h-44 bg-gray-100">
                {promo.imagen ? (
                  <img
                    src={getImageSrc(promo.imagen)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                    Sin imagen
                  </div>
                )}

                {!promo.activa && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 text-[11px] rounded-md bg-gray-900 text-white">
                    <FaBan size={10} />
                    Inactiva
                  </div>
                )}

                {promo.tipo === "porcentaje" && (
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 text-[11px] rounded-md bg-red-500 text-white font-semibold">
                    <FaTag size={10} />
                    -{promo.porcentajeDescuento ?? 0}%
                  </div>
                )}

                {promo.destacada && (
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 text-[11px] rounded-md bg-yellow-400 text-black font-semibold">
                    <FaStar size={10} />
                    Destacada
                  </div>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                    {promo.titulo}
                  </h3>

                  {promo.descripcion && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {promo.descripcion}
                    </p>
                  )}

                  {precioPromo > 0 && (
                    <div className="text-lg font-bold text-primary">
                      S/ {precioPromo.toFixed(2)}
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {tags.slice(0, 3).map((tag) => (
                        <CustomChip
                          key={tag}
                          label={tag}
                          size="small"
                          variant="primary-outline"
                          clickable={false}
                        />
                      ))}
                    </div>
                  )}

                  {(promo.fechaInicio || promo.fechaFin) && (
                    <div className="flex items-center gap-1 text-xs text-gray-400 pt-1">
                      <FaCalendarAlt size={12} />
                      {promo.fechaInicio || "∞"} → {promo.fechaFin || "Sin límite"}
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                  <CustomButton
                    iconOnly
                    icon={<FaEdit size={14} />}
                    variant="secondary-outline"
                    onClick={() => openEdit(promo)}
                  />

                  <CustomButton
                    iconOnly
                    icon={<FaTrash size={14} />}
                    variant="warning-outline"
                    onClick={() => deletePromocion(promo.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {(creating || editingPromocion) && (
        <PromocionModal
          open={creating || !!editingPromocion}
          initialData={editingPromocion}
          menu={menu}
          onClose={closeModal}
          onSave={(promo) => {
            if (editingPromocion) {
              updatePromocion(editingPromocion.id, promo);
            } else {
              createPromocion({
                ...promo,
                id: crypto.randomUUID(),
              });
            }
            closeModal();
          }}
        />
      )}
    </div>
  );
};