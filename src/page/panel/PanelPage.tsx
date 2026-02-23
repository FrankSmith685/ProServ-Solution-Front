/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layouts/header/Header";
import { CustomSidebarSubMenu } from "@/components/ui/navigation/CustomSidebarSubMenu";
import { FiMenu } from "react-icons/fi";
import { useAppState } from "@/hooks/useAppState";
import CustomLoader from "@/components/loader/CustomLoader";
import { sidebarMenus } from "./data/sidebarMenu";
import type {
  SidebarSubMenuLink,
} from "@/interfaces/ui/navigation/ICustomSidebarSubMenu";
import { getSecurityMenu } from "@/helpers/panel/mi-cuenta/getSecurityMenu";
import type { FindActiveItemFn, PanelMenu } from "@/interfaces/panel/IMiPanel";
import { getPreferencesMenu } from "@/helpers/panel/mi-cuenta/getPreferencesMenu";
import { PanelStartSelector } from "@/components/panel/mis-huariques/components/PanelStartSelector";
import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import type { UserTypeProfile } from "@/interfaces/hook/IUseUser";
import type { ServiceSteeps } from "@/interfaces/panel/mis-huariques/IHuarique";


const MOBILE_BREAKPOINT = 768;
const HEADER_HEIGHT = 65;

