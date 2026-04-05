import { Loader2 } from "lucide-react";
import type { FC } from "react";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import type { AdminPageHeaderProps } from "@/interfaces/layouts/admin/panel/IAdminPageShell";

const AdminPageHeader: FC<AdminPageHeaderProps> = ({
  badgeText,
  badgeIcon: BadgeIcon,
  title,
  description,
  activeSectionLabel,
  activeSectionIcon: ActiveSectionIcon,
  secondaryAction,
  primaryAction,
}) => {
  const renderSecondaryAction = () => {
    if (!secondaryAction) return null;

    if (secondaryAction.component === "a" && secondaryAction.href) {
      return (
        <CustomButton
          text={secondaryAction.text}
          icon={secondaryAction.icon}
          component="a"
          href={secondaryAction.href}
          onClick={secondaryAction.onClick}
          target={secondaryAction.target}
          rel={secondaryAction.rel}
          variant={secondaryAction.variant ?? "secondary-outline"}
          size="md"
          fontSize="14px"
          disabled={secondaryAction.disabled}
          className="w-full! gap-2! px-4! leading-4! sm:w-auto!"
        />
      );
    }

    return (
      <CustomButton
        text={secondaryAction.text}
        icon={secondaryAction.icon}
        onClick={secondaryAction.onClick}
        variant={secondaryAction.variant ?? "secondary-outline"}
        size="md"
        fontSize="14px"
        disabled={secondaryAction.disabled}
        className="w-full! gap-2! px-4! leading-4! sm:w-auto!"
      />
    );
  };

  return (
    <section className="relative overflow-hidden rounded-[28px] border border-border bg-surface px-5 py-6 shadow-sm sm:px-6 sm:py-7 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.10),transparent_24%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.12),transparent_24%)]" />

      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary sm:text-xs">
            <BadgeIcon size={14} />
            {badgeText}
          </div>

          <h2 className="font-montserrat text-2xl font-black leading-tight text-primary sm:text-3xl">
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-surface-soft px-3 py-2 text-xs font-semibold text-muted-foreground sm:text-sm">
            <ActiveSectionIcon size={16} className="text-primary" />
            Sección activa:
            <span className="font-bold text-primary">{activeSectionLabel}</span>
          </div>
        </div>

        {(secondaryAction || primaryAction) && (
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            {renderSecondaryAction()}

            {primaryAction && (
              <div className="hidden sm:block">
                <CustomButton
                  text={
                    primaryAction.loading
                      ? "Guardando..."
                      : primaryAction.text
                  }
                  icon={
                    primaryAction.loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      primaryAction.icon
                    )
                  }
                  type="button"
                  onClick={primaryAction.onClick}
                  variant={primaryAction.variant ?? "primary"}
                  size="md"
                  fontSize="14px"
                  disabled={primaryAction.disabled || primaryAction.loading}
                  className="w-full! gap-2! px-4! leading-4! sm:w-auto!"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdminPageHeader;