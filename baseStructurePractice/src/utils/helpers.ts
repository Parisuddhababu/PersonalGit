import { KEYS } from "@config/constant";
import moment from "moment";

export const verifyAuth = () => {
  return localStorage.getItem(KEYS.authToken) ? true : false;
};

export const destroyAuth = () => {
  localStorage.removeItem(KEYS.authToken);
};

export const authToken = () => {
  return localStorage.getItem(KEYS.authToken);
};
export const getDateFromTimestamp = (date : string) => {
  return moment(moment(parseInt(date)).format()).format('L')
}

export const getDateTimeFromTimestamp = (date : string) => {
  return moment(moment(parseInt(date)).format()).format('LTS')
}