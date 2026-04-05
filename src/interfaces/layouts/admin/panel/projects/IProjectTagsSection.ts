import type { ChangeEvent } from "react";

export interface ProjectTagsSectionProps {
  newTagName: string;
  loading?: boolean;
  saving?: boolean;
  deletingId?: string | null;

  onTagNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onCreateTag: () => Promise<void> | void;
  onDeleteTag: (id: string) => Promise<void> | void;
}