import type { ReactNode } from "react";

export interface DeleteModalProps {
  confirmLabel?: string;
  description?: string;
  errorMessage?: ReactNode;
  formAction: string | ((formData: FormData) => void | Promise<void>);
  itemName: string;
  pending?: boolean;
  resourceLabel: string;
  triggerLabel?: string;
}
