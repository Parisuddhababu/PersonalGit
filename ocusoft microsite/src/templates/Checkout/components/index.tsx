import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import CheckoutDetails1 from "@templates/Checkout/components/Details/checkout-details-1"
import CheckoutPayment1 from "@templates/Checkout/components/Payment/checkout-payment-1"


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
    user_address_list_1: CheckoutDetails1,
    payment_gateway_1: CheckoutPayment1,
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
