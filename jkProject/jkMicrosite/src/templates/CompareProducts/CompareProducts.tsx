import Loader from "@components/customLoader/Loader";
import { ICompareProductsState } from "@components/Hooks/compareProduct";
import useCompareProduct from "@components/Hooks/compareProduct/useCompareProduct";
import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { ICompareProducts } from "@templates/CompareProducts";
import { getDymanicBgTagColorAndImg, getTypeBasedCSSPath, getUserDetails, setDynamicDefaultStyle } from "@util/common";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { uuid } from "@util/uuid";
import { IMAGE_PATH } from "@constant/imagepath";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import { ICompareProductsProps } from "@type/Pages/compareProducts";
import CustomImage from "@components/CustomImage/CustomImage";
import usePriceDisplay from "@components/Hooks/priceDisplay";
import Link from "next/link";
import Cookies from "js-cookie";

const CompareProducts = (props: ICompareProducts) => {
  const showPrice = parseInt(Cookies.get("showPrice") ?? '') === 1 ? true : false;
  const { getCompareProductList, addProductInCompare } = useCompareProduct();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [compareProductData, setCompareProductData] = useState<
    ICompareProductsProps[]
  >([]);
  const { adddtoCartProduct } = useAddtoCart();
  const currencySymbol = useCurrencySymbol();
  const { isPriceDisplay } = usePriceDisplay();

  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
    // eslint-disable-next-line
  }, []);

  const getCompareProductListData = async () => {
    setIsLoading(true);
    const productIds = getCompareProductList()?.map(
      (ele: ICompareProductsState) => ele.product_id
    );
    if (productIds) {
      let obj = {
        product_id: productIds,
      };
      await pagesServices.postPage(APICONFIG.COMPARE_PRODUCT_LIST, obj).then(
        (result) => {
          setIsLoading(false);
          setCompareProductData(result?.data || []);
          setDynamicDefaultStyle(result?.default_style, result?.theme);
        },
        () => {
          setIsLoading(false);
        }
      );
    }
  };

  useEffect(() => {
    getCompareProductListData();
    // eslint-disable-next-line
  }, []);

  const reloadPage = () => {
    getCompareProductListData();
  };

  const getProductTagBGColorAndImage = (tagTitle : string)=>{
    const bgTagColorAndImg = getDymanicBgTagColorAndImg(tagTitle,props?.slugInfo?.product_tags_detail)
    return bgTagColorAndImg
  }

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productCard)}
        />
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.recenltyViewedBadges +
            ".css"
          }
        />
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.compareProducts +
            ".min.css"
          }
        />
        {/* <title>{pageTitle ? pageTitle : props?.domainName}</title> */}
      </Head>
      {isLoading && <Loader />}
      <main>
        <div className="compare-products-section">
          <div className="container">
            <h2>Compare Products</h2>

            <div className="container-inner">
              {compareProductData?.length > 0 ? (
                <div className="compare-product-list">
                  <div className="compare-product-row no-label">
                    <div className="compare-product-col"></div>

                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div className="compare-product-col-inner">
                            <div className="product-card card">
                              <div className="card-head">
                                <CustomImage
                                  src={
                                    item?.images[0]?.path
                                      ? item?.images[0]?.path
                                      : IMAGE_PATH.noImagePng
                                  }
                                  alt={item?.product.title}
                                  title={item?.product?.title}
                                  height="348"
                                  width="349"
                                />
                                <a
                                  href="#"
                                  onClick={() => {
                                    addProductInCompare(
                                      item?.product?.title,
                                      item?.price_breakup?.product_id
                                    );
                                    reloadPage();
                                  }}
                                  className="wishlist-link"
                                >
                                  <i className="icon jkm-trash"></i>
                                </a>
                                <div className="badge-wrapper">
                                  {item?.price_breakup?.is_discounted === 1 ? (
                                    <div className="badge discount-badge">
                                       {item?.price_breakup?.discount_per}% OFF
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                  {item?.is_available_for_order && item?.is_available_for_order !== 1 ? (
                                    <div className="badge out-of-stock-badge">
                                      Out Of Stock
                                    </div>
                                  ) : (
                                    <></>
                                  )}
                                  {item?.product_tag_name?.length > 0 && (
                                    <div
                                      className={"badge badge-featured"}
                                      key={uuid()}
                                      style={
                                        getProductTagBGColorAndImage(
                                          item?.product_tag_name
                                        ).style
                                      }
                                    >
                                      {getProductTagBGColorAndImage(item?.product_tag_name).imgPath && (
                                        <div className="product-tag-img">
                                          <img src={getProductTagBGColorAndImage(item?.product_tag_name).imgPath} alt="productTag Img"/>
                                        </div>
                                      )}

                                      {item?.product_tag_name}
                                    </div>
                                  )}
                                </div>
                                {getUserDetails() || (!getUserDetails() && isPriceDisplay) ? (
                                  <div className="product-overlay">
                                    <button
                                      type="button"
                                      className="btn btn-secondary btn-small btn-add-cart"
                                      onClick={() =>
                                        adddtoCartProduct({
                                          item_id:
                                            item?.price_breakup
                                              ?.website_product_id,
                                          qty: APPCONFIG.DEFAULT_QTY_TYPE,
                                          is_from_product_list: 1,
                                          productId: item?.product_id
                                        })
                                      }
                                    >
                                      Add To Cart{" "}
                                      <i className="icon jkm-add-to-cart"></i>
                                    </button>
                                  </div>
                                ) : <></>}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row no-label">
                    <div className="compare-product-col"></div>
                    {compareProductData.map((item) => {
                      return (
                        <div
                          key={uuid()}
                          className="compare-product-col product-card-heading"
                        >
                          <div className="compare-product-col-inner">
                            <span> {item?.product.title}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row no-label">
                    <div className="compare-product-col"></div>

                    {compareProductData.map((item) => {
                      return (
                        <div
                          key={uuid()}
                          className="compare-product-col product-card-heading"
                        >
                          <div className="compare-product-col-inner">
                            <span> {item?.product?.sku}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="compare-product-row no-label">
                    <div className="compare-product-col"></div>

                    {
                      showPrice ?
                        compareProductData.map((item) => {
                          return (
                            <div key={uuid()} className="compare-product-col">
                              <div className="compare-product-col-inner">
                                <div className="product-card-price-wrap">
                                  {item?.price_breakup?.is_discounted ? (
                                    <p className="product-card-discounted-price">
                                      {currencySymbol}{" "}
                                      {Math.round(
                                        item?.price_breakup?.original_total_price
                                      )?.toLocaleString(
                                        APPCONFIG.NUMBER_FORMAT_LANG
                                      )}
                                    </p>
                                  ) : null}
                                  <p className="product-card-price">
                                    {currencySymbol}{" "}
                                    {Math.round(
                                      item?.price_breakup?.total_price
                                    )?.toLocaleString(
                                      APPCONFIG.NUMBER_FORMAT_LANG
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          );
                        }) : (
                          <></>
                        )
                    }
                  </div >

                  <div className="compare-product-row no-label">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span> Ratings and Reviews </span>
                      </div>
                    )}
                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Ratings &amp; Reviews"
                          >
                            <div className="product-card-review">
                              {/* <Rating value={item.review_avg} cancel={false} />

                          <span
                            className="link link-secondary"
                            onClick={() =>
                              setReviewData(item.product_review, item)
                            }
                          >
                            {item.total_reviews} Reviews
                          </span> */}
                              {item.total_reviews} Reviews
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span> Product Width </span>
                      </div>
                    )}
                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Width"
                          >
                            {item?.product?.dimensions?.width || "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span> Product Length </span>
                      </div>
                    )}

                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Length"
                          >
                            {item?.product?.dimensions?.length || "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span>Metal Type - Purity</span>
                      </div>
                    )}

                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Purity"
                          >
                            {item?.price_breakup?.is_fix_price !== 1 ? (item?.default_metal?.metal_purity_name && item?.default_metal?.metal_type_name ?
                              `${item?.default_metal?.metal_purity_name} ${item?.default_metal?.metal_type_name}` : "-") : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span>Metal Weight</span>
                      </div>
                    )}
                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Weight"
                          >
                            {item?.price_breakup?.is_fix_price !== 1 ? ((item?.default_metal?.weight &&
                              item?.default_metal?.weight.toFixed(3) + " gm") ||
                              "-") : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span>Metal Price</span>
                      </div>
                    )}
                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Diamond Type"
                          >
                            {item?.price_breakup?.is_fix_price !== 1 ? (item?.price_breakup?.total_metal_price || "-") : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span>Diamond Sieve</span>
                      </div>
                    )}

                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Diamond sieve"
                          >
                            {item?.price_breakup?.is_fix_price !== 1 ? (item?.diamond_shape_quality_name || "") : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span>Diamond Pcs</span>
                      </div>
                    )}

                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Diamond Pcs"
                          >
                            {item?.price_breakup?.is_fix_price !== 1 ? (item?.total_diamond_pcs || "-") : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span>Diamond Carat</span>
                      </div>
                    )}
                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Diamond Carat"
                          >
                            {item?.price_breakup?.is_fix_price !== 1 ? ((item?.total_diamond_carat && Number(item?.total_diamond_carat).toFixed(3)) || "-") : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {getUserDetails() || (!getUserDetails() && isPriceDisplay) ? (
                    <div className="compare-product-row">
                      {compareProductData.length && (
                        <div className="compare-product-col product-card-header">
                          <span>Diamond Price</span>
                        </div>
                      )}

                      {compareProductData.map((item) => {
                        return (
                          <div key={uuid()} className="compare-product-col">
                            <div
                              className="compare-product-col-inner"
                              data-label="Diamond Price"
                            >
                              {item?.price_breakup?.is_fix_price !== 1 ? (item?.price_breakup?.total_diamond_price || "-") : "-"}
                            </div>
                          </div>
                        )})}

                      </div>
                    ) : <></>}

                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span>Color Stone</span>
                      </div>
                    )}

                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Color Stone"
                          >
                            {item?.price_breakup?.is_fix_price !== 1 ? (item?.color_shape_stone_name || "-") : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div
                        key={uuid()}
                        className="compare-product-col product-card-header"
                      >
                        <span>Color Stone Carat</span>
                      </div>
                    )}
                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Color Stone Carat"
                          >
                            {item?.price_breakup?.is_fix_price !== 1 ? ((item?.total_color_carat && (Number(item?.total_color_carat).toFixed(3))) || "-") : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="compare-product-row">
                    {compareProductData.length && (
                      <div className="compare-product-col product-card-header">
                        <span>Color Stone Pcs</span>
                      </div>
                    )}

                    {compareProductData.map((item) => {
                      return (
                        <div key={uuid()} className="compare-product-col">
                          <div
                            className="compare-product-col-inner"
                            data-label="Color Stone Psc"
                          >
                            {item?.price_breakup?.is_fix_price !== 1 ? (item?.total_color_pcs || "-") : "-"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {getUserDetails() || (!getUserDetails() && isPriceDisplay) ? (
                    <div className="compare-product-row">
                      {compareProductData.length && (
                        <div className="compare-product-col product-card-header">
                          <span>Color Stone Price</span>
                        </div>
                      )}

                      {compareProductData.map((item) => {
                        return (
                          <div key={uuid()} className="compare-product-col">
                            <div
                              className="compare-product-col-inner"
                              data-label="Color Stone Price"
                            >
                              {item?.price_breakup?.is_fix_price !== 1 ? (item?.price_breakup?.total_color_stone_price ||
                                "-") : "-"}
                            </div>
                          </div>
                        )})}
                      </div>
                    ) : <></>}
                </div >
              ) : (
                <></>
              )}
              <div className="no-products">
                {compareProductData.length == 0 && !isLoading && (
                  <NoDataAvailable title="No Products found..!!">
                    <Link href="/">
                      <a className="btn btn-primary">Go to Home</a>
                    </Link>
                  </NoDataAvailable>
                )}
              </div>
            </div >
          </div >
        </div >
      </main >
    </>
  );
};

export default CompareProducts;