export const PanelPage: React.FC = () => {
  const { user, serviceSteep, setActiveServiceSteep, activeServiceSteep,visitedServiceSteep, setVisitedServiceSteep,  } = useAppState();
  const { pathname } = useLocation();
  const { setProfileType } = useUser();
  const navigate = useNavigate();

  const section = pathname.split("/")[2];
  const baseMenu: PanelMenu | undefined = sidebarMenus[section];

  const getHuariqueStepPaths = (profileType: UserTypeProfile) => {
    return profileType === "independiente"
      ? [
          "/panel/mi-huarique/info",
          "/panel/mi-huarique/multimedia",
          "/panel/mi-huarique/menu",
          "/panel/mi-huarique/promociones",
          "/panel/mi-huarique/publicacion",
        ]
      : [
          "/panel/mi-huarique/empresa",
          "/panel/mi-huarique/info",
          "/panel/mi-huarique/multimedia",
          "/panel/mi-huarique/menu",
          "/panel/mi-huarique/promociones",
          "/panel/mi-huarique/publicacion",
        ];
  };

  useEffect(() => {
    if (!user?.profileType) return;

    if (user.profileType === "empresa") {
      setActiveServiceSteep("empresa");

      if (visitedServiceSteep.length === 0) {
        setVisitedServiceSteep(["empresa"]);
      }

    } else {
      setActiveServiceSteep("info");

      if (visitedServiceSteep.length === 0) {
        setVisitedServiceSteep(["info"]);
      }
    }

  }, [user?.profileType]);

  useEffect(() => {
    if (!user?.profileType) return;
    if (!pathname.startsWith("/panel/mi-huarique")) return;

    const step = pathname.split("/").at(-1) as ServiceSteeps;
    if (!step) return;

    if (visitedServiceSteep.includes(step)) return;

    const nextVisited = [...visitedServiceSteep, step];
    setVisitedServiceSteep(nextVisited);

  }, [pathname]);




  const currentMenu: PanelMenu | null = useMemo(() => {
    if (!user || !baseMenu) return null;

    const STEP_ORDER = getHuariqueStepPaths(user.profileType);

    const getStepIndex = (path: string) =>
      STEP_ORDER.findIndex(p => path.startsWith(p));

    return {
      ...baseMenu,
      menuData: baseMenu.menuData
        .filter(item => {
          if (
            user.profileType === "independiente" &&
            item.type === "link" &&
            item.path === "/panel/mi-huarique/empresa"
          ) {
            return false;
          }
          return true;
        })
        .map(item => {
          if (item.type === "link") {
            const stepIndex = getStepIndex(item.path);

            return {
              ...item,
              disabled:
                stepIndex === -1
                  ? false
                  : stepIndex > serviceSteep &&
                    !visitedServiceSteep.includes(
                      item.path.split("/").at(-1) as ServiceSteeps
                    )
            };
          }

          if (item.type === "group") {
            if (item.label === "Seguridad") {
              return {
                ...item,
                children: getSecurityMenu(user.metodosLogin),
              };
            }
            if (item.label === "Preferencias") {
              return {
                ...item,
                children: getPreferencesMenu(),
              };
            }
          }

          return item;
        }),
    };
  }, [user, baseMenu, serviceSteep, visitedServiceSteep, activeServiceSteep]);


  const findActiveItem: FindActiveItemFn = (menuData, pathname) => {
    for (const item of menuData) {
      if ("path" in item && pathname.startsWith(item.path)) {
        return item;
      }
      if ("children" in item) {
        const child = item.children.find(c =>
          pathname.startsWith(c.path)
        );
        if (child) return child;
      }
    }
    return null;
  };
  
  const activeItem: SidebarSubMenuLink | null = currentMenu
  ? findActiveItem(currentMenu.menuData, pathname)
  : null;

  const [isMobile, setIsMobile] = useState<boolean>(
    window.innerWidth < MOBILE_BREAKPOINT
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    const onResize = (): void => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMiHuariqueRoute = pathname.startsWith("/panel/mi-huarique");

  const mustSelectStartType =
    isMiHuariqueRoute &&
    user &&
    !user.profileType


  const [selectLoading, setSelectLoading] = useState(false);
  
  const handleSelectStartType = async (
    tipo: "independiente" | "empresa"
  ) => {
    setSelectLoading(true);

    await setProfileType(tipo, ({ success }) => {
      setSelectLoading(false);
      if (!success) return;
      if (tipo === "empresa") {
        navigate("/panel/mi-huarique/empresa", { replace: true });
        setActiveServiceSteep("empresa")
      } else {
        navigate("/panel/mi-huarique/info", { replace: true });
        setActiveServiceSteep("info")
      }
    });
  };

  const isRootPanel = pathname === "/panel";
  if (isRootPanel) {
    return <Navigate to="/panel/mi-cuenta/datos" replace />;
  }

  if (!user || !currentMenu) {
    return <CustomLoader message="Preparando tu panel" />;
  }

  return (
    <>
      <Header />

      <div className="flex items-center justify-center w-full">
        <div
          className="flex bg-terciary-soft w-full max-w-400"
          style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}
        >
          {!isMobile && (
            <aside className="w-64 shrink-0 bg-secondary text-on-dark border-r">
              <CustomSidebarSubMenu
                title={currentMenu.title}
                titleIcon={currentMenu.icon}
                menuData={currentMenu.menuData}
              />
            </aside>
          )}

          {isMobile && sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40"
                onClick={() => setSidebarOpen(false)}
              />
              <aside className="fixed inset-y-0 left-0 z-50 w-full xs:w-72 bg-secondary">
                <CustomSidebarSubMenu
                  title={currentMenu.title}
                  titleIcon={currentMenu.icon}
                  menuData={currentMenu.menuData}
                  onClose={() => setSidebarOpen(false)}
                />
              </aside>
            </>
          )}

          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="shrink-0 bg-glass border-b border-terciary-alpha-12">
              <div className="px-4 md:px-6 py-3 flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="md:hidden w-9 h-9 rounded-lg bg-primary text-on-dark flex items-center justify-center"
                >
                  <FiMenu />
                </button>

                <div className="flex flex-col">
                  <span className="text-xs text-terciary">
                    {currentMenu.title}
                  </span>
                  <h1 className="text-lg font-semibold text-secondary">
                    {activeItem?.label}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 responsive-padding">
              <div className="max-w-6xl mx-auto">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
      {mustSelectStartType && (
          <PanelStartSelector
            open
            loading={selectLoading}
            onSelect={handleSelectStartType}
          />
        )}
    </>
  );
};
