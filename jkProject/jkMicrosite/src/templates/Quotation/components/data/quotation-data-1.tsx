import { IQuotation, I_Quotation_Cart_Item } from "@type/Pages/Quotation";
import React, { useState } from "react";
import Head from "next/head";
import { ConvertDateCommonDisplay, covertPriceInLocalString, getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import CustomImage from "@components/CustomImage/CustomImage";
import { useToast } from "@components/Toastr/Toastr";
import ErrorHandler from "@components/ErrorHandler";
import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import Link from "next/link";
import APPCONFIG from "@config/app.config";
import Cookies from "js-cookie";
// import { IColor_Stone } from "@type/Pages/cart";
const QuotationData1 = (props: IQuotation) => {
  const { showError, showSuccess } = useToast();
  const currencySymbol = useCurrencySymbol();
  const isShowProductDetails = parseInt(Cookies.get("isShowProductDetails") ?? '') === 1 ? true : false;
  const [quotationData] = useState<I_Quotation_Cart_Item[]>(props?.cart_items);
  const downloadFile = async () => {
    await pagesServices.getPage(APICONFIG.CART_QUOTATION_DOWNLOAD, {}).then(
      (result) => {
        if (result.meta && result.meta.status_code == "200") {
          showSuccess(result.meta.message);
          window.open(`${result?.data}`, "_blank");
        }
      },
      (error) => {
        ErrorHandler(error, showError);
      }
    );
  };

  // const colorStonePcsCalcualtion = (data: IColor_Stone[]) => {
  //   let count = 0;
  //   data?.forEach((element: IColor_Stone) => (count += element.pcs));
  //   return count;
  // };

  // const colorStoneCtCalcualtion = (data: IColor_Stone[]) => {
  //   let count = 0;
  //   data?.forEach((element: IColor_Stone) => (count += element.carat));
  //   return count;
  // };
  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.quotationTable)} />
      </Head>
      <main>
        <div className="wrapper">
          <section className="quotation-container">
            <div className="container">
              <div className="quotation-wrap">
                <div className="quotation-content-top">
                  <div className="content-para">
                    <p className="content-top-para-number">
                      <strong> Number :</strong> {props?.quotation_number ?? ""}
                    </p>
                    <p className="content-top-para-date">
                      <strong>Date :</strong>{" "}
                      {ConvertDateCommonDisplay(new Date().toDateString())}
                    </p>
                  </div>
                  <div className="quotaion-content-button">
                    <a href="#">
                      <button className="btn btn-download" onClick={() => downloadFile()}>
                        <i className="jkm-pdf"></i>Download
                      </button>
                    </a>
                  </div>
                </div>
                <div className="quotaion-table-content">
                  <table className="table-className items">
                    <thead>
                      <tr className="items-head">
                        <th rowSpan={2} className="sn">
                          SN
                        </th>
                        <th colSpan={2} className="description">
                          Description
                        </th>
                        <th colSpan={5} className="diamond">
                          {" "}
                          Diamond
                        </th>
                        <th colSpan={5} className="metal">
                          {" "}
                          Metal
                        </th>
                        <th colSpan={5} className="stone">
                          {" "}
                          Stone
                        </th>
                        <th className="items-col rs" colSpan={4}>
                          Charges
                        </th>
                        <th className="about">Amount</th>
                      </tr>
                      <tr className="items-head">
                        <th className="items-col item">item</th>
                        <th className="items-col design">design</th>
                        <th className="items-col qty">Qty</th>
                        <th className="items-col pcs">Pcs</th>
                        <th className="items-col wts">Wts</th>
                        <th className="items-col rate">Rate</th>
                        <th className="items-col amount">Amount</th>
                        <th className="items-col qty">Qty</th>
                        <th className="items-col pcs">Pcs</th>
                        <th className="items-col wts">Wts</th>
                        <th className="items-col rate">Rate</th>
                        <th className="items-col amount">Amount</th>
                        <th className="items-col qty">Qty</th>
                        <th className="items-col pcs">Pcs</th>
                        <th className="items-col wts">Wts</th>
                        <th className="items-col rate">Rate</th>
                        <th className="items-col amount">Amount</th>
                        <th className="labour"> labour</th>
                        <th className="labour"> Certification</th>
                        <th className="labour"> Hallmark</th>
                        <th className="labour">Stamping</th>
                        <th className="items-col rs">(Rs)</th>
                      </tr>
                    </thead>
                    {quotationData?.map((ele, index) => (
                      <tbody key={index}>
                        <tr>
                          <td className="items-col sr.no">{index + 1}</td>
                          <td className="items-col item">
                            <p>{ele?.product?.title}</p>
                            <p>({ele?.product?.sku})</p>
                            <p className="my-order-sizes">{ele?.size_name ? `Size: ${ele?.size_name}` : ""}</p>
                            <p>{`QTY: ${ele?.qty}`}</p>
                          </td>
                          <td className="items-col design">
                            <CustomImage
                              className="items-img"
                              src={ele?.products?.images.length > 0 ? ele?.products?.images[0]?.path : ""}
                              alt={
                                ele?.products?.images.length > 0
                                  ? ele?.products?.images[0]?.name
                                  : "product thumb image"
                              }
                              title={ele?.product?.title}
                              width="350"
                              height="350"
                            />
                          </td>
                          <td className="items-col qty">
                            {ele?.total_rate_card_Details?.is_fix_price !==
                              1 ? (
                              <>
                                {ele?.diamond_details?.map(
                                  (dd, din: number) => {
                                    return (
                                      <span key={din}>
                                        {(dd?.diamond_shape_name
                                          ? dd?.diamond_shape_name
                                          : "") +
                                          " - " +
                                          (dd?.diamond_quality_name
                                            ? dd?.diamond_quality_name
                                            : "") +
                                          " - " +
                                          (dd.diamond_sieve_name
                                            ? dd.diamond_sieve_name
                                            : "") +
                                          (ele?.products?.diamond_details
                                            ?.length -
                                            1 !==
                                            din
                                            ? ", "
                                            : "")}
                                      </span>
                                    );
                                  }
                                )}
                              </>
                            ) : "-"}
                          </td>
                          {(isShowProductDetails && ele?.products?.total_diamond_pcs && ele?.total_rate_card_Details?.is_fix_price !== 1) ? (
                            <td className="items-col pcs">{`${ele?.products?.total_diamond_pcs} pcs`}</td>
                          ) : (
                            <td className="items-col pcs">-</td>
                          )}
                          {(isShowProductDetails && ele?.products?.total_diamond_carat && ele?.total_rate_card_Details?.is_fix_price !== 1) ? (
                            <td className="items-col wts">{`${Number(ele?.products.total_diamond_carat).toFixed(3)} ct`}</td>
                          ) : (
                            <td className="items-col wts">-</td>
                          )}
                          <td className="items-col rate">-</td>
                          <td className="items-col amount">
                            {(ele?.total_rate_card_Details?.total_diamond_price > 0 && ele?.total_rate_card_Details?.is_fix_price !== 1) ?
                              `${currencySymbol} ${covertPriceInLocalString(
                                ele?.total_rate_card_Details?.total_diamond_price
                              )}` : "-"}
                          </td>
                          <td className="items-col qty">{(isShowProductDetails && ele?.metal_quality && ele?.total_rate_card_Details?.is_fix_price !== 1) ? ele?.metal_quality : "-"}</td>
                          <td className="items-col pcs">-</td>
                          <td className="items-col wts">
                            {(isShowProductDetails && ele?.total_rate_card_Details?.net_weight && ele?.total_rate_card_Details?.is_fix_price !== 1) ?
                              `${Number(ele?.total_rate_card_Details?.net_weight).toFixed(3)} gm` : '-'}
                          </td>
                          <td className="items-col rate">-</td>
                          <td className="items-col amout">
                            {(isShowProductDetails && ele?.total_rate_card_Details?.total_metal_price > 0 && ele?.total_rate_card_Details?.is_fix_price !== 1) ?
                              `${currencySymbol} ${covertPriceInLocalString(
                                ele?.total_rate_card_Details?.total_metal_price
                              )}` : "-"}
                          </td>
                          <td className="items-col qty">
                            {ele?.total_rate_card_Details?.is_fix_price !==
                              1 ? (
                              <>
                                {ele?.color_stone_details?.map(
                                  (dd, din: number) => {
                                    return (
                                      <span key={din}>
                                        {(dd?.color_stone_name
                                          ? dd?.color_stone_name
                                          : "") +
                                          " - " +
                                          (dd?.color_stone_shape_name
                                            ? dd?.color_stone_shape_name
                                            : "") +
                                          (ele?.products?.color_stone_details
                                            ?.length -
                                            1 !==
                                            din
                                            ? ", "
                                            : "")}
                                      </span>
                                    );
                                  }
                                )}
                                {ele?.color_stone_details?.length <= 0
                                  ? "-"
                                  : ""}
                              </>
                            ) : (
                              "-"
                            )}
                          </td>
                          {(isShowProductDetails && ele?.products?.total_color_stone_pcs && ele?.total_rate_card_Details?.is_fix_price !== 1) ? (
                            <td className="items-col pcs">{`${ele?.products?.total_color_stone_pcs} pcs`}</td>
                          ) : (
                            <td className="items-col pcs">-</td>
                          )}
                          {(isShowProductDetails && ele?.products?.total_color_stone_carat && ele?.total_rate_card_Details?.is_fix_price !== 1) ? (
                            <td className="items-col wts">{`${Number(ele?.products?.total_color_stone_carat).toFixed(3)} ct`}</td>
                          ) : (
                            <td className="items-col wts">-</td>
                          )}
                          <td className="items-col rate">-</td>

                          <td className="items-col amount">
                            {(isShowProductDetails && props?.total_color_stone_price > 0 && ele?.total_rate_card_Details?.is_fix_price !== 1) ?
                              `${currencySymbol} ${covertPriceInLocalString(props?.total_color_stone_price)}` : "-"}
                          </td>


                          <td className="items-col rate">
                            {ele.total_rate_card_Details.labour_charge > 0 ? (
                              <>
                                {currencySymbol}
                                {covertPriceInLocalString(ele.total_rate_card_Details.labour_charge)}
                              </>
                            ) : (
                              " - "
                            )}
                          </td>

                          <td className="items-col amount">
                            {ele.total_rate_card_Details.certificate_charge > 0 ? (
                              <>
                                {currencySymbol}
                                {covertPriceInLocalString(ele.total_rate_card_Details.certificate_charge)}
                              </>
                            ) : (
                              " - "
                            )}
                          </td>

                          <td className="items-col rate">
                            {ele.total_rate_card_Details.hallmark_charge > 0 ? (
                              <>
                                {currencySymbol}
                                {covertPriceInLocalString(ele.total_rate_card_Details.hallmark_charge)}
                              </>
                            ) : (
                              " - "
                            )}
                          </td>

                          <td className="items-col amount">
                            {ele.total_rate_card_Details.stamping_charge > 0 ? (
                              <>
                                {currencySymbol}
                                {covertPriceInLocalString(ele.total_rate_card_Details.stamping_charge)}
                              </>
                            ) : (
                              " - "
                            )}
                          </td>

                          <td className="items-col rs">
                            {ele.total_rate_card_Details.is_fix_price === 1 ? (
                              <>
                                <p>
                                  <b>
                                    {currencySymbol}
                                    {Math.round(ele.total_rate_card_Details.total_price * ele.qty)?.toLocaleString(
                                      APPCONFIG.NUMBER_FORMAT_LANG
                                    )}
                                  </b>
                                </p>
                                {ele.total_rate_card_Details.discount_per > 0 && (
                                  <>
                                    <p>
                                      <span>{`Discount ${ele.total_rate_card_Details.discount_per} %`}</span>
                                      <span style={{ textDecorationLine: "line-through" }}>
                                        {`(${currencySymbol} ${Math.round(
                                          ele.total_rate_card_Details.original_total_price * ele.qty
                                        )?.toLocaleString(APPCONFIG.NUMBER_FORMAT_LANG)})`}
                                      </span>
                                    </p>

                                    <p>
                                      {currencySymbol}
                                      {Math.round(ele.total_rate_card_Details.item_price * ele.qty)?.toLocaleString(
                                        APPCONFIG.NUMBER_FORMAT_LANG
                                      )}
                                    </p>
                                  </>
                                )}
                              </>
                            ) : (
                              <>
                                <p>
                                  <b>
                                    {currencySymbol}
                                    {Math.round(ele.total_rate_card_Details.total_price * ele.qty)?.toLocaleString(
                                      APPCONFIG.NUMBER_FORMAT_LANG
                                    )}
                                  </b>
                                </p>
                                {ele.total_rate_card_Details.discount_per > 0 && (
                                  <p>
                                    <span>{`Discount ${ele.total_rate_card_Details.discount_per} %`}</span>
                                    <span style={{ textDecorationLine: "line-through" }}>
                                      {`(${currencySymbol} ${Math.round(
                                        ele.total_rate_card_Details.original_total_price * ele.qty
                                      )?.toLocaleString(APPCONFIG.NUMBER_FORMAT_LANG)})`}
                                    </span>
                                  </p>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
                <Link href="/cart/checkout_list/">
                  <a className="btn btn-contineu-checkout">Continue Checkout</a>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default QuotationData1;
