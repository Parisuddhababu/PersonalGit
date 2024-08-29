import { IBaseTemplateProps } from "@templates/index";
import { IOrderConfirmationProps } from "@type/Pages/orderConfirmation";
import OrderConfirmation from "@templates/OrderConfirmation/order-confirmation";

export interface IOrderConfirmation extends IBaseTemplateProps, IOrderConfirmationProps {}

export default OrderConfirmation;
