import type { FC } from "react";
import RegisterStep from "./RegisterStep";

export const RegisterStepsSection: FC = () => {
  return (
    <div className="w-full z-20">
      <div className="w-full h-20 border-b border-gray-300 flex items-center justify-center bg-white">
        <p className="text-2xl text-gray-800">
          Empezar a <span className="font-bold">vender</span> es sencillo
        </p>
      </div>

      <div className="w-full h-full">
        <RegisterStep />
      </div>
    </div>
  );
};

export default RegisterStepsSection;
