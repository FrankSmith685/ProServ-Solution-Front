import type { FC } from "react";

import { CustomButton } from "@/components/ui/kit/CustomButton";
import type { AdminPanelTabItem, AdminTabsCardProps } from "@/interfaces/layouts/admin/panel/IAdminPageShell";

const AdminTabsCard = <T extends string>({
  title,
  subtitle,
  tabs,
  activeTab,
  onChangeTab,
}: AdminTabsCardProps<T>): ReturnType<FC> => {
  const currentTab: AdminPanelTabItem<T> =
    tabs.find((item) => item.key === activeTab) ?? tabs[0];

  return (
    <section className="rounded-3xl border border-border bg-surface p-3 shadow-sm sm:p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-primary">
            {title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-border bg-surface-soft p-1.5">
          {tabs.map(({ key, label, icon: Icon }) => {
            const active = activeTab === key;

            return (
              <CustomButton
                key={key}
                text={label}
                type="button"
                onClick={() => onChangeTab(key)}
                variant={active ? "primary" : "secondary"}
                size="sm"
                icon={<Icon size={15} />}
                className={`
                  min-w-32! shrink-0! gap-1! px-4!
                  ${active ? "shadow-sm!" : ""}
                `}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-dashed border-primary/20 bg-primary/5 px-4 py-3">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-primary">
            {currentTab.label}:
          </span>{" "}
          {currentTab.description}
        </p>
      </div>
    </section>
  );
};

export default AdminTabsCard;