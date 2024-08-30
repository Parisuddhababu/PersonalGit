import { ReactNode } from "react";

export interface INoDataAvailableProps {
  title: string;
  message?: string;
  image?: string;
  children?: ReactNode;
}
