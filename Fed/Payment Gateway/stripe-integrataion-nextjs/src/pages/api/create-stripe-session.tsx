import APPCONFIG from "@/config/app.config";
import { NextApiRequest, NextApiResponse } from "next";

import Stripe from "stripe";

const CreateStripeSession = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const stripe = new Stripe(APPCONFIG.STRIPE_SECRATE_KEY, {
    apiVersion: "2023-08-16",
  });
  const { item } = req.body;
  const requiredparams = {
    price_data: {
      currency: item.currency,
      unit_amount: item.unit_amount,
      product_data: {
        name: item.name,
        description: item.description,
        images: [item.image],
      },
    },
    quantity: 1,
  };

  await stripe.checkout.sessions
    .create({
      payment_method_types: ["card"],
      line_items: [requiredparams],
      mode: "payment",
      success_url: `${item.success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: item.cancel_url,
      metadata: {
        images: item.image,
        order_id: item.order_id,
      },
      customer_email: item?.customer_email,
    })
    .then((session) => {
      res.json({ id: session.id });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

export default CreateStripeSession;
