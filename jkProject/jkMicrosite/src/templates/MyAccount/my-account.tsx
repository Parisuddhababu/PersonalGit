import React from "react";
import Head from "next/head";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import MyaccountComponent from "@components/Account";
import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
import MyAccountSection1 from "@templates/MyAccount/components/Account/my-account-1";

const MyAccount = () => {
  return (
    <>
      <Head>
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
        <MyaccountComponent />

        <section className="account_details">
          <div className="container">
            <MyAccountHeaderComponent />
            <MyAccountSection1/>
          </div>
        </section>
      </main>
    </>
  );
};

export default MyAccount;
