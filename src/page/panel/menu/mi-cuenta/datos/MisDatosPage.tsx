import type { FC } from "react";
import { MisDatosContainer } from "@/components/panel/mis-datos/MisDatosContainer";
import { useAppState } from "@/hooks/useAppState";

export const MisDatosPage: FC = () => {
  const {user} = useAppState();
  if(user){
    return <MisDatosContainer user={user}/>;
  }
};
