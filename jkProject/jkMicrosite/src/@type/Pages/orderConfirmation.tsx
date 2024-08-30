export interface ISummery {
  total_diamond_weight: number;
  total_metal_weight: number;
  total_cart_items_count: number;
  total_color_stone_carat: number;
}

export interface IAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  mobile_no: string;
}

export interface IOrderConfirmationData {
  net_total: number;
  cart_count: number;
  discount_amount: number;
  total_tax_amount: number;
  delivery_charge: number;
  total_cost: number;
  cart_summary: ISummery;
  quotation_number: string;
  _id: string;
  website_id: string;
  user_id: string;
  order_shipping_address: IAddress;
  order_billing_address: IAddress;
  order_payment: string;
  order_number: string;
  gift_wrap: {
    gift_wrap_price: number;
  };
  net_amount: number;
}

export interface IOrderConfirmationProps {
  cart_details: IOrderConfirmationData;
}
