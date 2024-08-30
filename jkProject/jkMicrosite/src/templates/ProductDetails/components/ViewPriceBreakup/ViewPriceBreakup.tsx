import React, { useState } from "react";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { covertPriceInLocalString, getTypeBasedCSSPath } from "@util/common";
import Modal from "@components/Modal";
import { IPriceBreakupProps } from "@templates/ProductDetails/components/ViewPriceBreakup";
import {
  IPriceBreakupProduct,
  IProductDetails,
} from "@type/Pages/productDetails";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import Cookies from "js-cookie";

const ViewPriceBreakup = ({ isModal, onClose, data }: IPriceBreakupProps) => {
  const [details] = useState<IProductDetails>(data);
  const [priceBrakupData] = useState<IPriceBreakupProduct>(data?.price_breakup);
  const isShowProductDetails = parseInt(Cookies.get("isShowProductDetails") ?? '') === 1 ? true : false;

  const toggleModal = () => {
    onClose();
  };
  const currencySymbol = useCurrencySymbol();

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(
            "",
            CSS_NAME_PATH.prodDetailViewPriceBreakup
          )}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("", CSS_NAME_PATH.popupBoxDesign)}
        />
      </Head>
      <main>
        <div className="page-wrapper">
          <Modal
            className="view-price-breakup-modal"
            open={isModal}
            onClose={toggleModal}
            dimmer={false}
            headerName="View Price Breakup"
          >
            <div className="modal-content">
              <table>
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Rate</th>
                    <th>Weight</th>
                    <th>Value</th>
                    <th>Discount</th>
                    <th>Final Value</th>
                  </tr>
                </thead>

                <tbody>
                  {isShowProductDetails && details?.price_breakup?.metal_type &&
                    <>
                      <tr className="label">
                        <td colSpan={6}>
                          {details?.price_breakup?.metal_type}
                        </td>
                      </tr>
                      <tr className="top-content pt-1">
                        <td>{`${priceBrakupData.metal_quality}`}</td>
                        <td>
                          {currencySymbol +
                            " " +
                            Math.round(priceBrakupData?.metal_rate)}
                        </td>
                        <td>
                          {priceBrakupData?.net_weight &&
                            priceBrakupData?.net_weight.toFixed(3) + " gm"}
                        </td>
                        <td>
                          {" "}
                          {currencySymbol +
                            " " +
                            covertPriceInLocalString(
                              Math.round(priceBrakupData?.total_metal_price)
                            )}
                        </td>
                        <td>-</td>
                        <td>
                          {" "}
                          {priceBrakupData?.total_metal_price &&
                            currencySymbol +
                            " " +
                            covertPriceInLocalString(
                              Math.round(priceBrakupData?.total_metal_price)
                            )}
                        </td>
                      </tr>
                      <tr className="bottom-content pb-1 top-content pt-1">
                        <td>
                          Total {details?.price_breakup?.metal_type} Value
                        </td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                          {" "}
                          {currencySymbol +
                            " " +
                            covertPriceInLocalString(
                              Math.round(priceBrakupData?.total_metal_price)
                            )}{" "}
                        </td>
                        <td>
                          {details?.price_breakup?.metal_discount_type === "PERCENTAGE" && `${details?.price_breakup?.metal_discount}% OFF`}
                          {details?.price_breakup?.metal_discount_type === "FLAT" && `${currencySymbol} ${details?.price_breakup?.metal_discount} OFF`}
                        </td>
                        <td>
                          {priceBrakupData?.total_metal_price &&
                            currencySymbol +
                            " " +
                            covertPriceInLocalString(
                              Math.round(priceBrakupData?.total_metal_price)
                            )}{" "}
                        </td>
                      </tr>
                    </>}
                  {isShowProductDetails && details?.price_breakup?.diamond_details?.length >
                    0 ? (
                    <>
                      <tr className="label">
                        <td colSpan={6}>Diamond</td>
                      </tr>
                      {details &&
                        details?.price_breakup?.diamond_details &&
                        details?.price_breakup?.diamond_details.map(
                          (dd) => {
                            return (
                              <tr
                                className="top-content pt-1"
                                key={`SD-${dd?.diamond_quality_name}`}
                              >
                                <td>
                                  {dd?.diamond_quality_name}{" "}
                                  {dd?.diamond_shape_name} ({dd?.pcs} pcs)
                                </td>
                                <td>
                                  {dd?.per_carat_rate
                                    ? currencySymbol + " " + dd?.per_carat_rate
                                    : ""}
                                </td>
                                <td>
                                  {parseFloat(dd?.carat?.toString()).toFixed(
                                    3
                                  ) + " ct"}{" "}
                                </td>
                                <td>
                                  {covertPriceInLocalString(dd?.total_price)
                                    ? currencySymbol +
                                    " " +
                                    covertPriceInLocalString(dd?.total_price)
                                    : "-"}
                                </td>
                                <td>-</td>
                                <td>
                                  {dd?.total_price
                                    ? currencySymbol +
                                    " " +
                                    covertPriceInLocalString(
                                      Math.round(dd?.total_price)
                                    )
                                    : "-"}
                                </td>
                              </tr>
                            );
                          }
                        )}

                      <tr className="bottom-content pb-1 top-content pt-1">
                        <td>Total Diamond Value</td>
                        <td>
                          -
                          {/* {priceBrakupData?.side_diamond_rate &&
                            currencySymbol +
                              " " +
                              covertPriceInLocalString(
                                Math.round(priceBrakupData?.side_diamond_rate)
                              )} */}
                        </td>
                        <td>-</td>
                        <td>
                          {currencySymbol +
                            " " +
                            covertPriceInLocalString(
                              Math.round(priceBrakupData?.total_diamond_price)
                            )}
                        </td>
                        <td>
                          {details?.price_breakup?.diamond_discount_type === "PERCENTAGE" && `${details?.price_breakup?.diamond_discount}% OFF`}
                          {details?.price_breakup?.diamond_discount_type === "FLAT" && `${currencySymbol} ${details?.price_breakup?.diamond_discount} OFF`}
                        </td>
                        <td>
                          {priceBrakupData?.total_diamond_price &&
                            currencySymbol +
                            " " +
                            covertPriceInLocalString(
                              Math.round(priceBrakupData?.total_diamond_price)
                            )}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <></>
                  )}
                  {isShowProductDetails && details?.website_product_detail?.color_stone_details
                    ?.length > 0 ? (
                    <>
                      <tr className="label">
                        <td colSpan={6}>
                          <span>Color Stones</span>
                        </td>
                      </tr>

                      {details &&
                        details?.website_product_detail?.color_stone_details.map(
                          (value) => {
                            return (
                              <tr
                                className="top-content pt-1"
                                key={`SD-${value.color_stone_quality_name}`}
                              >
                                <td>
                                  {value.color_stone_name}{" "}
                                  {value.color_stone_shape_name}
                                  {value.per_carat_rate} ({value.pcs} pcs)
                                </td>
                                <td>
                                  {value?.per_carat_rate
                                    ? currencySymbol + " " + value?.per_carat_rate
                                    : ""}
                                </td>
                                <td>
                                  {parseFloat(value.carat.toString()).toFixed(
                                    3
                                  ) + " ct"}{" "}
                                </td>
                                <td>
                                  {" "}
                                  {value.total_price &&
                                    currencySymbol +
                                    " " +
                                    covertPriceInLocalString(
                                      Math.round(value.total_price)
                                    )}{" "}
                                </td>
                                <td></td>
                                <td>
                                  {" "}
                                  {value.total_price &&
                                    currencySymbol +
                                    " " +
                                    covertPriceInLocalString(
                                      Math.round(value.total_price)
                                    )}{" "}
                                </td>
                              </tr>
                            );
                          }
                        )}
                      <tr className="middle-content">
                        <td>Total Color Stone Value</td>
                        {/* <td>
                          {priceBrakupData?.color_stone_rate &&
                            currencySymbol +
                              " " +
                              priceBrakupData?.color_stone_rate.toFixed(3)}
                        </td> */}
                        <td>-</td>
                        <td>-</td>
                        <td>
                          {" "}
                          {priceBrakupData.total_color_stone_price &&
                            currencySymbol +
                            " " +
                            covertPriceInLocalString(
                              Math.round(
                                priceBrakupData.total_color_stone_price
                              )
                            )}{" "}
                        </td>
                        <td>
                          {details?.price_breakup?.colorstone_discount_type === "PERCENTAGE" && `${details?.price_breakup?.colorstone_discount}% OFF`}
                          {details?.price_breakup?.colorstone_discount_type === "FLAT" && `${currencySymbol} ${details?.price_breakup?.colorstone_discount} OFF`}
                        </td>
                        <td>
                          {" "}
                          {priceBrakupData.total_color_stone_price &&
                            currencySymbol +
                            " " +
                            covertPriceInLocalString(
                              Math.round(
                                priceBrakupData.total_color_stone_price
                              )
                            )}{" "}
                        </td>
                      </tr>
                    </>
                  ) : (
                    <></>
                  )}
                  <tr className="label">
                    <td colSpan={6}>Other Charges</td>
                  </tr>
                  <tr className="bottom-content top-content pt-1">
                    <td>Certificate Charges</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td></td>
                    <td>
                      {currencySymbol +
                        " " +
                        Math.round(priceBrakupData.certificate_charge)}
                    </td>
                  </tr>
                  <tr className="top-content pt-1">
                    <td>Making Charges</td>
                    <td>
                      {currencySymbol +
                        " " +
                        Math.round(priceBrakupData?.labour_rate)}
                    </td>
                    <td>
                      {priceBrakupData?.net_weight &&
                        priceBrakupData?.net_weight < 2
                        ? `-`
                        : priceBrakupData?.net_weight.toFixed(3) + " gm "}
                    </td>
                    <td>
                      {" "}
                      {currencySymbol +
                        " " +
                        covertPriceInLocalString(
                          Math.round(priceBrakupData.labour_charge)
                        )}{" "}
                    </td>
                    <td></td>
                    <td>
                      {" "}
                      {priceBrakupData.labour_charge &&
                        currencySymbol +
                        " " +
                        covertPriceInLocalString(
                          Math.round(priceBrakupData.labour_charge)
                        )}{" "}
                    </td>
                  </tr>
                  <tr className="top-content pt-1">
                    <td>Hallmark Charges</td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                      {" "}
                      {currencySymbol +
                        " " +
                        covertPriceInLocalString(
                          Math.round(priceBrakupData.hallmark_charge)
                        )}{" "}
                    </td>

                    <td></td>
                    <td>
                      {" "}
                      {priceBrakupData.hallmark_charge &&
                        currencySymbol +
                        " " +
                        covertPriceInLocalString(
                          Math.round(priceBrakupData.hallmark_charge)
                        )}{" "}
                    </td>
                  </tr>
                  <tr className="top-content pt-1 bottom-content pb-1">
                    <td>Stamping Charges</td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                      {" "}
                      {currencySymbol +
                        " " +
                        covertPriceInLocalString(
                          Math.round(priceBrakupData.stamping_charge)
                        )}{" "}
                    </td>

                    <td></td>
                    <td>
                      {" "}
                      {priceBrakupData.stamping_charge > 0 ?
                        currencySymbol +
                        " " +
                        covertPriceInLocalString(
                          Math.round(priceBrakupData.stamping_charge)
                        ) : '-'}{" "}
                    </td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr className="py-1">
                    <td>Grand Total</td>
                    <td>-</td>
                    <td>-</td>
                    <td>
                      {priceBrakupData?.is_discounted ? (
                        <>
                          <del className="strike-out">
                            {currencySymbol}{" "}
                            {covertPriceInLocalString(
                              Math.round(priceBrakupData?.original_total_price)
                            )}
                          </del>
                          <br></br>
                        </>
                      ) : (
                        <></>
                      )}
                      {currencySymbol}{" "}
                      {covertPriceInLocalString(
                        Math.round(priceBrakupData?.total_price)
                      )}
                    </td>
                    <td></td>
                    <td>
                      {priceBrakupData?.is_discounted ? (
                        <>
                          <del className="strike-out">
                            {currencySymbol}{" "}
                            {covertPriceInLocalString(
                              Math.round(priceBrakupData?.original_total_price)
                            )}
                          </del>
                          <br></br>
                        </>
                      ) : (
                        <></>
                      )}
                      {currencySymbol}{" "}
                      {covertPriceInLocalString(
                        Math.round(priceBrakupData?.total_price)
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Modal>
        </div>
      </main>
    </>
  );
};
export default ViewPriceBreakup;
