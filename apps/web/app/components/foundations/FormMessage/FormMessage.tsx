import { Bomb, CircleCheckBig } from "lucide-react";

import type { FormMessageProps } from "./FormMessage.types";

export const FormMessage = ({ error, success }: FormMessageProps) => {
  return (
    <>
      {error && (
        <p className="text-danger border-danger/40 bg-danger/10 flex items-center gap-2 border px-3 py-2 text-sm">
          <Bomb size={14} />
          <span className="flex gap-1">
            <strong>Error:</strong>
            <span>{error}</span>
          </span>
        </p>
      )}
      {success && (
        <p className="text-success border-success/40 bg-success/10 flex items-center gap-2 border px-3 py-2 text-sm">
          <CircleCheckBig size={14} />
          <span>{success}</span>
        </p>
      )}
    </>
  );
};
