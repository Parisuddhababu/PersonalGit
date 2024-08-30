import { useState, useMemo, ReactNode, useContext, createContext, useCallback } from "react";
const ToastContext = createContext(null as any);
import { Toast } from "@components/Toastr/toaster";
import { IToastFilter, ToasterComponent } from "@components/Toastr";
import { generateSecureRandomNumber } from "@util/common";

// Create a random ID
function generateUEID () {
  let first: string | number = (generateSecureRandomNumber() * 46656) | 0;
  let second: string | number = (generateSecureRandomNumber() * 46656) | 0;
  first = ("000" + first.toString(36)).slice(-3);
  second = ("000" + second.toString(36)).slice(-3);

  return first + second;
}

export const ToastProvider = (props: ToasterComponent) => {
  const [toasts, setToasts] = useState<IToastFilter[]>([]);
  const open = (content: ReactNode, type: string, sticky: boolean = false) =>
    setToasts((currentToasts: any) => [
      ...currentToasts,
      { id: generateUEID(), content, type, sticky },
    ]);

  const close = (id: string) =>
    setToasts((currentToasts) =>
      currentToasts.filter((toast: IToastFilter) => toast.id !== id)
    );

  const showSuccess = (msg: string) => {
    open(msg, "success");
  };
  const showWarning = (msg: string) => {
    open(msg, "warning");
  };

  const showError = (msg: string, sticky: boolean = false) => {
    open(msg, "error", sticky);
  };
  const handleClose = useCallback((id: string) => () => {
    close(id);
  }, []);

  const contextValue = useMemo(() => ({ open, showError, showSuccess, showWarning }), [toasts]);

  return (
    /* eslint-disable-next-line */
    <ToastContext.Provider
      value={contextValue}
    >
      {props.children}
      <div className="toasts-wrapper">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast?.type}
            close={handleClose(toast?.id)}
            sticky={toast.sticky}
          >
            {toast.content}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => {
  const toastHelpers = useContext(ToastContext);
  return toastHelpers;
};

export { ToastContext, useToast };
export default ToastProvider;
