import { CheckCircle, XCircle } from "lucide-react";
import { TToast } from "@/components/types/TToast";

interface ToastProps {
  toast: TToast | null;
}

/**
 * Molecule: Toast Component
 * Displays toast notifications with success/error icons
 */
export default function Toast({ toast }: ToastProps) {
  if (!toast) return null;

  return (
    <div className={`toast ${toast.type}`}>
      {toast.type === "success" && <CheckCircle size={20} />}
      {toast.type === "error" && <XCircle size={20} />}
      <span>{toast.message}</span>
    </div>
  );
}
