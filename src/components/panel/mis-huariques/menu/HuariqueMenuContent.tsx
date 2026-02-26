import { useState } from "react";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { DishModal } from "./components/DishModal";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";

import type {
  MenuCategoria,
  MenuItem,
  HuariqueMenuContentProps,
  SortableItemProps,
} from "@/interfaces/panel/mis-huariques/IHuariqueMenu";

/* ================= SORTABLE ITEM ================= */

const SortableItem = ({ item, children }: SortableItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {children({ attributes, listeners })}
    </div>
  );
};

/* ============================================================ */

export const HuariqueMenuContent = ({
  categorias,
  loading,
  createCategoria,
  updateCategoria,
  createItem,
  updateItem,
  deleteItem,
  reorderItems,
}: HuariqueMenuContentProps) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6">
        <p className="text-sm text-gray-500">Cargando menú...</p>
      </div>
    );
  }

  const getImageSrc = (imagen: string | File | null): string | undefined => {
    if (!imagen) return undefined;
    if (typeof imagen === "string") return imagen;
    return URL.createObjectURL(imagen);
  };
return (
  <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">

    {/* EMPTY */}
    {!categorias.length && (
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 sm:p-8 text-center space-y-4">
        <h3 className="text-sm sm:text-base font-semibold text-secondary">
          Aún no agregaste tu carta (opcional)
        </h3>

        <p className="text-xs sm:text-sm text-gray-600">
          Puedes continuar sin crear platos. Luego podrás configurarlos desde el panel.
        </p>

        <CustomButton
          text="Crear categoría"
          icon={<FaPlus />}
          fontSize="14px"
          size="md"
          variant="primary"
          onClick={createCategoria}
        />
      </div>
    )}

    {categorias.map((cat: MenuCategoria) => (
      <div
        key={cat.id}
        className="rounded-2xl border border-gray-200 bg-gray-50 p-4 sm:p-6 space-y-5 sm:space-y-6"
      >

        {/* HEADER CATEGORÍA */}
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">

          <div className="space-y-1 w-full md:max-w-sm">
            <CustomInput
              label="Nombre de categoría"
              value={cat.nombre}
              onChange={(e) =>
                updateCategoria(cat.id, { nombre: e.target.value })
              }
              fullWidth
            />
          </div>

          <CustomButton
            text="Agregar plato"
            icon={<FaPlus />}
            fontSize="14px"
            variant="primary"
            size="md"
            className="w-full sm:w-auto"
            onClick={() => {
              setCategoriaActiva(cat.id);
              setEditingItem(null);
            }}
          />
        </div>

        {/* GRID RESPONSIVE */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(event) => {
            const { active, over } = event;
            if (!over || active.id === over.id) return;

            const oldIndex = cat.items.findIndex(i => i.id === active.id);
            const newIndex = cat.items.findIndex(i => i.id === over.id);

            reorderItems(cat.id, arrayMove(cat.items, oldIndex, newIndex));
          }}
        >
          <SortableContext items={cat.items.map(i => i.id)}>

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              2xl:grid-cols-5
              gap-3 sm:gap-4
            ">

              {cat.items.map((item: MenuItem) => (
                <SortableItem key={item.id} item={item}>
                  {({ attributes, listeners }) => (

                    <div className="
                      group
                      bg-white
                      rounded-xl sm:rounded-2xl
                      border border-gray-200
                      overflow-hidden
                      transition
                      hover:shadow-md
                    ">

                      {/* DRAG HANDLE */}
                      <div
                        className="cursor-grab px-3 py-1 text-gray-400 text-[10px] sm:text-xs"
                        {...attributes}
                        {...listeners}
                      >
                        ⋮⋮ arrastrar
                      </div>

                      {/* IMAGEN */}
                      <div className="relative aspect-4/3 sm:aspect-video bg-gray-100">

                        {item.imagen ? (
                          <img
                            src={getImageSrc(item.imagen)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-[11px] sm:text-xs">
                            Sin imagen
                          </div>
                        )}

                        {!item.disponible && (
                          <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded-md text-[9px] sm:text-[10px] font-semibold text-gray-600">
                            No disponible
                          </div>
                        )}

                        <div className="absolute bottom-2 right-2 bg-white px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-bold">
                          S/ {item.precio}
                        </div>
                      </div>

                      {/* CONTENIDO */}
                      <div className="p-3 sm:p-4 space-y-2">

                        <p className="font-semibold text-xs sm:text-sm text-gray-800 line-clamp-1">
                          {item.nombre}
                        </p>

                        {item.descripcion && (
                          <p className="text-[11px] sm:text-xs text-gray-500 line-clamp-2">
                            {item.descripcion}
                          </p>
                        )}

                        <div className="flex justify-between items-center pt-2">
                          <div className="text-[10px] text-gray-400">
                            ID: {item.id.slice(0, 4)}
                          </div>

                          <div className="flex gap-1 sm:gap-2">
                            <CustomButton
                              iconOnly
                              icon={<FaEdit size={12} />}
                              ariaLabel="Editar plato"
                              variant="secondary-outline"
                              onClick={() => {
                                setEditingItem(item);
                                setCategoriaActiva(cat.id);
                              }}
                            />

                            <CustomButton
                              iconOnly
                              icon={<FaTrash size={12} />}
                              ariaLabel="Eliminar plato"
                              variant="warning-outline"
                              onClick={() => deleteItem(item.id)}
                            />
                          </div>
                        </div>

                      </div>

                    </div>

                  )}
                </SortableItem>
              ))}

            </div>
          </SortableContext>
        </DndContext>
      </div>
    ))}

    <DishModal
      open={!!categoriaActiva}
      initialData={editingItem}
      onClose={() => {
        setCategoriaActiva(null);
        setEditingItem(null);
      }}
      onSave={(item) => {
        if (!categoriaActiva) return;

        if (editingItem) {
          updateItem(item.id, item);
        } else {
          createItem(categoriaActiva, item);
        }
      }}
    />
  </div>
);
};