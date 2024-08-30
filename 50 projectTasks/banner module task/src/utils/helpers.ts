import { KEYS } from "@config/constant";

export const verifyAuth = () => {
  return localStorage.getItem(KEYS.authToken) ? true : false;
};

export const destroyAuth = () => {
  localStorage.removeItem(KEYS.authToken);
};

export const authToken = () => {
  return localStorage.getItem(KEYS.authToken);
};
