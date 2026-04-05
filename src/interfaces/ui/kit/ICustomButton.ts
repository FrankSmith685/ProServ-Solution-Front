import type { ReactNode, ElementType } from "react";
import type { LinkProps } from "react-router-dom";
import type { Variant } from "@/shared/design/types";

export type ButtonSize = "sm" | "md" | "lg";

type BaseVisualProps = {
  id?: string;
  size?: ButtonSize;
  variant?: Variant;
  icon?: ReactNode;
  uppercase?: boolean;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: number;
  className?: string;
};

type ButtonAsButton = BaseVisualProps & {
  component?: "button";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  to?: never;
  href?: never;
  target?: never;
  rel?: never;
};

type ButtonAsAnchor = BaseVisualProps & {
  component: "a";
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
  onClick?: () => void;
  type?: never;
  to?: never;
};

type ButtonAsRouterLink = BaseVisualProps & {
  component: ElementType;
  to: LinkProps["to"];
  onClick?: () => void;
  type?: never;
  href?: never;
  target?: never;
  rel?: never;
};

type ContentWithIconOnly = {
  iconOnly: true;
  text?: string;
};

type ContentWithText = {
  iconOnly?: false;
  text: string;
};

type ButtonBehaviorProps =
  | ButtonAsButton
  | ButtonAsAnchor
  | ButtonAsRouterLink;

type ButtonContentProps = ContentWithIconOnly | ContentWithText;

export type CustomButtonProps = ButtonBehaviorProps & ButtonContentProps;