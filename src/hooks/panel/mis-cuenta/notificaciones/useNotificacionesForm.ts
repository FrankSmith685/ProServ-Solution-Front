/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNotificaciones } from "@/hooks/useNotificacion";
import type { TipoNotificacion } from "@/interfaces/hook/IUseNotificaciones";

export const useNotificacionesForm = () => {
  const {
    getTiposNotificaciones,
    getNotificacionesUsuario,
    toggleNotificacion,
  } = useNotificaciones();

  const [items, setItems] = useState<TipoNotificacion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [tipos, usuario] = await Promise.all([
        getTiposNotificaciones(),
        getNotificacionesUsuario(),
      ]);

      if (tipos) {
        setItems(
          tipos.map(t => ({
            ...t,
            activo:
              usuario?.find(
                u => u.TINO_Codigo === t.TINO_Codigo
              )?.activo ?? false,
          }))
        );
      }

      setLoading(false);
    };

    load();
  }, []);

  const toggle = async (codigo: number, value: boolean) => {
    setItems(prev =>
      prev.map(n =>
        n.TINO_Codigo === codigo
          ? { ...n, activo: value }
          : n
      )
    );

    const success = await toggleNotificacion(codigo, value);
    if (!success) {
      setItems(prev =>
        prev.map(n =>
          n.TINO_Codigo === codigo
            ? { ...n, activo: !value }
            : n
        )
      );
    }
  };

  return {
    items,
    loading,
    toggle,
  };
};
