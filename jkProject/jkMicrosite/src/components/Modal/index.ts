import Modal from "./Modal";
import { ReactNode } from "react";

export interface IModalProps {
  open: boolean;
  className?: any;
  children: ReactNode;
  dimmer?: boolean;
  onOpen?: () => void;
  onClose: () => void;
  headerName?: string;
}

export default Modal;
