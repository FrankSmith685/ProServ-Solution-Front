/* eslint-disable react-hooks/set-state-in-effect */
import { useRef, useState, useMemo, useEffect } from "react";
import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { FaPlus, FaTrash, FaImage, FaExpand, FaEdit } from "react-icons/fa";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import type { DishModalProps, MenuItem } from "@/interfaces/panel/mis-huariques/IHuariqueMenu";

const EMPTY_FORM: MenuItem = {
  id: "",
  nombre: "",
  descripcion: "",
  precio: 0,
  disponible: true,
  imagen: null,
};

export const DishModal = ({ open, initialData, onClose, onSave }: DishModalProps) => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const baseForm = useMemo<MenuItem>(() => {
    if (initialData) return initialData;

    return {
      ...EMPTY_FORM,
      id: crypto.randomUUID(),
    };
  }, [initialData]);

  const [form, setForm] = useState<MenuItem>(baseForm);
  const [preview, setPreview] = useState<string | null>(
    typeof baseForm.imagen === "string" ? baseForm.imagen : null
  );

  useEffect(() => {
    if (!open) return;

    setForm(baseForm);

    if (baseForm.imagen instanceof File) {
      const url = URL.createObjectURL(baseForm.imagen);
      setPreview(url);
      return;
    }

    if (typeof baseForm.imagen === "string") {
      setPreview(baseForm.imagen);
      return;
    }

    setPreview(null);
  }, [open, baseForm]);

  const handleImage = (file: File) => {
    const objectUrl = URL.createObjectURL(file);

    setPreview(objectUrl);

    setForm(prev => ({
      ...prev,
      imagen: file,
    }));
  };

  const header = (
    <div className="flex flex-col">
      <span className="text-2xl font-bold">
        {initialData ? "Editar plato" : "Nuevo plato"}
      </span>
      <span className="text-sm text-gray-500">
        Configura la información que verán los clientes.
      </span>
    </div>
  );

  const footer = (
    <>
      <CustomButton
        text="Cancelar"
        fontSize="14px"
        size="md"
        variant="secondary"
        onClick={onClose}
      />

      <CustomButton
        text={initialData ? "Guardar cambios" : "Crear plato"}
        fontSize="14px"
        size="md"
        variant="primary"
        onClick={() => {
          onSave(form);
          onClose();
        }}
      />
    </>
  );

  return (
    <>
      <CustomModal
        isOpen={open}
        onClose={onClose}
        width="720px"
        header={header}
        footer={footer}
        closeButton={true}
      >
        <section className="space-y-3">
          <label className="text-sm font-semibold text-gray-700">
            Imagen del plato
          </label>

          <div className="relative group rounded-2xl overflow-hidden bg-white ring-1 ring-gray-200 hover:ring-primary transition">
            {preview ? (
              <>
                <div className="h-72 bg-gray-50 flex items-center justify-center">
                  <img
                    src={preview}
                    className="max-h-full max-w-full object-contain cursor-pointer"
                    onClick={() => setViewerOpen(true)}
                  />
                </div>

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <CustomButton
                    iconOnly
                    icon={<FaExpand size={14} />}
                    variant="secondary-outline"
                    onClick={() => setViewerOpen(true)}
                  />

                  <CustomButton
                    iconOnly
                    icon={<FaTrash size={14} />}
                    variant="warning-outline"
                    onClick={() => {
                      setPreview(null);
                      setForm(prev => ({ ...prev, imagen: null }));
                    }}
                  />

                  <CustomButton
                    iconOnly
                    icon={<FaEdit size={14} />}
                    variant="secondary-outline"
                    onClick={() => fileRef.current?.click()}
                  />
                </div>
              </>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center gap-3 bg-gray-50">
                <div className="p-4 rounded-full bg-white shadow">
                  <FaImage className="text-gray-500 text-xl" />
                </div>

                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Seleccionar imagen
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG o WEBP
                  </p>
                </div>

                <CustomButton
                  text="Subir imagen"
                  size="md"
                  icon={<FaPlus className="w-3" />}
                  fontSize="14px"
                  variant="secondary"
                  onClick={() => fileRef.current?.click()}
                />
              </div>
            )}
          </div>
        </section>

        <input
          ref={fileRef}
          type="file"
          hidden
          accept="image/*"
          onChange={e => {
            const file = e.target.files?.[0];
            if (file) handleImage(file);
          }}
        />

        <section className="grid md:grid-cols-2 gap-6">
          <CustomInput
            label="Nombre del plato"
            value={form.nombre}
            onChange={e => setForm(prev => ({ ...prev, nombre: e.target.value }))}
            fullWidth
          />

          <CustomInput
            label="Precio"
            type="number"
            value={String(form.precio)}
            onChange={e =>
              setForm(prev => ({ ...prev, precio: Number(e.target.value) }))
            }
            fullWidth
          />
        </section>

        <CustomInput
          label="Descripción del plato"
          placeholder="Ej: Pollo a la brasa acompañado de papas crocantes y ensalada fresca."
          value={form.descripcion ?? ""}
          onChange={e =>
            setForm(prev => ({ ...prev, descripcion: e.target.value }))
          }
          multiline
          rows={4}
          fullWidth
          helperText="Describe ingredientes, acompañamientos o detalles que ayuden a elegir el plato."
        />

        <section className="bg-gray-50 rounded-xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Disponible en la carta
              </p>
              <p className="text-xs text-gray-500">
                Si se desactiva, no aparecerá para los clientes.
              </p>
            </div>

            <CustomSwitch
              label=""
              checked={Boolean(form.disponible)}
              variant="primary"
              size="lg"
              onChange={(_, checked) =>
                setForm(prev => ({ ...prev, disponible: checked }))
              }
            />
          </div>
        </section>
      </CustomModal>

      <CustomImageViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        startIndex={0}
        images={
          preview
            ? [{ src: preview, alt: "Imagen del plato" }]
            : []
        }
      />
    </>
  );
};