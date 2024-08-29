import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { IOrderConfirmationProps } from "@type/Pages/orderConfirmation";

const OrderConfirmation = (props: { data: IOrderConfirmationProps }) => {
  const router = useRouter()
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.successfullyProcessed)}
        />
        <title>Order Confirmation</title>
      </Head>
      <main>
        <br />
        <div className="successfully-processed-section">
          <div className="container">
            <em className="osicon-like-circle center-icon"></em>
            <h2>Your Order Has Been Successfully Processed!</h2>
            <div className="order-details">
              <p>Your order # is: <Link href={`/my-orders/${router?.query?.query}`}><a>{props?.data?.cart_details?.order_number}</a></Link></p>
              <p>Click here for order details.</p>
            </div>
            <Link href='/products'>
              <button type="button" className="btn btn-primary" aria-label="continue-shopping-btn">continue shopping</button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default OrderConfirmation;
