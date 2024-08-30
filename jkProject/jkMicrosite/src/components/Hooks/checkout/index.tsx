export { default as UsePlaceOrder } from './usePlaceOrder'

export interface UsePlaceOrderOutputProps {
  placeOrder: () => void;
  placeOrderLoading: boolean;
  // eslint-disable-next-line
  getPaymentStatusFromStripe: (id: string) => void;
  getPaymentStatusFromPhonepay: (_merchant_id: string, _transactionId: string, _order_id: string,
    _salt_key: string) => void
}

export interface PlaceOrderAddressDetails {
  name?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  mobile_no: string;
}

export interface PlaceOrderFormDataInterface {
  cart_id: string;
  is_advance: string;
  advance_amount: string;
  advance_percent: string;
  remaining_amount: string;
  gift_wrap_price: string | number;
  receiver_email: string;
  sender_email: string;
  message?: string;
  account_id: string;
  is_gift_wrap: number;
  payment_method?: number;
  billing_address?: PlaceOrderAddressDetails;
  shipping_address?: PlaceOrderAddressDetails;
  is_gst?: number;
  business_name?: string;
  gst_number?: string
}