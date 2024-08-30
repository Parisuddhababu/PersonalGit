import { IPaymentGatewayKeyProps } from "@components/Hooks/paymentGatewayKey";
import { encryptDecrypt } from "@components/Hooks/paymentGatewayKey/usePaymentGatewayKey";
import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import pagesServices from "@services/pages.services";

import Stripe from "stripe";

const CreateStripeSession = async (req: any, res: any) => {
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
  const { item } = req.body;

  const transformedItem = {
    price_data: {
      currency: item.currency,
      product_data: {
        images: [item.image],
        name: paymentKey?.data?.account?.account_name,
      },
      unit_amount: item.amount,
    },
    description: item.description,
    quantity: 1,
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [transformedItem],
    mode: "payment",
    success_url: `${item.success_url}?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: item.cancel_url,
    metadata: {
      images: item.image,
      order_id: item.order_id,
    },
    customer_email: item?.customer_email,
  });

  res.json({ id: session.id });
};

export default CreateStripeSession;
