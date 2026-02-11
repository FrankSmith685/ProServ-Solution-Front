import type { HuariqueInfoFormProps } from "@/interfaces/panel/mis-huariques/IHuariqueInfo";
import { useAppState } from "@/hooks/useAppState";
import { CustomInput } from "@/components/ui/kit/CustomInput";
import { CustomSelected } from "@/components/ui/kit/CustomSelected";

// Tab de información principal del huarique
export const HuariqueInfoTab = ({ form, onChange }: HuariqueInfoFormProps) => {
  // Categorías globales
  const { categories } = useAppState();
  // Excluye la categoría Reseñas
  const categoriasFiltradas = categories.filter(
    cat => cat.CATE_Nombre !== "Reseñas"
  );
  // Opciones de categoría
  const categoriaOptions = categoriasFiltradas.map(cat => ({
    value: String(cat.CATE_Id),
    label: cat.CATE_Nombre,
  }));
  // Categoría seleccionada
  const categoriaSeleccionada = categoriasFiltradas.find(
    cat => String(cat.CATE_Id) === form.categoria
  );
  // Opciones de subcategoría
  const subcategoriaOptions =
    categoriaSeleccionada?.Subcategorias.map(sub => ({
      value: String(sub.SUBC_Id),
      label: sub.SUBC_Nombre,
    })) ?? [];

  return (
    <section className="space-y-6 md:space-y-8">
      {/* TÍTULO */}
      <div className="space-y-1">
        <h3 className="text-sm md:text-base font-semibold text-secondary">
          Identidad del huarique
        </h3>
        <p className="text-xs md:text-sm text-gray-600">
          Define la información principal que verán los usuarios sobre tu huarique.
        </p>
      </div>

      {/* NOMBRE */}
      <div className="space-y-1">
        <CustomInput
          label="Nombre del huarique"
          value={form.nombre}
          onChange={e => onChange("nombre", e.target.value)}
          fullWidth
          required
        />
        <p className="text-[13px] text-gray-500">
          • Este será el nombre visible para los usuarios
        </p>
      </div>

      {/* DESCRIPCIÓN */}
      <div className="space-y-1">
        <CustomInput
          label="Descripción"
          helperText="•Cuéntanos qué tipo de comida ofreces o qué hace especial a tu huarique"
          value={form.descripcion}
          onChange={e => onChange("descripcion", e.target.value)}
          multiline
          rows={3}
          fullWidth
        />
      </div>

      {/* CATEGORÍA / SUBCATEGORÍA */}
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 md:p-6 space-y-6">
        <p className="text-xs md:text-sm text-gray-600">
          Selecciona la categoría principal y una subcategoría para que los
          usuarios entiendan mejor qué tipo de comida o servicio ofreces.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* CATEGORÍA */}
          <div className="space-y-2">
            <CustomSelected
              label="Categoría"
              placeholder="Seleccione una categoría"
              value={form.categoria}
              options={categoriaOptions}
              fullWidth
              onChange={e => {
                onChange("categoria", String(e.target.value));
                onChange("subcategoria", "");
              }}
            />
            <p className="text-[11px] text-gray-500">
              • Rubro principal del huarique
            </p>
          </div>

          {/* SUBCATEGORÍA */}
          <div className="space-y-2">
            <CustomSelected
              label="Subcategoría"
              placeholder="Seleccione una subcategoría"
              value={form.subcategoria}
              options={subcategoriaOptions}
              disabled={!form.categoria}
              fullWidth
              onChange={e => onChange("subcategoria", String(e.target.value))}
            />

            {!form.categoria ? (
              <p className="text-[11px] text-gray-400">
                • Selecciona una categoría primero
              </p>
            ) : subcategoriaOptions.length === 0 ? (
              <p className="text-[11px] text-amber-600">
                • Esta categoría no tiene subcategorías
              </p>
            ) : (
              <p className="text-[11px] text-gray-500">
                • Define mejor el tipo de comida que ofreces
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
