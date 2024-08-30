import Toastr from "@components/Toastr/Toastr";
import { ReactNode } from "react";
export interface IToastrProps {
  children?: ReactNode;
  type: "success" | "warning" | "error";
  close: () => void;
  sticky: boolean | undefined
}

export interface IToastFilter {
  id: string;
  content?: any;
  type: "success" | "warning" | "error";
  sticky?:boolean
}

export default Toastr;
