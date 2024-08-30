import { ICheckoutMain } from "@templates/Checkout";
import React, { useState } from "react";
import { getComponents } from "@templates/Checkout/components/index";
import { API_SECTION_NAME } from "@config/apiSectionName";
import useGiftMessage from "@components/Hooks/giftMessage";
import { useSelector } from "react-redux";
import Loader from "@components/customLoader/Loader";
import { IGstInformation } from ".";

const WrapComponent1 = (props: ICheckoutMain) => {
  const [checkoutData, setCheckoutData] = useState<ICheckoutMain>(props);
  const [userSelectedAddress, setUserSelectedAddress] = useState<any>();
  const [currentPaymentMethod, setCurrentPaymentMethod] = useState<string>("");
  const [gstInformation, setGstInformation] = useState<IGstInformation>();
  const { getCheckoutUpdatedData } = useGiftMessage();
  const getUpdatedData = async (
    shippingAddress?: string,
    billingAddress?: string,
    paymentMethods?: string,
    businessName?: string,
    gstNumber?: string,
    isGst?: number
  ) => {
    if (paymentMethods) {
      setCurrentPaymentMethod(paymentMethods);
      const list = {
        ...checkoutData.data,
        current_payment_methods: paymentMethods,
      };
      setCheckoutData({
        ...checkoutData,
        ...list,
      });
      return true;
    }

    if (isGst === 0 || isGst === 1) {
      let updatedGstInformation: IGstInformation = { isGst: isGst };

      if (isGst === 1) {
        updatedGstInformation.businessName = businessName;
        updatedGstInformation.gstNumber = gstNumber;
      }

      setGstInformation(updatedGstInformation);

      let list = {
        ...checkoutData.data,
        ...updatedGstInformation,
      };

      setCheckoutData({
        ...checkoutData,
        ...list,
      });
      return true;
    }

    if(shippingAddress || billingAddress){
      setUserSelectedAddress({
        userAddress: {
          shippingAddress,
          billingAddress,
        },
      });
      return true
    }
    const response: ICheckoutMain = await getCheckoutUpdatedData();
    setCheckoutData({ ...checkoutData, ...response });
  };
  const loaderData = useSelector((state) => state);

  const getProps = (ele: string) => {
    let mainProps = { list: checkoutData?.data, onUpdate:getUpdatedData};

    if (ele === API_SECTION_NAME.cart_details) {
      mainProps = {
        ...mainProps,
        ...userSelectedAddress,
        current_payment_methods: currentPaymentMethod,
        ...gstInformation,
      };
    }
    return mainProps;
  };

  return (
    <section className="checkout-sec">
      <div className="container">
        {
          //  @ts-ignore
          loaderData?.loaderRootReducer?.loadingState ? (
            <Loader />
          ) : (
            <div className="checkout-wrap">
              <section className="main-content">
                {checkoutData.sequence?.map(
                  (ele) =>
                    ele != API_SECTION_NAME.cart_details &&
                    getComponents(
                      checkoutData?.data?.[ele as keyof ICheckoutMain]
                        ?.type as string,
                      ele,
                      getProps(ele)
                    )
                )}
              </section>
              {checkoutData.sequence?.map(
                (ele) =>
                  ele == API_SECTION_NAME.cart_details &&
                  getComponents(
                    checkoutData?.data?.[ele as keyof ICheckoutMain]
                      ?.type as string,
                    ele,
                    getProps(ele)
                  )
              )}
            </div>
          )
        }
      </div>
    </section>
  );
};

export default WrapComponent1;
