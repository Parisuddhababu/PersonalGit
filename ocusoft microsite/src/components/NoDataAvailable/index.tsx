import { ReactNode } from "react";

export interface INoDataAvailableProps {
  title: string;
  message?: string;
  image?: string;
  isSuccess?:boolean;
  children?: ReactNode;
}
