import { Toast } from "primereact/toast";
import React, { useMemo, useRef } from "react";

import * as CONSTANT from "../constant/constant";

const ToastContext = React.createContext(null);

const ToastProvider = ({ children }) => {
    const toast = useRef(null);
    const showSuccess = useMemo(() => msg => {
        toast.current.show({
            detail: msg,
            life: CONSTANT.TOAST_TIMEOUT,
            severity: CONSTANT.SUCCESS_MESSAGE_TYPE,
            summary: CONSTANT.SUCCESS_MESSAGE_SUMMARY,
        });
    }, [toast]);

    const showInfo = useMemo(() => msg => {
        toast.current.show({
            detail: msg,
            life: CONSTANT.TOAST_TIMEOUT,
            severity: CONSTANT.INFO_MESSAGE_TYPE,
            summary: CONSTANT.INFO_MESSAGE_SUMMARY,
        });
    }, [toast]);

    const showWarn = useMemo(() => msg => {
        toast.current.show({
            detail: msg,
            life: CONSTANT.TOAST_TIMEOUT,
            severity: CONSTANT.WARNING_MESSAGE_TYPE,
            summary: CONSTANT.WARNING_MESSAGE_SUMMARY,
        });
    }, [toast]);

    const showError = useMemo(() => msg => {
        toast.current.show({
            detail: msg,
            life: CONSTANT.TOAST_TIMEOUT,
            severity: CONSTANT.ERROR_MESSAGE_TYPE,
            summary: CONSTANT.ERROR_MESSAGE_SUMMARY,
        });
    }, [toast]);

    const toasterCollection = useMemo(() => {
        return { showSuccess, showInfo, showWarn, showError };
    },[showSuccess, showInfo, showWarn, showError]);

    return (
        <ToastContext.Provider value={toasterCollection}>
            <Toast ref={toast}></Toast>
            {children}
        </ToastContext.Provider>
    );
}

const useToast = () => {
    const toastHelpers = React.useContext(ToastContext);
    return toastHelpers;
}

export { ToastContext, useToast };
export default ToastProvider;
