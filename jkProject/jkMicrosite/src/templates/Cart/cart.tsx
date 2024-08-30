import React, { useEffect, useState } from "react";
import { getComponents } from "./components";
import { ICartListMain } from "@templates/Cart";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import { getCartcount, getUserDetails, setDynamicDefaultStyle } from "@util/common";
import { useRouter } from "next/router";
import Loader from "@components/customLoader/Loader";
import useGetGuestUserCart from "@components/Hooks/getGuestUserCart";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import Link from "next/link";
import { updateCartCounter } from "src/redux/signIn/signInAction";
import { useDispatch } from "react-redux";
import { updateGuestCartData } from "@util/addGuestCartData";

const Cart = (props: ICartListMain) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cartList, setCartList] = useState<ICartListMain>(props);
  const { cartItems ,guestPageTitle} = useGetGuestUserCart();
  const { getGuestCartData } = useAddtoCart();
  const Router = useRouter();
  const dispatch = useDispatch();
  // const { addCartCustomiseData, getCartData } = useAddtoCart();
  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    if (cartItems && isGuestOrNot()) {
      setIsLoading(false);
      setCartList({ ...props, ...cartItems });
    }
    // eslint-disable-next-line
  }, [cartItems]);

  useEffect(() => {
    setDynamicColour();
    if (!isGuestOrNot()) {
      dispatch(updateCartCounter(props?.data?.cart_summary?.total_cart_items_count ?? 0));
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (props) {
      setIsLoading(true);
      if (!isGuestOrNot()) {
        setCartList(props);
        dispatch(updateCartCounter(props?.data?.cart_summary?.total_cart_items_count ?? 0));
      }
    }
    setIsLoading(false);
    // eslint-disable-next-line
  }, [props])

  useEffect(() => {
    if (isGuestOrNot()) {
      getCartData();
    } else {
      localStorage.removeItem(APPCONFIG.GUEST_CART_DATA);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Router]);

  const getCartData = async () => {
    const resposne = await getGuestCartData();
    if (resposne?.status_code == 200) {
      setCartList(resposne);
      updateGuestCartData(resposne?.data?.cart_items)
      dispatch(updateCartCounter(getCartcount() ?? 0))
    }
  };
  const isGuestOrNot = () => {
    if (!getUserDetails()) return true;
    return false;
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.cart + ".min.css"
          }
        />
        {guestPageTitle && <title>{guestPageTitle}</title>}
      </Head>
      {isLoading && <Loader />}
      <main>
        {cartList && cartList.sequence &&
          cartList?.sequence?.map((ele) =>
            getComponents(
              cartList?.data?.[ele as keyof ICartListMain]?.type as string,
              ele,
              cartList
            )
          )}
        {!cartList?.data && (
          <>
            <NoDataAvailable title="No Cart Item found..!!">
              <Link href="/">
                <a className="btn btn-secondary btn-small">Go to Home</a>
              </Link>
            </NoDataAvailable>
          </>
        )}
      </main>
    </>
  );
};

export default Cart;
