import { useState, useEffect } from "react"
import { IAddtoCart, ICoupon, ICustomiseAddtoProduct, IDeleteCart, IGuestUserData, IUpdateCart } from '@components/Hooks/addtoCart'
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import APICONFIG from '@config/api.config';
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import { useDispatch, useSelector } from 'react-redux';
import { IAPIError, ISignInReducerData } from '@type/Common/Base';
import { updateCartCounter, updateWishListCounter } from "src/redux/signIn/signInAction";
import pagesServices from "@services/pages.services";
import { addGuestCartItems, getCurrentGuestCartItems, getCurrentWishListItems, updateGuestCartItems } from "@util/addGuestCartData";
import { Message } from "@constant/errorMessage";
import { getParseUser } from "@util/common";
import APPCONFIG from "@config/app.config";
import { setLoader } from "src/redux/loader/loaderAction";
import { ICartListData } from "@type/Pages/cart";


export const useAddtoCart = () => {
  const { makeDynamicFormDataAndPostData, submitFormDataHook, deleteDataHook } = usePostFormDataHook();
  const { showError, showSuccess } = useToast();
  const dispatch = useDispatch();
  const cartCountdata = useSelector((state: ISignInReducerData) => state?.signIn);
  const wishlistCountData = useSelector((state: ISignInReducerData) => state?.signIn);

  const [cartCount, setCartCounter] = useState<number>(cartCountdata?.cart_count);
  const [wishlistCount, setWishlistCount] = useState<number>(wishlistCountData?.wishlist_count)
  const signIndata = useSelector((state: ISignInReducerData) => state);

  useEffect(() => {
    if (cartCountdata) {
      setCartCounter(cartCountdata?.cart_count)
    }
    if (wishlistCountData) {
      setWishlistCount(wishlistCountData?.wishlist_count)
    }
  }, [cartCountdata, wishlistCountData])
  const adddtoCartProduct = async (props: IAddtoCart) => {
    if (!signIndata?.signIn?.userData) {
      let newProductData = { ...props }
      showSuccess(Message.CART_UPDATE_MESSAGE_SUCCESS);
      const minQty = await getMinimumQtyForGuestUser(props?.productId!)
      if (props?.is_from_product_list) {
        newProductData = { ...newProductData, qty: minQty }
      }
      addGuestCartItems([{ ...newProductData }]);
      updateCartCount(props?.is_from_product_list ? minQty : props?.qty);
      return true;
    }
    // @ts-ignore
    dispatch(setLoader(true))
    const getUserDetails: any = getParseUser()
    let obj = {
      country_id: getUserDetails?.user_detail?.country?.country_id as string
    }
    const responceData = makeDynamicFormDataAndPostData(
      { ...props, ...obj },
      APICONFIG.ADDTOCART
    );
    return responceData
      ?.then((resp) => {
        if (resp?.data && resp?.meta) {
          if (!props?.from_guest) {
            showSuccess(resp?.meta?.message);
          }
          updateCartCount(resp?.data?.qty)
        } else {
          if (!props?.from_guest) {
            ErrorHandler(resp, showError);
          }
        }
        // @ts-ignore
        dispatch(setLoader(false))
        return resp
      })
      .catch((err) => {
        // @ts-ignore
        dispatch(setLoader(false))
        ErrorHandler(err, showError);
      });
  }

  const updateCartCount = (qty?: number) => {
    dispatch(updateCartCounter(cartCount + (qty ? +qty : 1) as number));
  }


  const decreaseCartCount = (count: number) => {
    if ((cartCount - count) > -1) dispatch(updateCartCounter(cartCount - count as number));
  }
  const decreaseWishListCount = (count: number) => {
    if ((wishlistCount - count) > -1) dispatch(updateWishListCounter(wishlistCount - count as number));
  }

  const updateCart = async (props: IUpdateCart, Id: string, indexGuest: number) => {
    // @ts-ignore
    dispatch(setLoader(true))
    if (!signIndata?.signIn?.userData) {
      const response = await updateGuestCartItems(props, indexGuest);
      if (response) {
        showSuccess(Message.CART_QTY_MESSAGE_SUCCESS);
        updateCartCount();
        // @ts-ignore
        dispatch(setLoader(false))
        return true;
      }
    }
    const responceData = makeDynamicFormDataAndPostData(
      { ...props },
      `${APICONFIG.UPDATE_CART}${Id}`
    );
    return responceData
      ?.then((resp) => {
        if (resp?.data && resp?.meta) {
          showSuccess(resp?.meta?.message);
        } else {
          ErrorHandler(resp, showError);
        }
        // @ts-ignore
        dispatch(setLoader(false))
        return resp
      })
      .catch((err) => {
        // @ts-ignore
        dispatch(setLoader(false))
        ErrorHandler(err, showError);
      });
  }

  const getCartData = async () => {
    // @ts-ignore
    dispatch(setLoader(true))
    try {
      const cartResponse = await pagesServices.getPage(APICONFIG.CART_LIST, {});
      // @ts-ignore
      dispatch(setLoader(false))
      return cartResponse
    }
    catch (err) {
      // @ts-ignore
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, showError);
    }
  }

  const deleteCartItem = async (props: IDeleteCart) => {
    // @ts-ignore
    dispatch(setLoader(true))
    try {
      const responseData = await submitFormDataHook(
        { ...props },
        APICONFIG.CART_DELETE
      );
      if (responseData?.meta?.status_code == 200) {
        // @ts-ignore
        dispatch(setLoader(false))
        showSuccess(responseData?.meta?.message);
        if (props?.cart_items_id.length > 1) {
          dispatch(updateCartCounter(0))
        }
      }
      return responseData
    }
    catch (err) {
      // @ts-ignore
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, showError);
    }
  }

  const getCoupon = async (totalCost?: number) => {
    // @ts-ignore
    dispatch(setLoader(true))
    try {
      const obj: { total_amount?: number } = {}
      if (totalCost) {
        obj.total_amount = totalCost
      }
      const responseData = await makeDynamicFormDataAndPostData(
        obj,
        APICONFIG.COUPON_LIST
      );
      if (responseData?.meta?.message) {
        // @ts-ignore
        dispatch(setLoader(false))
      }
      return responseData
    }
    catch (err) {
      // @ts-ignore
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, showError);
    }
  }

  const applyCoupon = async (props: ICoupon) => {
    // @ts-ignore
    dispatch(setLoader(true))
    try {
      const responseData = await makeDynamicFormDataAndPostData(
        { ...props },
        APICONFIG.APPLY_COUPON
      );
      if (responseData?.meta?.message) {
        // @ts-ignore
        dispatch(setLoader(false))
        if (responseData?.meta?.status_code === 200) {
          showSuccess(responseData?.meta?.message);
        } else {
          showError(responseData?.meta?.message)
        }
      }
      return responseData
    }
    catch (err) {
      // @ts-ignore
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, showError);
    }
  }

  const removeCoupon = async (id: string) => {
    // @ts-ignore
    dispatch(setLoader(true))
    try {
      const responseData = await deleteDataHook(
        {},
        `${APICONFIG.COUPON_DELETE}${id}`
      );
      if (responseData?.meta?.message) {
        // @ts-ignore
        dispatch(setLoader(false))
        showSuccess(responseData?.meta?.message);
      }
      return responseData
    }
    catch (err) {
      // @ts-ignore
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, showError);
    }
  }

  const addCartCustomiseData = async (props: ICustomiseAddtoProduct, guestUser = false) => {
    // @ts-ignore
    dispatch(setLoader(true))
    try {
      if (!signIndata?.signIn?.userData) {
        addGuestCartItems([{ ...props }]);
        showSuccess(Message.CART_UPDATE_MESSAGE_SUCCESS);
        updateCartCount(props?.qty);
        // @ts-ignore
        dispatch(setLoader(false))
        return true;
      }
      const bodyParam = props;
      const responseData = await makeDynamicFormDataAndPostData(
        bodyParam,
        APICONFIG.ADDTOCART
      );
      if (responseData?.meta?.message) {
        if (!guestUser) {
          showSuccess(responseData?.meta?.message);
        }
      }
      updateCartCount(props?.qty);
      // @ts-ignore
      dispatch(setLoader(false))
      return responseData
    }
    catch (err) {
      if (!guestUser) {
        ErrorHandler(err as IAPIError, showError);
      }
      // @ts-ignore
      dispatch(setLoader(false))
      return null;
    }
  }

  const deleteGuestUserCart = (item_id: string) => {
    // @ts-ignore
    dispatch(setLoader(true))
    const cartData = getCurrentGuestCartItems()
    const objWithIdIndex = cartData.findIndex((obj: IGuestUserData) => obj.item_id === item_id);
    if (objWithIdIndex > -1) {
      cartData.splice(objWithIdIndex, 1);
      localStorage.setItem(APPCONFIG.GUEST_CART_DATA, JSON.stringify(cartData));
      // @ts-ignore
      dispatch(setLoader(false))
      showSuccess(Message.CART_REMOVE_MESSAGE_SUCCESS);
      return true
    }
    // @ts-ignore
    dispatch(setLoader(false))
  }

  const getGuestCartData = async () => {
    // @ts-ignore
    // dispatch(setLoader(true))
    const guestUser = getCurrentGuestCartItems();
    // const itemId = guestUser.map((ele: ICustomiseAddtoProduct) => {
    //   if (ele?.item_id) return ele?.item_id
    // });
    if (guestUser.length > 0) {
      const response = await submitFormDataHook(
        { product_id: guestUser }, APICONFIG.GUEST_CART_LIST_DATA
      )
      // @ts-ignore
      dispatch(setLoader(false))
      return response
    }

  }

  const clearAllGuestCart = () => {
    // @ts-ignore
    dispatch(setLoader(true))
    localStorage.setItem(APPCONFIG.GUEST_CART_DATA, JSON.stringify([]));
    showSuccess(Message.CART_REMOVE_ALL_MESSAGE_SUCCESS);
    dispatch(updateCartCounter(0 as number));
    // @ts-ignore
    dispatch(setLoader(false))
    return true
  }

  const guestUpdateOriginalCart = (props: IAddtoCart) => {
    // @ts-ignore
    dispatch(setLoader(true))
    const getUserDetails: any = getParseUser()
    let obj = {
      country_id: getUserDetails?.user_detail?.country?.country_id as string
    }
    const responceData = makeDynamicFormDataAndPostData(
      { ...props, ...obj },
      APICONFIG.ADDTOCART
    );
    return responceData
      ?.then((resp) => {
        if (resp?.data && resp?.meta) {
          if (!props?.from_guest) {
            showSuccess(resp?.meta?.message);
          }
          updateCartCount()
        } else {
          if (!props?.from_guest) {
            ErrorHandler(resp, showError);
          }
        }
        // @ts-ignore
        dispatch(setLoader(false))
        return resp
      })
      .catch((err) => {
        // @ts-ignore
        dispatch(setLoader(false))
        ErrorHandler(err, showError);
      });
  }

  const getGuestWishListData = async () => {
    // @ts-ignore
    dispatch(setLoader(true))
    const guestUser = getCurrentWishListItems();
    const itemId = guestUser.map((ele: ICustomiseAddtoProduct) => {
      if (ele?.item_id) return ele?.item_id
    });
    if (itemId) {
      const response = await submitFormDataHook(
        { product_id: itemId }, APICONFIG.GUEST_USER_WISHLIST
      )
      // @ts-ignore
      dispatch(setLoader(false))
      return response
    }
  }

  const getMinimumQtyForGuestUser = async (productId: string) => {
    return await pagesServices.postPage(APICONFIG.GUEST_USER_MIN_QTY, { product_id: [productId] })?.then((resp) => {
      if (resp?.data?.[0]?.min_order_qty) {
        return resp?.data?.[0]?.min_order_qty
      } else {
        return 1
      }
    })
  }

  const checkCartIteamsForCheckout = async (cartList: ICartListData[], cartId: string) => {
    //@ts-ignore
    dispatch(setLoader(true))
    try {
      const checkoutResponse = await pagesServices.postPage(APICONFIG.CHECK_CART_ITEAMS, { cart_items: cartList, cart_id: cartId })
      // @ts-ignore
      dispatch(setLoader(false))
      return checkoutResponse
    }
    catch (err) {
      // @ts-ignore
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, showError);
    }
  }

  return {
    adddtoCartProduct,
    updateCartCount,
    updateCart,
    getCartData,
    deleteCartItem,
    getCoupon,
    applyCoupon,
    removeCoupon,
    addCartCustomiseData,
    deleteGuestUserCart,
    getGuestCartData,
    clearAllGuestCart,
    guestUpdateOriginalCart,
    getGuestWishListData,
    decreaseWishListCount,
    decreaseCartCount,
    checkCartIteamsForCheckout
  }
}

export default useAddtoCart

