import { getCurrencyCode, objToString } from "@util/common";
import { encryptDecrypt } from "@components/Hooks/paymentGatewayKey/usePaymentGatewayKey";
import { IPaymentGatewayKeyProps } from "@components/Hooks/paymentGatewayKey";
import { PlaceOrderAddressDetails } from "@components/Hooks/checkout";
import getConfig from "next/config";
import { ICheckout } from "@type/Pages/checkout";
import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";

const ccav = require("src/util/ccavenue.js");
const { publicRuntimeConfig } = getConfig();

export interface CcAvenuePaymentProps {
  paymentGatewayKey?: IPaymentGatewayKeyProps[];
  props: ICheckout;
}

export interface CcAvenuePaymentOutputInterface {
  // eslint-disable-next-line no-unused-vars
  handleCCAvenuePayment: (
    order_id: string,
    // eslint-disable-next-line
    billingDetails?: PlaceOrderAddressDetails,
    // eslint-disable-next-line
    shippingDetails?: PlaceOrderAddressDetails
  ) => void;
}

const useCcAvenuePayment = ({
  paymentGatewayKey,
  props,
}: CcAvenuePaymentProps): CcAvenuePaymentOutputInterface => {
  const getCCAvenueMerchantId = () => {
    if (paymentGatewayKey) {
      const index = paymentGatewayKey.findIndex(
        (ele: IPaymentGatewayKeyProps) =>
          ele.payment_gateway_name &&
          ele.payment_gateway_name.toLowerCase() ===
            APPCONFIG.PAYMENT_METHODS.ccavenue
      );

      return paymentGatewayKey?.[index]?.CCAVENUE_MERCHANT_ID;
    }
  };
  const getCCAvenueAppSecret = () => {
    if (paymentGatewayKey) {
      const index = paymentGatewayKey.findIndex(
        (ele: IPaymentGatewayKeyProps) =>
          ele.payment_gateway_name &&
          ele.payment_gateway_name.toLowerCase() ===
            APPCONFIG.PAYMENT_METHODS.ccavenue
      );

      return paymentGatewayKey?.[index]?.CCAVENUE_APP_SECRET;
    }
  };

  const handleCCAvenuePayment = (
    order_id: string,
    billingDetails?: PlaceOrderAddressDetails,
    shippingDetails?: PlaceOrderAddressDetails
  ) => {
    let data: any;
    data = ccav.encrypt(
      objToString({
        merchant_id: encryptDecrypt(getCCAvenueMerchantId()),
        currency: getCurrencyCode() || "INR",
        order_id: order_id,
        amount: props?.list?.cart_details?.total_cost,
        redirect_url:
          (window ? window.location.origin : publicRuntimeConfig.FRONT_URL) +
          APICONFIG.CCAVENUERESPONSE,
        cancel_url:
          (window ? window.location.origin : publicRuntimeConfig.FRONT_URL) +
          "/cart/checkout_list/",
        // billing_name: billingDetails?.name,
        billing_city: billingDetails?.city,
        billing_state: billingDetails?.state,
        billing_zip: billingDetails?.zip,
        billing_tel: billingDetails?.mobile_no,
        delivery_name: shippingDetails?.name,
        delivery_address: shippingDetails?.address,
        delivery_city: shippingDetails?.city,
        delivery_state: shippingDetails?.state,
        delivery_zip: shippingDetails?.zip,
        delivery_tel: shippingDetails?.mobile_no,
      }),
      encryptDecrypt(getCCAvenueAppSecret())
    );
    const enc = document.getElementById("encRequest") as HTMLInputElement;
    enc.value = data;
    const form = document.getElementById("nonseamless") as HTMLFormElement;
    form.submit();
  };

  return {
    handleCCAvenuePayment,
  };
};

export default useCcAvenuePayment;
