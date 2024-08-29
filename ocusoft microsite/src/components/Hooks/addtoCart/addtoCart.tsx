import { IAddtoCart, IDeleteCart, IUpdateCart } from '@components/Hooks/addtoCart'
import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import APICONFIG from '@config/api.config';
import ErrorHandler from "@components/ErrorHandler";
import { useDispatch, useSelector } from 'react-redux';
import { IAPIError } from '@type/Common/Base';
import pagesServices from "@services/pages.services";
import { setLoader } from "src/redux/loader/loaderAction";
import { ICartListData } from "@type/Pages/cart";
import { toast } from "react-toastify";
import { setCartCountAction } from "src/redux/product/productAction";
import { ReducerState } from "@type/Redux";
import { useRouter } from 'next/router';

export const useAddtoCart = () => {
  const { makeDynamicFormDataAndPostData, submitFormDataHook } = usePostFormDataHook();
  const dispatch = useDispatch();
  const productReducer = useSelector((state: ReducerState) => state?.productReducer)
  const router = useRouter();
  const { is_buy_now } = router.query;
  const adddtoCartProduct = async (props: IAddtoCart) => {
    dispatch(setLoader(true))

    const responceData = makeDynamicFormDataAndPostData(
      { ...props },
      APICONFIG.ADDTOCART
    );
    return responceData
      ?.then((resp) => {
        if (resp?.data && resp?.meta) {
          toast.success(resp?.meta?.message)
          updateCartCount(resp?.data?.qty)
          if (props?.is_buy_now) {
            setTimeout(() => {
              router.push(`/cart/checkout_list?is_buy_now=1`)
            }, 200);
          }
        } else {
          ErrorHandler(resp, toast.error);
        }
        if (props?.is_buy_now) {
          localStorage.removeItem('cart-items')
          localStorage.removeItem('shippingMethod')
        }
        dispatch(setLoader(false))
        return resp
      })
      .catch((err) => {
        dispatch(setLoader(false))
        ErrorHandler(err, toast.error);
      });
  }

  const updateCartCount = (qty?: number) => {
    dispatch(setCartCountAction(productReducer?.cartCount ? (Number(productReducer.cartCount) + (Number(qty) ?? 1)) : (Number(qty) ?? 1)))
  }

  const decreaseCartCount = (count: number) => {
    dispatch(setCartCountAction(productReducer.cartCount - count))
  }

  const updateCart = async (props: IUpdateCart, Id: string) => {
    dispatch(setLoader(true))
    const responceData = makeDynamicFormDataAndPostData(
      { ...props },
      `${APICONFIG.UPDATE_CART}${Id}`
    );
    return responceData
      ?.then((resp) => {
        if (resp?.data && resp?.meta) {
          toast.success(resp?.meta?.message);
        } else {
          ErrorHandler(resp, toast.error);
        }
        dispatch(setLoader(false))
        return resp
      })
      .catch((err) => {
        dispatch(setLoader(false))
        ErrorHandler(err, toast.error);
      });
  }


  const getCartData = async (loader = true) => {
    dispatch(setLoader(true))
    try {
      const cartResponse = await pagesServices.getPage(`${APICONFIG.CART_LIST}?is_buy_now=${Number(is_buy_now) === 1 ? 1 : 0}`, {});
      if (cartResponse?.data) {
        dispatch(setCartCountAction(cartResponse?.data?.cart_details?.cart_count ?? 0))
      }
      if (loader) {
        dispatch(setLoader(false))
      }
      return cartResponse
    }
    catch (err) {
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, toast.error);
      return false
    }
  }

  const deleteCartItem = async (props: IDeleteCart) => {
    try {
      dispatch(setLoader(true))
      const responseData = await submitFormDataHook(
        { ...props },
        APICONFIG.CART_DELETE
      );
      dispatch(setLoader(false))
      if (responseData?.meta?.status_code == 200) {
        toast.success(responseData?.meta?.message);
        if (productReducer?.cartCount) {
          dispatch(setCartCountAction(Number(productReducer?.cartCount) - Number(props?.cart_items_id.length)))
        }
      }
      return responseData
    }
    catch (err) {
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, toast.error);
    }
  }

  const checkCartIteamsForCheckout = async (cartList: ICartListData[], cartId: string) => {
    dispatch(setLoader(true))
    try {
      const checkoutResponse = await pagesServices.postPage(APICONFIG.CHECK_CART_ITEAMS, { cart_items: cartList, cart_id: cartId })
      dispatch(setLoader(false))
      return checkoutResponse
    }
    catch (err) {
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, toast.error);
    }
  }

  return {
    adddtoCartProduct,
    updateCartCount,
    updateCart,
    getCartData,
    deleteCartItem,
    decreaseCartCount,
    checkCartIteamsForCheckout
  }
}

export default useAddtoCart

