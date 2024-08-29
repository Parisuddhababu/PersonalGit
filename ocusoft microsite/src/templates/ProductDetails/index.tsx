import { IBaseTemplateProps } from "@templates/index";
import ProductDetails from "@templates/ProductDetails/productDetails";
import { IProductDetails } from "@type/Pages/productDetails";

export interface IProductDetailsMain extends IBaseTemplateProps, IProductDetails {}

export default ProductDetails;
