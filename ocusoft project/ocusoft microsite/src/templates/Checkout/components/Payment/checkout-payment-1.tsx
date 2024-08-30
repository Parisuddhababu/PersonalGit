import React, { useEffect, useState } from "react";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import { ICheckout } from "@type/Pages/checkout";
import Cookies from "js-cookie";

const CheckoutPayment1 = (props: ICheckout) => {
  const [isGst, setIsGst] = useState<number>(0);
  const [gstBusinessName, setGstBusinessName] = useState<string | undefined>("");
  const [gstNumber, setGstNumber] = useState<string | undefined>("")

  useEffect(() => {
    props.onUpdate("", "", "", gstBusinessName, gstNumber, isGst);
  }, [gstBusinessName, gstNumber, isGst])

  useEffect(() => {
    setIsGst(Cookies.get("isGst") ? +Cookies.get("isGst")! : 0)
    setGstBusinessName(Cookies.get("businessName") ? Cookies.get("businessName") : "")
    setGstNumber(Cookies.get("gstNumber") ? Cookies.get("gstNumber") : "")
  }, [])

  const onGstCheckboxChange = () => {
    if (isGst === 1) {
      setGstBusinessName("")
      setGstNumber("")
      setIsGst(0)
      Cookies.set("businessName", "");
      Cookies.set("gstNumber", "");
      Cookies.set("isGst", "")
    }
  }

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
          {isGst === 1 &&
            <>
              <div className="checkout-gst-details-fields">
                <span className="field-span"> <p className="field-name">Business Name</p>:  {gstBusinessName}</span>
                <span className="field-span"> <p className="field-name">GST Number</p>:  {gstNumber}</span>
              </div>
              <span className="gst-edit-icon">
                <i
                  className="jkm-pencil jkm-pencil"
                ></i>
              </span>
            </>}
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

              </div>
            </section>
          </section>
        </div>
      </section>
    </>
  );
};

export default CheckoutPayment1;
