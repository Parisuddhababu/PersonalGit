import React, { useEffect, useState } from "react";
import Head from "next/head";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import MyaccountComponent from "@components/Account";
import MyAccountHeaderComponent from "@components/Account/MyAccountHeaderComponent";
import { getComponents } from "./components";
import { useRouter } from "next/router";
import MyWishlistSection1 from "./components/Wishlist";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import { IWishListProps } from "@type/Pages/myWishlist";
import MyWishlistSection2 from "@templates/MyWishlist/components/Wishlist/wishlist-2";
import { getParseUser, getTypeBasedCSSPath, setDynamicDefaultStyle } from "@util/common";
import { IPagination } from "@type/Common/Base";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";

const MyWishlist = (props: any) => {
  const [showGuestWishList, setShowGuestWishList] = useState<boolean>(false);
  const [guestWishlistData, setGuestWishlistData] = useState<IWishListProps[]>();
  const [paginationProperty, setPagePaginationProperty] = useState<IPagination>();
  const [loggedInWishListData, setLoggedInWishListData] = useState<any>(null);
  const [type, setType] = useState(props?.data?.wishlist_temp_type ?? 1)

  const { getGuestWishListData } = useAddtoCart();
  const Router = useRouter();
  useEffect(() => {
    let parseUser = getParseUser();
    // @ts-ignore
    if (!parseUser) {
      setShowGuestWishList(true);
      getWishlistData();
      setDynamicColour();
    } else {
      getLoggedInUserWishListData();
    }
    // eslint-disable-next-line
  }, [Router]);

  const getLoggedInUserWishListData = async () => {
    const response = await pagesServices.getPage(APICONFIG.WISHLIST, {});
    if (response) {
      setLoggedInWishListData(response);
      if (response?.data?.wishlist_temp_type) setType(response?.data?.wishlist_temp_type)
    }
  };

  const getWishlistData = async () => {
    setShowGuestWishList(false);
    const response = await getGuestWishListData();
    setDynamicColourGeust(response);
    setGuestWishlistData(response?.data?.original?.data);
    setPagePaginationProperty(response?.data?.original);
    setShowGuestWishList(true);
  };

  const setDynamicColour = () => {
    if (loggedInWishListData) {
      if (loggedInWishListData?.default_style && loggedInWishListData?.theme) {
        setDynamicDefaultStyle(loggedInWishListData?.default_style, loggedInWishListData?.theme);
      }
    }
  };
  const setDynamicColourGeust = (prop: any) => {
    if (prop?.default_style && prop?.theme) {
      setDynamicDefaultStyle(prop?.default_style, prop?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <main>
        {!showGuestWishList ? (
          <>
            <MyaccountComponent />

            <section className="account_details">
              <div className="container">
                <MyAccountHeaderComponent />

                {/* <MyWishlistSection1 /> */}
              </div>
            </section>
            {loggedInWishListData?.sequence?.map((ele: any) =>
              getComponents(type, ele, loggedInWishListData?.data?.[ele]?.original, props?.slugInfo?.product_tags_detail)
            )}
          </>
        ) : (
          <section className="account_details">
            <div className="container mb-2">
              <h2>
                <p>My Wishlist</p>
              </h2>
            </div>
            {guestWishlistData ? (
              props.data?.wishlist_temp_type === 1 ?
                <MyWishlistSection1
                  // @ts-ignore
                  data={guestWishlistData}
                  draw={paginationProperty?.draw || 1}
                  guest={true}
                  refreshData={() => {
                    getWishlistData();
                  }}
                  product_tags_detail={props?.slugInfo?.product_tags_detail}
                /> : <MyWishlistSection2
                  // @ts-ignore
                  data={guestWishlistData}
                  draw={paginationProperty?.draw || 1}
                  guest={true}
                  refreshData={() => {
                    getWishlistData();
                  }}
                />
            ) : (
              <></>
            )}
          </section>
        )}
      </main>
      <Head>
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.myAccount + ".min.css"} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myaccountBanner)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.avatar)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(type, CSS_NAME_PATH.accountTabs)} />
        {/* <link rel="stylesheet" href={getTypeBasedCSSPath(type, CSS_NAME_PATH.myAccountCard)} /> */}
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myAccountLoadMore)} />
        {/* 
        <title>
          {props?.slugInfo?.slug_info?.slug_detail?.meta_title ? props?.slugInfo?.slug_info?.slug_detail?.meta_title : props?.domainName}
        </title> */}
      </Head>
    </>
  );
};

export default MyWishlist;
