import React, { useEffect, useState } from "react";
import Head from "next/head";
import { IOrderConfirmation } from "@templates/OrderConfirmation";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import CustomImage from "@components/CustomImage/CustomImage";
import { IMAGE_PATH } from "@constant/imagepath";
import {
  covertPriceInLocalString,
  getTypeBasedCSSPath,
  getUserDetails,
  setDynamicDefaultStyle,
} from "@util/common";
import { useRouter } from "next/router";
import {
  IAddress,
  IOrderConfirmationData,
} from "@type/Pages/orderConfirmation";
import useOrderSettingHooks from "@components/Hooks/OrderSettings/useOrderSettingsHook";
import { IOrderSettingsHooksState } from "@components/Hooks/OrderSettings";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import usePriceDisplay from "@components/Hooks/priceDisplay";
import Link from "next/link";
import Cookies from "js-cookie";
// import pagesServices from "@services/pages.services";
// import APICONFIG from "@config/api.config";

const OrderConfirmation = (props: IOrderConfirmation) => {
  const [orderList] = useState<IOrderConfirmationData>(
    props.data?.cart_details
  );
  const orderSettingData = useOrderSettingHooks();
  const [settingData, setSettingData] = useState<IOrderSettingsHooksState>();
  const Router = useRouter();
  const currencySymbol = useCurrencySymbol();
  const { isPriceDisplay } = usePriceDisplay();
  const isShowProductDetails = parseInt(Cookies.get("isShowProductDetails") ?? '') === 1 ? true : false;
  // const router = useRouter()

  useEffect(() => {
    if (getUserDetails() || (!getUserDetails() && isPriceDisplay)) {
    } else {
      Router.push("/");
    }
    // eslint-disable-next-line
  }, [isPriceDisplay]);

  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
    // eslint-disable-next-line
  }, []);

  const checkBillingAndShippingSame = (
    shipping: IAddress,
    billing: IAddress
  ) => {
    const bill = `${billing?.address} ${billing?.city} ${billing?.state} ${billing?.zip} ${billing?.country}`;
    const ship = `${shipping?.address} ${shipping?.city} ${shipping?.state} ${shipping?.zip} ${shipping?.country}`;
    if (bill === ship) {
      return true;
    }
    return false;
  };

  const getPaymentMethods = (id: string) => {
    let paymentName = "";
    if (settingData && settingData?.payment_method?.length > 0) {
      settingData?.payment_method?.map((ele) => {
        if (ele?.code === id) {
          paymentName = ele?.name;
        }
      });
    }
    return paymentName;
  };

  useEffect(() => {
    if (orderSettingData) {
      setSettingData(orderSettingData);
      getPaymentMethods(orderList?.order_payment);
    }
    // eslint-disable-next-line
  }, [orderSettingData]);

  // useEffect(() => {
  //   if (!router.query?.query) {
  //     return
  //   }
  //   handlerBludartRegistration(router.query?.query as string)
  // }, [router.query?.query])

  // const handlerBludartRegistration = async (orderId: string) => {
  //   try {
  //     await pagesServices.postPage(APICONFIG.BLUE_DART_REGISTARTION, {
  //       order_id: orderId,
  //     });
  //   } catch (error) {
  //   }
  // };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.orderConfirmationMain +
            ".min.css"
          }
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(
            null,
            CSS_NAME_PATH.orderConfSummarySection
          )}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.orderConfirmationComp)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.orderConfPageWrapper)}
        />
      </Head>
      <main>
        <div className="wrapper">
          <section className="heading-sec">
            <div className="container">
              <div className="heading-title-wrap">
                <h2 className="heading-title">Order Confirmation</h2>
              </div>
            </div>
          </section>
          <section className="content">
            <div className="container">
              <ul className="progress-bar">
                <li className="active process-complete">
                  <Link href={"/cart/list/"}>
                    <a>
                      1 <i className="jkm-check complete-mark"></i>
                    </a>
                  </Link>
                  <span>Shopping Cart</span>
                </li>
                <li className="active process-complete">
                  <Link href={"cart/checkout_list/"}>
                    <a>
                      2<i className="jkm-check complete-mark"></i>
                    </a>
                  </Link>
                  <span>Checkout</span>
                </li>
                <li>
                  <a>
                    3<i className="jkm-check complete-mark"></i>
                  </a>
                  <span>Order Confirmation</span>
                </li>
              </ul>
            </div>
          </section>
          <section className="order-confirmation-sec">
            <div className="container">
              <div className="order-confirmation-wrap">
                <section className="main-content">
                  <CustomImage
                    src={IMAGE_PATH.confirmationImgWeb}
                    alt={"Confirm Details"}
                    title={"Confirm Details"}
                    height="244px"
                    width="482px"
                  />
                  <h2 className="title">Thank You!</h2>
                  <h5 className="success-massege">
                    Your Order has been Placed Successfully.
                  </h5>
                  <h5 className="order-number">
                    Order Number is: <strong>{orderList?.order_number}</strong>
                  </h5>
                  <p className="verification-message">
                    Well email your an order confirmation info.
                  </p>
                  <button
                    onClick={() => Router.push("/my-orders")}
                    type="button"
                    className="btn btn-contiue-shopping btn-my-order"
                  >
                    My Order
                  </button>
                  <button
                    onClick={() => Router.push("/")}
                    type="button"
                    className="btn btn-contiue-shopping"
                  >
                    Continue Shopping
                  </button>
                </section>
                <aside className="sort-info sidebar-section">
                  {
                    isShowProductDetails &&
                    <div className=" sort-info-conatainer summary-info">
                      <h4 className="sort-info-title">Summary</h4>
                      {orderList?.cart_summary?.total_metal_weight ? (
                        <div className="sort-info-content">
                          <p className="sort-info-tags">Total Metal Weight:</p>
                          <p className="sort-info-values">
                            {Number(orderList?.cart_summary?.total_metal_weight).toFixed(3) + " gm"}
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                      {orderList?.cart_summary?.total_diamond_weight ? (
                        <div className="sort-info-content">
                          <p className="sort-info-tags">Total Diamond Carat:</p>
                          <p className="sort-info-values">
                            {Number(orderList?.cart_summary?.total_diamond_weight).toFixed(3) +
                              " ct"}
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}

                      {orderList?.cart_summary?.total_color_stone_carat ? (
                        <div className="sort-info-content">
                          <p className="sort-info-tags">
                            Total Color Stone Carat:
                          </p>
                          <p className="sort-info-values">
                            {Number(orderList?.cart_summary?.total_color_stone_carat).toFixed(3) +
                              " ct"}
                          </p>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  }
                  <div className=" sort-info-conatainer summary-info">
                    <h4 className="sort-info-title">
                      Billing Address{" "}
                      {`${checkBillingAndShippingSame(
                        orderList?.order_shipping_address,
                        orderList?.order_billing_address
                      )
                        ? " & Shipping Address"
                        : ""
                        }`}
                    </h4>
                    <div className="address-content">
                      <p className="address-content-para address">
                        {orderList?.order_billing_address?.name},
                      </p>
                      <p className="address-content-para address">
                        {orderList?.order_billing_address?.address}
                      </p>
                      <p className="address-content-para city-state">
                        {orderList?.order_billing_address?.city},{" "}
                        {orderList?.order_billing_address?.state},
                        {orderList?.order_billing_address?.zip}{" "}
                      </p>
                      <p className="address-content-para country">
                        {orderList?.order_billing_address?.country}
                      </p>
                      <p className="address-content-para contact-number">
                        {orderList?.order_billing_address?.mobile_no}
                      </p>
                    </div>
                  </div>
                  {!checkBillingAndShippingSame(
                    orderList?.order_shipping_address,
                    orderList?.order_billing_address
                  ) ? (
                    <div className=" sort-info-conatainer summary-info">
                      <h4 className="sort-info-title">
                        Shipping Address{" "}
                        {`${checkBillingAndShippingSame(
                          orderList?.order_shipping_address,
                          orderList?.order_billing_address
                        )
                          ? " & Shipping Address"
                          : ""
                          }`}
                      </h4>
                      <div className="address-content">
                        <p className="address-content-para address">
                          {orderList?.order_shipping_address?.name},
                        </p>
                        <p className="address-content-para address">
                          {orderList?.order_shipping_address?.address}
                        </p>
                        <p className="address-content-para city-state">
                          {orderList?.order_shipping_address?.city},{" "}
                          {orderList?.order_shipping_address?.state},
                          {orderList?.order_shipping_address?.zip}{" "}
                        </p>
                        <p className="address-content-para country">
                          {orderList?.order_shipping_address?.country}
                        </p>
                        <p className="address-content-para contact-number">
                          {orderList?.order_shipping_address?.mobile_no}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className=" sort-info-conatainer payment-info">
                    <h4 className="sort-info-title">Payment</h4>
                    <div className="sort-info-content">
                      <p className="sort-info-tags">
                        Paid with {getPaymentMethods(orderList?.order_payment)}
                      </p>
                    </div>
                  </div>
                  <div className=" sort-info-conatainer ">
                    <div className="sort-info-content">
                      <p className="sort-info-tags">Subtotal:</p>
                      <p className="sort-info-values">
                        {currencySymbol}{" "}
                        {covertPriceInLocalString(
                          Math.round(orderList?.net_total)
                        )}
                      </p>
                    </div>
                    <div className="sort-info-content">
                      <p className="sort-info-tags">
                        Shipping Charges (Standard):
                      </p>
                      <p className="sort-info-values">
                        {currencySymbol}{" "}
                        {covertPriceInLocalString(
                          Math.round(orderList?.delivery_charge)
                        )}
                      </p>
                    </div>
                    <div className="sort-info-content">
                      <p className="sort-info-tags">Tax:</p>
                      <p className="sort-info-values">
                        {currencySymbol}{" "}
                        {covertPriceInLocalString(
                          Math.round(orderList?.total_tax_amount)
                        )}
                      </p>
                    </div>
                    {orderList?.gift_wrap?.gift_wrap_price &&
                      orderList?.gift_wrap?.gift_wrap_price !== 0 ? (
                      <div className="sort-info-content">
                        <p className="sort-info-tags">Gift Wrap Charges:</p>
                        <p className="sort-info-values">
                          {currencySymbol}{" "}
                          {covertPriceInLocalString(
                            Math.round(orderList?.gift_wrap?.gift_wrap_price)
                          )}
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="sort-info-content">
                      <p className="sort-info-tags">Total Amount:</p>
                      <p className="sort-info-values">
                        {currencySymbol}{" "}
                        {covertPriceInLocalString(
                          Math.round(orderList?.net_amount)
                        )}
                      </p>
                    </div>
                    {orderList?.discount_amount ? (
                      <div className="sort-info-content">
                        <p className="sort-info-tags">Coupon Discount:</p>
                        <p className="sort-info-values">
                          {currencySymbol}{" "}
                          {covertPriceInLocalString(
                            Math.round(orderList?.discount_amount)
                          )}
                        </p>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>

                  <div className="sort-info-content tolal-summary">
                    <p className="total-amout-title">Grand Total:</p>
                    <p className="sort-info-values">
                      {currencySymbol}{" "}
                      {covertPriceInLocalString(
                        Math.round(orderList?.total_cost)
                      )}
                    </p>
                  </div>

                  {/* <form action="#">
                    <div className="form-group">
                      <label htmlFor="Description">
                        Add Delivery Instructions
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Add instructions for your order....."
                      ></textarea>
                    </div>
                  </form>
                  <button className="btn-summary btn-primary btn-place-order">
                    Place Order
                  </button> */}
                </aside>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default OrderConfirmation;
