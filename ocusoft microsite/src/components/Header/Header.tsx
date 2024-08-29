import React, { useEffect, useState } from "react";
import pagesServices from "@services/pages.services";
import { IHeaderProps, IHeaderTopState } from "@components/Header";
import HeaderTop from "@components/Header/HeaderTop";
import MainMenu from "@components/Header/MainMenu";
import store from "src/redux/store";
import {
  // getTypeBasedCSSPath,
  getTypeBasedCSSPath,
  getUserDetails,
  setDynamicDefaultStyle,
} from "@util/common";
import ToastProvider from "@components/Toastr/Toastr";
import { Provider, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import http from "@util/axios";
import APICONFIG from "@config/api.config";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { setCartCountAction } from "src/redux/product/productAction";
import { Action_Update_Site_Logo } from "src/redux/whatsApp/whatsAppAction";

const Header = ({ menu }: IHeaderProps) => {
  const [headerTopData, setHeaderTopData] = useState<IHeaderTopState>({
    contact_header: "",
    base_template: 1,
    availablePages: [],
    cartCount: 0,
    data: {
      header: {
        announcement: "",
        country: {
          country_phone_code: "",
        },
        email: '',
        header_link: "",
        mobile: "",
        site_logo: {
          path: ""
        }
      },
      micrsoite_logo: {
        loader_image: {
          path: ""
        }
      }

    }
  });

  const [isHeader, setIsHeader] = useState<boolean>(false);
  const dispatch = useDispatch()

  useEffect(() => {
    if (http.defaults.headers.common["Accountcode"]) {
      getHeaderTopData();
    }
  }, [http.defaults.headers.common["Accountcode"]]);

  const getHeaderTopData = async () => {
    const response = await pagesServices.getPage(APICONFIG.HEADERTOP, {});
    setDynamicDefaultStyle(response?.default_style, response?.theme);
    setIsHeader(true);
    if (response.status) {
      setHeaderTopData(
        {
          contact_header: response?.data?.header?.mobile,
          ...response,
        }
      );
      updateSiteLogo(response?.data?.header?.site_logo?.path ?? response?.data?.header?.logo);
      Cookies.set(
        "favicon",
        response?.data?.header ? response?.data.micrsoite_logo?.loader_image?.path : response?.data?.header?.favicon_icon?.path);
      if (response?.data?.micrsoite_logo?.loader_image?.path) {
        Cookies.set(
          "loaderImg",
          response?.data?.micrsoite_logo?.loader_image?.path
        );
      }
      Cookies.set(
        "baseTemplate",
        response?.base_template
      );
      if (getUserDetails()) {
        dispatch(setCartCountAction(response?.data?.cart_count));
      }
    }
  };

  const updateSiteLogo = (logo: string) => {
    dispatch(Action_Update_Site_Logo(logo));
  };

  const getDynamicHeaderTop = () => {
    return (
      <HeaderTop
        {...headerTopData}
      // availablePages={availablePages}
      />
    );
  };

  const getDynamicMainMenu = () => {
    return (
      <MainMenu
        menu={menu}
      />
    );
  };
  return (
    // @ts-ignore
    <ToastProvider>
      <Head>
        <link rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.header)}
        />

      </Head>
      <Provider store={store}>
        {(isHeader && menu) && (
          <header>
            {getDynamicHeaderTop()}
            {getDynamicMainMenu()}
          </header>
        )}
      </Provider>
    </ToastProvider>
  );
};

export default Header;
