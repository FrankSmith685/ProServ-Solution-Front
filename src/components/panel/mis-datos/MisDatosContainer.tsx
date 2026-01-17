/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import type {
  MisDatosFormState,
  MisDatosTab,
  EditableField,
  AvatarError,
  MisDatosContainerProps,
  ProfileFooterActivityItem,
} from "@/interfaces/panel/mis-datos/IMisDatos";

import { useFile } from "@/hooks/useFile";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileTabs } from "./ProfileTabs";
import { GeneralTab } from "./GeneralTab";
import { PerfilTab } from "./PerfilTab";
import { DocumentosTab } from "./DocumentosTab";
import { UbicacionTab } from "./UbicacionTab";
import { ActionBar } from "../ActionBar";
import { ProfileFooter } from "./ProfileFooter";
import type { UpdateUserPayload, UserInfo } from "@/interfaces/hook/IUseUser";
import { useUser } from "@/hooks/useUser";
import { useUbigeo } from "@/hooks/useUbigeo";
import { useAppState } from "@/hooks/useAppState";

const MAX_SIZE_MB = 2;

const buildStateFromUser = (user: UserInfo): MisDatosFormState => ({
  fotoPerfil: user?.fotoPerfil || "",
  nombre: user?.nombre || "",
  apellido: user?.apellido || "",
  email: user?.correo || "",
  telefono: user?.telefono || "",
  dni: user?.dni || "",
  ubigeo: user?.idUbigeo || "",
});

