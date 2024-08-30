import { IImage } from "@type/Common/Base";

export interface IMyOrderDetails {
  props: IMyOrderDetailsProps;
}

export interface IMyOrderDetailsProps {
  billing_address: IBillingAddressData;
  created_at: string;
  currency_symbol: string;
  delivery_date: string;
  gross_amount: number;
  is_advance: number;
  net_amount: number;
  order_items: IOrderItemArray[];
  order_number: string;
  order_status: number ;
  payment_method: number;
  shipping_address: IPropsShippingAddress;
  total_cost: number;
  total_discont: number;
  total_shipping_charges: number;
  total_tax_amount: number;
  transactions: ITransactionProps;
  updated_at: string;
  user_info: IUserInfoProps;
  _id: string;
  transaction_id: string;
  gift_wrap: IGiftwrapprops;
  is_gst?: number;
  business_name?: string;
  gst_number?: string;
}

export interface IGiftwrapprops {
  gift_recipient: string;
  gift_sender: string;
  gift_message: string;
  gift_wrap_charge: number;
}

export interface IUserInfoProps {
  email: string;
  mobile: string;
  user_id: string;
  country: {
    country_phone_code: string;
  };
}

export interface ITransactionProps {
  _id: string;
  order_id: string;
  transaction_id: string;
  payment_status_text: string;
}

export interface IPropsShippingAddress {
  address: string;
  city: string;
  country: string;
  mobile_no: string;
  name: string;
  state: string;
  zip: string;
}

export interface IOrderItemArray {
  default_metal: IDefaultMetalProps;
  diamond_details: IDiamondDetailsProps[];
  item_id: string;
  item_price: number;
  order_id: string;
  product: IProductProps;
  products: IProductsProps;
  qty: string;
  size: string | number | null;
  size_name: string;
  waybill_no?: string;
  total_rate_card_Details: ITotalRateCardDetails;
  _id: string;
}

export interface ITotalRateCardDetails {
  certificate_charge: number;
  color_stone_rate: number;
  hallmark_charge: number;
  labour_charge: number;
  metal_rate: number;
  net_weight: number;
  product_id: string;
  side_diamond_rate: number;
  stamping_charge: number;
  total_color_stone_price: number;
  total_diamond_price: number;
  total_metal_price: number;
  total_price: number;
  website_product_id: string;
  _id: string;
}

export interface IProductProps {
  categories: ICategoryProps[];
  gross_weight: number;
  sku: string;
  slug: string;
  title: string;
  _id: string;
}

export interface IProductsProps {
  color_stone_details: IColorStoneDetails[];
  color_stone_name: string;
  default_metal_name: string;
  diamond_details: IDiamondDetailsProps;
  images: IImage[];
  total_diamond_carat: number;
  total_diamond_pcs: number;
  _id: string;
}

export interface IColorStoneDetails {
  color_stone_name: string;
  carat: string;
  color_stone_id?: string
}

export interface ICategoryProps {
  category_id: string;
  category_name: string;
}

export interface IDiamondDetailsProps {
  diamond_quality_name: string;
  diamond_shape_name: string;
  diamond_sieve_name: string;
  carat: string;
  pcs: string;
}

export interface IDefaultMetalProps {
  metal_purity_id: string;
  metal_purity_name: string;
  metal_type_id: string;
  metal_type_name: string;
  weight: number;
}

export interface IBillingAddressData {
  address: string;
  city: string;
  country: string;
  mobile_no: string;
  name: string;
  state: string;
  zip: string;
}
