import type { FC } from "react";

export interface Item {
  id: string;
  label: string;
  Component: FC;
  type: "component" | "style";
}

export interface Props {
  items: Item[];
  active: string | null;
  onSelect: (id: string) => void;
}