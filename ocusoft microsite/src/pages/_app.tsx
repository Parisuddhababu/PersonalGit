/* eslint-disable no-console, no-control-regex*/
import React, { Fragment, useEffect, useState } from "react";
import { AppContext, AppProps } from "next/app";
import "mapbox-gl/dist/mapbox-gl.css";
import { Provider } from "react-redux";
import store from "src/redux/store";

// Components
import NextNProgress from "@components/NextNProgress";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("@components/Header/Header"), {
  ssr: true,
});
const Footer = dynamic(() => import("@components/Footer/Footer"), {
  ssr: true,
});
const ToastProvider = dynamic(() => import("@components/Toastr/Toastr"), {
  ssr: true,
});

import { setAuthHeader, setDynamicDefaultStyle, IsBrowser } from "@util/common";
import pagesServices from "@services/pages.services";
import { IRootColor } from "@type/Common/Base";
import http from "@util/axios";
import { getWebsiteCode } from "@util/accountCode";
import { GetServerSideProps } from "next";
import APICONFIG from "@config/api.config";
import { Router } from "next/router";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify'
import Head from "next/head";
import Loader from "@components/customLoader/Loader";
export interface IMyAppProps {
  menu: any;
  Context: {
    default_style: IRootColor;
    theme: string;
  };
  ctx: {
    breadcrumbs: {
      name: string;
      link: string;
    };
    page_template: string;
  };
}
let preURL: string;
Router.events.on("beforeHistoryChange", () => {
  if (IsBrowser) {
    if (window.history.state !== null) {
      //@ts-ignore
      window["next_referrer"] = window.history.state.as;
    } else if (preURL) {
      //@ts-ignore
      window["next_referrer"] = preURL.as;
    } else {
      //@ts-ignore
      window["next_referrer"] = "";
    }
  }
});

const App = ({ Component, pageProps }: AppProps) => {
  const [menu, setMenu] = useState<any>(null);
  const getDefaultStyleData = () => {
    pagesServices.getPage(APICONFIG.DEFAULT_STYLE_API, {}).then((resp) => {
      setDynamicDefaultStyle(resp.default_style, resp.theme);
    });
  };

  useEffect(() => {
    if (!menu?.data) {
      getHeaderMenuData();
    }

    if (IsBrowser && (!preURL || preURL !== window.history.state)) {
      preURL = window.history.state;
    }
  }, []);

  useEffect(() => {
    if (http.defaults.headers.common["Accountcode"]) {
      getDefaultStyleData();
    }
  }, [http.defaults.headers.common["Accountcode"]]);

  const getHeaderMenuData = async () => {
    if (pageProps) {
      // @ts-ignore
      const canonical = pageProps?.canonical;
      if (canonical) {
        const { accountCode, isPreview } = await getWebsiteCode(canonical);
        if (accountCode && accountCode !== undefined) {
          http.defaults.headers.common["Accountcode"] = await accountCode;
          // @ts-ignore
          http.defaults.headers["Accountcode"] = accountCode;

          //@ts-ignore
          http.defaults.headers["Ispreview"] = isPreview;
          http.defaults.headers.common['Ispreview'] = isPreview;
        }
      }
    }
    const menu = await pagesServices.getHeader();
    setMenu(menu);
  };


  return (
    <Fragment>
      <Head>
        <link rel="stylesheet" href="/assets/css/common/common.min.css" />
      </Head>
      <Provider store={store}>
        <Header
          menu={menu?.data}
        />
        <ToastContainer />
        <div className="page-wrapper">
          <Loader />
          <NextNProgress />
          <ToastProvider>
            <Component {...pageProps} suppressHydrationWarning />
          </ToastProvider>
          <Footer />
        </div>
      </Provider>
    </Fragment>
  );
};

// @ts-ignore
export const getServerSideProps: GetServerSideProps = async ({
  ctx,
}: AppContext) => {
  /**
   * Before api call check token exits then set header
   */
  const token = await setAuthHeader(ctx?.req);
  if (token) {
    if (token) {
      http.defaults.headers.common["Authorization"] = token;
    }
  } else {
    delete http.defaults.headers.common["Authorization"];
  }
};
export default App;
