import {
  PlaceOrderFormDataInterface,
  UsePlaceOrderOutputProps,
} from "@components/Hooks/checkout/index";
import { ICheckout } from "@type/Pages/checkout";
import { IAddressListData } from "@templates/MyAddress/components/Address";
import ErrorHandler from "@components/ErrorHandler";
import { useToast } from "@components/Toastr/Toastr";
import pagesServices from "@services/pages.services";
import { useCallback, useEffect, useState } from "react";
import useOrderSettingHooks from "@components/Hooks/OrderSettings/useOrderSettingsHook";
import { IPaymentGatewayKeyProps } from "@components/Hooks/paymentGatewayKey";
import useCcAvenuePayment from "@components/Hooks/paymentGatewayKey/ccAvenuePaymentGateway/useCcAvenuePayment";
import APPCONFIG from "@config/app.config";
import APICONFIG from "@config/api.config";
import { encryptDecrypt } from "../paymentGatewayKey/usePaymentGatewayKey";
import { getCurrencyCode } from "@util/common";
import Cookies from "js-cookie";
import { IMAGE_PATH } from "@constant/imagepath";
import { useDispatch, useSelector } from "react-redux";
import { ISignInReducerData } from "@type/Common/Base";
import { updateCartCounter } from "src/redux/signIn/signInAction";
import { useRouter } from "next/router";
import useRazorpay from "react-razorpay";
import getConfig from "next/config";
import { loadStripe } from "@stripe/stripe-js";
import { Message } from "@constant/errorMessage";
const { publicRuntimeConfig } = getConfig();
let stripePromise: any = null;

