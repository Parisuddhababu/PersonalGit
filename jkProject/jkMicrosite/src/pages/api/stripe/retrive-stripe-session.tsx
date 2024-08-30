import { IPaymentGatewayKeyProps } from "@components/Hooks/paymentGatewayKey";
import { encryptDecrypt } from "@components/Hooks/paymentGatewayKey/usePaymentGatewayKey";
import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import pagesServices from "@services/pages.services";
import Stripe from "stripe";

export default async function handler(req: any, res: any) {
  const paymentKey = await pagesServices.paymentKeyDetailsForApi(
    APICONFIG.PAYMENT_GATEWAT_KEYS,
    req,
    {}
  );
  const index = await paymentKey?.data?.payment_gateway_details?.findIndex(
    (ele: IPaymentGatewayKeyProps) =>
      ele?.payment_gateway_name &&
      ele?.payment_gateway_name.toLowerCase() ===
        APPCONFIG.PAYMENT_METHODS.stripe
  );
  const stripe = new Stripe(
    // @ts-ignore
    encryptDecrypt(
      paymentKey?.data?.payment_gateway_details?.[index]?.STRIPE_SECRET
    ),
    {
      apiVersion: "2020-08-27",
    }
  );
  const { id } = req.body;

  try {
    if (!id) {
      throw Error("Incorrect Checkout session Id");
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(id);

    if (checkout_session) {
      const data = JSON.stringify(checkout_session);
      const Ss = JSON.parse(data);
      if (Ss.payment_intent) {
        const paymentDetails = await stripe.paymentIntents.retrieve(
          Ss.payment_intent
        );
        res
          .status(200)
          .json({ checkout: checkout_session, paymentDetails: paymentDetails });
      } else {
        res
          .status(200)
          .json({ checkout: checkout_session, paymentDetails: Ss });
      }
    }
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
}
