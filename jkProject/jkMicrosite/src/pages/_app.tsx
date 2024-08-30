/* eslint-disable no-console, no-control-regex*/
import React, { useEffect, useState } from "react";
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
// const MaintenanceMode = dynamic(
//   () => import("@components/Maintenance/Maintenance")
// );
// import getConfig from "next/config";
import { setAuthHeader, setDynamicDefaultStyle } from "@util/common";
import pagesServices from "@services/pages.services";
import { IRootColor } from "@type/Common/Base";
import http from "@util/axios";
import { getWebsiteCode } from "@util/accountCode";
import Head from "next/head";
import { GetServerSideProps } from "next";
import APICONFIG from "@config/api.config";
import { Router } from "next/router";
import { IsBrowser } from "@util/common";
// const { publicRuntimeConfig } = getConfig();
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
    //@ts-ignore
    window["next_referrer"] =
      window.history.state !== null
        ? window.history.state.as
        : preURL
          ? //@ts-ignore
          preURL?.as
          : "";
  }
});

const App = ({ Component, pageProps }: AppProps) => {
  const [menu, setMenu] = useState<any>(null);
  // eslint-disable-next-line
  const [type, setType] = useState<number>(1);
  const getDefaultStyleData = () => {
    pagesServices.getPage(APICONFIG.DEFAULT_STYLE_API, {}).then((resp) => {
      setDynamicDefaultStyle(resp.default_style, resp.theme);
    });
  };

  useEffect(() => {
    if (!menu?.data) {
      getHeaderMenuData();
    }
    // eslint-disable-next-line

    if (IsBrowser && (!preURL || preURL !== window.history.state)) {
      preURL = window.history.state;
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (http.defaults.headers.common["Accountcode"]) {
      getDefaultStyleData();
    }
    // eslint-disable-next-line
  }, [http.defaults.headers.common["Accountcode"]]);

  const getHeaderMenuData = async () => {
    if (pageProps) {
      // @ts-ignore
      const canonical = pageProps?.canonical;
      if (canonical) {
        const { accountCode } = await getWebsiteCode(canonical);
        if (accountCode && accountCode !== undefined) {
          http.defaults.headers.common["Accountcode"] = await accountCode;
          // @ts-ignore
          http.defaults.headers["Accountcode"] = accountCode;
        }
      }
    }
    const menu = await pagesServices.getHeader();
    setType(menu?.data?.type);
    setMenu(menu);
  };

  const getMainCssAsParTemplateType = () => {
    if (type === 1) {
      return (
        <>
          <link rel="stylesheet" href={"/assets/css/app.min.css"} />
        </>
      );
    } else if (type === 2) {
      return (
        <>
          <link rel="stylesheet" href={"/assets/css/pages/index-2.min.css"} />
        </>
      );
    } else {
      return (
        <>
          <link rel="stylesheet" href={"/assets/css/app.min.css"} />
        </>
      );
    }
  };

  return (
    <>
      <Head>{getMainCssAsParTemplateType()}</Head>
      <>
        <Header
          // @ts-ignore
          menu={menu?.data}
          categoryTypeCount={menu?.data?.category_type_count}
          // @ts-ignore
          breadcrumbs={pageProps?.ctx?.breadcrumbs}
          // @ts-ignore
          pageTemplate={pageProps?.ctx?.page_template}
        />

        <Provider store={store}>
          <div className="page-wrapper">
            <NextNProgress />
            {/* {IsBrowser ? ( */}
            <>
              {/* @ts-ignore */}
              <ToastProvider>
                <Component {...pageProps} suppressHydrationWarning />
              </ToastProvider>
            </>
            {/* ) : (
            <></>
          )} */}
            <Footer />
          </div>
        </Provider>
      </>
    </>
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
    http.defaults.headers.common["Authorization"] = token;
  } else {
    delete http.defaults.headers.common["Authorization"];
  }
};
export default App;
