import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import CheckoutDetails1 from "@templates/Checkout/components/Details/checkout-details-1"
import CheckoutPayment1 from "@templates/Checkout/components/Payment/checkout-payment-1"
import CheckoutSummery1 from "@templates/Checkout/components/Summery/checkout-summery-1"
import  GiftMessage1 from "@templates/Checkout/components/GiftMessage/gift-message-1"


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
    user_address_list_1: CheckoutDetails1,
    payment_gateway_1: CheckoutPayment1,
    cart_details_1: CheckoutSummery1,
    gift_message_1: GiftMessage1,
};


/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: any) => {
    const ComponentName = getTypeWiseComponentName(type, name);
    const RenderComponent = componentMapping[ComponentName];
    if (RenderComponent) {
        return <RenderComponent {...props} />;
    }
};
