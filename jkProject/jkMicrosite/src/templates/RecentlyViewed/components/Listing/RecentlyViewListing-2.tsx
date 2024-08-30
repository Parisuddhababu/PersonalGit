import {
  IAddtoWishList,
  IRemoveWishList,
} from "@components/Hooks/addtoWishList";
import useAddtoWishList from "@components/Hooks/addtoWishList/addtoWishList";
import APPCONFIG from "@config/app.config";
import { IListMainProductProps } from "@type/Pages/productList";
import { getCurrentWishListItems } from "@util/addGuestCartData";

import { getComponents } from "@templates/ProductList/components";
import { IMAGE_PATH } from "@constant/imagepath";

import {
  getParseUser,
  getUserDetails,
} from "@util/common";
import Head from "next/head";
import { useState, useEffect } from "react";
import { IRecentlyViewList } from "@type/Pages/recentlyView";
import useLoadMoreHook from "@components/Hooks/loadMore";
import APICONFIG from "@config/api.config";
import { API_SECTION_NAME } from "@config/apiSectionName";
import Loader from "@components/customLoader/Loader";
import ProductBox from "@templates/ProductList/components/ProductListSection/product-box";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";

const RecentlyViewListing2 = (props: IRecentlyViewList) => {
  const [wishListData, setWishListData] = useState([]);
  const [productlist, setProductList] = useState(props?.original?.data);


  // const currencySymbol = useCurrencySymbol();
  const { adddtoWishListProduct, removeWishListProduct, getWishListData } =
    useAddtoWishList();
  const [isQuickView, setIsQuickView] = useState<boolean>(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const currencySymbol = useCurrencySymbol();
  useEffect(() => {
    getWishList();
    // eslint-disable-next-line
  }, []);

  const {
    loadedMoreData,
    loadMoreFunc,
    currentPage,
    showLoadMoreButton,
    setShowLoadMoreButton,
  } = useLoadMoreHook();

  useEffect(() => {
    if (loadedMoreData?.length !== 0) {
      setProductList([...productlist, ...loadedMoreData]);
    }
    if (props?.original?.draw === 1) {
      setShowLoadMoreButton(false);
    }
    // eslint-disable-next-line
  }, [loadedMoreData]);

  const loadMoreFunctionCall = () => {
    getFormData(loadMoreFunc);
  };

  const getFormData = (funcLoadMoreOfHook: any) => {
    const formData = new FormData();
    const totalDataToget = currentPage * APPCONFIG.ANY_LIST_LENGTH;
    const object = {
      start: totalDataToget
    }
    formData.append("start", totalDataToget.toString());
    funcLoadMoreOfHook(APICONFIG.RECENT_PRODUCT_LIST_BY_ID, API_SECTION_NAME.recently_view_list, object);
  };

  const getWishList = async () => {
    if (getUserDetails()) {
      const resposne = await getWishListData();
      setWishListData(resposne?.data[0]?.item_id);
    } else {
      const gueatWishlist = getCurrentWishListItems();
      const itemArray = gueatWishlist.map(
        (ele: IAddtoWishList) => ele?.item_id
      );
      setWishListData(itemArray);
    }
  };

  const onCloseQuickView = () => {
    setIsQuickView(false);
  };

  const addtoWishList = async (data: IListMainProductProps) => {
    const getUserDetails: any = getParseUser();
    setIsLoading(true);
    // @ts-ignore
    if (!wishListData?.includes(data?.product?._id) || !wishListData.length) {
      let wishListObj = {
        type: APPCONFIG.DEFAULT_QTY_TYPE,
        account_id: getUserDetails?.user_detail?.register_from as string,
        // @ts-ignore
        item_id: data?.product?._id,
      };
      await adddtoWishListProduct(wishListObj as IAddtoWishList);
      getWishList();
      setIsLoading(false);
    } else {
      let arr = [];
      // @ts-ignore
      arr.push(data?.product?._id);
      let wishListObj = {
        account_id: getUserDetails?.user_detail?.register_from as string,
        item_id: arr,
      };
      await removeWishListProduct(wishListObj as IRemoveWishList);
      getWishList();
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loader />}
      <section className="similar-products-section">
        <div className="container">
          <div className="page-title">
            <h2>Recently Viewed</h2>
          </div>
          <div className="grid-section row">
            {productlist?.map((product: any, index) => {
              return (
                <ProductBox
                  product={{
                    slug: product.product.slug,
                    image: product?.images?.[0]?.path
                      ? product?.images?.[0]?.path
                      : IMAGE_PATH.noImagePng,
                    title: product.product.title,
                    is_available_for_order: product?.is_available_for_order,
                    product_id: product?.product_id ?? product?.product._id,
                    _id: product.product._id,
                    website_product_id: product._id,
                    is_discounted: product.price_breakup?.is_discounted,
                    discount_per: product.discount_percentage,
                    product_tag_name: product.product_tag_name,
                    is_fix_price: product.is_fix_price,
                    diamond_total_carat: product.diamond_total_carat,
                    net_weight: product.net_weight,
                    total_price: product.total_price ?? product?.price_breakup?.total_price,
                    currency_symbol: currencySymbol,
                    original_total_price: product.price_breakup?.original_total_price,
                    sku: product.product?.sku,
                    is_in_wishlist: product.is_in_wishlist
                  }}
                  setIsQuickView={() => setIsQuickView(true)}
                  setQuickViewSlug={() => setQuickViewSlug(product.product.slug)}
                  product_tags_detail={props?.product_tags_detail}
                  wishListData={wishListData}
                  key={index}
                  addtoWishList={() => addtoWishList(product)}
                  type={1}
                />
              );
            })}
          </div>
          {
            showLoadMoreButton && productlist?.length > 0 && (
              <div className="blog-list-content-footer flex-center">
                <button
                  className="btn btn-primary btn-small"
                  onClick={loadMoreFunctionCall}
                >
                  Load More
                </button>
              </div>
            )
          }
        </div>
      </section >


      {
        isQuickView ? (
          getComponents("2", "quick_view", {
            isModal: isQuickView,
            slug: quickViewSlug,
            onClose: onCloseQuickView,
          })
        ) : (
          <></>
        )}

      <Head>
        {/* <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(2, CSS_NAME_PATH.recenltyViewedCards)}
        /> */}
        {/* <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(2, CSS_NAME_PATH.similarProductsTemplate2)}
        /> */}
      </Head>
    </>
  );
};

export default RecentlyViewListing2;
