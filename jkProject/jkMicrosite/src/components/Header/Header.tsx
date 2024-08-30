import React, { useEffect, useState } from "react";
import pagesServices from "@services/pages.services";
import { IHeaderProps, IHeaderTopState, IMetalType } from "@components/Header";
import HeaderTop from "./HeaderTop";
import MainMenu from "./MainMenu";
import store from "src/redux/store";
import {
  getCartcount,
  getUserDetails,
  setDynamicDefaultStyle,
} from "@util/common";
import ToastProvider from "@components/Toastr/Toastr";
import { Provider } from "react-redux";
import { getCurrentWishListItems } from "@util/addGuestCartData";
import Cookies from "js-cookie";
import http from "@util/axios";
import { IMAGE_PATH } from "@constant/imagepath";
import APICONFIG from "@config/api.config";
import HeaderTopTemplate2 from "@components/Header/HeaderTopTemplate2";
import MainMenuTemplate2 from "@components/Header/MainMenuTemplate2";

const Header = ({ menu, categoryTypeCount }: IHeaderProps) => {
  const [headerTopData, setHeaderTopData] = useState<IHeaderTopState>({
    announcement: "",
    generalconf_logo: {
      name: "",
      path: "",
    },
    generalconf_favicon_icon: {
      name: "",
      path: "",
    },
    generalconf_phone_number: "",
    website: {
      website_id: "",
      website_name: "",
    },
    _id: "",
    generalconf_link: "",
    cartCount: 0,
    wishlistCount: 0,
    availablePages: [],
  });
  const [availablePages, setAvailablePages] = useState<string[]>([]);
  const [headertype, setHeaderType] = useState(1);
  const [cartCount, setCartCount] = useState<number>(0);
  const [WishlistCount, setWishlistCount] = useState<number>(0);
  const [metalTypeData, setMetalTypeData] = useState<IMetalType[]>([]);
  // eslint-disable-next-line
  const [isHeader, setIsHeader] = useState<boolean>(false);
  // useEffect(() => {
  //   getMetalTypeData();
  //   getHeaderTopData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (http.defaults.headers.common["Accountcode"]) {
      getHeaderTopData();
      getMetalTypeData();
    }
    // eslint-disable-next-line
  }, [http.defaults.headers.common["Accountcode"]]);

  const getMetalTypeData = async () => {
    await pagesServices.getPage(APICONFIG.METAL_TYPE, {}).then((ele) => {
      setMetalTypeData(ele.data);
    });
  };

  const getHeaderTopData = async () => {
    const response = await pagesServices.getPage(APICONFIG.HEADERTOP, {});
    setHeaderType(response?.data?.type)
    await setDynamicDefaultStyle(response?.default_style, response?.theme);
    setIsHeader(true);
    if (response.status) {
      setHeaderTopData(
        {
          contact_header: response?.data?.header_contact?.data?.[0],
          ...response?.data?.header_announcement?.data?.[0],
        } || null
      );
      Cookies.set(
        "favicon",
        response?.data?.header_announcement?.data?.[0]?.generalconf_favicon_icon?.path ? response?.data?.header_announcement?.data?.[0]?.generalconf_favicon_icon?.path : response?.data?.header_announcement?.data?.[0]?.generalconf_logo?.path
      );
      Cookies.set(
        "loaderImg",
        response?.data?.micrsoite_logo?.loader_image?.path || IMAGE_PATH.favicon
      );
      Cookies.set(
        "baseTemplate",
        response?.base_template
      );
      setAvailablePages(response?.data?.active_pages);
      if (getUserDetails()) {
        setCartCount(response?.data?.cart_count);
        setWishlistCount(response?.data?.wishlist_count);
      } else {
        //@ts-ignore
        setCartCount(getCartcount());
        setWishlistCount(getCurrentWishListItems().length);
      }
    }
  };

  const getDynamicHeaderTop = () => {
    if (headertype === 1) {
      return (
        <HeaderTop
          {...headerTopData}
          cartCount={cartCount}
          wishlistCount={WishlistCount}
          availablePages={availablePages}
        />
      );
    } else if (headertype === 2) {
      return (
        <HeaderTopTemplate2
          {...headerTopData}
          cartCount={cartCount}
          wishlistCount={WishlistCount}
          availablePages={availablePages}
          //@ts-ignore
          menu={menu}
        />
      );
    } else {
      return (
        <HeaderTop
          {...headerTopData}
          cartCount={cartCount}
          wishlistCount={WishlistCount}
          availablePages={availablePages}
        />
      );
    }
  };

  const getDynamicMainMenu = () => {
    if (headertype === 1) {
      return (
        <MainMenu
          menu={menu}
          logo={headerTopData?.generalconf_logo?.path || ""}
          metal_type={metalTypeData}
          categoryTypeCount={categoryTypeCount}
        />
      );
    } else if (headertype === 2) {
      return (
        <MainMenuTemplate2
          menu={menu}
          metal_type={metalTypeData}
          logo={headerTopData?.generalconf_logo?.path || ""}
          categoryTypeCount={categoryTypeCount}

        />
      );
    } else {
      return (
        <MainMenu
          menu={menu}
          logo={headerTopData?.generalconf_logo?.path || ""}
          metal_type={metalTypeData}
          categoryTypeCount={categoryTypeCount}

        />
      );
    }
  };

  return (
    // @ts-ignore
    <ToastProvider>
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
