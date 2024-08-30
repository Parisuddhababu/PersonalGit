import React from "react";
import {useState} from "react"
import Head from "next/head";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import MyaccountComponent from "@components/Account";
import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
import MyAddressSection1 from "./components/Address";
import { MyaddressPropsMain } from ".";
import { getTypeBasedCSSPath } from "@util/common";

const MyAddress = (props:MyaddressPropsMain) => {
  const [type] =  useState(props?.data?.user_address_list_type ?? 1)
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
         <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myaccountBanner)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.avatar)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(type, CSS_NAME_PATH.accountTabs)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myaccountAddressBooktabs)}
        />
         <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myAccountCard)}
        />
          <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myAccountLoadMore)}
        />

      </Head>

      <main>
        <MyaccountComponent />
        <section className="account_details">
          <div className="container">
            <MyAccountHeaderComponent />
            <MyAddressSection1 useraddressDetails = {props?.data?.user_address_list?.data}/>
          </div>
        </section>
      </main>
    </>
  );
};

export default MyAddress;
