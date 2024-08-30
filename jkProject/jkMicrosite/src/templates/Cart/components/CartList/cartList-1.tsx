import React, { useState, useEffect, useRef } from "react";
import { ICart, ICartListData, ICartSummery } from "@type/Pages/cart";
import Wrapper from "@components/Wrapper";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import {
  covertPriceInLocalString,
  getParseUser,
  getTotalDiamondCarat,
  getUserDetails,
} from "@util/common";
import { ICategorySummaryItems } from "@type/Pages/Products";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import { ICoupon, IDeleteCart, IUpdateCart } from "@components/Hooks/addtoCart";
import useAddtoWishList from "@components/Hooks/addtoWishList/addtoWishList";
import APPCONFIG from "@config/app.config";
import { IAddtoWishList } from "@components/Hooks/addtoWishList";
import { getComponents } from "@templates/Cart/components";
import { getTypeBasedCSSPath, setDynamicDefaultStyle } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import SignInFormSection1 from "@templates/SignIn/components/SignInForm";
import { useRouter } from "next/router";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import { ICartListMain } from "@templates/Cart";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@components/customLoader/Loader";
import CustomImage from "@components/CustomImage/CustomImage";
import {
  getCurrentGuestCartItems,
  getCurrentWishListItems,
} from "@util/addGuestCartData";
import DeletePopup from "@components/Deletepopup/DeletePopup";
import useGetGuestUserCart from "@components/Hooks/getGuestUserCart";
// import SignInFormSection2 from "@templates/SignIn/components/SignInForm/sign-in-form-2";
import Link from "next/link";
import { uuid } from "@util/uuid";
import { setLoader } from "src/redux/loader/loaderAction";
import Cookies from "js-cookie";
import PlaceInquiry from "@templates/PlaceInquiry";
import { useToast } from "@components/Toastr/Toastr";
import CustomiseBar from "../customiseBar";
import CustomiseProduct, {
  ICustomiseCombinations,
  ICustomiseData,
  ICustomiseProductListData,
} from "../customiseProduct";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import { Message } from "@constant/errorMessage";

