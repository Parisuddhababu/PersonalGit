import { IProductDetails } from "@type/Pages/productDetails";
import CustomiseProductPopup from "@templates/ProductDetails/components/customiseProduct/customise-product-1";
import { ICustomiseProductHookProps } from "@components/Hooks/customiseProductDetails";
export interface ICustomiseProductProps {
  data: IProductDetails;
  onClose: () => void;
  customProductDetails: ({ }: object) => any;
  customProductData: ({ }: object) => any;
  isModal: boolean;
  customiseData?: ICustomiseProductHookProps;
}

export interface ICustomiseFormFields {
  metal_type: string
  metal_purity: string
  metal_color: string
  diamond: string;
  color_stone: string;
}

export default CustomiseProductPopup;
