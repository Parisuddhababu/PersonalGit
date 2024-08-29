import Cart from "@templates/Cart/cart";
import { IBaseTemplateProps } from "@templates/index";
import { ICart } from "@type/Pages/cart";

export interface ICartListMain extends IBaseTemplateProps, ICart {}

export default Cart;
