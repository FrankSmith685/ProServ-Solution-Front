import { HomeCategorias } from "@/components/home/HomeCategoria";
import HomeHero from "@/components/home/HomeHero";
import HomeHuariquesDestacados from "@/components/home/HomeHuariqueDestacado";
import HomeHuariquesOpiniones from "@/components/home/HomeHuariqueOpinion";
import HomeInvitacionHuarique from "@/components/home/HomeInvitacionHuarique";
import HomePrimerosPasos from "@/components/home/HomePrimerosPasos";
import HomeVisibilidadFutura from "@/components/home/HomeVisibilidadFutura";
import UserTypeModal from "@/components/modals/UserTypeModal";
import { useAppState } from "@/hooks/useAppState";
import type { UserType } from "@/interfaces/ui/overlay/ICustomUserTypeModal";
import { useNavigate } from "react-router-dom";

type UserRole = "comensal" | "vendedor" | null;

export default function HomePage() {
  const { accessToken, setTypeUserAuth, user } = useAppState();
  const navigate = useNavigate();

  // 🔹 Detectar rol del usuario
  const getUserRole = (): UserRole => {
    if (!user) return null;

    if (user.tipo_usuario?.some(t => t.descripcion === "vendedor")) {
      return "vendedor";
    }

    if (user.tipo_usuario?.some(t => t.descripcion === "comensal")) {
      return "comensal";
    }

    return null;
  };

  const role = getUserRole();

  // 🔹 Definir variante del hero
  const heroVariant =
    !accessToken ? "public" :
    role === "vendedor" ? "vendedor" :
    role === "comensal" ? "comensal" :
    "public";

  // 🔹 Mostrar modal solo si está logueado pero sin rol
  const shouldShowUserTypeModal =
  !accessToken || (accessToken && user && !role);

  const handleSelectType = (type: UserType): void => {
    if (type === "vendedor") {
      setTypeUserAuth("emprendedor");
      navigate("/registrar");
      return;
    }

    setTypeUserAuth("comensal");
    navigate("/servicios?m=map");
  };

  return (
    <div className="w-full">
      <HomeHero variant={heroVariant} />

      <HomePrimerosPasos variant={heroVariant}/>
      <HomeCategorias variant={heroVariant}/>
      <HomeVisibilidadFutura variant={heroVariant}/>
      <HomeHuariquesDestacados variant={heroVariant}/>
      <HomeHuariquesOpiniones variant={heroVariant}/>
      <HomeInvitacionHuarique variant={heroVariant}/>

      {shouldShowUserTypeModal && (
        <UserTypeModal
          isOpen={true}
          onClose={() => {}}
          onSelectType={handleSelectType}
        />
      )}
    </div>
  );
}
