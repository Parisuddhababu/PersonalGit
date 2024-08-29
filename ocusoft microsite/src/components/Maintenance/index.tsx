import { ReactNode } from "react";

export interface MaintenanceModeProps {
  title: string;
  message?: string;
  image?: string;
  children?: ReactNode;
}
