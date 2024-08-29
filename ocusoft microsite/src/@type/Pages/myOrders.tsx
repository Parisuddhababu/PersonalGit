import { IImage, IPagination } from "@type/Common/Base";
import { IBillingAddressData, IOrderProduct, IOrderedData, ShippingAddress } from "./orderDetails";

export interface IMyorderData extends IPagination {
  data: IMyOrderDataProps[];
}

export interface IMyOrderDataProps {
  created_at: string;
  currency_symbol: string;
  total_cost: string;
  is_advance: number;
  order_number: string;
  order_status: number;
  transactions?: ITransactions;
  _id: string;
  order_items: IMyOrderitemsData[];
}

export interface ITransactions {
  order_id: string,
  payment_status_text: string,
  transaction_id: string,
  _id: string
}

export interface IMyOrderitemsData {
  order_id: string;
  product: IProductData;
  products: IProductMaindata;
  qty: string;
  size_name: string;
  total_price: number;
  total_rate_card_Details: ITotalCardRateDetails;
  _id: string;
}

export interface IProductData {
  sku: string;
  title: string;
  _id: string;
}

export interface IProductMaindata {
  created_at: string;
  _id: string;
  images: IImage[];
}

export interface ITotalCardRateDetails {
  created_at: string;
  original_total_price: number;
  total_price: number;
  _id: string;
}



export interface IMyOrderListProps {
  data: IOrderListData
}


export interface IOrderListData {
  _id: string
  user_info?: UserInfo
  order_number: string
  shipping_address: ShippingAddress
  billing_address: IBillingAddressData
  payment_method?: string
  shipping_method?: string
  order_status: number
  total_cost: number;
  cart_summary: ICartSummary
  created_at: string
  order_items: OrderItem[];
  order_details?: IOrderedData
  total_shipping_charges?: number;
  tracking_number?:string;
  cancel_reason?:string;
}

export interface UserInfo {
  user_id: string
}


export interface ICartSummary {
  account_id: string
  cart_id: string
  user_id: string
  sub_total: number
  tax_price: number
  total_price: number
  cart_count: number
}

export interface OrderItem {
  _id: string
  item_price: number
  total_price: number
  product: IOrderProduct
  qty: number
  order_item_status: number
  order_id: string
}





