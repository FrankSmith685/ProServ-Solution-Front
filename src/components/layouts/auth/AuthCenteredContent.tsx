import type { FC, ReactNode } from "react";

interface AuthCenteredContentProps {
  left: ReactNode;
  right?: ReactNode;
}

export const AuthCenteredContent: FC<AuthCenteredContentProps> = ({
  left,
  right
}) => {
  return (
    <div className="relative z-20 w-full flex-1 flex items-start justify-center responsive-padding py-12">
      <div className="w-full h-full flex gap-4 flex-col-reverse lg:flex-row items-center justify-center">

        <div className="w-full max-w-112.5 bg-white p-4 rounded-xl">
          {left}
        </div>

        {right && (
          <div className="w-full flex-1 h-full max-w-150 lg:max-w-225">
            {right}
          </div>
        )}
      </div>
    </div>
  );
};
