import OfferPopup from "@templates/OfferPopup/offerPopup";
import { IImage } from "@type/Common/Base";

export interface IInputSelection {
  form_field: any
  image: IImage | null;
}
export interface IOfferProps {
  onClose: () => void;
  isModal: boolean;
  InputSelection: IInputSelection
}

export interface IOfferForm {
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  gender: string;
  country: string;
}


export default OfferPopup