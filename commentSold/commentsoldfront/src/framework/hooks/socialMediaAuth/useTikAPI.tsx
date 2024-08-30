import { ITikAPIPopupOptions, ITikAPIResponse } from "@/types/hooks";
import { TikAPI } from "@/utils/tikapi";
import { useEffect } from "react";

export const useTikAPI = (onLoginCallback: (_data: ITikAPIResponse) => void) => {
  useEffect(() => {
    TikAPI?.onLogin(onLoginCallback);
  }, [onLoginCallback]);

  const openPopup = (options: ITikAPIPopupOptions) => {
    TikAPI?.popup(options);
  };

  return { openPopup };
};
