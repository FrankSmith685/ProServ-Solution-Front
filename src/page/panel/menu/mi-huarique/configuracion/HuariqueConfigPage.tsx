export const HuariqueConfigPage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-red-600">
        Configuración
      </h1>

      <div className="border border-red-200 p-4 rounded">
        <p className="text-sm mb-3">
          Eliminar el huarique es una acción irreversible
        </p>
        <button className="btn-danger">
          Eliminar Huarique
        </button>
      </div>
    </div>
  );
};
