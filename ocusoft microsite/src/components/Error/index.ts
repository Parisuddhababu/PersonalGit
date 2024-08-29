export { default as ErrorPage } from "@components/Error/Error";

export interface IErrorPageprops {
  code: number;
  message: string;
  error?: any;
  domainName? : string
}
