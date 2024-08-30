export { default as ErrorPage } from "./Error";

export interface IErrorPageprops {
  code: number;
  message: string;
  error?: any;
  domainName? : string
}
