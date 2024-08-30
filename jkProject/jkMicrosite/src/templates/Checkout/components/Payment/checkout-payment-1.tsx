import React, { useEffect, useState } from "react";
import { getCurrencyCode, getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import { ICheckout } from "@type/Pages/checkout";
import useOrderSettingHooks from "@components/Hooks/OrderSettings";
import GSTForm from "../GSTForm";
import Cookies from "js-cookie";
import APPCONFIG from "@config/app.config";

const CheckoutPayment1 = (props: ICheckout) => {
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<string>("");
  const [paymentMethods, setPaymentMethods] = useState<any[]>();
  const orderSettingData = useOrderSettingHooks();
  const [isGst, setIsGst] = useState<number>(0);
  const [displayPopup, setDisplayPopup] = useState<boolean>(false);
  const [gstBusinessName, setGstBusinessName] = useState<string>();
  const [gstNumber, setGstNumber] = useState<string>();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    if (orderSettingData && orderSettingData?.payment_method?.length > 0) {
      setPaymentMethods(orderSettingData?.payment_method || []);
    }
  }, [orderSettingData]);

  const onChangePaymentMethod = (e: any) => {
    setCurrentPaymentMethod(e.target.value);
    props.onUpdate("", "", e.target.value);
  };

  useEffect(() => {
    props.onUpdate("", "", "", gstBusinessName, gstNumber, isGst);
    // eslint-disable-next-line
  }, [gstBusinessName, gstNumber, isGst]);

  const getGstInformation = (gstBusinessName: string, gstNumber: string) => {
    setGstBusinessName(gstBusinessName);
    setGstNumber(gstNumber);
  };

  useEffect(() => {
    setIsGst(Cookies.get("isGst") ? +Cookies.get("isGst")! : 0);
    setGstBusinessName(
      Cookies.get("businessName") ? Cookies.get("businessName") : ""
    );
    setGstNumber(Cookies.get("gstNumber") ? Cookies.get("gstNumber") : "");
  }, []);

  const onCloseModal = () => {
    setDisplayPopup(false);
  };

  const onGstCheckboxChange = () => {
    if (isGst === 1) {
      setGstBusinessName("");
      setGstNumber("");
      setIsGst(0);
      Cookies.set("businessName", "");
      Cookies.set("gstNumber", "");
      Cookies.set("isGst", "");
    }
    isGst === 0 && setDisplayPopup(true);
  };

  const checkPhonepeForCurrency = (paymentMethod: string) => {
    return paymentMethod === APPCONFIG.PAYMENT_METHODS.phonepe ? getCurrencyCode() === "INR" : true
  };


  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.checkoutPaymentMethod)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.checkoutTitle)}
        />
      </Head>

      <div className="checkout-gst-main">
        <div className="checkout-gst-details">
          {isGst === 1 && (
            <>
              <div className="checkout-gst-details-fields">
                <span className="field-span">
                  {" "}
                  <p className="field-name">Business Name</p>: {gstBusinessName}
                </span>
                <span className="field-span">
                  {" "}
                  <p className="field-name">GST Number</p>: {gstNumber}
                </span>
              </div>
              <span className="gst-edit-icon">
                <i
                  onClick={() => {
                    setIsEdit(true);
                    setDisplayPopup(true);
                  }}
                  className="jkm-pencil jkm-pencil"
                ></i>
              </span>
            </>
          )}
        </div>
        <div className="checkout-gst-label">
          <input
            type="checkbox"
            value={isGst}
            onChange={() => onGstCheckboxChange()}
            checked={isGst === 1}
            className="gst-checkbox"
          />

          <label className="gst-label" htmlFor="gst_checkbox">
            Use GST/VAT Invoice
          </label>
        </div>
      </div>
      <GSTForm
        getGstInformation={getGstInformation}
        visable={displayPopup}
        onCloseModal={onCloseModal}
        setIsGst={setIsGst}
        isEdit={isEdit}
        currentBusinessName={gstBusinessName}
        currentGstNumber={gstNumber}
      />
      <section className="payment-sec">
        <h4 className="sort-info-title">Payment Method</h4>
        <div className="payment-sec-wrap">
          <section className="tabbed-content tabs-side">
            <div className="payment-method-type tabs">
              <ul>
                <li>
                  <a href="#paymnentWallets" className="active">
                    <i className="jkm-wallet payment-method-icon"></i>Payment &
                    Wallets
                  </a>
                </li>
              </ul>
            </div>

            <section
              id="paymnentWallets"
              className="item payment-method-logo active"
              data-title="Payment & Wallets"
            >
              <i className="jkm-wallet payment-method-icon-small-device"></i>
              <div className="item-content">
                <form action="#" className="item-content">
                  <div className="d-row">
                    {paymentMethods?.map(
                      (pm, pmIndex) =>
                        checkPhonepeForCurrency(pm?.name?.toLowerCase()) && (
                          <div
                            key={pmIndex}
                            className="d-col d-col-3 custom-col"
                          >
                            <div className="cmn-radio">
                              <input
                                type="radio"
                                checked={
                                  currentPaymentMethod ===
                                    pm?.name?.toLowerCase()
                                    ? true
                                    : false
                                }
                                value={pm?.name?.toLowerCase()}
                                id={pm?.name?.toLowerCase()}
                                name={pm?.name?.toLowerCase()}
                                onClick={(e) => onChangePaymentMethod(e)}
                              />
                              <label htmlFor={pm?.name?.toLowerCase()}>
                                <CustomImage
                                  src={`/assets/images/${pm?.name?.toLowerCase()}.webp`}
                                  alt={pm?.name?.toLowerCase()}
                                  title={pm?.name?.toLowerCase()}
                                  width="114"
                                  height="24"
                                  pictureClassName="payment-method-logo"
                                />
                              </label>
                            </div>
                          </div>
                        )
                    )}
                    {/* {paymentMethods &&
                      paymentMethods?.map(
                        (pm) =>
                          pm?.[0]?.name?.toLowerCase() ===
                            APPCONFIG.PAYMENT_METHODS.razorpay && (
                            <div
                              key={"razorpay_payment_option"}
                              className="d-col d-col-3 custom-col"
                            >
                              <div className="cmn-radio razorpay_logo">
                                <input
                                  type="radio"
                                  id="razorpay_logo"
                                  name="payment-method-logo"
                                  checked={
                                    currentPaymentMethod ===
                                    APPCONFIG.PAYMENT_METHODS.razorpay
                                      ? true
                                      : false
                                  }
                                  value={APPCONFIG.PAYMENT_METHODS.razorpay}
                                  onClick={(e) => onChangePaymentMethod(e)}
                                />
                                <label htmlFor="razorpay_logo">
                                  <CustomImage
                                    src={IMAGE_PATH.razorPay}
                                    alt="Razorpay"
                                    title="Razor Pay"
                                    width="114"
                                    height="24"
                                    pictureClassName="payment-method-logo"
                                  />
                                </label>
                              </div>
                            </div>
                          )
                      )}
                    {paymentMethods &&
                      paymentMethods?.map(
                        (pm) =>
                          pm?.[0]?.name?.toLowerCase() ===
                            APPCONFIG.PAYMENT_METHODS.stripe && (
                            <div
                              key={"stripe_payment_option"}
                              className="d-col d-col-3 custom-col"
                            >
                              <div className="cmn-radio stripe_logo">
                                <input
                                  type="radio"
                                  id="stripe_logo"
                                  name="payment-method-logo"
                                  checked={
                                    currentPaymentMethod ===
                                    APPCONFIG.PAYMENT_METHODS.stripe
                                      ? true
                                      : false
                                  }
                                  value={APPCONFIG.PAYMENT_METHODS.stripe}
                                  onClick={(e) => onChangePaymentMethod(e)}
                                />
                                <label htmlFor="stripe_logo">
                                  <CustomImage
                                    src={IMAGE_PATH.stripe}
                                    alt="Stripe"
                                    title="Stripe"
                                    width="114"
                                    height="24"
                                    pictureClassName="payment-method-logo"
                                  />
                                </label>
                              </div>
                            </div>
                          )
                      )} */}
                  </div>
                </form>
              </div>
            </section>
          </section>
        </div>
      </section>
    </>
  );
};

export default CheckoutPayment1;
