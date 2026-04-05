import type { ChangeEvent } from "react";

export interface ProjectCategoriesSectionProps {
  newCategoryName: string;
  newCategoryDescription: string;
  loading?: boolean;
  saving?: boolean;
  deletingId?: string | null;

  onCategoryNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCategoryDescriptionChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCreateCategory: () => Promise<void> | void;
  onDeleteCategory: (id: string) => Promise<void> | void;
}