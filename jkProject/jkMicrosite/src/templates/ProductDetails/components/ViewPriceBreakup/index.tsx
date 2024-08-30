import ViewPriceBreakup from "@templates/ProductDetails/components/ViewPriceBreakup/ViewPriceBreakup";
import { IProductDetails } from "@type/Pages/productDetails";
export interface IPriceBreakupProps {
  data: IProductDetails;
  onClose: () => void;
  isModal: boolean;
}

export default ViewPriceBreakup;
