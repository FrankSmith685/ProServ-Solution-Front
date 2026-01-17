import type { FC } from "react";
import { useAppState } from "@/hooks/useAppState";

import { AuthBackgroundLayout } from "@/components/layouts/auth/AuthBackgroundLayout";
import { AuthHeader } from "@/components/layouts/auth/AuthHeader";

import { RegisterUserTypeSelect } from "@/components/auth/register/RegisterUserTypeSelect";
import RegisterSection from "@/components/auth/register/RegisterSection";
import { RegisterForm } from "@/components/auth/register/RegisterForm";
import RegisterStepsSection from "@/components/auth/register/RegisterStepsSection";

const RegisterPage: FC = () => {
  const { typeUserAuth } = useAppState();

  return (
    <AuthBackgroundLayout
      desktopImage="https://mappidevbucket.s3.amazonaws.com/mapp_229"
      mobileImage="https://mappidevbucket.s3.amazonaws.com/mapp_230"
    >
      <AuthHeader />

      <div
        className="
          relative z-20 w-full flex-1 flex 
          items-start justify-center 
          responsive-padding py-10
        "
      >
        <div
          className="
            w-full h-full flex gap-10
            flex-col-reverse lg:flex-row
            items-center justify-center
          "
        >
          <div
            className="
              w-full max-w-120 
              bg-white rounded-2xl
              shadow-xl
              border border-terciary-alpha-12
              p-6 sm:p-8
              animate-fade-in-up
            "
          >
            {typeUserAuth ? <RegisterForm /> : <RegisterUserTypeSelect />}
          </div>
          <div className="w-full flex-1 h-full max-w-225 flex items-center justify-center">
            <RegisterSection />
          </div>
        </div>
      </div>
      <RegisterStepsSection/>
    </AuthBackgroundLayout>
  );
};

export default RegisterPage;
