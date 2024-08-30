import React from "react";
import Head from "next/head";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

import MyOrderDetailsSection1 from "./components";

const MyOrderDetail = (props: any) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.orderDetails +
            ".min.css"
          }
        />
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.myAccount +
            ".min.css"
          }
        />
      </Head>

      <main>
      <MyOrderDetailsSection1 props={props?.data?.order_details} />
      </main>
    </>
  );
};

export default MyOrderDetail;
