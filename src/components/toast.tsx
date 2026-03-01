import { useEffect, useState } from "react";
import "./Toast.scss";

type ToastType = "success" | "error" | "info";

type ToastState = {
  message: string;
  type: ToastType;
  visible: boolean;
};

let triggerToast: ((msg: string, type?: ToastType) => void) | null = null;

export const showToast = (message: string, type: ToastType = "info") => {
  triggerToast?.(message, type);
};

export default function Toast() {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "info",
    visible: false,
  });

  useEffect(() => {
    triggerToast = (message, type = "info") => {
      setToast({ message, type, visible: true });

      setTimeout(() => {
        setToast((t) => ({ ...t, visible: false }));
      }, 2500);
    };

    return () => {
      triggerToast = null;
    };
  }, []);

  if (!toast.visible) return null;

  return (
    <div className={`toast-float ${toast.type}`}>
      {toast.message}
    </div>
  );
}
