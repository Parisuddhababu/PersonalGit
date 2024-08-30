import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IProductDetails } from "@type/Pages/productDetails";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { useEffect, useState } from "react";
import { IProductShipingDetailProps } from "@templates/ProductDetails/components/ProductShipingDetail";
import useCustomiseProductDetails from "@components/Hooks/customiseProductDetails/useCustomiseProductDetails";
import { uuid } from "@util/uuid";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const ProductShipingDetail1 = (props: IProductShipingDetailProps) => {
  const [details, setDetails] = useState<IProductDetails>(props?.data);
  const [currentActiveTab, setCurrentActiveTab] = useState<
    "detail" | "shiping"
  >("detail");
  const productDetails = useSelector((state: any) => state);
  const { customDetails } = useCustomiseProductDetails();
  const isShowProductDetails = parseInt(Cookies.get("isShowProductDetails") ?? '') === 1 ? true : false;

  useEffect(() => {
    setDetails({ ...details, ...productDetails?.priceDisplayData?.productDetails });
  }, [productDetails?.priceDisplayData?.productDetails])

  useEffect(() => {
    if (customDetails) {
      setDetails({ ...details, ...customDetails });
    }
    // eslint-disable-next-line
  }, [customDetails]);

  useEffect(() => {
    if (props?.data) {
      setDetails({ ...details, ...props.data });
    }
    if (props?.data?.price_breakup?.is_fix_price === 1) {
      setCurrentActiveTab("shiping")
    }
    // eslint-disable-next-line
  }, [props?.data]);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productTabSection)}
        />
      </Head>
      <section className="product-tab-section">
        <div className="container">
          <ul id="tabs" className="nav nav-tabs">
            {isShowProductDetails && details?.price_breakup?.is_fix_price !== 1 && <li
              className="nav-item"
              onClick={() => setCurrentActiveTab("detail")}
            >
              <a
                id="tab-pro-details"
                className={`nav-link ${currentActiveTab === "detail" && "active"
                  }`}
              >
                Product Detail
              </a>
            </li>}
            <li
              className="nav-item"
              onClick={() => setCurrentActiveTab("shiping")}
            >
              <a
                id="tab-ship-details"
                className={`nav-link ${currentActiveTab === "shiping" && "active"
                  }`}
              >
                Product Information
              </a>
            </li>
          </ul>

          <div className="tab-content">
            {currentActiveTab === "detail" ? (
              <>
                {
                  isShowProductDetails &&
                  <div
                    id="content-pro-details"
                    className={`tab-pane ${currentActiveTab === "detail" && "active"
                      }`}
                  >
                    <div className="collapse-heading" id="heading-pro-details">
                      <h5>
                        <a href="#collapse-pro-details">Product Detail</a>
                      </h5>
                    </div>

                    <div id="collapse-pro-details" className="collapse">
                      <div className="collapse-body">
                        <div className="details-wrap-section">
                          <div className="item-box">
                            <h6>Product Information</h6>
                            <table>
                              <tbody>
                                <tr>
                                  {details?.dimensions?.width ? (
                                    <>
                                      <td className="col-td">
                                        <table>
                                          <tr>
                                            <td className="left-data">Width</td>
                                          </tr>
                                          <tr>
                                            <td className="right-data">
                                              {details?.dimensions?.width
                                                ? details?.dimensions?.width
                                                : ""}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  {details?.dimensions?.length ? (
                                    <>
                                      <td className="col-td">
                                        <table>
                                          <tr>
                                            <td className="left-data">Length</td>
                                          </tr>
                                          <tr>
                                            <td className="right-data">
                                              {details?.dimensions?.length
                                                ? details?.dimensions?.length
                                                : ""}
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  {details?.price_breakup?.metal_quality ? (
                                    <>
                                      <td className="col-td">
                                        <table>
                                          <tr>
                                            <td className="left-data">Purity</td>
                                          </tr>
                                          <tr>
                                            <td className="right-data">
                                              {
                                                details?.price_breakup
                                                  ?.metal_quality
                                              }
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                  {details?.gross_weight ? (
                                    <td className="col-td">
                                      <table>
                                        <tr>
                                          <td className="left-data">Gross Weight</td>
                                        </tr>
                                        <tr>
                                          <td className="right-data">
                                            {details?.gross_weight &&
                                              details?.gross_weight.toFixed(
                                                3
                                              )}{" "}
                                            gm
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  ) : (
                                    <></>
                                  )}
                                  {details?.price_breakup?.net_weight ? (
                                    <>
                                      <td className="col-td">
                                        <table>
                                          <tr>
                                            <td className="left-data">Net Weight</td>
                                          </tr>
                                          <tr>
                                            <td className="right-data">
                                              {details?.price_breakup?.net_weight &&
                                                details?.price_breakup?.net_weight.toFixed(
                                                  3
                                                )}{" "}
                                              gm
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {details?.website_product_detail?.diamond_details
                            ?.length > 0 ? (
                            <div className="item-box">
                              <h6>Diamond Details</h6>
                              <table>
                                <tbody>
                                  {details?.website_product_detail?.diamond_details?.map(
                                    (dd) => (
                                      <>
                                        <tr>
                                          {dd?.diamond_quality_name && (
                                            <>
                                              <td className="col-td">
                                                <table>
                                                  <tr key={uuid()}>
                                                    <td className="left-data">
                                                      Diamond Quality
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="right-data">
                                                      {dd?.diamond_quality_name}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </>
                                          )}
                                          {dd?.diamond_shape_name && (
                                            <>
                                              <td className="col-td">
                                                <table>
                                                  <tr key={uuid()}>
                                                    <td className="left-data">
                                                      Diamond Shape
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="right-data">
                                                      {dd?.diamond_shape_name}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </>
                                          )}
                                          {dd?.pcs && (
                                            <>
                                              <td className="col-td">
                                                <table>
                                                  <tr key={uuid()}>
                                                    <td className="left-data">
                                                      Total Pcs
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="right-data">
                                                      {dd?.pcs + " pcs"}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </>
                                          )}
                                          {dd?.carat && (
                                            <>
                                              <td className="col-td">
                                                <table>
                                                  <tr key={uuid()}>
                                                    <td className="left-data">
                                                      Total Weight
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="right-data">
                                                      {Number(dd?.carat).toFixed(3)} ct
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </>
                                          )}
                                        </tr>
                                      </>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <></>
                          )}
                          {details?.website_product_detail?.color_stone_details
                            ?.length > 0 ? (
                            <div className="item-box">
                              <h6>Color Stone Details</h6>
                              <table>
                                <tbody>
                                  {details?.website_product_detail?.color_stone_details?.map(
                                    (dd) => (
                                      <>
                                        <tr>
                                          {dd?.color_stone_name && (
                                            <>
                                              <td className="col-td">
                                                <table>
                                                  <tr key={uuid()}>
                                                    <td className="left-data">
                                                      Stone
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="right-data">
                                                      {dd?.color_stone_name}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </>
                                          )}
                                          {dd?.color_stone_shape_name && (
                                            <>
                                              <td className="col-td">
                                                <table>
                                                  <tr key={uuid()}>
                                                    <td className="left-data">
                                                      Shape
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="right-data">
                                                      {dd?.color_stone_shape_name}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </>
                                          )}
                                          {dd?.pcs && (
                                            <>
                                              <td className="col-td">
                                                <table>
                                                  <tr key={uuid()}>
                                                    <td className="left-data">
                                                      Total Pcs
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="right-data">
                                                      {dd?.pcs + " pcs"}
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </>
                                          )}
                                          {dd?.carat && (
                                            <>
                                              <td className="col-td">
                                                <table>
                                                  <tr key={uuid()}>
                                                    <td className="left-data">
                                                      Total Weight
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td className="right-data">
                                                      {Number(dd?.carat).toFixed(3)} ct
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </>
                                          )}
                                        </tr>
                                      </>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <></>
                          )}
                          {details?.website_product_detail?.metal_type ||
                            details?.price_breakup?.metal_quality ||
                            details?.price_breakup?.net_weight ? (
                            <div className="item-box">
                              <h6>Metal Details</h6>
                              <table>
                                <tbody>
                                  <tr>
                                    {(details?.price_breakup?.metal_type || details?.website_product_detail?.default_metal_type) && (
                                      <>
                                        <td className="col-td">
                                          <table>
                                            <tr>
                                              <td className="left-data">
                                                Metal Type
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="right-data">
                                                {
                                                  details?.price_breakup?.metal_type ?
                                                    details?.price_breakup?.metal_type
                                                    : details?.website_product_detail?.default_metal_type
                                                }
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </>
                                    )}
                                    {details?.price_breakup?.metal_quality && (
                                      <>
                                        <td className="col-td">
                                          <table>
                                            <tr>
                                              <td className="left-data">
                                                Metal Quality
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="right-data">
                                                {
                                                  details?.price_breakup
                                                    ?.metal_quality
                                                }
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </>
                                    )}
                                    {details?.price_breakup?.net_weight && (
                                      <>
                                        <td className="col-td">
                                          <table>
                                            <tr>
                                              <td className="left-data">
                                                Metal Weight
                                              </td>
                                            </tr>
                                            <tr>
                                              <td className="right-data">
                                                {details?.price_breakup
                                                  ?.net_weight &&
                                                  details?.price_breakup?.net_weight.toFixed(
                                                    3
                                                  )}{" "}
                                                gm
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </>
                                    )}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <></>
                          )}

                        </div>
                      </div>
                    </div>
                  </div>
                }
              </>
            ) : (
              <div
                className={`tab-pane ${currentActiveTab === "shiping" && "active"
                  }`}
              >
                <div className="collapse-heading">
                  <h5>
                    <a className="collapsed" href="#collapse-ship-details">
                      Product Information
                    </a>
                  </h5>
                </div>
                <div id="collapse-ship-details" className="collapse">
                  <div className="collapse-body">
                    <div className="details-wrap-section product-shipping-details">
                      {details?.website_product_detail?.short_desc ||
                        details?.website_product_detail?.long_desc ? (
                        <div className="item-box">
                          <table>
                            <tbody>
                              {<tr>
                                {details?.website_product_detail
                                  ?.short_desc && (
                                    <>
                                      <td className="col-td">
                                        <table>
                                          <tr>
                                            <td className="left-data">
                                              Short Description -
                                            </td>
                                          </tr>
                                          <tr>
                                            <td className="right-data">
                                              <div dangerouslySetInnerHTML={{
                                                __html: details?.website_product_detail
                                                  ?.short_desc
                                              }}
                                                className="inherit-ul-li"
                                              />
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </>
                                  )}
                                {details?.website_product_detail?.long_desc && (
                                  <>
                                    <td className="col-td">
                                      <table>
                                        <tr>
                                          <td className="left-data">
                                            Long Description -
                                          </td>
                                        </tr>
                                        <tr>
                                          <td className="right-data">
                                            <div dangerouslySetInnerHTML={{
                                              __html: details?.website_product_detail
                                                ?.long_desc
                                            }}
                                              className="inherit-ul-li"
                                            />
                                          </td>
                                        </tr>
                                      </table>
                                    </td>
                                  </>
                                )}
                              </tr>}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <></>
                      )}
                      {/* <div className="item-box">
                        <table>
                          <tbody>
                            <tr>
                              <td className="col-td-shipping">
                                <i className="jkm-certified"></i>
                                <span>100% Certified</span>
                              </td>
                              <td className="col-td-shipping">
                                <i className="jkm-fast-delivery"></i>
                                <span>Fast Delivery</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductShipingDetail1;
