export const HuariqueMenuPage = () => {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Carta / Menú</h1>
        <button className="btn-primary">+ Nuevo plato</button>
      </header>

      <div className="border rounded-lg p-4">
        <h3 className="font-medium">Platos</h3>

        <div className="mt-3 space-y-2">
          <div className="flex justify-between items-center">
            <span>Arroz con pollo</span>
            <span>S/ 15.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};
