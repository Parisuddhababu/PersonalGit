import Checkout from "@templates/Checkout/checkout";
import { IBaseTemplateProps } from "@templates/index";
import { ICheckout } from "@type/Pages/checkout";

export interface ICheckoutMain extends IBaseTemplateProps, ICheckout {}

export default Checkout;
