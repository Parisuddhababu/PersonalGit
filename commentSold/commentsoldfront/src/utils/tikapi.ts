'use client'
import { TIKTOK_AVAILABLE_SCOPES, TIKTOK_OAUTH_URL } from "@/constant/common";
import { Message } from "@/constant/errorMessage";
import { TIKTOK_CLIENT_ID_REGEX } from "@/constant/regex";
import { ITikAPIPopupOptions, ITikAPIResponse } from "@/types/hooks";

export const TikAPI = (() => {
  if (typeof window === 'undefined') {
    return;
  }
  let callback: ((_data: ITikAPIResponse) => void) | null = null;

  const popup = (options: ITikAPIPopupOptions) => {
    if (!options.client_id) {
      throw new Error(Message.CLIENT_ID_REQUIRED);
    }

    options.client_id = ((client) => {
      if (!TIKTOK_CLIENT_ID_REGEX.test(client)) {
        throw new Error(Message.INVALID_CLIENT_ID);
      }
      return client;
    })(options.client_id);

    options.scope = ((scopes) => {
      if (!scopes || scopes === "") {
        return "";
      }
      scopes = typeof scopes === "string" ? decodeURIComponent(scopes).split(" ") : scopes;

      if (!scopes || !Array.isArray(scopes) || scopes.length === 0) {
        throw new Error(Message.SCOPE_INVALID);
      }

      const validScopes = scopes
        .map((s) => {
          if (!s || typeof s !== "string" || !TIKTOK_AVAILABLE_SCOPES.includes(s.trim().toUpperCase())) {
            return false;
          }
          return s.trim().toUpperCase();
        })
        .filter((s) => s) as string[];

      if (validScopes.length !== scopes.length) {
        throw new Error(Message.SOME_SCOPE_INVALID);
      }
      return validScopes.join("+");
    })(options.scope);

    options.is_popup = true;

    const urlQuery = new URLSearchParams();
    for (const key in options) {
      if (options[key as keyof ITikAPIPopupOptions]) {
        urlQuery.append(key, options[key as keyof ITikAPIPopupOptions] as string);
      }
    }

    const url = `${options.url || TIKTOK_OAUTH_URL}?${urlQuery.toString()}`;
    const left = window.screen.width / 2 - 500 / 2;
    const top = window.screen.height / 2 - 500 / 2;
    window.open(url, "Login with TikTok", `toolbar=no, width=500, height=720, top=${top}, left=${left}`);

    return url;
  };

  window.addEventListener(
    "message",
    (event) => {
      if (!event.data || !event.data._tikapi) return;
      if (typeof callback === "function") {
        return callback(event.data);
      }
    },
    false
  );

  return {
    popup,
    oauth: popup,
    onLogin: (cb: (_data: ITikAPIResponse) => void) => {
      callback = cb;
    },
  };
})();
