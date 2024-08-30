export interface IDeletePopupProps {
  onClose: () => void;
  // eslint-disable-next-line
  isDelete: (data: boolean) => void;
  message: string;
}