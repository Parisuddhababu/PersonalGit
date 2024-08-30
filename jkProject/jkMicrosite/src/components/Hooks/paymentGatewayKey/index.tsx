import usePaymentGatewayKey from "@components/Hooks/paymentGatewayKey/usePaymentGatewayKey";

export interface IPaymentGatewayKeyProps {
  CCAVENUE_ACCESS_CODE?: string;
  CCAVENUE_APP_SECRET?: string;
  CCAVENUE_MERCHANT_ID?: string;
  payment_gateway_id?: string;
  payment_gateway_name?: string;
  STRIPE_KEY?: string;
  STRIPE_SECRET?: string;
  RAZORPAY_KEY?: string;
  RAZORPAY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
  MERCHANT_ID?: string,
  SALT_KEY?: string
}

export interface PaymentGatewayKeyOutputInterface {
  getPaymentMethodsKey: () => void;
  paymentGatewayKey?: IPaymentGatewayKeyProps[];
}

export default usePaymentGatewayKey;
