import { memo, useState, useCallback, type FC } from "react";
import { CustomInput } from "@/components/ui/kit/CustomInput";

interface Props {
  onSearchChange: (value: string) => void;
}

const FiltersBarComponent: FC<Props> = ({ onSearchChange }) => {
  const [search, setSearch] = useState("");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange(value);
  }, [onSearchChange]);

  return (
    <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <CustomInput
        type="search"
        placeholder="Buscar..."
        fullWidth
        value={search}
        onChange={handleChange}
      />

      {/* Aquí puedes agregar más filtros si quieres */}
    </div>
  );
};

export const FiltersBar = memo(FiltersBarComponent);
