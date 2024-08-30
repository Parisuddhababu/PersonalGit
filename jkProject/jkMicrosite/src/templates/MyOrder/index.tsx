import MyOrder from "@templates/MyOrder/my-order";
import { IMyOrderDataProps } from "@type/Pages/myOrders";
import { IBaseTemplateProps } from "..";


export interface IMyOrdersMain extends IBaseTemplateProps, IMyOrderDataProps {}

export default MyOrder