export const MisDatosContainer = (DataUser:MisDatosContainerProps) => {
  const { setUser } = useAppState();
  const { uploadFile, updateFile, deleteFile, getFiles } = useFile();
  const {updateUser} = useUser();
  const { getUbigeoByCodigo, getCodUbigeo } = useUbigeo();

  const user = DataUser.user;

  const [ubicacion, setUbicacion] = useState({
    departamento: "",
    provincia: "",
    distrito: "",
  });

  const [tab, setTab] = useState<MisDatosTab>("general");
  const [form, setForm] = useState<MisDatosFormState>(() => buildStateFromUser(user));
  const [saved, setSaved] = useState<MisDatosFormState>(() => buildStateFromUser(user));
  const [loading, setLoading] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<AvatarError>(null);

  useEffect(() => {
    if (!user?.idUbigeo) return;
    const loadUbigeo = async () => {
      const data = await getUbigeoByCodigo(String(user.idUbigeo));
      if (!data) return;

      setUbicacion({
        departamento: data.departamento,
        provincia: data.provincia,
        distrito: data.distrito,
      });
    };
    loadUbigeo();
  }, [user?.idUbigeo]);


  const entidad = "usuario";
  const entidadId = user?.cod_usuario;
  const tipoAvatar = "perfil";

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const progress = useMemo(() => {
    const filled = Object.entries(saved).filter(
      ([k, v]) => k !== "avatar" && Boolean(v)
    ).length;
    return Math.round((filled / 7) * 100);
  }, [saved]);

  const isComplete = progress === 100;

  const update = <K extends EditableField>(
    key: K,
    value: MisDatosFormState[K]
  ) => {
    setForm(p => ({ ...p, [key]: value }));
    setHasEdited(true);
  };

  const handleAvatarChange = (file: File) => {
    if (!entidadId) return;
    setAvatarError(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setAvatarError("type");
      return;
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setAvatarError("size");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm(p => ({ ...p, fotoPerfil: reader.result as string }));
    };
    reader.readAsDataURL(file);
    const action = saved.fotoPerfil ? updateFile : uploadFile;
    action(
      { entidad, entidadId, tipo: tipoAvatar, file },
      ({ success, data }) => {
        if (!success || !data) return;

        setForm(p => ({ ...p, fotoPerfil: data.archivo.ARCH_Ruta }));
        setSaved(p => ({ ...p, fotoPerfil: data.archivo.ARCH_Ruta }));

        setUser({
          ...user,
          fotoPerfil: data.archivo.ARCH_Ruta,
          ultimaActividadPerfil: data.actividad?.ultimaActividadPerfil ?? null,
          ultimaActividadFoto: data.actividad?.ultimaActividadFoto ?? null,
        });
      }
    );
  };

  const handleAvatarRemove = () => {
    if (!entidadId || !saved.fotoPerfil) return;
    getFiles({ entidad, entidadId, tipo: tipoAvatar }, ({ success, data }) => {
      if (!success || !data?.length) return;
      deleteFile({ archivoId: data[0].ARCH_ID }, ({ success, data }) => {
        if (!success) return;

        setForm(p => ({ ...p, fotoPerfil: "" }));
        setSaved(p => ({ ...p, fotoPerfil: "" }));

        setUser({
          ...user,
          fotoPerfil: null,
          ultimaActividadPerfil: data?.actividad?.ultimaActividadPerfil ?? null,
          ultimaActividadFoto: data?.actividad?.ultimaActividadFoto ?? null,
        });
      });

    });
  };

  const save = async () => {
    if (loading || !dirty || !user) return;
    setLoading(true);
    const payload: UpdateUserPayload = {
      USUA_Interno: user.cod_usuario,
      USUA_Nombre: form.nombre,
      USUA_Apellido: form.apellido,
      USUA_Telefono: form.telefono || undefined,
      USUA_Dni: form.dni || undefined,
      USUA_IdUbigeo: form.ubigeo || undefined,
    };

    await updateUser(payload, ({ success }) => {
      if (success) {
        setSaved(form);
        setHasEdited(false);
        setLastSaved(new Date().toLocaleTimeString());
      }
      setLoading(false);
    });
  };

  const handleUbicacionChange = async (value: {
    departamento?: string;
    provincia?: string;
    distrito?: string;
  }) => {
    setUbicacion(prev => {
      const next = { ...prev, ...value };

      if (next.departamento && next.provincia && next.distrito) {
        getCodUbigeo(
          next.departamento,
          next.provincia,
          next.distrito
        ).then(cod => {
          if (cod) update("ubigeo", cod);
        });
      }

      return next;
    });
  };

  const activity = useMemo<ProfileFooterActivityItem[]>(() => {
    const items: ProfileFooterActivityItem[] = [];
    if (user.ultimaActividadPerfil) {
      items.push({
        text: user.ultimaActividadPerfil.USAC_Accion,
        date: user.ultimaActividadPerfil.USAC_Fecha,
        metadata: user.ultimaActividadPerfil.USAC_Metadata as {
          campos?: string[];
        },
      });
    }

    if (user.ultimaActividadFoto) {
      items.push({
        text: user.ultimaActividadFoto.USAC_Accion,
        date: user.ultimaActividadFoto.USAC_Fecha,
      });
    }

    return items.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [user]);

  const ubicacionLabel = useMemo(() => {
    if (!ubicacion.departamento) return "";
    return [
      ubicacion.departamento,
      ubicacion.provincia,
      ubicacion.distrito,
    ]
      .filter(Boolean)
      .join(" / ");
  }, [ubicacion]);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      <ProfileHeader
        form={form}
        dirty={dirty}
        complete={isComplete}
        onAvatarChange={handleAvatarChange}
        onAvatarRemove={handleAvatarRemove}
        avatarError={avatarError}
      />

      <ProfileTabs tab={tab} onChange={setTab} />

      <div className="bg-surface-soft rounded-3xl p-6 space-y-8">
        {tab === "general" && <GeneralTab form={form} onNavigate={setTab} ubicacionLabel={ubicacionLabel}/>}
        {tab === "perfil" && <PerfilTab form={form} onChange={update} />}
        {tab === "documentos" && <DocumentosTab form={form} onChange={update} />}
        {tab === "ubicacion" && (
          <UbicacionTab
            departamento={ubicacion.departamento}
            provincia={ubicacion.provincia}
            distrito={ubicacion.distrito}
            onChange={handleUbicacionChange}
          />
        )}
      </div>

      <ActionBar visible={hasEdited && dirty} loading={loading} onSave={save} />
      <ProfileFooter
        progress={progress}
        lastSaved={lastSaved}
        activity={activity}
      />

    </div>
  );
};

