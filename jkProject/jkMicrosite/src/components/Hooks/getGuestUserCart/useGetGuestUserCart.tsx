import { getCurrentGuestCartItems } from "@util/addGuestCartData";
import { IsBrowser } from "@util/common";
import { useEffect, useState } from "react";
import {
  IAddtoCart,
  ICustomiseAddtoProduct,
} from "@components/Hooks/addtoCart";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import ErrorHandler from "@components/ErrorHandler";
import { useToast } from "@components/Toastr/Toastr";
import { ICartListMain } from "@templates/Cart";
import { ISignInReducerData } from "@type/Common/Base";
import { useSelector } from "react-redux";

const useGetGuestUserCart = () => {
  const [guestCurrentData] = useState<
    ICustomiseAddtoProduct[] | IAddtoCart[]
  >(getCurrentGuestCartItems());
  const [signInFormType, setSignInFormType] = useState<string | number>(1)
  const signIndata = useSelector((state: ISignInReducerData) => state);
  const [cartItems, setCartItemsData] = useState<ICartListMain>();
  const { showError } = useToast();
  const [guestPageTitle, setGuestPageTitle] = useState("");
  useEffect(() => {
    if (IsBrowser && !signIndata?.signIn?.userData) {
      getCartListData();
    }
    // eslint-disable-next-line
  }, [guestCurrentData]);

  const getCartListData = async () => {
    // const product_ids = [] as string[];
    // guestCurrentData?.map(async (ele) => {
    //   await product_ids.push(ele?.item_id);
    // });
    // const formData = new FormData();
    // product_ids?.map((pi, index) => {
    //   formData.append(`product_id[${index}]`, pi);
    // });
    if (guestCurrentData.length > 0) {
      await pagesServices
        .postPage(APICONFIG.GUEST_CART_LIST_DATA, {
          product_id: guestCurrentData
        })
        .then((ele) => {
          setSignInFormType(ele?.data?.signin_form?.sign_in_form_type)
          setGuestPageTitle(ele?.meta?.title)
          setCartItemsData(ele);
        })
        .catch((error) => {
          ErrorHandler(error, showError);
        });
    }

  };
  return {
    cartItems,
    signInFormType,
    guestPageTitle
  }
};

export default useGetGuestUserCart;
