import usePostFormDataHook from "@components/Hooks/postFormDataRegisterHook";
import APICONFIG from "@config/api.config";
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import {
  IAddtoWishList,
  IRemoveWishList,
} from "@components/Hooks/addtoWishList";
import { updateWishListCounter } from "src/redux/signIn/signInAction";
import { useDispatch, useSelector } from "react-redux";
import { IAPIError, ISignInReducerData } from "@type/Common/Base";
import { useEffect, useState } from "react"
import { Message } from "@constant/errorMessage";
import { addGuestWishListItems, deleteGuestUserWishList, getCurrentGuestCartItems } from "@util/addGuestCartData";
import { setLoader } from "src/redux/loader/loaderAction";
import { IAddtoCart } from "@components/Hooks/addtoCart";
import APPCONFIG from "@config/app.config";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";

export const useAddtoWishList = () => {
  const { getDataHook, submitFormDataHook } = usePostFormDataHook();
  const {deleteGuestUserCart} = useAddtoCart()
  const { showError, showSuccess } = useToast();
  const dispatch = useDispatch();
  const wishListCountdata = useSelector(
    (state: ISignInReducerData) => state?.signIn
  );
  const [wishListCount, setWishListCount] = useState<number>(
    wishListCountdata?.wishlist_count
  );

  useEffect(() => {
    if (wishListCountdata) {
      setWishListCount(wishListCountdata?.wishlist_count);
    }
  }, [wishListCountdata]);

  const adddtoWishListProduct = (props: IAddtoWishList) => {
    // @ts-ignore
    dispatch(setLoader(true))

    if (!wishListCountdata?.userData) {
      const addedOrnot = addGuestWishListItems(props);
      if (addedOrnot) {
        deleteGuestUserCart(props?.item_id)
        updateWishListCount();
        // @ts-ignore
        dispatch(setLoader(false))
        showSuccess(Message.WISHLIST_UPDATE_MESSAGE_SUCCESS);
      }
      if (props?.fromCart) {
        const cartData = getCurrentGuestCartItems();
        const index = cartData?.findIndex((ele: IAddtoCart) => ele?.item_id === props?.item_id);
        if (index !== -1) {
          cartData.splice(index, 1);
          localStorage.setItem(APPCONFIG.GUEST_CART_DATA, cartData);
        }
      }
      // @ts-ignore
      dispatch(setLoader(false))
      return true;
    }
    const responceData = submitFormDataHook(
      { ...props },
      APICONFIG.CREATE_WISHLIST
    );
    return responceData
      ?.then((resp) => {
        if (resp?.data && resp?.meta) {
          showSuccess(resp?.meta?.message);
          // @ts-ignore
          dispatch(setLoader(false))
          updateWishListCount();
        } else {
          // @ts-ignore
          dispatch(setLoader(false))
          ErrorHandler(resp, showError);
        }
        // @ts-ignore
        dispatch(setLoader(false))
        return resp;
      })
      .catch((err) => {
        // @ts-ignore
        dispatch(setLoader(false))
        ErrorHandler(err, showError);
      });
  };

  const removeWishListProduct = (

    props: IRemoveWishList,
  ) => {
    // @ts-ignore
    dispatch(setLoader(true))
    if (!wishListCountdata?.userData) {
      const addedOrnot = deleteGuestUserWishList(props?.item_id[0]);
      if (addedOrnot) {
        removeWishListCount();
        // @ts-ignore
        dispatch(setLoader(false))
        showSuccess(Message.WISHLIST_UPDATE_MESSAGE_REMOVED);
      }
      // @ts-ignore
      dispatch(setLoader(false))
      return true;
    }
    const responceData = submitFormDataHook(
      { ...props },
      APICONFIG.DELETE_WISHLIST
    );

    return responceData
      ?.then((resp) => {
        if (resp?.data && resp?.meta) {
          showSuccess(resp?.meta?.message);
          removeWishListCount();
          // @ts-ignore
          dispatch(setLoader(false))
        } else {
          // @ts-ignore
          dispatch(setLoader(false))
          ErrorHandler(resp, showError);
        }
        return resp;
      })
      .catch((err) => {
        // @ts-ignore
        dispatch(setLoader(false))
        ErrorHandler(err, showError);
      });
  };

  const updateWishListCount = () => {
    dispatch(updateWishListCounter((wishListCount + 1) as number));
  };

  const removeWishListCount = () => {
    if ((wishListCount - 1) > -1) dispatch(updateWishListCounter((wishListCount - 1) as number));
  };

  const getWishListData = async () => {
    // @ts-ignore
    dispatch(setLoader(true))
    try {
      const responseData = await getDataHook(APICONFIG.WISHLIST_PRODUCT, {});
      // @ts-ignore
      dispatch(setLoader(false))
      return responseData
    }
    catch (err) {
      // @ts-ignore
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, showError);
    }
  }
  const getUpdatedWishListData = async () => {
    // @ts-ignore
    dispatch(setLoader(true))
    try {
      const responseData = await getDataHook(APICONFIG.WISHLIST, {});
      // @ts-ignore
      dispatch(setLoader(false))
      return responseData
    }
    catch (err) {
      // @ts-ignore
      dispatch(setLoader(false))
      ErrorHandler(err as IAPIError, showError);
    }
  }

  return {
    adddtoWishListProduct,
    updateWishListCount,
    removeWishListCount,
    removeWishListProduct,
    getWishListData,
    getUpdatedWishListData
  };
};

export default useAddtoWishList;