const CartList1 = (props: ICartListMain) => {
  const currencySymbol = useCurrencySymbol();
  const { signInFormType } = useGetGuestUserCart();
  const showPrice =
    parseInt(Cookies.get("showPrice") ?? "") === 1 ? true : false;
  const isB2BUser =
    parseInt(Cookies.get("isB2BUser") ?? "") === 1 ? true : false;
  const [selectedProducts, setSelectedProducts] = useState<ICartListData[]>([]);
  const [selectAllTogle, setSelectAllTogle] = useState<boolean>(false);
  const [selectedProductCount, setSelectedProductCount] = useState<number>(0);
  const [currentProductIndex, setCurrentProductIndex] = useState<
    number | null
  >();

  const [cartList, setCartList] = useState<ICartListData[]>(
    props?.data?.cart_items
  );
  const [cartSummery, setCartSummery] = useState<ICartSummery>(
    props?.data?.cart_summary
  );
  const {
    clearAllGuestCart,
    getGuestCartData,
    deleteGuestUserCart,
    updateCartCount,
    decreaseCartCount,
    updateCart,
    getCartData,
    deleteCartItem,
    getCoupon,
    removeCoupon,
    applyCoupon,
    checkCartIteamsForCheckout,
  } = useAddtoCart();
  const { adddtoWishListProduct } = useAddtoWishList();
  const [remarkId, setRemarkId] = useState<string>("");
  const [remark, setRemark] = useState<string>("");
  const [guestRemarkIndex, setGuestRemarkIndex] = useState<number>();
  const [templateType] = useState<string>("1");
  const [cartCharges, setCartCharges] = useState<ICart>(props?.data);
  const [isQuickView, setIsQuickView] = useState<boolean>(false);
  const [couponModel, setCouponModel] = useState<boolean>(false);
  const [couponCount, setCouponCount] = useState<number>(0);
  const [newCouponCode, setNewCouponCode] = useState<string>();
  const [isApplyied, setIsApplied] = useState<boolean>();
  const [signInModal, setSigninModal] = useState<boolean>(false);
  // const [currentTax, setCurrentTax] = useState<number>(0);
  // const [totalCost, setTotalCost] = useState<number>(0);
  const Router = useRouter();
  const loaderData = useSelector((state) => state);
  const [isDeletePopup, setIsDeletePopup] = useState<boolean>(false);
  const [deleteItemData, setDeleteItemData] = useState<any>();
  const [isClearAll, setIsClearAll] = useState<boolean>(false);
  const [viewPlaceInquiry, setViewPlaceInquiry] = useState(false);
  const [categorySummaryItems, setCategorySummaryItems] = useState<
    ICategorySummaryItems[]
  >([]);
  const { showError } = useToast();
  const signInElementRef = useRef<HTMLDivElement>(null);
  const [allAvailableCombinations, setAllAvailableCombinations] =
    useState(null);
  const [customiseCombinations, setCustomiseCombinations] = useState<
    ICustomiseCombinations[]
  >([]);
  const [selectedProductCombinations, setSelectedProductCombinations] =
    useState<ICustomiseCombinations[]>([]);
  const [customiseCartListData, setCustomiseCartListData] =
    useState<null | ICustomiseProductListData>(null);
  const [
    allAvailableProductForCustomisation,
    setAllAvailableProductForCustomisation,
  ] = useState<ICartListData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customisableProductCount, setCustomisableProductCount] =
    useState<number>(0);
  const isShowProductDetails = parseInt(Cookies.get("isShowProductDetails") ?? '') === 1 ? true : false;

  const dispatch = useDispatch();
  useEffect(() => {
    setCartList(props?.data?.cart_items);
    setCartSummery(props?.data?.cart_summary);
    setIsApplied(props?.data?.coupon_code ? true : false);
    setNewCouponCode(props?.data?.coupon_code);
    if (getUserDetails()) {
      getCouponDetails(props?.data?.total_cost);
    }
    setDynamicColourGeust();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (signInModal) {
      window.scrollTo({
        behavior: "smooth",
        top:
          signInElementRef?.current?.offsetTop! -
          document?.getElementsByTagName("header")?.[0]?.offsetHeight!,
      });
    }
  }, [signInModal]);

  // useEffect(() => {
  //   if (!getUserDetails()) {
  //     let summation = 0;
  //     cartList.forEach((currentValue) => (summation = summation + currentValue.item_price * currentValue.qty));
  //     setTotalCost(summation);
  //   }
  //   // eslint-disable-next-line
  // }, [cartCharges, guestCartValue, cartList]);

  // useEffect(() => {
  //   if (!getUserDetails()) {
  //     setCurrentTax((totalCost * cartCharges?.tax_percentage) / 100);
  //   }
  //   // eslint-disable-next-line
  // }, [totalCost]);

  const getCouponDetails = async (totalCost: number) => {
    const couponResponse = await getCoupon(totalCost);
    setCouponCount(couponResponse?.data?.original?.recordsTotal);
  };
  const increaseCount = async (data: ICartListData, indexGuest: number) => {
    if (!(data?.qty < Number(data?.max_order_qty))) {
      showError(`Maximum Quantity for this product is ${data?.max_order_qty}`);
      return;
    }
    const obj = {
      qty: data?.qty + 1,
      cart_item: getUserDetails() ? data?._id : data?.item_id,
    };
    const response = await updateCart(
      obj as IUpdateCart,
      cartCharges?._id,
      getUserDetails() ? -1 : indexGuest
    );
    // if (response?.meta?.status_code == 200 || response) {
    if (response?.meta?.status_code == 200 && getUserDetails()) {
      await getUpdatedCartData();
      updateCartCount();
    } else {
      // updateGuestCartData(obj, "increment");
      if (!getUserDetails()) {
        guestCartData();
        updateCartCount();
      }
    }
  };
  const decreaseCount = async (data: ICartListData, indexGuest: number) => {
    if (!(data?.qty > Number(data?.min_order_qty))) {
      showError(`Minimum Quantity for this product is ${data?.min_order_qty}`);
      return;
    }
    const obj = {
      qty: data?.qty - 1,
      cart_item: getUserDetails() ? data?._id : data?.item_id,
    };
    const response = await updateCart(
      obj,
      cartCharges?._id,
      getUserDetails() ? -1 : indexGuest
    );
    if (response?.meta?.status_code == 200) {
      await getUpdatedCartData();
      decreaseCartCount(1);
    } else {
      if (!getUserDetails()) {
        guestCartData();
        decreaseCartCount(1);
      }
    }
    //  updateGuestCartData(obj, "decrement");
  };

  const onInputValueChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Delete"];
    if (
      e.key === " " ||
      (!allowedKeys.includes(e.key) && isNaN(Number(e.key)))
    ) {
      e.preventDefault();
    }
  };

  const handleCartCount = (qty: number, data: ICartListData) => {
    let count = Math.abs(qty - data?.qty);
    if (qty > data?.qty) {
      updateCartCount(count);
    }
    if (qty < data?.qty) {
      decreaseCartCount(count);
    }
  };

  const onQtyChange = async (
    data: ICartListData,
    indexGuest: number,
    addedQty: number
  ) => {
    let qty = addedQty;
    if (addedQty > +data?.max_order_qty) {
      showError(`Maximum Quantity for this product is ${data?.max_order_qty}`);
      qty = +data?.max_order_qty;
    }
    if (addedQty < +data?.min_order_qty) {
      showError(`Minimum Quantity for this product is ${data?.min_order_qty}`);
      qty = +data?.min_order_qty;
    }
    if (qty === data?.qty) {
      return;
    }

    const obj = {
      qty: qty,
      cart_item: getUserDetails() ? data?._id : data?.item_id,
    };
    const response = await updateCart(
      obj,
      cartCharges?._id,
      getUserDetails() ? -1 : indexGuest
    );

    if (response?.meta?.status_code == 200) {
      await getUpdatedCartData();
      handleCartCount(qty, data);
    } else {
      if (!getUserDetails()) {
        guestCartData();
        handleCartCount(qty, data);
      }
    }
  };

  // const updateGuestCartData = (obj: IUpdateCart, type: string) => {
  //   const tempCartList = [...cartList];
  //   const Index = cartList.findIndex((ele) => {
  //     return ele?.item_id == obj?.cart_item;
  //   });
  //   if (Index != -1) {
  //     // @ts-ignore
  //     tempCartList[Index].qty = obj?.qty;
  //     if (type == "increment") {
  //       if (tempCartList?.[Index]?.item_price) {
  //         setGuestCartValue(Math.round(guestCartValue + tempCartList?.[Index]?.item_price));
  //       }
  //     } else if (type == "decrement") {
  //       if (tempCartList?.[Index]?.item_price) {
  //         setGuestCartValue(guestCartValue - tempCartList?.[Index]?.item_price);
  //       }
  //     }
  //     setCartList(tempCartList);
  //   }
  // };

  const deleteCart = async (data: ICartListData) => {
    const parseUser = getParseUser();
    if (!parseUser) {
      const response = await deleteGuestUserCart(data?.item_id as string);
      if (response) {
        // @ts-ignore
        dispatch(setLoader(false));
        guestCartData();
        decreaseCartCount(data?.qty);
        Router.push("/cart/list");
      }
      return true;
    }
    const array = [data?._id];
    const obj = {
      cart_items_id: array,
      cart_id: cartCharges?._id,
    };
    const response = await deleteCartItem(obj as IDeleteCart);
    if (response?.meta?.status_code == 200) {
      getUpdatedCartData();
      decreaseCartCount(data?.qty);
      Router.push("/cart/list");
    }
  };

  const setDynamicColourGeust = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  const getUpdatedCartData = async () => {
    const resposne = await getCartData();
    setCartList(resposne?.data?.cart_items);
    setCartSummery(resposne?.data?.cart_summary);
    setCartCharges(resposne?.data);
    setNewCouponCode(resposne?.data?.coupon_code);
    if (getUserDetails()) {
      getCouponDetails(resposne?.data?.total_cost);
    }
    if (resposne?.data?.coupon_code) {
      setIsApplied(true);
    } else setIsApplied(false);
  };

  const guestCartData = async () => {
    const resposne = await getGuestCartData();
    setCartList(resposne?.data?.cart_items || []);
    setCartSummery(resposne?.data?.cart_summary || {});
    setCartCharges(resposne?.data || {});
    setNewCouponCode(resposne?.data?.coupon_code);
  };
  const getUpdatedCoupon = async () => {
    getUpdatedCartData();
  };

  const addtoWishList = async (data: ICartListData) => {
    const getUserDetails: any = getParseUser();
    let wishListData = {
      type: APPCONFIG.DEFAULT_QTY_TYPE,
      account_id: getUserDetails?.user_detail?.register_from as string,
      item_id: data?.product_id,
      fromCart: true,
    };
    const response = await adddtoWishListProduct(
      wishListData as IAddtoWishList
    );
    if (response?.meta?.status_code == 201) {
      getUpdatedCartData();
    }
    deleteCart(data);
  };

  const deleteAllItem = async () => {
    const parseUser = getParseUser();
    if (!parseUser) {
      const response = await clearAllGuestCart();
      if (response) {
        setCartList([]);
        Router.push("/cart/list");
      }
      return true;
    }
    const ids = cartList.map((ele: ICartListData) => {
      return ele?._id;
    });
    const obj = {
      cart_items_id: ids,
      cart_id: cartCharges?._id,
    };
    const response = await deleteCartItem(obj as IDeleteCart);
    if (response?.meta?.status_code == 200) {
      getUpdatedCartData();
      Router.push("/cart/list");
    }
    // decreaseCartCount(0)
  };

  const setRemarkEdit = async (data: ICartListData, reMarkIndex: number) => {
    setIsQuickView(true);
    setRemarkId(data?._id);
    setRemark(data?.remark);
    setGuestRemarkIndex(reMarkIndex);
  };

  const onCloseQuickView = () => {
    setIsQuickView(false);
    setCouponModel(false);
    setRemarkId("");
    setGuestRemarkIndex(-1);
  };

  const removeCouponCode = async () => {
    const response = await removeCoupon(cartCharges?._id as string);
    if (response?.meta?.status_code == 200) {
      getUpdatedCartData();
      setNewCouponCode("");
      setIsApplied(false);
    }
  };

  const ApplyCouponCode = async () => {
    const obj = {
      coupon_code: newCouponCode,
      cart_id: cartCharges?._id,
    };
    const response = await applyCoupon(obj as ICoupon);
    if (response?.meta?.status_code == 200) {
      setIsApplied(true);
      getUpdatedCartData();
    }
  };

  const onCheckout = async () => {
    const isCartIteamsValid = await checkCartIteamsForCheckout(
      cartList,
      props?.data?._id
    );
    if (
      isCartIteamsValid?.data?.success ||
      isCartIteamsValid?.meta?.status_code === 401
    ) {
      const parseUser = getParseUser();
      if (!parseUser) {
        setSigninModal(!signInModal);
        return true;
      } else {
        Router.push("/cart/checkout_list");
      }
    } else {
      const errors =
        isCartIteamsValid?.data?.errors &&
        Object.values(isCartIteamsValid?.data?.errors).flat();
      errors.map((msg: string) => showError(msg, true));
    }
  };

  const onCloseDeleteModal = () => {
    setIsDeletePopup(false);
  };

  const handleDeleteData = (isDelete: boolean) => {
    if (isDelete) {
      if (isClearAll) {
        setIsClearAll(false);
        deleteAllItem();
      } else {
        deleteCart(deleteItemData);
        setDeleteItemData(null);
      }
      onCloseDeleteModal();
    } else {
      setIsClearAll(false);
      onCloseDeleteModal();
      setDeleteItemData(null);
    }
  };

  // const components = {
  //   1: SignInFormSection1,
  //   2: SignInFormSection2,
  // };
  // @ts-ignore
  {
    /* Note : Below line is commented while resolving conflicts to development branch with development-template-2 */
  }
  // var DynamicSignInComponent = components[signInFormType];
  useEffect(() => {
    if (getUserDetails()) {
      setCartList(props?.data?.cart_items);
      setCartSummery(props?.data?.cart_summary);
      setCartCharges(props?.data);
      setSigninModal(false);
    }

    const categorySummary = props?.data?.category_wise_summary ?? {};

    const _categorySummaryItems: ICategorySummaryItems[] = [];

    Object.entries(categorySummary).forEach(([categoryKey, categoryIdObj]) => {
      const categoryValues = Object.values(categoryIdObj ? categoryIdObj : {});

      _categorySummaryItems.push({
        name: categoryKey,
        data: categoryValues.map((categoryObj) => {
          return {
            qty: categoryObj.qty ?? 0,
            label: categoryObj?.category ?? "",
            metalWeight: categoryObj?.metal_weight?.toFixed(2) ?? 0,
            diamondCarats: categoryObj?.diamond_carats?.toFixed(2) ?? 0,
            colorStoneCarats: categoryObj?.color_stone_carats?.toFixed(2) ?? 0,
          };
        }),
      });
    });

    setCategorySummaryItems([..._categorySummaryItems]);
    // eslint-disable-next-line
  }, []);

  const showPlaceInquiryModal = () => {
    if (getUserDetails()) {
      setViewPlaceInquiry(true);
    } else {
      // Router.push("sign-in", undefined, {shallow: true});
      setSigninModal(true);
    }
  };

  useEffect(() => {
    const selectedProductCount = selectedProducts.filter(
      (data) => data?.product_id
    );
    selectedProductCount?.length ===
      allAvailableProductForCustomisation?.filter((data) => data?.product_id)
        ?.length
      ? setSelectAllTogle(true)
      : setSelectAllTogle(false);
    setSelectedProductCount(selectedProductCount.length);
    setCustomisableProductCount(
      allAvailableProductForCustomisation?.filter((data) => data?.product_id)
        ?.length
    );

    let selectedProductCombinations = customiseCombinations;
    if (selectedProductCount?.length > 0 && customiseCombinations !== null) {
      selectedProductCombinations = customiseCombinations?.filter((item1) =>
        selectedProducts.some((item2) => item1?._id === item2?.item_id)
      );
    }
    setSelectedProductCombinations(selectedProductCombinations);
  }, [allAvailableProductForCustomisation, selectedProducts]);

  const handleCheckboxChange = (
    type: string,
    index?: number,
    data?: ICartListData
  ) => {
    type === "all" && setSelectedProducts(allAvailableProductForCustomisation);
    selectAllTogle && setSelectedProducts([]);
    if (type === "single") {
      const updatedCheckboxValues = [...selectedProducts];
      //@ts-ignore
      updatedCheckboxValues[index] = data?._id !== selectedProducts[index]?._id ? data : null;
      setSelectedProducts(updatedCheckboxValues);
    }
  };

  useEffect(() => {
    //@ts-ignore
    setAllAvailableProductForCustomisation(cartList?.map((ele) =>
      ele?.total_rate_card_Details?.is_fix_price !== 1 ? ele : null
    )
    );
    getCombinationList();
    getAllAvailableCombinations();
  }, [cartList]);

  const getCombinationList = async () => {
    const parseUser = getParseUser();
    let item_ids: string[] = [];

    if (!parseUser) {
      const guestUser = getCurrentGuestCartItems();
      guestUser.map(({ item_id }: { item_id: string }) =>
        item_ids.push(item_id)
      );
    }

    await pagesServices
      .postPage(APICONFIG.CART_ITEAM_COMBINATION, parseUser ? {} : { item_ids })
      .then(async (result) => {
        setCustomiseCombinations(result?.data);
      });
  };

  const getAllAvailableCombinations = async () => {
    await pagesServices
      .getPage(APICONFIG.CUSTOMIZATION_OPTIONS, {})
      .then(async (result) => {
        setAllAvailableCombinations(result?.data);
      });
  };

  const CustomizeProductData = async (data: ICustomiseData[]) => {
    setSelectedProductCount(0);
    setSelectedProducts([]);
    setIsLoading(true);
    try {
      const result = await pagesServices.postPage(
        APICONFIG.CART_ITEAM_PRICE_BREAKUP,
        { cart_items_ids: data }
      );
      if (!getUserDetails()) {
        const guestUserData = getCurrentGuestCartItems();
        const apiData = result?.data || {};
        console.log(apiData, "api data", guestUserData);
        const newGuestCartData = guestUserData.map(
          (item: ICustomiseData, index: number) =>
            apiData[index.toString()]
              ? apiData[index.toString()]?.error
                ? item
                : { ...item, ...data.find(({ cart_item }) => +cart_item! === index) }
              : item
        );

        localStorage.setItem(
          APPCONFIG.GUEST_CART_DATA,
          JSON.stringify(newGuestCartData)
        );
        guestCartData();
      } else {
        getUpdatedCartData();
      }
      setCustomiseCartListData(result?.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (customiseCartListData !== null) {
      setTimeout(() => {
        setCustomiseCartListData(null);
      }, 10000);
    }
  }, [customiseCartListData]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.cartTable)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.cartSummery)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.cartModel)}
        />
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />
      </Head>

      {signInModal ? (
        <>
          {signInFormType == 1 && (
            <link
              rel="stylesheet"
              href={
                APPCONFIG.STYLE_BASE_PATH_PAGES +
                CSS_NAME_PATH.signIn +
                ".min.css"
              }
            />
          )}
          <div className="guest-sign-in">
            {/* Note : Below line is commented while resolving conflicts to development branch with development-template-2 */}
            {/* <DynamicSignInComponent guestUser={true} /> */}
            <link
              rel="stylesheet"
              href={
                APPCONFIG.STYLE_BASE_PATH_PAGES +
                CSS_NAME_PATH.signIn +
                ".min.css"
              }
            />
          </div>
          <div className="guest-sign-in" ref={signInElementRef}>
            <SignInFormSection1
              guestUser={true}
              reloadPage={true}
              onComplete={() => {
                setSigninModal(false);
              }}
            />
          </div>
        </>
      ) : (
        <>
          {/* @ts-ignore */}
          {(isLoading || loaderData?.loaderRootReducer?.loadingState) && (
            <Loader />
          )}
          <div className="page-wrapper">
            <main>
              <div className="wrapper">
                <section className="heading-sec">
                  <div className="container">
                    <div className="heading-title-wrap">
                      <h2 className="heading-title">Shopping Cart</h2>
                    </div>
                  </div>
                </section>
                <section className="content">
                  <div className="container">
                    <ul className="progress-bar">
                      <li className="active">
                        <a>
                          1 <i className="jkm-check complete-mark"></i>
                        </a>
                        <span>Shopping Cart</span>
                      </li>
                      <li>
                        <a>
                          2<i className="jkm-check complete-mark"></i>
                        </a>
                        <span>Checkout</span>
                      </li>
                      <li>
                        <a>
                          3<i className="jkm-check complete-mark"></i>{" "}
                        </a>
                        <span>Order Confirmation</span>
                      </li>
                    </ul>
                  </div>
                </section>
                {cartList?.length > 0 && (
                  <CustomiseBar
                    selectedProducts={selectedProducts?.filter(
                      (el) => el?.product_id
                    )}
                    allAvailableCombinations={
                      customisableProductCount ? allAvailableCombinations : null
                    }
                    productCombinations={
                      customisableProductCount
                        ? selectedProductCombinations?.length > 0
                          ? selectedProductCombinations
                          : customiseCombinations
                        : []
                    }
                    CustomizeProductData={CustomizeProductData}
                  />
                )}
                <section className="shopping-cart-sec">
                  {cartList?.length ? (
                    <div className="container">
                      <div className="shopping-cart-wrap">
                        <section className="main-content">
                          <div className="table-wrap">
                            {cartList.length ? (
                              <table className="table-container">
                                <thead>
                                  <tr>
                                    <th>
                                      <div className="custom-checkbox">
                                        {customisableProductCount > 0 && (
                                          <>
                                            <input
                                              type="checkbox"
                                              onChange={() => {
                                                handleCheckboxChange("all");
                                              }}
                                              checked={
                                                customisableProductCount ===
                                                selectedProductCount
                                              }
                                            />
                                            <span></span>
                                          </>
                                        )}
                                      </div>
                                    </th>
                                    <th className="items-col first-item">
                                      Item
                                    </th>
                                    <th className="item-col col-2"> Size</th>
                                    <th className="item-col col-3">Quantity</th>
                                    {showPrice && (
                                      <th className="item-col col-4">Price</th>
                                    )}
                                  </tr>
                                </thead>

                                {cartList.map(
                                  (data: ICartListData, index: number) => (
                                    <>
                                      <tbody
                                        className="items-body"
                                        key={uuid()}
                                      >
                                        <tr className="item-info">
                                          <th>
                                            {data?.total_rate_card_Details
                                              ?.is_fix_price !== 1 ? (
                                              <div className="custom-checkbox">
                                                <input
                                                  type="checkbox"
                                                  onChange={() =>
                                                    handleCheckboxChange(
                                                      "single",
                                                      index,
                                                      data
                                                    )
                                                  }
                                                  checked={
                                                    data?._id ===
                                                    selectedProducts[index]?._id
                                                  }
                                                />
                                                <span></span>
                                              </div>
                                            ) : (
                                              <></>
                                            )}
                                          </th>
                                          <td className="first-item items-details">
                                            <div className="items-details-contnet items-col">
                                              <CustomImage
                                                src={
                                                  data?.products?.images[0]
                                                    ?.path
                                                }
                                                height="350px"
                                                width="350px"
                                                pictureClassName="items-details-img"
                                                alt={
                                                  data?.product?.title +
                                                  "_image"
                                                }
                                              />
                                              <div className="items-details-content-info">
                                                <div className="items-title">
                                                  <Link
                                                    href={`/product/detail/${data?.product?.slug}`}
                                                  >
                                                    <a>
                                                      {data?.product?.title}
                                                    </a>
                                                  </Link>
                                                </div>

                                                <div className="items-details-info sku-info">
                                                  <span>SKU: </span>
                                                  <span className="sku-name">
                                                    {data?.product?.sku}
                                                  </span>
                                                </div>

                                                {data?.products?.diamond_details
                                                  ?.length !== 0 &&
                                                  data?.total_rate_card_Details
                                                    ?.is_fix_price !== 1 && (
                                                    <div className="items-details-info">
                                                      <span>
                                                        Diamond Quality:{" "}
                                                      </span>
                                                      <>
                                                        <span>
                                                          {
                                                            data?.products
                                                              ?.diamond_details[0]
                                                              ?.diamond_quality_name
                                                          }
                                                        </span>
                                                      </>
                                                    </div>
                                                  )}
                                                {isShowProductDetails && data?.products?.diamond_details
                                                  ?.length !== 0 &&
                                                  data?.total_rate_card_Details
                                                    ?.is_fix_price !== 1 && (
                                                    <div className="items-details-info">
                                                      <span>
                                                        Diamond Weight:{" "}
                                                      </span>
                                                      <Wrapper key={uuid()}>
                                                        <span>
                                                          {getTotalDiamondCarat(
                                                            data?.products
                                                          )
                                                            ? Number(
                                                              getTotalDiamondCarat(
                                                                data?.products
                                                              )
                                                            ).toFixed(3) +
                                                            " ct"
                                                            : "-"}
                                                        </span>
                                                      </Wrapper>
                                                    </div>
                                                  )}

                                                {data?.metal_quality &&
                                                  data?.total_rate_card_Details
                                                    ?.is_fix_price !== 1 && (
                                                    <div className="items-details-info">
                                                      <span>
                                                        Metal Quality:{" "}
                                                      </span>
                                                      <span>
                                                        {data?.metal_quality}
                                                      </span>
                                                    </div>
                                                  )}
                                                {isShowProductDetails && data?.total_rate_card_Details
                                                  ?.net_weight > 0 &&
                                                  data?.total_rate_card_Details
                                                    ?.is_fix_price !== 1 && (
                                                    <div className="items-details-info">
                                                      <span>
                                                        Metal Weight:{" "}
                                                      </span>
                                                      <span>
                                                        {data
                                                          ?.total_rate_card_Details
                                                          ?.net_weight &&
                                                          data?.total_rate_card_Details?.net_weight.toFixed(
                                                            3
                                                          ) + ` gm`}
                                                      </span>
                                                    </div>
                                                  )}
                                                {data?.color_stone_details
                                                  ?.length &&
                                                  data?.total_rate_card_Details
                                                    ?.is_fix_price !== 1 ? (
                                                  <div
                                                    className="items-details-info"
                                                    key={uuid()}
                                                  >
                                                    {data?.color_stone_details?.map(
                                                      (ele, index) => (
                                                        <>
                                                          {index === 0 ? (
                                                            <span className="material-label">
                                                              Color Stone
                                                            </span>
                                                          ) : (
                                                            <></>
                                                          )}
                                                          <span>
                                                            {
                                                              ele.color_stone_name
                                                            }
                                                          </span>
                                                        </>
                                                      )
                                                    )}
                                                  </div>
                                                ) : (
                                                  <></>
                                                )}
                                                {isShowProductDetails && data?.color_stone_details
                                                  ?.length &&
                                                  data?.total_rate_card_Details
                                                    ?.is_fix_price !== 1 ? (
                                                  <div
                                                    className="items-details-info"
                                                    key={uuid()}
                                                  >
                                                    {data?.color_stone_details?.map(
                                                      (ele, index) => (
                                                        <>
                                                          {index === 0 ? (
                                                            <span className="material-label">
                                                              Color Carat
                                                            </span>
                                                          ) : (
                                                            <></>
                                                          )}
                                                          <span>
                                                            {Number(
                                                              ele?.carat
                                                            ).toFixed(3)}
                                                          </span>
                                                        </>
                                                      )
                                                    )}
                                                  </div>
                                                ) : (
                                                  <></>
                                                )}
                                                {data?.total_rate_card_Details
                                                  ?.is_fix_price !== 1 && (
                                                    <div>
                                                      {currentProductIndex !==
                                                        index && (
                                                          <button
                                                            className="btn btn-primary btn-small btn-modify"
                                                            type="button"
                                                            onClick={() =>
                                                              setCurrentProductIndex(
                                                                index
                                                              )
                                                            }
                                                          >
                                                            Edit
                                                          </button>
                                                        )}
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                          </td>
                                          <td className="item-col col-2 items-size">
                                            <div className="items-col">
                                              <span>
                                                {" "}
                                                {data?.size_name
                                                  ? data?.size_name
                                                  : "---"}
                                              </span>
                                            </div>
                                          </td>
                                          <td className=" item-col col-3 items-qty">
                                            <div className=" items-col items-qty-set ">
                                              <form action="#">
                                                <div className="qty">
                                                  <span
                                                    id="input_plus"
                                                    className="arrow-up"
                                                    onClick={() =>
                                                      increaseCount(data, index)
                                                    }
                                                  >
                                                    <i className="jkm-arrow-top"></i>
                                                  </span>
                                                  <span
                                                    id="input_minus"
                                                    className="arrow-down"
                                                    onClick={() =>
                                                      decreaseCount(data, index)
                                                    }
                                                  >
                                                    <i className="jkm-arrow-down"></i>
                                                  </span>
                                                  <input
                                                    type="text"
                                                    className="form-control"
                                                    onBlur={(e) =>
                                                      onQtyChange(
                                                        data,
                                                        index,
                                                        +e.target.value
                                                      )
                                                    }
                                                    min={data?.min_order_qty}
                                                    max={data?.max_order_qty}
                                                    value={data?.qty}
                                                    onKeyDown={(e) =>
                                                      onInputValueChange(e)
                                                    }
                                                  />
                                                </div>
                                              </form>
                                            </div>
                                          </td>
                                          {showPrice && (
                                            <td className="item-col col-4 items-amout">
                                              <div className="items-col">
                                                <span className="items-amout-amt">
                                                  {currencySymbol}
                                                  {covertPriceInLocalString(
                                                    Math.round(
                                                      data?.item_price *
                                                      data?.qty
                                                    )
                                                  )}
                                                </span>
                                              </div>
                                            </td>
                                          )}
                                        </tr>
                                        <tr className="item-action">
                                          <td
                                            colSpan={5}
                                            className="item-action-col"
                                          >
                                            <div className="action-toolbars">
                                              {getUserDetails() ? (
                                                !data?.is_added_to_wishlist ? (
                                                  <a
                                                    href="#"
                                                    className="move-to-wishlist"
                                                    onClick={() =>
                                                      addtoWishList(data)
                                                    }
                                                  >
                                                    Move to Wishlist
                                                  </a>
                                                ) : (
                                                  <></>
                                                )
                                              ) : getCurrentWishListItems()?.some(
                                                (ele: IAddtoWishList) =>
                                                  ele?.item_id ==
                                                  data?.product_id
                                              ) ? (
                                                <></>
                                              ) : (
                                                <a
                                                  href="#"
                                                  className="move-to-wishlist"
                                                  onClick={() =>
                                                    addtoWishList(data)
                                                  }
                                                >
                                                  Move to Wishlist
                                                </a>
                                              )}
                                              {remarkId !== data?._id && (
                                                <>
                                                  {data?.remark ? (
                                                    <div className="tooltip-wrapper">
                                                      <>
                                                        <a className="jkm-info-circle"></a>
                                                        <div className="tooltip">
                                                          <span>
                                                            {data?.remark}
                                                          </span>
                                                        </div>
                                                      </>
                                                    </div>
                                                  ) : (
                                                    ""
                                                  )}
                                                  <a
                                                    href="#"
                                                    className="edit"
                                                    onClick={() =>
                                                      setRemarkEdit(data, index)
                                                    }
                                                  >
                                                    <i className="jkm-pencil"></i>
                                                  </a>
                                                </>
                                              )}
                                              <>
                                                <a
                                                  title="Delete From Cart"
                                                  href="#"
                                                  className="remove"
                                                  onClick={() => {
                                                    setIsDeletePopup(true);
                                                    setDeleteItemData(data);
                                                  }}
                                                >
                                                  <i className="jkm-trash"></i>
                                                </a>
                                              </>
                                            </div>
                                          </td>
                                        </tr>
                                        {currentProductIndex === index ? (
                                          <tr>
                                            <td
                                              colSpan={5}
                                              className="item-action-col"
                                            >
                                              <CustomiseProduct
                                                allAvailableCombinations={
                                                  allAvailableCombinations
                                                }
                                                productCombinations={customiseCombinations?.find(
                                                  (el) =>
                                                    el?._id === data?.item_id
                                                )}
                                                onClose={() =>
                                                  setCurrentProductIndex(null)
                                                }
                                                product={data}
                                                CustomizeProductData={
                                                  CustomizeProductData
                                                }
                                              />
                                            </td>
                                          </tr>
                                        ) : (
                                          <></>
                                        )}
                                        {customiseCartListData &&
                                          customiseCartListData[data?._id]
                                            ?.error && (
                                            <tr>
                                              <td colSpan={5}>
                                                <p className="customise-error">
                                                  {Message.PRODUCT_NOT_CUSTOMISED}
                                                </p>
                                              </td>
                                            </tr>
                                          )}
                                      </tbody>
                                    </>
                                  )
                                )}
                              </table>
                            ) : (
                              <></>
                            )}
                          </div>
                          <div className="action-toolbar-shopping">
                            <button
                              type="button"
                              className="btn btn-primary btn-continue-shopping"
                              onClick={() => Router.push("/")}
                            >
                              <a href="#"> Continue Shopping</a>
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary btn-clear-shopping"
                              onClick={() => {
                                setIsDeletePopup(true);
                                setIsClearAll(true);
                              }}
                            >
                              <a href="#">Clear Shopping Cart</a>
                            </button>
                          </div>
                        </section>
                        {cartList.length ? (
                          <aside className="sort-info sidebar-section">
                            {
                              isShowProductDetails &&
                              <div className=" sort-info-conatainer summary-info">
                                {(cartSummery?.total_metal_weight > 0 ||
                                  cartSummery?.total_diamond_weight > 0 ||
                                  cartSummery?.total_color_stone_carat > 0) && (
                                    <h4 className="sort-info-title">Summary</h4>
                                  )}
                                {cartSummery?.total_metal_weight > 0 && (
                                  <div className="sort-info-content">
                                    <p className="sort-info-tags">
                                      Total Metal Weight:
                                    </p>
                                    <p className="sort-info-values">
                                      {Number(
                                        cartSummery?.total_metal_weight
                                      ).toFixed(3) + " GM"}
                                    </p>
                                  </div>
                                )}
                                {cartSummery?.total_diamond_weight > 0 && (
                                  <div className="sort-info-content">
                                    <p className="sort-info-tags">
                                      Total Diamond Weight:
                                    </p>
                                    <p className="sort-info-values">
                                      {Number(
                                        cartSummery?.total_diamond_weight
                                      ).toFixed(3) + " CT"}
                                    </p>
                                  </div>
                                )}
                                {cartSummery?.total_color_stone_carat > 0 ? (
                                  <div className="sort-info-content">
                                    <p className="sort-info-tags">
                                      Total Color Stone Carat:
                                    </p>
                                    <p className="sort-info-values">
                                      {Number(
                                        cartSummery?.total_color_stone_carat
                                      ).toFixed(3) + " CT"}
                                    </p>
                                  </div>
                                ) : (
                                  <> </>
                                )}
                              </div>
                            }

                            {isB2BUser && categorySummaryItems?.length > 0 && (
                              <div className="summary-section">
                                <h4 className="sort-info-title">
                                  Sub category wise summary
                                </h4>
                                {categorySummaryItems?.map((categoryItem) => {
                                  const { name, data } = categoryItem;
                                  let totalPcs = 0,
                                    totalMetalWt = 0,
                                    totalDiaCt = 0,
                                    totalClrct = 0;

                                  return (
                                    <React.Fragment key={uuid()}>
                                      <h5 className="summary-title">{`Summary (${name} Category)`}</h5>
                                      <div className="table-wrap">
                                        <table className="table-container">
                                          <thead>
                                            <tr className="item-info">
                                              <th className="product">
                                                Product
                                              </th>
                                              <th className="pcs">Pcs.</th>
                                              {
                                                isShowProductDetails &&
                                                <>
                                                  <th className="metal-wgt">
                                                    Metal wt.
                                                  </th>
                                                  <th className="dia-cts">
                                                    Dia. ct.
                                                  </th>
                                                  <th className="clr-cts">
                                                    Clr. ct.
                                                  </th>
                                                </>
                                              }
                                            </tr>
                                          </thead>

                                          <tbody className="items-body">
                                            <>
                                              {data?.map((categoryObj) => {
                                                totalPcs +=
                                                  categoryObj?.qty ?? 0;
                                                totalMetalWt += +(
                                                  categoryObj?.metalWeight ?? 0
                                                );
                                                totalDiaCt += +(
                                                  categoryObj?.diamondCarats ??
                                                  0
                                                );
                                                totalClrct += +(
                                                  categoryObj?.colorStoneCarats ??
                                                  0
                                                );

                                                return (
                                                  <tr
                                                    className="item-info"
                                                    key={uuid()}
                                                  >
                                                    <td>
                                                      {categoryObj?.label ?? ""}
                                                    </td>
                                                    <td>
                                                      {categoryObj?.qty ?? 0}
                                                    </td>
                                                    {
                                                      isShowProductDetails &&
                                                      <>
                                                        <td>
                                                          {categoryObj?.metalWeight ??
                                                            0}
                                                        </td>
                                                        <td>
                                                          {categoryObj?.diamondCarats ??
                                                            0}
                                                        </td>
                                                        <td>
                                                          {categoryObj?.colorStoneCarats ??
                                                            0}
                                                        </td>
                                                      </>
                                                    }

                                                  </tr>
                                                );
                                              })}

                                              <tr>
                                                <td>Total</td>
                                                <td>{totalPcs}</td>
                                                <td>
                                                  {totalMetalWt.toFixed(2)}
                                                </td>
                                                <td>{totalDiaCt.toFixed(2)}</td>
                                                <td>{totalClrct.toFixed(2)}</td>
                                              </tr>
                                            </>
                                          </tbody>
                                        </table>
                                      </div>
                                    </React.Fragment>
                                  );
                                })}
                              </div>
                            )}

                            {showPrice && (
                              <div className=" sort-info-conatainer shipping-info">
                                <h4 className="sort-info-title">Shipping</h4>
                                <div className="sort-info-content">
                                  <p className="sort-info-tags">Subtotal:</p>
                                  <p className="sort-info-values">
                                    {currencySymbol}{" "}
                                    {covertPriceInLocalString(
                                      Math.round(cartCharges?.net_total)
                                    )}
                                  </p>
                                </div>
                                <div className="sort-info-content">
                                  <p className="sort-info-tags">
                                    Shipping Charges:
                                  </p>
                                  <p className="sort-info-values">
                                    {currencySymbol}{" "}
                                    {covertPriceInLocalString(
                                      Math.round(cartCharges?.delivery_charge)
                                    )}
                                  </p>
                                </div>
                                {cartCharges?.discount_amount ? (
                                  <div className="sort-info-content">
                                    <p className="sort-info-tags">
                                      Cart Discount:
                                    </p>
                                    <p className="sort-info-values">
                                      {currencySymbol}{" "}
                                      {covertPriceInLocalString(
                                        Math.round(cartCharges?.discount_amount)
                                      )}
                                    </p>
                                  </div>
                                ) : (
                                  <></>
                                )}
                                <div className="sort-info-content">
                                  <p className="sort-info-tags">Tax:</p>
                                  <p className="sort-info-values">
                                    {currencySymbol}{" "}
                                    {covertPriceInLocalString(
                                      Math.round(cartCharges?.total_tax_amount)
                                    )}
                                  </p>
                                </div>
                              </div>
                            )}
                            {getUserDetails() && showPrice ? (
                              <div className="apply-coupon-sec">
                                <p className="apply-coupon-text">
                                  Apply Coupon Code
                                </p>
                                <form>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="applyCoupon"
                                    placeholder="Apply Coupon"
                                    value={newCouponCode}
                                    onChange={(e) =>
                                      setNewCouponCode(e.target.value)
                                    }
                                    disabled={isApplyied ? true : false}
                                  />
                                  <button
                                    className="btn btn-primary btn-small"
                                    type="button"
                                    disabled={!newCouponCode}
                                    onClick={() =>
                                      isApplyied
                                        ? removeCouponCode()
                                        : ApplyCouponCode()
                                    }
                                  >
                                    {isApplyied ? "Remove" : "Apply"}
                                  </button>
                                </form>
                                {couponCount ? (
                                  <a
                                    href="#"
                                    className="coupon-links"
                                    onClick={() => setCouponModel(!couponModel)}
                                  >
                                    View Coupons ({couponCount} Available)
                                  </a>
                                ) : (
                                  <>No Coupon Available </>
                                )}
                              </div>
                            ) : (
                              <></>
                            )}
                            {showPrice && (
                              <div className="sort-info-content tolal-summary">
                                <p className="total-amout-title">
                                  Total Cost :
                                </p>
                                <p className="sort-info-values">
                                  {currencySymbol}{" "}
                                  {covertPriceInLocalString(
                                    Math.round(cartCharges?.total_cost)
                                  )}
                                </p>
                              </div>
                            )}

                            {showPrice && (
                              <button
                                className="btn-summary btn-primary btn-checkout"
                                onClick={() => onCheckout()}
                              >
                                Checkout
                              </button>
                            )}

                            {isB2BUser && (
                              <button
                                style={{ marginTop: "30px" }}
                                className="btn-summary btn-primary mt-3 btn-checkout"
                                onClick={showPlaceInquiryModal}
                              >
                                Place Inquiry
                              </button>
                            )}
                          </aside>
                        ) : (
                          <> </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <NoDataAvailable title="No Cart Item found..!!">
                        <Link href="/">
                          <a className="btn btn-secondary btn-small">
                            Go to Home
                          </a>
                        </Link>
                      </NoDataAvailable>
                    </>
                  )}
                </section>
              </div>
            </main>
          </div>
        </>
      )}

      {isQuickView ? (
        getComponents(templateType, "remark", {
          isModal: isQuickView,
          remark: remark,
          remarkId: remarkId,
          onClose: onCloseQuickView,
          updateData: getUpdatedCartData,
          cart_id: cartCharges?._id,
          remark_index: guestRemarkIndex,
        })
      ) : (
        <></>
      )}
      {couponModel ? (
        getComponents(templateType, "coupon", {
          isModal: couponModel,
          onClose: onCloseQuickView,
          updateCoupon: getUpdatedCoupon,
          cart_id: cartCharges?._id,
          coupon_code: newCouponCode,
        })
      ) : (
        <></>
      )}
      {isDeletePopup && (
        <DeletePopup
          onClose={onCloseDeleteModal}
          isDelete={(isDelete) => handleDeleteData(isDelete)}
          message="Are you sure you want to delete item?"
        />
      )}

      {viewPlaceInquiry && (
        <PlaceInquiry
          viewModal={viewPlaceInquiry}
          handleCloseModal={() => setViewPlaceInquiry(false)}
        />
      )}
    </>
  );
};

export default CartList1;
