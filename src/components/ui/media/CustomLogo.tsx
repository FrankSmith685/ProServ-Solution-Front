import { memo, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { CustomImage } from "@/components/ui/media/CustomImage";
import type { LogoProps } from "@/interfaces/ui/media/ICustomLogo";

const LogoComponent: FC<LogoProps> = ({
  isActive = false,
  width = 150,
  height = "auto",
  navigateTo = "/",
  clickable = true,
  className
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!clickable) return;
    navigate(navigateTo);
  };

  return (
    <div
      role={clickable ? "button" : "img"}
      tabIndex={clickable ? 0 : -1}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === "Enter") handleClick();
      }}
      className={`
        max-w-45
        w-full
        flex
        items-center
        justify-center
        ${clickable ? "cursor-pointer" : "cursor-default"}
        transition-transform duration-300
        hover:scale-[1.02]
        ${className ?? ""}
      `}
      aria-label="Brand logo"
    >
      <CustomImage
        name={isActive ? "logo_02" : "logo_01"}
        alt="brand logo"
        width={width}
        height={height}
        radius="none"
        shadow={false}
        cover={false}
        className="border-none! bg-transparent!"
      />
    </div>
  );
};

export const Logo = memo(LogoComponent);
