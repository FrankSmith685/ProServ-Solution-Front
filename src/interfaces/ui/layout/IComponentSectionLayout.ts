import type { ReactNode } from "react";

export interface SectionLayoutProps {
  title: string;
  subTitle?: string;
  children: ReactNode;
  menuOpen?: boolean;
  onToggleMenu?: () => void;
  onBack?: () => void;
}
