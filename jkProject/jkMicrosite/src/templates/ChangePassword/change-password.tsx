import React, { useEffect , useState} from "react";
import Head from "next/head";
import ChangePasswordSection1 from "@templates/ChangePassword/components/Password/password";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import MyaccountComponent from "@components/Account";
import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
import { useSelector } from "react-redux";
import { ISignInReducerData } from "@type/Common/Base";
import { useRouter } from "next/router";
import { getTypeBasedCSSPath } from "@util/common";

const ChangePassword = (props:any) => {
  const reduxData = useSelector((state: ISignInReducerData) => state);
  const router = useRouter();
  const [type] =  useState(props?.data?.change_password_temp_type ?? 1)

  useEffect(() => {
    if (reduxData?.guestUserRootReducer?.guestUserFlag) {
      router.push('/sign-in')
    }
    // eslint-disable-next-line
  }, [])
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
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myAccountBankDetails)}
        />
      </Head>

      <main>
        <MyaccountComponent />

        <section className="account_details">
          <div className="container">
            <MyAccountHeaderComponent />
            <ChangePasswordSection1 />
          </div>
        </section>
      </main>
    </>
  );
};

export default ChangePassword;
