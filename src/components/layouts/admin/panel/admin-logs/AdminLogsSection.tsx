/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, type ReactNode } from "react";
import {
  Loader2,
  ShieldCheck,
  User,
  Mail,
  Database,
  Hash,
  Globe,
  CalendarDays,
  ScrollText,
} from "lucide-react";

import { useAdminLogs } from "@/hooks/useAdminLogs";
import { CustomTable } from "@/components/ui/kit/CustomTable";

import type { AdminLog } from "@/interfaces/hook/IUseAdminLogs";

const TABLE_HEADERS: string[] = [
  "Usuario",
  "Acción",
  "Entidad",
  "Entidad ID",
  "IP",
  "Fecha",
];

const badgeBaseClass =
  "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide";

const entityBadgeClass =
  "inline-flex items-center gap-1 rounded-full border border-border bg-muted/30 px-3 py-1 text-[11px] font-medium text-(--color-text)";

const getActionBadgeClass = (accion: string): string => {
  const normalized = accion.toLowerCase();

  if (
    normalized.includes("crear") ||
    normalized.includes("create") ||
    normalized.includes("nuevo")
  ) {
    return `${badgeBaseClass} border-emerald-500/20 bg-emerald-500/10 text-emerald-600`;
  }

  if (
    normalized.includes("actualizar") ||
    normalized.includes("editar") ||
    normalized.includes("update")
  ) {
    return `${badgeBaseClass} border-blue-500/20 bg-blue-500/10 text-blue-600`;
  }

  if (
    normalized.includes("eliminar") ||
    normalized.includes("delete") ||
    normalized.includes("borrar")
  ) {
    return `${badgeBaseClass} border-red-500/20 bg-red-500/10 text-red-600`;
  }

  return `${badgeBaseClass} border-border bg-surface text-(--color-text)`;
};

const formatDateTime = (date: string | null | undefined): string => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "-";

  return parsed.toLocaleString();
};

const AdminLogsSection = () => {
  const { logs, loading, getAdminLogs } = useAdminLogs();

  useEffect(() => {
    getAdminLogs();
  }, []);

  const stats = useMemo(() => {
    const total = logs.length;

    const creates = logs.filter((log) =>
      log.accion.toLowerCase().includes("crear")
    ).length;

    const updates = logs.filter(
      (log) =>
        log.accion.toLowerCase().includes("actualizar") ||
        log.accion.toLowerCase().includes("editar")
    ).length;

    const deletes = logs.filter((log) =>
      log.accion.toLowerCase().includes("eliminar")
    ).length;

    return {
      total,
      creates,
      updates,
      deletes,
    };
  }, [logs]);

  const tableRows: ReactNode[][] = useMemo(() => {
    return logs.map((log: AdminLog) => [
      <div className="min-w-56 max-w-72" key={`${log.id}-user`}>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-text)">
            <User size={14} />
            <span>{log.user?.nombre || "Usuario no disponible"}</span>
          </div>

          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <Mail size={13} />
            <span className="break-all">{log.user?.email || "-"}</span>
          </div>
        </div>
      </div>,

      <div className="min-w-36" key={`${log.id}-action`}>
        <span className={getActionBadgeClass(log.accion)}>{log.accion}</span>
      </div>,

      <div className="min-w-32" key={`${log.id}-entity`}>
        <span className={entityBadgeClass}>
          <Database size={12} />
          {log.entidad || "-"}
        </span>
      </div>,

      <div className="min-w-48 max-w-64" key={`${log.id}-entity-id`}>
        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs text-muted-foreground">
          <Hash size={13} />
          <span className="break-all">{log.entidad_id || "-"}</span>
        </div>
      </div>,

      <div className="min-w-32" key={`${log.id}-ip`}>
        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
          <Globe size={14} />
          <span>{log.ip || "-"}</span>
        </div>
      </div>,

      <div className="min-w-44" key={`${log.id}-date`}>
        <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted-foreground">
          <CalendarDays size={14} />
          <span>{formatDateTime(log.created_at)}</span>
        </div>
      </div>,
    ]);
  }, [logs]);

  return (
    <section className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-2xl border border-border bg-muted/30 p-3">
            <ScrollText size={18} />
          </div>

          <p className="text-sm text-muted-foreground">Total de logs</p>
          <h3 className="mt-1 text-2xl font-bold">{stats.total}</h3>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-emerald-600">
            <ShieldCheck size={18} />
          </div>

          <p className="text-sm text-muted-foreground">Creaciones</p>
          <h3 className="mt-1 text-2xl font-bold">{stats.creates}</h3>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-2xl border border-blue-500/20 bg-blue-500/10 p-3 text-blue-600">
            <ShieldCheck size={18} />
          </div>

          <p className="text-sm text-muted-foreground">Actualizaciones</p>
          <h3 className="mt-1 text-2xl font-bold">{stats.updates}</h3>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-5 shadow-sm">
          <div className="mb-3 inline-flex rounded-2xl border border-red-500/20 bg-red-500/10 p-3 text-red-600">
            <ShieldCheck size={18} />
          </div>

          <p className="text-sm text-muted-foreground">Eliminaciones</p>
          <h3 className="mt-1 text-2xl font-bold">{stats.deletes}</h3>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-4 shadow-sm sm:p-5 lg:p-6">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h3 className="text-lg font-semibold sm:text-xl">
              Historial de actividad administrativa
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Revisa las acciones realizadas por los administradores del sistema.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-14">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface-soft">
            <CustomTable
              headers={TABLE_HEADERS}
              data={tableRows}
              loading={loading}
              rows={6}
              columns={TABLE_HEADERS.length}
              emptyText="No hay logs registrados"
              columnWidths={[
                "280px",
                "180px",
                "160px",
                "260px",
                "160px",
                "220px",
              ]}
              minWidth={1260}
              maxHeight={560}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminLogsSection;