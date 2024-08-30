import Loader from "@components/customLoader/Loader";
import { useToast } from "@components/Toastr/Toastr";
import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import pagesServices from "@services/pages.services";
import { ICCAvenuePropsData } from "@templates/CCAvenuePayment";
import { stringToObj } from "@util/common";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCartCounter } from "src/redux/signIn/signInAction";

const CCAvenuePaymentResponse = (props: ICCAvenuePropsData) => {
  const [isLoading, setisLoading] = useState<boolean>(false);
  const { showError } = useToast();
  const Router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    if (props?.ccresponse?.data) {
      getPaymentStatusFromCCAvenue();
    }
    // eslint-disable-next-line
  }, [props?.ccresponse]);

  const getPaymentStatusFromCCAvenue = () => {
    setisLoading(true);
    const data = props?.ccresponse?.data;
    if (data) {
      const parseData = stringToObj(data?.ccavResponse);
      const status =
        parseData?.order_status === "Success"
          ? APPCONFIG.ORDER_PAYMENT_STATUS.success
          : APPCONFIG.ORDER_PAYMENT_STATUS.failed;
      makePaymentStatusParam(
        parseData?.tracking_id,
        parseData,
        status,
        APPCONFIG.PAYMENT_METHODS.ccavenue,
        parseData?.order_id
      );
    }
  };

  /**
   *
   * @param transactionId
   * @param res Payment full response
   * @param status success | failed | cancel
   * @param paymentMethod
   * @param orderId String
   */
  const makePaymentStatusParam = (
    transactionId: string | null,
    res: any,
    status: string,
    paymentMethod = APPCONFIG.PAYMENT_METHODS.razorpay,
    orderId = ""
  ) => {
    const data = {
      order_id:
        paymentMethod === APPCONFIG.PAYMENT_METHODS.stripe
          ? res?.checkout?.metadata?.order_id
          : orderId,
      transaction_id: transactionId,
      transaction_detail: { ...res },
      payment_method: paymentMethod,
      total_amount: res?.amount,
    };
    setisLoading(true);
    checkPaymentStatus(data, status);
  };

  /**
   *
   * @param data Request param
   * @param status success | failed | cancel
   */
  const checkPaymentStatus = async (data: any, status: any) => {
    if (status === APPCONFIG.ORDER_PAYMENT_STATUS.failed) {
      await pagesServices
        .postPage(APICONFIG.ORDER_PAYMENT_FAILED, data)
        .then((result) => {
          if (
            result.meta &&
            (result.meta.status_code == "200" ||
              result.meta.status_code == "201")
          ) {
            setisLoading(false);
            showError("Payment was not Done Successfully");
            Router.push("/cart/checkout_list");
          }
        })
        .catch((error) => {
          setisLoading(false);
          showError(error?.meta?.message);
        });
    }

    if (status === APPCONFIG.ORDER_PAYMENT_STATUS.success) {
      await pagesServices
        .postPage(APICONFIG.ORDER_PAYMENT_SUCCESS, data)
        .then((result) => {
          if (
            result.meta &&
            (result.meta.status_code == "200" ||
              result.meta.status_code == "201")
          ) {
            setisLoading(false);
            dispatch(updateCartCounter(0));
            Router.push("/order-confirm/" + data?.order_id);
          }
        })
        .catch((error) => {
          setisLoading(false);
          showError(error?.meta?.message);
        });
    }

    if (status === APPCONFIG.ORDER_PAYMENT_STATUS.cancel) {
      await pagesServices
        .postPage(APICONFIG.ORDER_PAYMENT_CANCEL, data)
        .then((result) => {
          if (
            result.meta &&
            (result.meta.status_code == "200" ||
              result.meta.status_code == "201")
          ) {
            setisLoading(false);
          }
        })
        .catch((error) => {
          setisLoading(false);
          showError(error?.meta?.message);
        });
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href={
          APPCONFIG.STYLE_BASE_PATH_COMPONENT +
          CSS_NAME_PATH.toasterDesign +
          ".css"
        }
      />
      {isLoading && <Loader />}
    </>
  );
};

export default CCAvenuePaymentResponse;
