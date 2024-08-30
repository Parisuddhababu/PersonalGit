export interface IDeletePopupProps {
  onClose: () => void;
  isDelete: (data: boolean) => void;
  message: string;
}

export type DeleteConfirmationBoxProps = {
  onClose: () => void;
  onDelete: () => void;
  message: string;
}