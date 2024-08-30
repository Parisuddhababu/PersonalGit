import useOrderSettingHooks, {
  IOrderSettingsHooksState,
} from "@components/Hooks/OrderSettings";
import Loader from "@components/customLoader/Loader";
import APICONFIG from "@config/api.config";
import APPCONFIG from "@config/app.config";
import pagesServices from "@services/pages.services";
import { IMyOrderDetails } from "@type/Pages/orderDetails";
import { converDateMMDDYYYY, TextTruncate } from "@util/common";
import { useEffect, useState } from "react";
import Link from "next/link";
import { uuid } from "@util/uuid";
import Cookies from "js-cookie";
import BlueDartTracking from "@templates/OrderDetail/components/BlueDartTracking";

const MyOrderDetailsSection1 = ({ props }: IMyOrderDetails) => {
  const [settingData, setSettingData] = useState<IOrderSettingsHooksState>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isShowProductDetails = parseInt(Cookies.get("isShowProductDetails") ?? '') === 1 ? true : false;

  const orderSettingData = useOrderSettingHooks();

  const getOrderStatus = (id: string | number) => {
    let orderName = "";
    if (settingData) {
      if (settingData?.order_status?.length > 0) {
        settingData?.order_status?.map((ele) => {
          if (ele?.code === id) {
            orderName = ele?.name;
          }
        });
      }
      return orderName;
    }
  };

  const downloadInvoiceById = async (id: any) => {
    setIsLoading(true);
    await pagesServices
      .getPage(APICONFIG.DOWNLOAD_ORDER_INVOICE + id, {})
      .then((result) => {
        setIsLoading(false);
        if (result?.meta && result?.status_code === 200) {
          window.open(`${result?.data?.original?.data}`, "_blank");
        }
      })
      .catch((err) => err);
  };

  useEffect(() => {
    if (orderSettingData) {
      setSettingData(orderSettingData);
      getPaymentMethods(props?.payment_method);
    }
    // eslint-disable-next-line
  }, [orderSettingData]);

  const getPaymentMethods = (id: number | string) => {
    let paymentName = "";
    if (settingData) {
      if (settingData?.payment_method?.length > 0) {
        settingData?.payment_method?.map((ele) => {
          if (ele?.code === id) {
            paymentName = ele?.name;
          }
        });

        return paymentName;
      }
    }
  };

  const getTotalPrice = (orderItem: any) => {
    const isPriceFixed = orderItem?.total_rate_card_Details?.is_fix_price ?? 0;
    const totalPrice = isPriceFixed ? orderItem?.item_price : orderItem?.total_rate_card_Details?.total_price ?? 0;
    return `${props.currency_symbol} ${Math.round(totalPrice * orderItem.qty)?.toLocaleString(
      APPCONFIG.NUMBER_FORMAT_LANG
    )}`;
  }

  return (
    <>
      {isLoading && <Loader />}
      <div className="container">
        <div className="order-details-section">
          <div className="container">
            <div className="order-details-inner">
              <div className="order-details-header">
                <div>
                  <div>
                    <b>Invoice No: </b> {props?.total_tax_amount}
                  </div>
                  <div>
                    <b>Transaction No: </b>
                    {props?.transaction_id}
                  </div>
                  <div>
                    <b>Payment Status: </b>
                    {props?.transactions?.payment_status_text}
                  </div>
                  <div>
                    <b>Order Status: </b>
                    {getOrderStatus(props?.order_status)}
                  </div>
                  <div>
                    <>
                      <b>Expected Delivery Date: </b>
                      {props?.delivery_date}
                    </>
                  </div>
                  <div>
                    <>
                      <b>Waybill No: </b>
                      {props?.order_items?.[0]?.waybill_no ?? '-'}
                    </>
                  </div>
                  {props?.is_gst === 1 && (
                    <>
                      <div>
                        <b>Business Name: </b>
                        {props?.business_name}
                      </div>
                      <div>
                        <b>GST Number: </b>
                        {props?.gst_number}
                      </div>
                    </>
                  )}
                </div>
                <div className="order-details-wrapper">
                  <span
                    className="btn btn-primary"
                    onClick={() => downloadInvoiceById(props?._id)}
                  >
                    Download Invoice
                  </span>
                  {
                    props?.order_items?.[0]?.waybill_no != undefined &&
                    <a className="btn btn-primary" href="https://bluedart.com" target="_blank" rel="noreferrer">Track Order</a>
                  }
                  <Link href="/my-orders">
                    <a className="btn btn-primary">Back to My Order</a>
                  </Link>
                </div>
              </div>

              <div className="order-details-content">
                <div className="order-details-content-inner">
                  <div className="order-details-content-item grid">
                    <label>Order Number : </label>
                    <p>{props?.order_number}</p>
                  </div>
                  <div className="order-details-content-item grid">
                    <label>Order Date : </label>
                    <p>{converDateMMDDYYYY(props?.created_at)}</p>
                  </div>
                  <div className="order-details-content-item grid">
                    <label>Email Address : </label>
                    <p>{props?.user_info?.email}</p>
                  </div>
                  <div className="order-details-content-item grid">
                    <label>Payment Method : </label>
                    <p>{getPaymentMethods(props?.payment_method)}</p>
                  </div>
                  <div className="order-details-content-item grid">
                    <label>Mobile Number : </label>
                    <p>
                      {props?.user_info?.country?.country_phone_code}{" "}
                      {props?.user_info?.mobile}
                    </p>
                  </div>
                </div>
                <div className="order-details-content-inner">
                  <div className="order-details-content-item">
                    <label>Shipping Address :</label>
                    <div className="full-width">
                      <p>{`${props?.shipping_address?.name},`}</p>
                      <p>{`${props?.shipping_address?.address}`}</p>
                      <p>{`${props?.shipping_address?.city}, ${props?.shipping_address?.state}, ${props?.shipping_address?.country}, ${props?.shipping_address?.zip}`}</p>
                      <p>{`${props?.shipping_address?.mobile_no}`}</p>
                    </div>
                  </div>
                </div>
                <div className="order-details-content-inner">
                  <div className="order-details-content-item">
                    <label>Billing Address :</label>
                    <div className="full-width">
                      <p>{`${props?.billing_address?.name},`}</p>
                      <p>{`${props?.billing_address?.address}`}</p>
                      <p>{`${props?.billing_address?.city}, ${props?.billing_address?.state}, ${props?.billing_address?.country}, ${props?.billing_address?.zip}`}</p>
                      <p>{`${props?.billing_address?.mobile_no}`}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-items-box">
                <h4>Order Items</h4>

                <div className="order-items-box-inner">
                  <div className="order-items-table">
                    <div className="order-items-header">
                      {/* Order List Header  */}
                      <div className="order-item order-item-header">
                        <div className="order-item-col order-item-img"></div>
                        <div className="order-item-col order-item-item">
                          Item
                        </div>
                        <div className="order-item-col order-item-metal">
                          Metal
                        </div>
                        <div className="order-item-col order-item-diamonds">
                          Diamonds
                        </div>
                        <div className="order-item-col order-item-color-stone">
                          Color Stone
                        </div>
                        <div className="order-item-col order-item-charges">
                          Charges
                        </div>
                        <div className="order-item-col order-item-amount">
                          Amount
                        </div>
                      </div>
                      {/* End Order List Header  */}
                    </div>

                    <div className="order-items-body">
                      {/* Order List Data  */}
                      {props?.order_items?.map((ele: any, eInd: number) => (
                        <div className="order-item" key={eInd}>
                          <div className="order-item-col order-item-img">
                            <img
                              src={
                                ele?.products?.images.length > 0
                                  ? ele?.products?.images[0].path
                                  : ""
                              }
                              alt={
                                ele?.products?.images.length > 0
                                  ? ele?.products?.images[0].name
                                  : "Order product thumb image"
                              }
                            />
                          </div>
                          <div
                            className="order-item-col order-item-item"
                            data-label="Item"
                          >
                            <p>{ele?.product?.title}</p>
                            <p>({ele?.product?.sku})</p>
                            <p className="my-order-sizes">
                              {ele?.size_name ? `Size: ${ele?.size_name}` : ""}
                            </p>
                            <p>{`QTY: ${ele?.qty}`}</p>
                            {ele?.remark ? (
                              ele?.remark.length >= 20 ? (
                                <p>
                                  {"Remark: " + TextTruncate(ele?.remark, 20)}{" "}
                                  <p className="text-primary"> show more</p>
                                </p>
                              ) : (
                                "Remark: " + ele?.remark
                              )
                            ) : (
                              <></>
                            )}
                          </div>
                          <div
                            className="order-item-col order-item-metal"
                            data-label="Metal"
                          >
                            {ele?.total_rate_card_Details?.is_fix_price !== 1 ? (
                              <>
                                <p>{ele?.metal_quality ?? ""}</p>
                                {
                                  isShowProductDetails &&
                                  <p>
                                    {ele?.total_rate_card_Details?.net_weight
                                      ? `${Number(
                                        ele?.total_rate_card_Details?.net_weight
                                      ).toFixed(3)} gm`
                                      : ""}
                                  </p>
                                }
                                {
                                  isShowProductDetails && <p className="font-weight-bold">
                                    {props?.currency_symbol}{" "}
                                    {Math.round(
                                      ele?.total_rate_card_Details
                                        ?.total_metal_price
                                    )?.toLocaleString(
                                      APPCONFIG.NUMBER_FORMAT_LANG
                                    )}
                                  </p>
                                }
                              </>
                            ) : (
                              "-"
                            )}
                          </div>


                          <div className="order-item-col order-item-diamonds" data-label="Diamonds">
                            {ele?.total_rate_card_Details?.is_fix_price !== 1 ? (
                              <>
                                {ele?.diamond_details?.map(
                                  (dd: any, din: any) => {
                                    return (
                                      <p key={uuid()}>
                                        {`${dd?.diamond_shape_name
                                          ? `${dd.diamond_shape_name} - `
                                          : ""
                                          }` +
                                          `${dd?.diamond_quality_name
                                            ? `${dd.diamond_quality_name} - `
                                            : ""
                                          }` +
                                          `${dd?.diamond_sieve_name ?? ""}` +
                                          (ele?.diamond_details?.length - 1 !==
                                            din
                                            ? ","
                                            : "")}
                                      </p>
                                    );
                                  }
                                )}
                                {isShowProductDetails && ele?.products.total_diamond_carat &&
                                  ele?.products?.total_diamond_pcs ? (
                                  <p>{`${Number(
                                    ele?.products.total_diamond_carat
                                  ).toFixed(3)} ct - ${ele?.products?.total_diamond_pcs
                                    } pcs`}</p>
                                ) : (
                                  <></>
                                )}
                                {isShowProductDetails && ele?.total_rate_card_Details
                                  ?.total_diamond_price > 0 && (
                                    <p className="font-weight-bold">
                                      {props?.currency_symbol}{" "}
                                      {Math.round(
                                        ele?.total_rate_card_Details
                                          ?.total_diamond_price
                                      )?.toLocaleString(
                                        APPCONFIG.NUMBER_FORMAT_LANG
                                      )}
                                    </p>
                                  )}
                              </>
                            ) : (
                              "-"
                            )}
                          </div>

                          <div
                            className="order-item-col order-item-color-stone"
                            data-label="Color Stone"
                          >
                            {ele?.total_rate_card_Details?.is_fix_price !==
                              1 ? (
                              <>
                                {ele?.color_stone_details?.map(
                                  (cs: any, cin: any) => {
                                    return (
                                      <p key={uuid()}>
                                        {`${cs?.color_stone_shape_name
                                          ? `${cs.color_stone_shape_name} - `
                                          : ""
                                          }` +
                                          `${cs?.color_stone_name
                                            ? `${cs.color_stone_name} - `
                                            : ""
                                          }` +
                                          (ele?.color_stone_details?.length -
                                            1 !==
                                            cin
                                            ? ","
                                            : "")}
                                      </p>
                                    );
                                  }
                                )}
                                {isShowProductDetails && ele?.products.total_color_stone_carat &&
                                  ele?.products?.total_color_stone_pcs ? (
                                  <p>{`${Number(
                                    ele?.products.total_color_stone_carat
                                  ).toFixed(3)} ct - ${ele?.products?.total_color_stone_pcs
                                    } pcs`}</p>
                                ) : (
                                  <></>
                                )}
                                {isShowProductDetails && ele?.total_rate_card_Details
                                  ?.total_color_stone_price > 0 ? (
                                  <p className="font-weight-bold">
                                    {props?.currency_symbol}{" "}
                                    {Math.round(
                                      ele?.total_rate_card_Details
                                        ?.total_color_stone_price
                                    )?.toLocaleString(
                                      APPCONFIG.NUMBER_FORMAT_LANG
                                    )}
                                  </p>
                                ) : (
                                  <></>
                                )}
                                {/* <p>0.070 ct - 9 pcs</p> */}
                                {/* {ele?.color_stone_details && (
                            <p className="font-weight-bold">
                            {props?.currency_symbol}{" "}
                            {
                              Math.round(ele?.total_rate_card_Details
                                ?.total_color_stone_price)?.toLocaleString(
                                  APPCONFIG.NUMBER_FORMAT_LANG
                                  )
                                }
                            </p>
                          )} */}
                              </>
                            ) : (
                              "-"
                            )}
                          </div>

                          <div
                            className="order-item-col order-item-charges"
                            data-label="Charges"
                          >
                            {ele?.total_rate_card_Details
                              ?.certificate_charge ? (
                              <p>
                                Certification: {props?.currency_symbol}{" "}
                                {Math.round(ele?.total_rate_card_Details?.certificate_charge)?.toLocaleString(
                                  APPCONFIG.NUMBER_FORMAT_LANG
                                )}
                              </p>
                            ) : (
                              <></>
                            )}
                            {ele?.total_rate_card_Details?.hallmark_charge ? (
                              <p>
                                Hallmark: {props?.currency_symbol}{" "}
                                {Math.round(ele?.total_rate_card_Details?.hallmark_charge)?.toLocaleString(
                                  APPCONFIG.NUMBER_FORMAT_LANG
                                )}
                              </p>
                            ) : (
                              <></>
                            )}
                            {ele?.total_rate_card_Details?.stamping_charge ? (
                              <p>
                                Stamping: {props?.currency_symbol}{" "}
                                {Math.round(ele?.total_rate_card_Details?.stamping_charge)?.toLocaleString(
                                  APPCONFIG.NUMBER_FORMAT_LANG
                                )}
                              </p>
                            ) : (
                              <></>
                            )}
                            {ele?.total_rate_card_Details?.labour_charge ? (
                              <p>
                                Labour: {props?.currency_symbol}{" "}
                                {Math.round(ele?.total_rate_card_Details?.labour_charge)?.toLocaleString(
                                  APPCONFIG.NUMBER_FORMAT_LANG
                                )}
                              </p>
                            ) : (
                              <></>
                            )}
                          </div>
                          <div
                            className="order-item-col order-item-amount text-right"
                            data-label="Amount"
                          >
                            <p className="font-weight-bold">
                              {getTotalPrice(ele)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* End Order List Data  */}

                      {/* Order List Footer  */}
                      <div className="order-item order-item-footer">
                        <div className="order-item-col"></div>
                        <div className="order-item-col"></div>
                        <div className="order-item-col"></div>
                        <div className="order-item-col"></div>
                        <div className="order-item-col"></div>
                        <div className="order-item-col order-item-total">
                          <div>
                            <p>Subtotal: </p>
                            <p className="font-weight-bold">
                              {props?.currency_symbol}{" "}
                              {Math.round(props?.gross_amount)?.toLocaleString(
                                APPCONFIG.NUMBER_FORMAT_LANG
                              ) || "0"}
                            </p>
                          </div>
                          <div>
                            <p>Shipping Charges: </p>
                            <p className="font-weight-bold">
                              {props?.currency_symbol}{" "}
                              {Math.round(props?.total_shipping_charges)?.toLocaleString(
                                APPCONFIG.NUMBER_FORMAT_LANG
                              ) || "0"}
                            </p>
                          </div>
                          <div>
                            <p>Tax: </p>
                            <p className="font-weight-bold">
                              {props?.currency_symbol}{" "}
                              {Math.round(props?.total_tax_amount)?.toLocaleString(
                                APPCONFIG.NUMBER_FORMAT_LANG
                              ) || "0"}
                            </p>
                          </div>
                          {props?.gift_wrap?.gift_wrap_charge &&
                            props?.gift_wrap?.gift_wrap_charge !== 0 ? (
                            <div>
                              <p>Gift Wrap: </p>
                              <p className="font-weight-bold">
                                {props?.currency_symbol}{" "}
                                {Math.round(props?.gift_wrap?.gift_wrap_charge)?.toLocaleString(
                                  APPCONFIG.NUMBER_FORMAT_LANG
                                ) || "0"}
                              </p>
                            </div>
                          ) : (
                            <></>
                          )}
                          {props?.is_advance ? (
                            <div>
                              <p>Adv. Payable Amount: </p>
                              <p className="font-weight-bold">
                                {props?.currency_symbol} 0
                              </p>
                            </div>
                          ) : (
                            <></>
                          )}
                          <div>
                            <p>Total Amount: </p>
                            <p className="font-weight-bold">
                              <hr /> {props?.currency_symbol}{" "}
                              {Math.round(props?.net_amount)?.toLocaleString(
                                APPCONFIG.NUMBER_FORMAT_LANG
                              ) || "0"}
                            </p>
                          </div>
                          <div>
                            <p>Remaining Amount: </p>
                            <p className="font-weight-bold">
                              {props?.currency_symbol} 0
                            </p>
                          </div>
                          {props?.total_discont ? (
                            <div>
                              <p>Coupon Discount: </p>
                              <p className="font-weight-bold text-success">
                                - {props?.currency_symbol}{" "}
                                {`${Math.round(props?.total_discont)?.toLocaleString(
                                  APPCONFIG.NUMBER_FORMAT_LANG
                                )}` || "0"}
                              </p>
                            </div>
                          ) : (
                            <></>
                          )}

                          <div>
                            <p>Grand Total: </p>
                            <p className="font-weight-bold">
                              {props?.currency_symbol}{" "}
                              {Math.round(props?.total_cost)?.toLocaleString(
                                APPCONFIG.NUMBER_FORMAT_LANG
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* End Order List Footer  */}
                    </div>
                  </div>
                </div>
              </div>

              {
                props?.order_items?.[0]?.waybill_no != undefined &&
                <BlueDartTracking productId={props?._id} />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyOrderDetailsSection1;
