export type CustomSelectOption = {
  value: string;
  label: string;
};

export const DEFAULT_FONT_FAMILY = "Arial, sans-serif";
export const DEFAULT_FONT_SIZE = "default";

export const FONT_FAMILIES: CustomSelectOption[] = [
  { value: DEFAULT_FONT_FAMILY, label: "Default (Arial)" },
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Segoe UI, sans-serif", label: "Segoe UI" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Courier New, monospace", label: "Courier New" },
  { value: "monospace", label: "Monospace" },
];
