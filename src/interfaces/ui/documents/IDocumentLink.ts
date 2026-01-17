import type { BaseVariant } from "@/shared/design/types";
import type { LinkUnderline } from "../kit/ICustomLink";

export interface DocumentLinkState {
  text: string;
  variant: BaseVariant;
  underline: LinkUnderline;
  withIcon: boolean;
}
