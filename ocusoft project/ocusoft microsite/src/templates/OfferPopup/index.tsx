import OfferPopup from "@templates/OfferPopup/offerPopup";

export interface IOfferForm {
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  gender: string;
  country: string;
}

export interface IOtherValueType {
  price_range? : [number, number],
  custom_image? : File | null
  upload_logo? : File | null
}



export default OfferPopup