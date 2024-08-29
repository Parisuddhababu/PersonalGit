import React from "react";
import { getComponents } from "@templates/Cart/components/index";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPathPages } from "@util/common";
const Cart = () => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPathPages(null, CSS_NAME_PATH.cart)} />
      </Head>
      <main>
        {['cart_items']?.map((ele) =>
          getComponents(
            '1',
            ele,
            []
          )
        )}
      </main>
    </>
  );
};

export default Cart;
