import React, { useState } from "react";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import { getComponents } from "@templates/Checkout/components/index";
import { ICheckout } from "@type/Pages/checkout";
import MyAddressSection1 from "@templates/MyAddress/components/Address";

const CheckoutDetails1 = (props: ICheckout) => {
  const [templateType] = useState<string>("1");
  const [isGiftMessage, setIsGiftMessage] = useState<boolean>(false);
  const onCloseQuickView = () => {
    setIsGiftMessage(false);
  };



  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.addNewAddressPopUp)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.checkoutOrderInfo)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.checkoutAddressDetails)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.checkoutTitle)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath("", CSS_NAME_PATH.popupBoxDesign)} />
      </Head>
      <h3 className="heading-title-content ">Delivery / Pickup Information</h3>
      <section className="top-sec">
        <form>
          <div className="mode-section">
            <div className="gift-wrap" onClick={() => setIsGiftMessage(true)}>
              <a href="#">
                <i className="jkm-gift gift-icon"></i> Gift Wrap and Write a Message
              </a>
            </div>
          </div>
        </form>
      </section>
      {props?.list?.cart_details?.gift_message ? (
        <span>
          {"gift Message: "}{props?.list?.cart_details?.gift_message?.gift_message}
          {"gift Recipient: "}{props?.list?.cart_details?.gift_message?.gift_recipient}
          {"gift Sender: "}{props?.list?.cart_details?.gift_message?.gift_sender}
        </span>
      ) : (
        <></>
      )}
      <div></div>
      <MyAddressSection1
        useraddressDetails={props?.list?.user_address_list?.data}
        showOption={true}
      // getUpdateValue={getUpdatedValueHandler}
      />

      {isGiftMessage ? (
        getComponents(templateType, "gift_message", {
          isModal: isGiftMessage,
          onClose: onCloseQuickView,
          _id: props?.list?.cart_details?._id,
          gift_message: props?.list?.cart_details?.gift_message,
          updateData: props?.onUpdate,
        })
      ) : (
        <></>
      )}
    </>
  );
};

export default CheckoutDetails1;
