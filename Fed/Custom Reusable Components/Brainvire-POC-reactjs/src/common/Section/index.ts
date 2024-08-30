import { ReactNode } from "react";
export { default as Section } from "./Section";

export interface ISection {
  className: string;
  header: any;
  containerInclude?: boolean;
  children?: ReactNode;
}

export interface ISectionHead {
  title?: string;
  description?: string;
  title_tag: "h1" | "h2" | "h3";
  title_class?: string;
  sub_title?: string;
  sub_title_tag?: "h1" | "h2" | "div";
  sub_title_class?: string;
  custom_Header?: ReactNode;
  button?: {
    title: string;
    url: string;
    target?: string;
  };
  animataion?: {
    title?: string;
    sub_title?: string;
    button?: string;
  };
}
