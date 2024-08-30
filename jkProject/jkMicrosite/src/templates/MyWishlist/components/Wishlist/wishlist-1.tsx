import Loader from "@components/customLoader/Loader";
import { IAddtoCart } from "@components/Hooks/addtoCart";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import { IAddtoWishList, IRemoveWishList } from "@components/Hooks/addtoWishList";
import useAddtoWishList from "@components/Hooks/addtoWishList/addtoWishList";
import useLoadMoreHook from "@components/Hooks/loadMore";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import { API_SECTION_NAME } from "@config/apiSectionName";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IWishListProps, IWishListPropsData } from "@type/Pages/myWishlist";
import { getCurrentWishListItems, updateGuestWishListData } from "@util/addGuestCartData";
import { getParseUser } from "@util/common";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import Link from "next/link";
import { updateWishListCounter } from "src/redux/signIn/signInAction";
import { IMAGE_PATH } from "@constant/imagepath";
import ProductBox from "@templates/ProductList/components/ProductListSection/product-box";

const MyWishlistSection1 = (props: IWishListProps) => {
  const [wishListData, setWishListData] = useState<IWishListPropsData[]>([]);
  const { adddtoCartProduct, decreaseWishListCount } = useAddtoCart();
  const { removeWishListProduct, getUpdatedWishListData } = useAddtoWishList();
  const { showError } = useToast();
  const dispatch = useDispatch();
  // const showPr
  const currencySymbol = useCurrencySymbol();
  const addCart = async (id: any, productId: string) => {
    if (productId === undefined) {
      showError("Product Id is missing ");
      return;
    }
    await adddtoCartProduct({
      item_id: id,
      qty: APPCONFIG.DEFAULT_QTY_TYPE,
      is_from_product_list: 1,
      productId: productId
    } as IAddtoCart);
    deleteWishList(productId);
  };

  const deleteWishList = async (productid: string) => {
    if (props.guest) {
      const wishListData = getCurrentWishListItems();
      const index = wishListData.findIndex(
        (ele: IAddtoWishList) => ele.item_id === productid
      );
      if (index !== -1) {
        wishListData.splice(index, 1);
        localStorage.setItem(
          APPCONFIG.GUEST_WISHLIST_DATA,
          JSON.stringify(wishListData)
        );
        // @ts-ignore
        dispatch(setLoader(true));
        await props.refreshData();
        await decreaseWishListCount(1);
        // @ts-ignore
        dispatch(setLoader(false));
      }
      return true;
    }
    let parseUser = getParseUser();
    // @ts-ignore
    if (parseUser && parseUser?.user_detail) {
      let arr = [];
      arr.push(productid);
      let Data = {
        // @ts-ignore
        account_id: parseUser.user_detail?.register_from,
        item_id: arr,
      };
      const response = await removeWishListProduct(Data as IRemoveWishList);
      if (response?.meta?.status_code == 200) {
        const wishListResponse = await getUpdatedWishListData();
        setWishListData(wishListResponse?.data?.wishlist_data?.original?.data);
      }
    }
  };

  const loaderData = useSelector((state) => state);
  const {
    loadedMoreData,
    loadMoreFunc,
    currentPage,
    showLoadMoreButton,
    setShowLoadMoreButton,
  } = useLoadMoreHook();

  useEffect(() => {
    setWishListData(props?.data);
    dispatch(updateWishListCounter(+props?.data?.length || 0));
    updateGuestWishListData(props?.data)
    // eslint-disable-next-line
  }, [props?.data])

  useEffect(() => {
    if (loadedMoreData?.length !== 0) {
      setWishListData([...wishListData, ...loadedMoreData]);
    }
    if (props?.draw === 1) {
      setShowLoadMoreButton(false);
    }
    // eslint-disable-next-line
  }, [loadedMoreData]);

  const getFormData = async (funcLoadMoreOfHook: any) => {
    const totalDataToget = currentPage * APPCONFIG.ANY_LIST_LENGTH;
    const wishListData = await getCurrentWishListItems();
    const removeItemIdfromData = await removeItemIdFromGuestData(wishListData)
    const object = {
      product_id: removeItemIdfromData || [],
      start: totalDataToget,
    };
    funcLoadMoreOfHook(
      APICONFIG.GUEST_USER_WISHLIST,
      API_SECTION_NAME.guest_user_wishList,
      object
    );
  };

  const loadMoreFunctionCall = () => {
    getFormData(loadMoreFunc);
  };

  const removeItemIdFromGuestData = (wishListDataOfGuest: any) => {
    return wishListDataOfGuest?.map((ele: any) => ele?.item_id)
  }

  return (
    <>
      <Head>
        {/* <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productCard)}
        /> */}
        {/* <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myAccountCard)}
        /> */}

        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />
      </Head>
      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState ? (
        <Loader />
      ) : (
        <section className="wishlist_section">
          <div className="container">
            <div className="grid-section row">
              {wishListData?.length === 0 ? (
                <NoDataAvailable title="No WishList Product found..!!">
                  <Link href="/">
                    <a className="btn btn-secondary btn-small">Go to Home</a>
                  </Link>
                </NoDataAvailable>
              ) : (
                wishListData?.map((product: any, index) => {
                  return (
                    <ProductBox
                      product={{
                        slug: product.slug ?? product.product.slug,
                        image: product?.images?.[0]?.path
                          ? product?.images?.[0]?.path
                          : IMAGE_PATH.noImagePng,
                        title: product.product.title,
                        is_available_for_order: 1,
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
                      product_tags_detail={props?.product_tags_detail}
                      wishListData={wishListData}
                      key={index}
                      type={1}
                      isWishList={true}
                      addCart={() => {
                        addCart(product?._id, product?.product_id)
                      }}
                      deleteWishList={() => {
                        deleteWishList(
                          product.price_breakup.product_id
                            ? product.product_id
                            : product?.product?._id
                        )
                      }}
                    />
                  );
                })
              )}
            </div >
          </div >
          {
            wishListData?.length > 0 && showLoadMoreButton && (
              <div className="flex-center load-more">
                <button
                  className="btn btn-primary btn-small"
                  onClick={loadMoreFunctionCall}
                >
                  Load More
                </button>
              </div>
            )
          }
        </section >
      )}

    </>
  );
};

export default MyWishlistSection1;
