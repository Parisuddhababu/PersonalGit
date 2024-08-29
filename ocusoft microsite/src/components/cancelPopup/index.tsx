export interface ICancelPopupProps {
  onClose: () => void;
  onCancel: (data: { confirmed: boolean; cancel_reason: string }) => void;
}
export interface ICancelOrderForm {
  cancel_reason: string;
}
