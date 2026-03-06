/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useMemo, useEffect, useRef } from "react";
import { CustomModal } from "@/components/ui/overlay/CustomModal";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomButton } from "@/components/ui/kit/CustomButton";
import { CustomSwitch } from "@/components/ui/kit/CustomSwitch";
import { CustomImageViewer } from "@/components/ui/media/CustomImageViewer";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";
import { FaPlus, FaTrash, FaImage, FaExpand, FaEdit } from "react-icons/fa";
import type { Promocion, PromocionTipo, PropsPromocionModal } from "@/interfaces/panel/mis-huariques/IHuariquePromocion";
import { CustomMultiSelected } from "@/components/ui/kit/CustomMultiSelected";
import { CustomChip } from "@/components/ui/kit/CustomChip";

export const PromocionModal = ({
  open,
  initialData,
  menu,
  onClose,
  onSave,
}: PropsPromocionModal) => {

  const fileRef = useRef<HTMLInputElement>(null);

  const [viewerOpen, setViewerOpen] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>("");

  const today: string = new Date().toISOString().split("T")[0];

  const baseForm = useMemo<Promocion>(() => {
    if (initialData) return initialData;

    return {
      id: crypto.randomUUID(),
      titulo: "",
      descripcion: "",
      tipo: "combo",
      precioPromo: 0,
      porcentajeDescuento: 0,
      activa: true,
      destacada: false,
      imagen: null,
      tags: [],
      fechaInicio: today,
      fechaFin: "",
      items: [],
    };
  }, [initialData, today]);

  const [form, setForm] = useState<Promocion>(() => baseForm);

  const [preview, setPreview] = useState<string | null>(() =>
    typeof baseForm.imagen === "string" ? baseForm.imagen : null
  );

  const [limitedByDate, setLimitedByDate] = useState<boolean>(
    Boolean(initialData?.fechaFin)
  );

  useEffect(() => {
    if (!open) return;

    setForm(baseForm);

    if (baseForm.imagen instanceof File) {
      const url: string = URL.createObjectURL(baseForm.imagen);
      setPreview(url);
      return;
    }

    if (typeof baseForm.imagen === "string") {
      setPreview(baseForm.imagen);
      return;
    }

    setPreview(null);
  }, [open, baseForm]);

  const handleImage = (file: File): void => {
    const objectUrl: string = URL.createObjectURL(file);
    setPreview(objectUrl);
    setForm((prev: Promocion): Promocion => ({
      ...prev,
      imagen: file,
    }));
  };

  const header = (
    <div className="flex flex-col">
      <span className="text-2xl font-bold">
        {initialData ? "Editar promoción" : "Nueva promoción"}
      </span>

      <span className="text-sm text-gray-500">
        Crea ofertas atractivas para tus clientes.
      </span>
    </div>
  );

  const footer = (
    <>
      <CustomButton
        text="Cancelar"
        variant="secondary"
        fontSize="14px"
        size="md"
        onClick={onClose}
      />

      <CustomButton
        text={initialData ? "Guardar cambios" : "Crear promoción"}
        variant="primary"
        fontSize="14px"
        size="md"
        onClick={(): void => {
          if (!form.items?.length) return;

          if (limitedByDate && form.fechaInicio && form.fechaFin) {
            const start = new Date(form.fechaInicio);
            const end = new Date(form.fechaFin);

            if (end.getTime() < start.getTime()) {
              alert("La fecha final no puede ser menor que la fecha de inicio");
              return;
            }
          }

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
        closeButton
      >

        {/* IMAGEN */}
        <section className="space-y-3">

          <label className="text-sm font-semibold text-gray-700">
            Imagen de la promoción
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
                  icon={<FaPlus className="w-3" />}
                  size="md"
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
          onChange={(e) => {

            const file = e.target.files?.[0];

            if (file) handleImage(file);

          }}
        />

        {/* TITULO Y PRECIO */}
        <section className="grid md:grid-cols-2 gap-6">

          <CustomInput
            label="Título"
            value={form.titulo}
            onChange={(e)=>
              setForm(p=>({...p,titulo:e.target.value}))
            }
            fullWidth
          />

          <CustomInput
            label="Precio promocional"
            type="number"
            value={String(form.precioPromo ?? 0)}
            onChange={(e)=>
              setForm(p=>({...p,precioPromo:Number(e.target.value)}))
            }
            fullWidth
          />

        </section>

        {/* DESCRIPCION */}
        <CustomInput
          label="Descripción de la promoción"
          placeholder="Ej: Combo especial que incluye 1/2 pollo a la brasa, papas familiares y 2 bebidas a precio promocional."
          value={form.descripcion ?? ""}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              descripcion: e.target.value.slice(0, 250),
            }))
          }
          multiline
          rows={4}
          fullWidth
          helperText={`${(form.descripcion ?? "").length}/250 • Explica qué incluye la promoción o el beneficio para el cliente.`}
        />

        {/* TIPO PROMOCION */}
        <CustomSelected
          label="Tipo de promoción"
          fullWidth
          value={form.tipo}
          options={[
            { label: "Combo", value: "combo" },
            { label: "Precio especial", value: "precio_fijo" },
            { label: "Descuento %", value: "porcentaje" },
            { label: "2x1", value: "dos_por_uno" },
          ]}
          onChange={(e)=>
            setForm(p=>({...p,tipo:e.target.value as PromocionTipo}))
          }
        />
        

        {/* DESCUENTO */}
        {form.tipo === "porcentaje" && (
          <CustomInput
            label="Porcentaje de descuento"
            type="number"
            value={String(form.porcentajeDescuento ?? 0)}
            onChange={(e)=>
              setForm(p=>({...p,porcentajeDescuento:Number(e.target.value)}))
            }
            helperText="Ej: 20 = 20%"
            fullWidth
          />
        )}

        {/* FECHAS */}
        <section className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-xl">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Limitar promoción por fechas
            </p>
            <p className="text-xs text-gray-500">
              Si se activa podrás definir cuándo empieza y termina
            </p>
          </div>

          <CustomSwitch
            label=""
            checked={limitedByDate}
            variant="primary"
            size="lg"
            onChange={(_, checked) => {

              setLimitedByDate(checked);

              if (!checked) {
                setForm(p => ({
                  ...p,
                  fechaInicio: "",
                  fechaFin: ""
                }));
              } else {
                setForm(p => ({
                  ...p,
                  fechaInicio: today
                }));
              }

            }}
          />

        </section>
        {limitedByDate && (

          <section className="grid md:grid-cols-2 gap-6">

            <CustomInput
              label="Fecha inicio"
              type="date"
              value={form.fechaInicio ?? ""}
              inputProps={{
                min: today
              }}
              onChange={(e)=>{

                const newStart = e.target.value;

                setForm(prev => {

                  let newEnd = prev.fechaFin;

                  if (newEnd && new Date(newStart) > new Date(newEnd)) {
                    newEnd = newStart;
                  }

                  return {
                    ...prev,
                    fechaInicio: newStart,
                    fechaFin: newEnd
                  };

                });

              }}
              fullWidth
            />

            <CustomInput
              label="Fecha fin"
              type="date"
              value={form.fechaFin ?? ""}
              inputProps={{
                min: form.fechaInicio || today
              }}
              onChange={(e)=>
                setForm(p=>({...p,fechaFin:e.target.value}))
              }
              fullWidth
            />

          </section>
        )}
          
        {/* TAGS */}
        <section className="space-y-3">
          <CustomInput
            label="Tags de la promoción"
            placeholder="Escribe una etiqueta y presiona Enter (ej: oferta)"
            value={tagInput}
            onChange={(e)=>setTagInput(e.target.value)}
            onKeyDown={(e)=>{
              if (e.key === "Enter") {
                e.preventDefault();
                const tag = tagInput.trim().toLowerCase().replace(/\s+/g,"-");
                if (!tag) return;
                if (form.tags?.includes(tag)) return;
                if ((form.tags?.length ?? 0) >= 10) return;
                setForm(p=>({
                  ...p,
                  tags:[...(p.tags ?? []), tag]
                }));
                setTagInput("");
              }
            }}
            helperText={`${form.tags?.length ?? 0}/10 • Presiona Enter para agregar la etiqueta`}
            fullWidth
          />

          {form.tags && form.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.tags.map(tag => (
                <CustomChip
                  key={tag}
                  label={tag}
                  variant="primary-outline"
                  onDelete={()=>{
                    setForm(p=>({
                      ...p,
                      tags:p.tags?.filter(t=>t !== tag)
                    }));

                  }}
                />

              ))}

            </div>

          )}

        </section>

        {/* PLATOS */}
        <CustomMultiSelected
          label="Platos incluidos"
          placeholder="Seleccione los Platos"
          fullWidth
          value={form.items ?? []}
          options={menu.flatMap(c =>
            c.items.map(item => ({
              label: `${c.nombre} - ${item.nombre}`,
              value: `${c.nombre}-${item.id}-${item.nombre}`
            }))
          )}
          onChange={(event) => {
            const value = event.target.value;
            const items = typeof value === "string"
              ? value.split(",")
              : value;

            setForm(p => ({
              ...p,
              items
            }));
          }}
        />

        {/* SWITCHES */}
        <section className="bg-gray-50 rounded-xl px-4 py-4 space-y-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-semibold text-gray-700">
                Promoción destacada
              </p>
              <p className="text-xs text-gray-500">
                Aparecerá primero en el menú
              </p>
            </div>

            <CustomSwitch
              label=""
              checked={Boolean(form.destacada)}
              variant="primary"
              size="lg"
              onChange={(_,checked)=>
                setForm(p=>({...p,destacada:checked}))
              }
            />

          </div>

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-semibold text-gray-700">
                Promoción activa
              </p>
              <p className="text-xs text-gray-500">
                Si se desactiva no aparecerá para clientes
              </p>
            </div>

            <CustomSwitch
              label=""
              checked={Boolean(form.activa)}
              variant="primary"
              size="lg"
              onChange={(_,checked)=>
                setForm(p=>({...p,activa:checked}))
              }
            />

          </div>

        </section>

      </CustomModal>

      <CustomImageViewer
        isOpen={viewerOpen}
        onClose={()=>setViewerOpen(false)}
        startIndex={0}
        images={
          preview
            ? [{ src: preview, alt: "Imagen promoción"}]
            : []
        }
      />
    </>
  );
}