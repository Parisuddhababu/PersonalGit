import React, { useState, useEffect } from "react";
import { covertPriceInLocalString, getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import { ICheckout } from "@type/Pages/checkout";
import CustomImage from "@components/CustomImage/CustomImage";
import { ICartListData } from "@type/Pages/cart";
import CCAvenueForm from "@components/Hooks/paymentGatewayKey/ccAvenuePaymentGateway/ccavenueForm";
import usePaymentGatewayKey, {
  IPaymentGatewayKeyProps,
} from "@components/Hooks/paymentGatewayKey";
import { encryptDecrypt } from "@components/Hooks/paymentGatewayKey/usePaymentGatewayKey";
import usePlaceOrder from "@components/Hooks/checkout/usePlaceOrder";
import Loader from "@components/customLoader/Loader";
import { useRouter } from "next/router";
import APPCONFIG from "@config/app.config";
import Link from "next/link";
import Cookies from "js-cookie";

const CheckoutSummery1 = (props: ICheckout) => {
  const [summery, setSummery] = useState<ICartListData[]>(
    props?.list?.cart_details?.cart_items
  );
  const [cartDetails, setCartDetails] = useState(props?.list?.cart_details);
  const currencySymbol = useCurrencySymbol();
  const { paymentGatewayKey } = usePaymentGatewayKey();
  const { placeOrder, placeOrderLoading, getPaymentStatusFromStripe, getPaymentStatusFromPhonepay } =
    usePlaceOrder(props, paymentGatewayKey);
  const router = useRouter();
  const { session_id } = router.query;
  const { merchant_id } = router.query;
  const { transactionId } = router.query;
  const { salt_key } = router.query;
  const { order_id } = router.query;
  const isShowProductDetails = parseInt(Cookies.get("isShowProductDetails") ?? '') === 1 ? true : false;

  useEffect(() => {
    setSummery(props?.list?.cart_details?.cart_items);
    setCartDetails(props?.list?.cart_details);
  }, [props]);

  useEffect(() => {
    //   Used For Payment success callback
    if (session_id) {
      getPaymentStatusFromStripe(session_id.toString());
    }

    if (merchant_id && transactionId && order_id && salt_key) {
      getPaymentStatusFromPhonepay(merchant_id.toString(), transactionId.toString(), order_id.toString(),
        salt_key.toString())
    }
    // eslint-disable-next-line
  }, []);

  const getCCAvenueAccessCode = () => {
    if (paymentGatewayKey) {
      const index = paymentGatewayKey.findIndex(
        (ele: IPaymentGatewayKeyProps) =>
          ele.payment_gateway_name &&
          ele.payment_gateway_name.toLowerCase() ===
          APPCONFIG.PAYMENT_METHODS.ccavenue
      );

      return paymentGatewayKey?.[index]?.CCAVENUE_ACCESS_CODE;
    }
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.checkoutOrderInfo)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.checkoutSummarySection)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.checkoutTitle)}
        />
      </Head>
      {placeOrderLoading && <Loader />}
      <aside className="sort-info sidebar-section">
        {
          isShowProductDetails &&
          <div className=" sort-info-conatainer summary-info">
            <h4 className="sort-info-title">Summary</h4>
            <div className="sort-info-content">
              <p className="sort-info-tags">Total Metal Weight:</p>
              <p className="sort-info-values">
                {cartDetails?.cart_summary?.total_metal_weight ? Number(cartDetails?.cart_summary?.total_metal_weight).toFixed(3) + " GM" : "-"}
              </p>
            </div>
            <div className="sort-info-content">
              <p className="sort-info-tags">Total Diamond Weight:</p>
              <p className="sort-info-values">
                {cartDetails?.cart_summary?.total_diamond_weight ? Number(cartDetails?.cart_summary?.total_diamond_weight).toFixed(3) + " CT" : "-"}
              </p>
            </div>
            {cartDetails?.cart_summary?.total_color_stone_carat ? (
              <div className="sort-info-content">
                <p className="sort-info-tags">Total Color Stone Weight:</p>
                <p className="sort-info-values">
                  {cartDetails?.cart_summary?.total_color_stone_carat ? Number(cartDetails?.cart_summary?.total_color_stone_carat).toFixed(3) + " CT" : "-"}
                </p>
              </div>
            ) : (
              <></>
            )}
          </div>
        }

        <div className="sort-info-conatainer order-summary-info">
          <div className="order-summary-info-top">
            <h4 className="sort-info-title">Order Summary</h4>
            <Link href={"/cart/view_quotation"}>
              <a className="coupon-links pop-up-links">View Quotation</a>
            </Link>
          </div>
          {summery?.map((data, dIndex) => (
            <div className="order-summary-info-content" key={dIndex}>
              <CustomImage
                pictureClassName="items-img"
                src={
                  data?.products?.images.length > 0
                    ? data?.products?.images[0]?.path
                    : ""
                }
                alt={
                  data?.products?.images.length > 0
                    ? data?.products?.images[0]?.name
                    : "product thumb image"
                }
                title="imagePreview"
                width="350"
                height="350"
              />
              <div className="items-details-content-info">
                <div className="items-title">
                  <Link href={`/product/detail/${data?.product?.slug}`}>
                    <a className="items-title">{data?.product?.title}</a>
                  </Link>
                </div>

                {/* <div className="items-title"> <a href="product-details.html">Fara Diamond Ring</a></div> */}

                <div className="items-details-info">
                  <span>SKU: </span>
                  <span>{data?.product?.sku}</span>
                </div>

                <div className="items-details-info">
                  <span>QTY: </span>
                  <span>{data?.qty}</span>
                </div>
                <div className="items-details-info price">
                  <span>
                    {" "}
                    {currencySymbol}{" "}
                    {covertPriceInLocalString(Math.round(data?.item_price * data?.qty))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="sort-info-conatainer ">
          <div className="sort-info-content">
            <p className="sort-info-tags">Subtotal:</p>
            <p className="sort-info-values">
              {currencySymbol}{" "}
              {covertPriceInLocalString(Math.round(cartDetails?.net_total))}
            </p>
          </div>
          <div className="sort-info-content">
            <p className="sort-info-tags">Shipping Charges:</p>
            <p className="sort-info-values">
              {currencySymbol}{" "}
              {covertPriceInLocalString(
                Math.round(cartDetails?.delivery_charge)
              )}
            </p>
          </div>
          <div className="sort-info-content">
            <p className="sort-info-tags">Tax:</p>
            <p className="sort-info-values">
              {currencySymbol}{" "}
              {covertPriceInLocalString(
                Math.round(cartDetails?.total_tax_amount)
              )}
            </p>
          </div>
          {cartDetails.gift_message?.gift_wrap_charge ? (
            <div className="sort-info-content">
              <p className="sort-info-tags">Gift Wrap:</p>
              <p className="sort-info-values">
                {currencySymbol}{" "}
                {covertPriceInLocalString(
                  Math.round(cartDetails?.gift_message?.gift_wrap_charge)
                )}
              </p>
            </div>
          ) : (
            <></>
          )}
        </div>
        {cartDetails?.coupon_code?.length ? (
          <div className="sort-info-conatainer apply-coupon-sec">
            <p className="apply-coupon_text">Applied Coupon Code</p>
            <form action="#">
              <input
                type="text"
                className="form-control"
                name="applyCoupon"
                value={cartDetails?.coupon_code}
                disabled
                readOnly
              />
              <i className="jkm-check applied"></i>
            </form>
          </div>
        ) : (
          <></>
        )}

        <div className="sort-info-content tolal-summary">
          <p className="total-amout-title">Total Amount :</p>
          <p className="sort-info-values">
            {currencySymbol}{" "}
            {covertPriceInLocalString(Math.round(cartDetails?.net_amount))}
          </p>
        </div>
        <div className="sort-info-content tolal-summary">
          <p className="total-amout-title">Coupon Discount :</p>
          <p className="sort-info-values">
            {currencySymbol}{" "}
            {covertPriceInLocalString(
              Math.round(cartDetails?.discount_amount)
            )}
          </p>
        </div>
        <div className="sort-info-content tolal-summary">
          <p className="total-amout-title">Total Cost :</p>
          <p className="sort-info-values">
            {currencySymbol}{" "}
            {covertPriceInLocalString(Math.round(cartDetails?.total_cost))}
          </p>
        </div>
        <button
          className="btn-summary btn-primary btn-place-order"
          onClick={() => placeOrder()}
          disabled={placeOrderLoading}
        >
          Place Order
        </button>
      </aside>
      <CCAvenueForm accessCode={encryptDecrypt(getCCAvenueAccessCode())} />
    </>
  );
};

export default CheckoutSummery1;
