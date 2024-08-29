import BreadCrumbs from "@components/BreadCrumbs";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import React, { useEffect, useState, Fragment, useMemo, useCallback } from "react";
import OrderSummary from "./components/OrderSummary";
import ShippingMethod from "./components/ShippingMethod";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "src/redux/loader/loaderAction";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import AddressSelectionPopup, { SeletedAddress } from "@templates/MyAddress/components/AddressSelectionPopup";
import { IAddressListData } from "@templates/MyAddress/components/Address";
import { toast } from "react-toastify";
import ErrorHandler from "@components/ErrorHandler";
import ShippingAddress from "./components/ShippingBillingAddress";
import AddEditAddress from "@templates/MyAddress/components/AddEditAddress";
import { useRouter } from "next/router";
import {
  Elements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import StripeCardForm from "./components/StripeForm/StripeCardForm";
import { loadStripe } from "@stripe/stripe-js";
import { setCartCountAction } from "src/redux/product/productAction";
import { EMAIL_REGEX } from "@constant/regex";
import { ICartData, IPaymentMethod, IShipping } from "@type/Pages/cart";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import { ISignInReducerData } from "@type/Common/Base";
import { encryptDecrypt } from "@components/Hooks/paymentGatewayKey/usePaymentGatewayKey";
import APPCONFIG from "@config/app.config";
import Script from "next/script";
let stripePromise: any = null;
let orderiD: string;

const Checkout = () => {
  const router = useRouter()
  const [cartData, setCartData] = useState<ICartData>();
  const [shippingMethods, setShippingMethods] = useState<IShipping[]>([])
  const [stripeAccount, setStripeAccount] = useState('')
  const [userAddress, setUserAddress] = useState<IAddressListData[]>([])
  const dispatch = useDispatch()
  const [addressSelection, setAddressSelection] = useState({
    isOpen: false,
    type: 0
  })
  const [modal, setModal] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<IAddressListData>();
  const [editMode, setEditMode] = useState(false);
  const [idOfAddress, setIdOfAddress] = useState("");
  const [selectedShippingMethod, setSelectedShippingMethod] = useState<IShipping>();
  const [step, setStep] = useState(1)
  const [isBillingAddressSame, setIsBillingAddressSame] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<string[]>([])
  const [isShippingAddressChanged, setIsShippingAddressChanged] = useState(false)
  const [paypalKeys, setPaypalKeys] = useState({
    clientId: '',
    currency: 'USD',
    dataClientToken: ''
  })
  const [pmiKeys, setPmiKeys] = useState({
    mid: '',
    key: '',
  })
  const [pmiorderId, setPmiorderId] = useState('')
  const [initialzed, setInitialzed] = useState(false)
  const reduxData = useSelector((state: ISignInReducerData) => state);
  const {
    getCartData,
  } = useAddtoCart();
  const [gateWay, setGateWay] = useState(1)
  const signedInUserdata = useSelector((state: ISignInReducerData) => state);
  const fullUrl = typeof window !== 'undefined' ? window.location.href : '';

  let email: string = signedInUserdata?.signIn?.userData?.user_detail?.email;

  useEffect(() => {
    getCartDataItem()
    getAllAddresses()
    getPaymentMethod()
    const _shippingMethod = localStorage.getItem('shippingMethod')
    if (_shippingMethod) {
      handleNextPage(JSON.parse(_shippingMethod))
    }
  }, [])

  useEffect(() => {
    if (!paymentMethod?.length) {
      return
    }
    getPaymentKeys()
  }, [paymentMethod?.length])

  const cartAmount = useMemo(() => {
    return Number(cartData?.cart_details?.total_price) + Number(selectedShippingMethod?.rate)
  }, [cartData?.cart_details?.total_price, selectedShippingMethod?.rate])

  const getPaymentKeys = async () => {
    pagesServices.postPage(APICONFIG.PAYMENT_GATEWAT_KEYS, {}).
      then((res) => {
        if (res?.data?.payment_gateway_details?.length) {
          res?.data?.payment_gateway_details?.forEach((i: any) => {
            if (i?.payment_gateway_name === 'Stripe' && stripeAccount) {
              stripePromise = loadStripe(APPCONFIG.stripePublicKey, { stripeAccount })
            }
            if (i?.payment_gateway_name === 'Paypal') {
              setPaypalKeys({
                ...paypalKeys,
                clientId: encryptDecrypt(i?.CLIENT_ID) as string,
                dataClientToken: encryptDecrypt(i?.SECRET_KEY) as string,
              })
            }
            if (i?.payment_gateway_name === 'PMI') {
              setPmiKeys({
                mid: encryptDecrypt(i?.mid) as string,
                key: encryptDecrypt(i?.key) as string
              })
            }
          })
        }
      })
  }

  const editAddress = (id: string) => {
    if (id) {
      let address = userAddress?.find((ele: { _id: string }) => ele?._id == id);
      setFilteredData(address);
      setIdOfAddress(id);
      setEditMode(true);
      toggleModal();
    }
  };

  const getAllPaymentMethods = async () => {
    pagesServices.getPage(APICONFIG.SHIPPING_METHODS, {}).then((res) => {
      if (res?.meta?.status_code === 200) {
        setShippingMethods(res?.data?.shipping_methods)
        res?.data?.shipping_methods?.forEach((i: IShipping) => {
          if (i?.is_default) {
            setInitialzed(true)
            onShippingMethodSelect(i)
          }
        })
      }
    })
  }

  const getCartDataItem = async () => {
    const cartItems = localStorage.getItem('cart-items')
    if (cartItems) {
      setCartData(JSON.parse(cartItems))
      return
    }
    dispatch(setLoader(true))
    const result = await getCartData(false);
    dispatch(setLoader(false))
    setIsShippingAddressChanged(false)
    if (result?.data) {
      setCartData(result?.data)
      localStorage.setItem('cart-items', JSON.stringify(result.data))
    }
  };


  const handleNextPage = useCallback((shipingMethod?: IShipping) => {
    localStorage.setItem('shippingMethod', JSON.stringify(shipingMethod))
    setSelectedShippingMethod(shipingMethod)
    setStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [setSelectedShippingMethod])


  const getAllAddresses = (loader = true) => {
    const cartItems = localStorage.getItem('cart-items')
    if (cartItems && loader) {
      dispatch(setLoader(true))
    }
    pagesServices
      .getPage(APICONFIG.GET_ADRESS_BOOK_LIST, {})
      .then((result) => {
        if (cartItems && loader) {
          dispatch(setLoader(false))
        }
        if (result?.data?.user_address_list?.data?.length) {
          setUserAddress(result?.data?.user_address_list?.data)
        }
      }).then(() => {
        if (cartItems && loader) {
          dispatch(setLoader(false))
        }
      })
  }

  const getPaymentMethod = async () => {
    pagesServices
      .getPage(APICONFIG.PAYMENT_METHOD, {})
      .then((result) => {
        console.log(result, 'Result')
        if (result?.data?.payment_methods?.length) {
          setStripeAccount(result?.data?.stripe_account)
          setPaymentMethod(result?.data?.payment_methods?.map((i: IPaymentMethod) => i?.payment_gateway_name))
        }
      })
  }

  const onDefaultAddressChange = useCallback((address?: SeletedAddress) => {
    let obj: { is_default_shipped?: number, is_default_billing?: number } = {
      is_default_billing: 1
    }
    if (address?.type === 2) {
      obj = {
        is_default_shipped: 1
      }
    }
    if (!address?.id) {
      return
    }
    setAddressSelection({
      type: 0,
      isOpen: false
    })
    dispatch(setLoader(true))
    pagesServices
      .postPage(`${APICONFIG.CHANGE_DEFAULT_ADDRESS}${address?.id}`, obj)
      .then((result) => {
        dispatch(setLoader(false))
        if (result?.meta?.status_code === 200) {
          toast.success(result?.meta?.message)
          getAllAddresses(address?.type === 2)
          if (address?.type === 2) {
            localStorage.removeItem('cart-items')
            getCartDataItem()
          }
          return
        }
        toast.error(result?.meta?.message)
      })
      .catch((error) => {
        dispatch(setLoader(false))
        ErrorHandler(error, toast.error);
      });
  }, [addressSelection, getAllAddresses])

  const defaultShippedAddress: IAddressListData[] = useMemo(() => {
    return userAddress.filter((user: { is_default_shipped: number }) => user.is_default_shipped == 1);
  }, [userAddress])

  const defaultBillingAddress: IAddressListData[] = useMemo(() => {
    return userAddress.filter((user: { is_default_billing: number }) => user.is_default_billing == 1);
  }, [userAddress])

  const onEditAddress = useCallback((type = 2) => {
    if (type === 2) {
      setIsShippingAddressChanged(true)
    }
    editAddress(type == 2 ? defaultShippedAddress?.[0]?._id : defaultBillingAddress?.[0]?._id)
  }, [defaultShippedAddress, defaultBillingAddress])

  const onChangeShippingAddress = useCallback((type = 2) => {
    setAddressSelection({
      isOpen: true,
      type
    })
  }, [addressSelection]);

  const toggleModal = useCallback(() => {
    setModal(!modal);
  }, [modal]);

  const setFormEditMode = useCallback(() => {
    setEditMode(false);
  }, [editMode]);

  const placeOrderObj = useMemo(() => {
    let billing_address = {
      "name": `${defaultBillingAddress?.[0]?.first_name} ${defaultBillingAddress?.[0]?.last_name}`,
      "address": defaultBillingAddress?.[0]?.address,
      "city": defaultBillingAddress?.[0]?.city?.name,
      "state": defaultBillingAddress?.[0]?.state?.name,
      "country": defaultBillingAddress?.[0]?.country?.name,
      "zip": defaultBillingAddress?.[0]?.pincode,
      "mobile_no": defaultBillingAddress?.[0]?.mobile_number
    }
    const shipping_address = {
      "name": `${defaultShippedAddress?.[0]?.first_name} ${defaultShippedAddress?.[0]?.last_name}`,
      "address": defaultShippedAddress?.[0]?.address,
      "city": defaultShippedAddress?.[0]?.city?.name,
      "state": defaultShippedAddress?.[0]?.state?.name,
      "country": defaultShippedAddress?.[0]?.country?.name,
      "zip": defaultShippedAddress?.[0]?.pincode,
      "mobile_no": defaultShippedAddress?.[0]?.mobile_number
    }
    if (isBillingAddressSame) {
      billing_address = shipping_address
    }
    const obj = {
      "cart_id": cartData?.cart_details?.cart_id,
      "payment_method": "STRIPE",
      "shipping_method": selectedShippingMethod?.title,
      "total_shipping_charges": selectedShippingMethod?.rate,
      is_buy_now: Number(router?.query?.is_buy_now) === 1 ? 1 : 0,
      "total_cost": (Number(cartData?.cart_details?.total_price) + Number(selectedShippingMethod?.rate)),
      billing_address,
      shipping_address,
    }
    if (gateWay === 1) {
      obj.payment_method = 'STRIPE'
    }
    if (gateWay === 2) {
      obj.payment_method = 'Paypal'
    }
    return obj
  }, [gateWay, defaultShippedAddress, defaultBillingAddress, isBillingAddressSame, cartData, router?.query?.is_buy_now, selectedShippingMethod])


  const onPaymentComplete = async (transaction: { id?: string; paymentID?: string, Tran_ID?: string }, method: string, status: number, order_id?: string) => {
    if (method === 'Stripe') {
      onTransaction({
        order_id,
        payment_method: 'STRIPE',
        transaction_id: status ? transaction?.id : null,
        transaction_detail: { ...transaction },
        is_buy_now: Number(router?.query?.is_buy_now) === 1 ? 1 : 0
      }, status)
    }
    if (method === 'Paypal') {
      onTransaction({
        order_id,
        payment_method: 'Paypal',
        transaction_id: status ? transaction?.paymentID : null,
        transaction_detail: { ...transaction },
        is_buy_now: Number(router?.query?.is_buy_now) === 1 ? 1 : 0
      }, status)
    }
    if (method === 'PMI') {
      onTransaction({
        order_id,
        payment_method: 'PMI',
        transaction_id: status ? transaction?.Tran_ID : null,
        transaction_detail: { ...transaction },
        is_buy_now: Number(router?.query?.is_buy_now) === 1 ? 1 : 0
      }, status)
    }
  }

  const onTransaction = (details: any, status: number) => {
    const data = {
      ...details,
      total_amount: (Number(cartData?.cart_details?.total_price) + Number(selectedShippingMethod?.rate)),
    };
    dispatch(setLoader(true))
    checkPaymentStatus(data, status);
  }

  const checkPaymentStatus = async (data: { order_id: string; }, status: number) => {
    if (status === 0) {
      await pagesServices
        .postPage(APICONFIG.ORDER_PAYMENT_FAILED, data)
        .then(() => {
          dispatch(setLoader(false))
          toast.error('Payment is failed, please try again after some time.')
        })
        .catch((error) => {
          dispatch(setLoader(false))
          toast.error(error?.meta?.message);
        });
    }

    if (status === 1) {
      await pagesServices
        .postPage(APICONFIG.ORDER_PAYMENT_SUCCESS, data)
        .then((result) => {
          dispatch(setLoader(false))
          if (
            result.meta &&
            (result.meta.status_code == "200" ||
              result.meta.status_code == "201")
          ) {
            dispatch(setCartCountAction(0));
            router.push("/order-confirm/" + data?.order_id);
            localStorage.removeItem('cart-items')
            localStorage.removeItem('shippingMethod')
          } else {

            toast.error(result?.meta?.message);
          }
        })
        .catch((error) => {
          dispatch(setLoader(false))
          toast.error(error?.meta?.message);
        });
    }
  };

  const createOrder = async (_: any, actions: any) => {
    try {
      if (!email) {
        toast.error('Email id is required')
        return
      }
      if (!EMAIL_REGEX.test(email)) {
        toast.error('Email id is invalid')
        return
      }
      dispatch(setLoader(true))
      const placeOrder = await pagesServices.postPage(APICONFIG.CHECKOUT_PLACE_ORDER, placeOrderObj)
      if (placeOrder?.meta?.status) {
        orderiD = placeOrder?.data?.order_id
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                value: Number(cartData?.cart_details?.total_price) + Number(selectedShippingMethod?.rate), // Specify the amount
              },
            },
          ],
        });
      }
      toast.error(placeOrder?.meta?.message)
    } catch (error) {
      dispatch(setLoader(false))
    }
  };

  const onApprove = async (data: any, actions: any) => {
    return actions.order.capture().then((details: any) => {
      // Handle successful payment
      onPaymentComplete(data, 'Paypal', 1, orderiD)
    });
  };

  const onError = () => {
    onPaymentComplete({}, 'Paypal', 0, orderiD)
  };

  useEffect(() => {
    if (!cartData || !defaultShippedAddress?.[0]?.pincode || initialzed) {
      return
    }
    getAllPaymentMethods()
  }, [cartData, defaultShippedAddress?.[0]?.pincode])

  useEffect(() => {
    if (!defaultShippedAddress?.[0]?.pincode || !initialzed || !selectedShippingMethod) {
      return
    }
    onShippingMethodSelect(selectedShippingMethod)
  }, [defaultShippedAddress?.[0]?.pincode])

  const onShippingMethodSelect = useCallback((method: IShipping) => {
    const _shippingMethod = localStorage.getItem('shippingMethod')
    if (_shippingMethod) {
      return
    }
    dispatch(setLoader(true))
    pagesServices
      .postPage(APICONFIG.SHIPING_RATES, {
        ship_type: method.code,
        zip_code: Number(defaultShippedAddress?.[0]?.pincode),
        cart_items: cartData?.cart_items?.map((i) => {
          return {
            qty: Number(router?.query?.is_buy_now) === 1 ? i?.buy_now_qty : i?.qty,
            product_id: i?.product_id
          }
        })
      })
      .then((result) => {
        dispatch(setLoader(false))
        if (result?.meta?.status_code === 200) {
          setSelectedShippingMethod({ ...method, rate: result?.data?.shipping_rate?.rate })
          return
        }
        toast.error(result?.meta?.message)
      }).then(() => {
        dispatch(setLoader(false))
      })
  }, [defaultShippedAddress?.[0]?.pincode, cartData, router, setSelectedShippingMethod])

  console.log(paymentMethod, 'paymentMethod')


  useEffect(() => {
    const setupListener = () => {
      if (window.addEventListener) {
        window.addEventListener('message', handleMessage, false);
      }
      // else if (window.attachEvent) {
      //   console.log('DATATAT');
      //   window.attachEvent('onmessage', handleMessage);
      // }
    };

    const handleMessage = (e: MessageEvent) => {
      if (e.origin === 'https://www.securepymt.com') {
        const data = JSON.parse(e.data);
        console.log(data, orderiD, 'DATATAT');
        if (data?.response === 'InProcess') {
          setLoader(true)
          return
        }
        setLoader(false)
        if (data?.Approval_Status === 'Approved') {
          onPaymentComplete(data, 'PMI', 1, orderiD)
        } else {
          onPaymentComplete({}, 'PMI', 0, orderiD)
          setPmiorderId('')
        }
      }
    };

    setupListener();

    // Cleanup
    return () => {
      if (window.removeEventListener) {
        window.removeEventListener('message', handleMessage, false);
      }
      // else if (window.detachEvent) {
      //   window.detachEvent('onmessage', handleMessage);
      // }
    };
  }, []);

  const createPmiOrder = async () => {
    try {
      if (!email) {
        toast.error('Email id is required')
        return
      }
      if (!EMAIL_REGEX.test(email)) {
        toast.error('Email id is invalid')
        return
      }
      setPmiorderId('')
      dispatch(setLoader(true))
      const placeOrder = await pagesServices.postPage(APICONFIG.CHECKOUT_PLACE_ORDER, placeOrderObj)
      dispatch(setLoader(false))
      if (placeOrder?.meta?.status) {
        orderiD = placeOrder?.data?.order_id
        setPmiorderId(placeOrder?.data?.order_id)
        return
      }
      toast.error(placeOrder?.meta?.message)
    } catch (error) {
      dispatch(setLoader(false))
    }
  };

  return (
    <Fragment>
      <div>
        <Head>
          <title>Checkout</title>
          <link
            rel="stylesheet"
            href={getTypeBasedCSSPath(null, CSS_NAME_PATH.orderSummary)}
          />
          <link
            rel="stylesheet"
            href={getTypeBasedCSSPath(null, CSS_NAME_PATH.shippingAddress)}
          />
          <link
            rel="stylesheet"
            href={getTypeBasedCSSPath(null, CSS_NAME_PATH.shippingsection)}
          />
          <link
            rel="stylesheet"
            href={getTypeBasedCSSPath(null, CSS_NAME_PATH.standardshipping)}
          />
          <link
            rel="stylesheet"
            href={getTypeBasedCSSPath(null, CSS_NAME_PATH.selectPaymentMethod)}
          />
          <link
            rel="stylesheet"
            href={getTypeBasedCSSPath(null, CSS_NAME_PATH.summarysection)}
          />
          <link
            rel="stylesheet"
            href={getTypeBasedCSSPath(null, CSS_NAME_PATH.shippingto)}
          />
        </Head>
        <Script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></Script>
        <main>
          <BreadCrumbs item={[
            { slug: '/cart/list', title: 'Shopping Cart', isClickable: true },
            { slug: '/cart/checkout_list', title: 'Checkout' },
          ]} />
          <section className="shipping-address-section">
            <div className="container">
              <div className="shipping-address-methods-wrap">
                <div className="shipping-address-wrap">
                  <h2 className="shipping-title">
                    {
                      step === 1 ?
                        'SHIPPING ADDRESS' :
                        'SELECT PAYMENT METHOD'
                    }
                  </h2>
                  {
                    step === 1 && (defaultShippedAddress?.length > 0 ||
                      defaultBillingAddress?.length > 0) &&
                    <ShippingAddress
                      onEdit={onEditAddress}
                      onNewAddress={toggleModal}
                      address={defaultShippedAddress?.[0]}
                      billingAddress={defaultBillingAddress?.[0]}
                      onChangeShippingAddress={onChangeShippingAddress}
                      isBillingAddressSame={isBillingAddressSame}
                      setBillingAddress={(status: boolean) => setIsBillingAddressSame(status)}
                    />
                  }
                </div>
                {
                  step === 2 &&
                  <Fragment>
                    <div className="select-payment-content">
                      {
                        paymentMethod?.includes('Stripe') &&
                        <div className="ocs-radio">
                          <input type="radio" id="card1" name="card1" checked={gateWay === 1}
                            onChange={() => { setGateWay(1) }}
                          />
                          <label htmlFor="card1">
                            <picture>
                              <source
                                srcSet="/assets/images/credit-card.webp"
                                type="image/webp"
                              />
                              <img
                                src="/assets/images/credit-card.png"
                                alt="card-img"
                                title="card-img"
                                height={30}
                                width={43}
                              />
                            </picture>
                            Credit Card
                          </label>
                        </div>
                      }

                      {
                        gateWay === 1 && paymentMethod?.includes('Stripe') && stripePromise &&
                        <Elements stripe={stripePromise}>
                          <StripeCardForm
                            onPaymentCompleted={onPaymentComplete}
                            placeOrderObj={placeOrderObj}
                            amount={cartAmount}
                          />
                        </Elements>
                      }

                    </div>
                    {
                      paymentMethod?.includes('Paypal') &&
                      <div className="select-payment-content">
                        <div className="ocs-radio">
                          <input type="radio" id="card2" name="card2"
                            checked={gateWay === 2}
                            onChange={() => setGateWay(2)}
                          />
                          <label htmlFor="card2">
                            <picture>
                              <source
                                srcSet="/assets/images/paypal.webp"
                                type="image/webp"
                              />
                              <img
                                src="/assets/images/paypal.png"
                                alt="card-img"
                                title="card-img"
                                height={30}
                                width={43}
                              />
                            </picture>
                            Paypal
                          </label>
                        </div>
                        <PayPalScriptProvider options={{
                          clientId: paypalKeys.clientId,
                          dataClientToken: paypalKeys.dataClientToken,
                        }}>
                          {
                            gateWay === 2 &&

                            <form className="card-form-wrap row">
                              <div className="form-group d-col">
                                <label className="control-label">Email*</label>
                                <input
                                  type="text"
                                  placeholder="Enter your email"
                                  className="form-control"
                                  defaultValue={email}
                                  onChange={(e) => email = e.target.value}
                                />
                              </div>
                              <div className="d-col place-order-btn">
                                <PayPalScriptProvider options={
                                  {
                                    clientId: paypalKeys.clientId,
                                    currency: paypalKeys.currency,
                                  }
                                }>
                                  <PayPalButtons
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                    onError={onError}
                                    onCancel={() => dispatch(setLoader(false))}
                                  />
                                </PayPalScriptProvider>
                              </div>
                            </form>
                          }
                        </PayPalScriptProvider>

                        <br />
                      </div>

                    }

                    {
                      pmiKeys.mid != '' &&
                      <div className="select-payment-content">
                        <div className="ocs-radio">
                          <input type="radio" id="card3" name="card3"
                            checked={gateWay === 3}
                            onChange={() => setGateWay(3)}
                          />
                          <label htmlFor="card3">
                            PMI
                          </label>
                        </div>
                        <br />
                        <br />
                        {
                          gateWay === 3 &&
                          <form className="card-form-wrap row">
                            <div className="form-group d-col">
                              <label className="control-label">Email*</label>
                              <input
                                type="text"
                                placeholder="Enter your email"
                                className="form-control"
                                defaultValue={email}
                                onChange={(e) => email = e.target.value}
                              />
                            </div>
                            {
                              !pmiorderId &&
                              <div className="d-col">
                                <button
                                  type='button'
                                  className="btn btn-primary"
                                  aria-label="place-order-btn"
                                  onClick={createPmiOrder}
                                >
                                  PLACE ORDER
                                </button>
                              </div>
                            }

                            <br />
                            {
                              pmiorderId !== '' &&
                              <iframe
                                src={`https://www.securepymt.com/TSEP_iFrame/PMI_iFrame.php?mid=${pmiKeys.mid}&key=${pmiKeys.key}&amt=${cartAmount}&cname=&rurl=${fullUrl}&orderKey=${pmiorderId}&app=extPay&acctNum=${reduxData?.signIn?.userData?.user_detail?._id}&tranType=credit&testing=${APPCONFIG.PMI_TESTING}`}
                                id="iframe_a" title="iFrame Payments" className="responsive-iframe" width="100%" height="600"></iframe>
                            }
                          </form>

                        }
                      </div>
                    }

                    {
                      paymentMethod?.includes('COD') &&
                      <div className="select-payment-content">
                        <div className="ocs-radio">
                          <input type="radio" id="card3" name="card3"
                            checked={gateWay === 3}
                            onChange={() => setGateWay(3)}
                          />
                          <label htmlFor="card3">
                            COD
                          </label>
                        </div>
                      </div>
                    }

                  </Fragment>
                }
                {
                  step === 1 && shippingMethods?.length > 0 &&
                  <ShippingMethod
                    items={shippingMethods}
                    onSelectShippingMethod={onShippingMethodSelect}
                    shippingMethod={selectedShippingMethod as IShipping}
                    onHandleNext={() => handleNextPage(selectedShippingMethod)}
                  />
                }
              </div>
              {
                cartData?.cart_items?.length! > 0 &&
                <OrderSummary
                  items={cartData?.cart_items}
                  summary={cartData?.cart_details}
                  defaultAddress={defaultShippedAddress?.[0]}
                  shippingMethod={selectedShippingMethod}
                  step={step}
                  goToPreviousStep={() => {
                    localStorage.removeItem('shippingMethod')
                    setStep(1)
                  }}
                />
              }
            </div>
          </section>
        </main>
      </div>
      {modal && <AddEditAddress
        isModal={modal}
        onClose={toggleModal}
        setFormEditMode={setFormEditMode}
        showOption={true}
        idOfAddress={idOfAddress}
        editMode={editMode}
        filteredData={filteredData}
        onComplete={() => {
          getAllAddresses(!isShippingAddressChanged)
          if (editMode && !isShippingAddressChanged) {
            return
          }
          localStorage.removeItem('cart-items')
          getCartDataItem()
        }}
      />}
      {
        addressSelection.isOpen &&
        <AddressSelectionPopup
          address={userAddress}
          onClose={() => setAddressSelection({
            isOpen: false,
            type: 0
          })}
          type={addressSelection?.type}
          onChange={onDefaultAddressChange}
          defaultAddress={addressSelection?.type == 2 ? defaultShippedAddress?.[0]?._id : defaultBillingAddress?.[0]?._id}
        />
      }
    </Fragment>
  );
};

export default Checkout;
