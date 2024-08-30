import { IImage, IPagination } from "@type/Common/Base";

export interface IMyorderData extends IPagination {
  data: IMyOrderDataProps[];
}

export interface IMyOrderDataProps {
  created_at: string;
  currency_symbol: string;
  waybill_no?: string;
  total_cost: string;
  is_advance: number;
  order_number: string;
  order_status: number;
  transactions?: ITransactions;
  _id: string;
  order_items: IMyOrderitemsData[];
}

export interface ITransactions {
  order_id : string,
  payment_status_text:string,
  transaction_id:string,
  _id: string
}

export interface IMyOrderitemsData {
  order_id: string;
  product: IProductData;
  products: IProductMaindata;
  qty: string;
  waybill_no?: string;
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