const UsePlaceOrder = (
  props: ICheckout,
  paymentGatewayKey?: IPaymentGatewayKeyProps[]
): UsePlaceOrderOutputProps => {
  const { showError } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const orderSettingData = useOrderSettingHooks();
  const Razorpay = useRazorpay();
  const { handleCCAvenuePayment } = useCcAvenuePayment({
    paymentGatewayKey,
    props,
  });
  const userDetails = useSelector(
    (state: ISignInReducerData) => state?.signIn?.userData?.user_detail
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const [phonepeCred, setPhonepeCred] = useState({
    merchant_id: "",
    salt_key: "",
  });

  useEffect(() => {
    const index = paymentGatewayKey?.findIndex(
      (ele: IPaymentGatewayKeyProps) =>
        ele.payment_gateway_name?.toLowerCase() ===
        APPCONFIG.PAYMENT_METHODS.stripe
    );

    const phonepayIndex = paymentGatewayKey?.findIndex(
      (ele: IPaymentGatewayKeyProps) =>
        ele.payment_gateway_name?.toLowerCase() ===
        APPCONFIG.PAYMENT_METHODS.phonepe
    );

    if (phonepayIndex !== -1) {
      const phonepeCred = {
        merchant_id: encryptDecrypt(
          paymentGatewayKey?.[phonepayIndex!]?.MERCHANT_ID
        ),
        salt_key: encryptDecrypt(paymentGatewayKey?.[phonepayIndex!]?.SALT_KEY),
      };
      //@ts-ignore
      setPhonepeCred(phonepeCred);
    }

    if (index !== -1) {
      // @ts-ignore
      if (index !== -1 && paymentGatewayKey?.[index]?.STRIPE_KEY) {
        stripePromise = loadStripe(
          // @ts-ignore
          encryptDecrypt(paymentGatewayKey?.[index]?.STRIPE_KEY)
        );
      }
    }
  }, [paymentGatewayKey]);

  const getAddressFromList = (type: string): IAddressListData | undefined => {
    return props?.list?.user_address_list?.data?.find(
      (address) =>
        address._id ===
        (type === "shipping"
          ? props?.userAddress?.shippingAddress
          : props?.userAddress?.billingAddress)
    );
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
      total_amount: props?.list?.cart_details?.total_cost,
    };
    setIsLoading(true);
    checkPaymentStatus(data, status);
  };

  /**
   *
   * @param data Request param
   * @param status success | failed | cancel
   */
  const checkPaymentStatus = async (data: any, status: string) => {
    if (status === APPCONFIG.ORDER_PAYMENT_STATUS.failed) {
      await pagesServices
        .postPage(APICONFIG.ORDER_PAYMENT_FAILED, data)
        .then((result) => {
          if (
            result.meta &&
            (result.meta.status_code == "200" ||
              result.meta.status_code == "201")
          ) {
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setIsLoading(false);
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
            setIsLoading(false);
            dispatch(updateCartCounter(0));
            router.push("/order-confirm/" + data?.order_id);
          } else {
            setIsLoading(false);
            showError(result?.meta?.message);
          }
        })
        .catch((error) => {
          setIsLoading(false);
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
            setIsLoading(false);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          showError(error?.meta?.message);
        });
    }
  };

  const checkPincodeDeliveryAvailable = async (pincode: string) => {
    setIsLoading(true);
    let available = true;
    await pagesServices
      .getHeaderFooterData(APICONFIG.AVAILABLITY_BY_PINCODE(pincode))
      .then(
        async (result) => {
          if (result?.meta && result.meta?.status_code == 200) {
            setIsLoading(false);
            available = result.data?.result === "Valid";
          }
        },
        (error) => {
          setIsLoading(false);
          ErrorHandler(error, showError);
          available = false;
        }
      );
    return available;
  };

  const handleRazorpayPayment = async (order_id: string) => {
    let newArr = [];
    props?.list?.cart_details?.cart_items.forEach((element) => {
      newArr.push(element._id);
    });
    let obj = {
      total_amount: props?.list?.cart_details?.total_cost,
      order_id: order_id,
      payment_method: "razorpay",
    };

    // razorPayGateway(city);

    await pagesServices.postPage(APICONFIG.RAZORPAY_CART_PAYMENT, obj).then(
      (result) => {
        if (result.meta && result.meta.status_code == "200") {
          //   showSuccess(result.meta.message_code);
          setIsLoading(false);
          handleRazorPaymentPopup(result.data);
        } else {
          showError(result?.meta?.message);
        }
      },
      (error) => {
        setIsLoading(false);
        showError(error?.meta?.message);
      }
    );
  };

  const handleRazorpayResponse = async (id: string, order_id: any) => {
    await pagesServices
      .getPage(APICONFIG.RAZORPAYMENT_RESPONSE + id, {})
      .then((resp) => {
        if (resp?.meta && resp?.meta.status_code === 201) {
          if (resp?.data?.items && resp?.data?.items.length > 0) {
            if (resp?.data?.items[0].error_code) {
              makePaymentStatusParam(
                resp?.data?.items[0].id,
                resp?.data,
                APPCONFIG.ORDER_PAYMENT_STATUS.failed,
                APPCONFIG.PAYMENT_METHODS.razorpay,
                order_id
              );
            } else {
              makePaymentStatusParam(
                resp?.data?.items[0].id,
                resp?.data,
                APPCONFIG.ORDER_PAYMENT_STATUS.success,
                APPCONFIG.PAYMENT_METHODS.razorpay,
                order_id
              );
            }
          }
        }
      })
      .catch((error) => {
        makePaymentStatusParam(
          null,
          error,
          APPCONFIG.ORDER_PAYMENT_STATUS.failed,
          APPCONFIG.PAYMENT_METHODS.razorpay,
          order_id
        );
        showError(error?.meta?.message);
      });
  };

  const handleRazorPaymentPopup = useCallback(
    (paymentResponse: any) => {
      setIsLoading(false);
      const { id, amount, receipt } = paymentResponse.razorpay_order;
      const index = paymentGatewayKey?.findIndex(
        (ele: IPaymentGatewayKeyProps) =>
          ele.payment_gateway_name?.toLowerCase() ===
          APPCONFIG.PAYMENT_METHODS.razorpay
      );
      const options = {
        // @ts-ignore
        key: encryptDecrypt(paymentGatewayKey?.[index]?.RAZORPAY_KEY),
        amount: amount,
        currency: getCurrencyCode(),
        name: "Cart Checkout",
        image: Cookies.get("favicon") || IMAGE_PATH.favicon,
        order_id: id,
        prefill: {
          name: `${userDetails?.first_name} ${userDetails?.last_name}`,
          contact: `${userDetails?.mobile}`,
          email: `${userDetails?.email}`,
        },
        handler: (res: any) => {
          if (res) {
            handleRazorpayResponse(res.razorpay_order_id, receipt);
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      // @ts-ignore
      const rzpay = new Razorpay(options);
      rzpay.on("payment.failed", function (response: any) {
        makePaymentStatusParam(response, paymentResponse, "failed");
      });
      rzpay.on("payment.cancel", function (response: any) {
        makePaymentStatusParam(response, paymentResponse, "cancel");
      });
      rzpay.open();
    },
    // eslint-disable-next-line
    [Razorpay]
  );

  /**
   * Call Stripe Payment Gateway for redirect page
   */
  const handleStripePayment = async (order_id: string) => {
    setIsLoading(true);
    let obj = {
      amount: Math.round(props?.list?.cart_details?.total_cost) * 100,
      currency: getCurrencyCode() || "INR",
      quantity: props?.list?.cart_details.cart_count,
      description: "Best Place to buy Jewellery",
      customer_email: userDetails?.email,
      order_id: order_id,
      success_url:
        (window ? window.location.origin : publicRuntimeConfig.FRONT_URL) +
        "/cart/checkout_list/",
      cancel_url:
        (window ? window.location.origin : publicRuntimeConfig.FRONT_URL) +
        "/cart/checkout_list/",
      //   success_url: "http://localhost:3000" + "/cart/checkout_list/",
      //   cancel_url: "http://localhost:3000" + "/cart/checkout_list/",
    };

    const stripe = await stripePromise;
    const checkoutSession = await pagesServices.postPage(
      APICONFIG.STRIPE_CREATE_CHECKOUT,
      {
        item: obj,
      }
    );
    const result = await stripe.redirectToCheckout({
      sessionId: checkoutSession?.id,
    });
    if (result.error) {
      setIsLoading(false);
      showError(result.error.message);
    }
  };

  const handlePhonepePayment = async (order_id: string) => {
    setIsLoading(true);
    const transactionId = "T" + Date.now();
    const data = {
      amount: Math.round(props?.list?.cart_details?.total_cost) * 100,
      MUID: "PGTESTPAYUAT" + Date.now(),
      transactionId: transactionId,
      merchant_id: phonepeCred?.merchant_id,
      salt_key: phonepeCred?.salt_key,
      order_id: order_id,
      redirectUrl:
        (window ? window.location.origin : publicRuntimeConfig.FRONT_URL) +
        `/cart/checkout_list?transactionId=${transactionId}&merchant_id=${phonepeCred?.merchant_id}&order_id=${order_id}&salt_key=${phonepeCred?.salt_key}`,
    };
    await pagesServices
      .postPage(APICONFIG.PHONEPAY_CREATE_CHECKOUT, data)
      .then((res) => {
        if (res?.error) {
          setIsLoading(false);
          showError(Message.PHONE_PAY_UNAVAILABLE);
          return;
        }
        window.location.href = res?.data;
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        showError(Message.PHONE_PAY_UNAVAILABLE);
      });
  };

  /**
   * handle cash on Delivery payment
   */
  const handleCODPayment = (data: any) => {
    makePaymentStatusParam(
      data?.order_id,
      data,
      APPCONFIG.ORDER_PAYMENT_STATUS.success,
      APPCONFIG.PAYMENT_METHODS.cod,
      data?.order_id
    );
  };

  const placeOrder = async () => {
    let validationError = {
      meta: {
        message: "Please select",
        status: false,
        message_code: "",
        status_code: 422,
      },
      errors: [],
    };
    const userBillingAddress: IAddressListData | undefined =
      getAddressFromList("billing");
    const userShippingAddress: IAddressListData | undefined =
      getAddressFromList("shipping");
    if (!userBillingAddress || !userShippingAddress) {
      if (!userBillingAddress) {
        validationError.meta.message = `${validationError.meta.message} billing address`;
      }
      if (!userShippingAddress) {
        validationError.meta.message = `${validationError.meta.message} ${!userBillingAddress ? "and " : ""
          } shipping address`;
      }
      ErrorHandler(validationError, showError);
      return true;
    }
    if (
      props?.current_payment_methods === "" ||
      props?.current_payment_methods === null ||
      props?.current_payment_methods === undefined
    ) {
      validationError.meta.message = `${validationError.meta.message} payment method`;
      ErrorHandler(validationError, showError);
      return true;
    }

    // TODO: Need to work on gift wrap logic
    let formData: PlaceOrderFormDataInterface = {
      cart_id: props?.list?.cart_details?._id,
      is_advance: "0",
      advance_amount: "0",
      advance_percent: "0",
      remaining_amount: "0",
      gift_wrap_price:
        props?.list?.cart_details?.gift_message?.gift_wrap_charge || "0",
      receiver_email:
        props?.list?.cart_details?.gift_message?.gift_recipient || "",
      sender_email: props?.list?.cart_details?.gift_message?.gift_sender || "",
      message: props?.list?.cart_details?.gift_message?.gift_message || "",
      account_id: props?.list?.cart_details?.account_id || "",
      is_gift_wrap: 0,
      is_gst: props?.isGst,
    };
    if (orderSettingData && orderSettingData?.payment_method?.length > 0) {
      setIsLoading(true);
      const index = orderSettingData?.payment_method?.findIndex(
        (ele) => ele.name.toLowerCase() === props?.current_payment_methods
      );
      // @ts-ignore
      formData["payment_method"] = await orderSettingData?.payment_method?.[
        index
      ]?.code;
    }

    // TODO: Remove this once payment code get in API added for testing reason
    // formData['payment_method'] = 4

    formData["billing_address"] = {
      name:
        userBillingAddress?.fullname ??
        `${userBillingAddress?.user?.first_name} ${userBillingAddress?.user?.last_name}`,
      address: `${userBillingAddress?.address_line1} ${userBillingAddress?.address_line2}`,
      city: `${userBillingAddress?.city?.name}`,
      state: `${userBillingAddress?.state?.name}`,
      country: `${userBillingAddress?.country?.name}`,
      zip: `${userBillingAddress?.pincode}`,
      mobile_no: `${userBillingAddress?.country?.country_phone_code} ${userBillingAddress?.mobile_number}`,
    };

    formData["shipping_address"] = {
      name:
        userShippingAddress?.fullname ??
        `${userShippingAddress?.user?.first_name} ${userShippingAddress?.user?.last_name}`,
      address: `${userShippingAddress?.address_line1} ${userShippingAddress?.address_line2}`,
      city: `${userShippingAddress?.city?.name}`,
      state: `${userShippingAddress?.state?.name}`,
      country: `${userShippingAddress?.country?.name}`,
      zip: `${userShippingAddress?.pincode}`,
      mobile_no: `${userShippingAddress?.country?.country_phone_code} ${userShippingAddress?.mobile_number}`,
    };

    if (
      orderSettingData &&
      props?.current_payment_methods.toLowerCase() ===
      APPCONFIG.PAYMENT_METHODS.cod
    ) {
      if (
        orderSettingData?.max_cod_amount !== 0 &&
        orderSettingData?.max_cod_amount < props?.list?.cart_details?.total_cost
      ) {
        setIsLoading(false);
        showError(
          `Maximum Cash on Delivery (COD) Amount is ${orderSettingData?.max_cod_amount}`
        );
        return;
      }
    }

    if (props?.isGst === 1) {
      let gstDetails = {
        business_name: props?.businessName,
        gst_number: props?.gstNumber,
      };
      formData = { ...formData, ...gstDetails };
    }
    checkPincodeDeliveryAvailable(userShippingAddress?.pincode)
      .then(async (res) => {
        if (res) {
          await pagesServices
            .postPage(APICONFIG.CHECKOUT_PLACE_ORDER, formData)
            .then(
              (result) => {
                if (
                  result.meta &&
                  (result.meta.status_code == "200" ||
                    result.meta.status_code == "201")
                ) {
                  Cookies.remove('shippingAddress');
                  Cookies.remove('billingAddress');
                  Cookies.remove('businessName');
                  Cookies.remove('gstNumber');
                  Cookies.remove('isGst');
                  if (props?.current_payment_methods) {
                    if (
                      props?.current_payment_methods?.toLowerCase() ===
                      APPCONFIG.PAYMENT_METHODS.razorpay
                    ) {
                      handleRazorpayPayment(result?.data?.order_id);
                    } else if (
                      props?.current_payment_methods?.toLowerCase() ===
                      APPCONFIG.PAYMENT_METHODS.stripe
                    ) {
                      handleStripePayment(result?.data?.order_id);
                    } else if (
                      props?.current_payment_methods.toLowerCase() ===
                      APPCONFIG.PAYMENT_METHODS.ccavenue
                    ) {
                      handleCCAvenuePayment(
                        result?.data?.order_id,
                        formData["billing_address"],
                        formData["shipping_address"]
                      );
                    } else if (
                      props?.current_payment_methods.toLowerCase() ===
                      APPCONFIG.PAYMENT_METHODS.cod
                    ) {
                      handleCODPayment(result?.data);
                    } else if (
                      props?.current_payment_methods.toLowerCase() ===
                      APPCONFIG.PAYMENT_METHODS.phonepe
                    ) {
                      handlePhonepePayment(result.data.order_id);
                    }
                  }
                } else {
                  setIsLoading(false);
                  showError(result?.meta?.message);
                }
              },
              (error) => {
                setIsLoading(false);
                ErrorHandler(error, showError);
              }
            );
        } else {
          setIsLoading(false);
          showError("Incorrect pincode/postcode for shipping address");
        }
      })
      .catch(() => {
        setIsLoading(false);
        showError("Incorrect pincode/postcode for shipping address");
      });
  };

  /**
   * Success, Cancel or fail payment status check using stripe session response
   * @param session_id
   */
  const getPaymentStatusFromStripe = async (session_id: string) => {
    setIsLoading(true);
    await pagesServices
      .postPage(APICONFIG.STRIPE_PAYMENT_STATUS, {
        id: session_id,
      })
      .then((res) => {
        const status =
          res?.paymentDetails?.status === "succeeded"
            ? APPCONFIG.ORDER_PAYMENT_STATUS.success
            : res?.paymentDetails?.status === "canceled"
              ? APPCONFIG.ORDER_PAYMENT_STATUS.cancel
              : APPCONFIG.ORDER_PAYMENT_STATUS.failed;
        makePaymentStatusParam(
          res?.checkout?.id,
          res,
          status,
          APPCONFIG.PAYMENT_METHODS.stripe
        );
      });
  };

  const getPaymentStatusFromPhonepay = async (
    merchant_id: string,
    transactionId: string,
    order_id: string,
    salt_key: string
  ) => {
    setIsLoading(true);

    const data = {
      merchant_id: merchant_id,
      transactionId: transactionId,
      saltKey: salt_key
    };

    await pagesServices
      .postPage(APICONFIG.PHONEPAY_PAYMENT_STATUS, data)
      .then((res: any) => {
        if (res?.error) {
          setIsLoading(false);
          showError(Message.PHONE_PAY_STATUS_UNAVAILABLE);
          return;
        }

        const status =
          res?.data?.data?.state === "COMPLETED"
            ? APPCONFIG.ORDER_PAYMENT_STATUS.success
            : APPCONFIG.ORDER_PAYMENT_STATUS.failed;

        makePaymentStatusParam(
          res?.data?.data?.transactionId,
          res,
          status,
          APPCONFIG.PAYMENT_METHODS.phonepe,
          order_id
        );
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };

  return {
    placeOrder,
    placeOrderLoading: isLoading,
    getPaymentStatusFromStripe,
    getPaymentStatusFromPhonepay,
  };
};

export default UsePlaceOrder;
