import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getDymanicBgTagColorAndImg, getTypeBasedCSSPath, getUserDetails, getVideoId } from "@util/common";
import { IQuickView1Props } from "@templates/ProductList/components/QuickView";
import Modal from "@components/Modal";
import useProductQuickView from "@components/Hooks/products/useProductQuickView";
import useCompareProduct from "@components/Hooks/compareProduct/useCompareProduct";
import { ICompareProductsState } from "@components/Hooks/compareProduct";
import CustomImage from "@components/CustomImage/CustomImage";
import APPCONFIG from "@config/app.config";
import useCustomImageSlider from "@components/Hooks/products/useCustomImageSlider";
import { IMAGE_PATH } from "@constant/imagepath";
import useZoomImageHook from "@components/Hooks/ImageZoom/ImageZoomHooks";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import { IAddtoCart } from "@components/Hooks/addtoCart";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import usePriceDisplay from "@components/Hooks/priceDisplay";
import SocialShare from "@components/SocialShare/SocialShare";
import { useRouter } from "next/router";
import useReviewRatings from "@components/Hooks/ReviewRatings/useReviewRatings";
import CustomRatingViews from "@components/customRatings/customRatingViews";
import Link from "next/link";
import { IProductDetailsData } from "@type/Pages/Products";
import Cookies from "js-cookie";
import { useToast } from "@components/Toastr/Toastr";
import { uuid } from "@util/uuid";

const IQuickView1 = ({ onClose, slug, isModal, product_tags_detail, type }: IQuickView1Props) => {
  const {
    details,
    defaultSize,
    setDefaultSize,
    itemQty,
    setItemQty,
    addtoWishList,
    updateDefaultSizeData,
  } = useProductQuickView({
    slug: slug,
  });
  const { showError } = useToast();
  const isB2BUser = parseInt(Cookies.get("isB2BUser") ?? '') === 1 ? true : false;
  const showPrice = parseInt(Cookies.get("showPrice") ?? '') === 1 ? true : false;
  const [isAcceptebleQty, setIsAcceptebleQty] = useState<boolean>(true)
  const [videoLink, setVideoLink] = useState<any>(null);
  const [productDetails, setProductDetails] = useState<IProductDetailsData | null>(null);
  const [errorMessage, setErrorMesage] = useState<string>("");
  const isShowProductDetails = parseInt(Cookies.get("isShowProductDetails") ?? '') === 1 ? true : false;

  const { totalReviewCount, totalRatingCount, getReviewRatings } =
    useReviewRatings({
      product_id: productDetails?.website_product_detail?.product_id as string,
      callApi: true,
    });
  const { addProductInCompare, getCompareProductList } = useCompareProduct();
  const reference = useRef<HTMLDivElement[] | null[]>([]);
  const {
    selectedImage,
    handleRightClick,
    handleLeftClick,
    handleSelectedImageChange,
  } = useCustomImageSlider({
    images: productDetails?.images || [],
    refrence: reference,
  });
  const currencySymbol = useCurrencySymbol();
  const { isPriceDisplay } = usePriceDisplay();
  const { mouseEnter, onMouseMove, mouseLeave, imgWidth, imgHeight, x, y } =
    useZoomImageHook();
  const { adddtoCartProduct } = useAddtoCart();
  const Router = useRouter();
  const addCart = async () => {
    if (isAcceptebleQty) {
      let obj = {
        item_id: productDetails?.price_breakup?.website_product_id,
        qty: itemQty || APPCONFIG.DEFAULT_QTY_TYPE,
      };
      // @ts-ignore
      if (defaultSize) obj["size_id"] = defaultSize;
      // @ts-ignore
      if (defaultSize) obj["new_size_id"] = defaultSize;
      const response = await adddtoCartProduct(obj as IAddtoCart);
      if (response?.meta?.status_code == 201) {
        toggleModal();
      }
    } else {
      showErrorHandler()
    }
  };

  useEffect(() => {
    if (productDetails?.price_breakup?.website_product_id) {
      getReviewRatings();
    }
    // eslint-disable-next-line
  }, [productDetails?.price_breakup?.website_product_id]);

  const toggleModal = () => {
    onClose();
  };

  const redirectNCart = async () => {
    if (isAcceptebleQty) {
      addCart();
      if (getUserDetails()) {
        Router.push("/cart/list/");
      } else {
        // addCart();
        Router.push("/cart/list/");
      }
    } else {
      showErrorHandler()
    }
  };

  useEffect(() => {
    setProductDetails(details);
  }, [details]);

  const onSizeChange = async (id: string) => {
    setDefaultSize(id);
    const updatedData = (await updateDefaultSizeData(
      id,
      productDetails
    )) as IProductDetailsData;
    setProductDetails(updatedData);
  };

  // const decrementFunction = () => {
  //   if (itemQty > 1) {
  //     setItemQty(itemQty != 0 ? itemQty - 1 : 0);
  //   }
  // };

  const showPlaceInquiryModal = () => {
    if (getUserDetails()) redirectNCart();
    else Router.replace("/sign-in");
  }

  const showErrorHandler = () => {
    showError(errorMessage)
  }

  const handleOnChangeProductQty = (addedQty: number, maxQty: number, minQty: number) => {
    setItemQty(addedQty)
    setIsAcceptebleQty(true)
    if (addedQty < minQty) {
      setErrorMesage(`Minimum Quantity for this product is ${minQty}`)
      setIsAcceptebleQty(false)
    }
    if (addedQty > maxQty) {
      setErrorMesage(`Maximum Quantity for this product is ${maxQty}`)
      setIsAcceptebleQty(false)
    }
  }
  const openVideo = (data: any, idx: number) => {
    const { video_url } = data;
    const videoId = getVideoId(video_url);
    setVideoLink(videoId);
    handleSelectedImageChange(idx);
  };

  const getThumIcon = (url: string) => {
    const videoId = getVideoId(url);
    return (url && videoId) ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : IMAGE_PATH.noImagePng
  }

  const getProductTagBGColorAndImage = (tagTitle: string) => {
    const bgTagColorAndImg = getDymanicBgTagColorAndImg(tagTitle, product_tags_detail)
    return bgTagColorAndImg
  }


  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={APPCONFIG.STYLE_BASE_PATH_PAGES + "quick-view.min.css"}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productQuickView)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.popupBoxDesign)}
        />
      </Head>
      <Modal
        className="quick-view"
        open={isModal}
        onClose={toggleModal}
        dimmer={false}
      >
        {productDetails ? (
          <div className="modal-content">
            <main>
              <section className="detils-wrapper">
                <div className="container">
                  <div className="details-left">
                    <div className="badge-wrapper">
                      {productDetails?.price_breakup?.is_discounted && showPrice ? (
                        <div className="badge discount-badge">{productDetails?.price_breakup?.discount_per}% OFF</div>
                      ) : (
                        <></>
                      )}
                      {details?.website_product_detail?.is_available_for_order !== 1 ? (
                        <div className="badge out-of-stock-badge">
                          Out Of Stock
                        </div>
                      ) : (
                        <></>
                      )}
                      {productDetails?.website_product_detail?.product_tag_name?.length > 0 && (
                        <div
                          className={"badge badge-featured"}
                          key={uuid()}
                          style={
                            getProductTagBGColorAndImage(
                              productDetails?.website_product_detail?.product_tag_name
                            ).style
                          }
                        >
                          {getProductTagBGColorAndImage(productDetails?.website_product_detail?.product_tag_name).imgPath && (
                            <div className="product-tag-img">
                              <img src={getProductTagBGColorAndImage(productDetails?.website_product_detail?.product_tag_name).imgPath} alt="productTag Img" />
                            </div>
                          )}

                          {productDetails?.website_product_detail?.product_tag_name}
                        </div>
                      )}
                    </div>
                    <div className="product-actions">
                      <a
                        className={`jkm-box ${getCompareProductList()?.some(
                          (item: ICompareProductsState) =>
                            item.product_id ===
                            productDetails?.website_product_detail?.product_id
                        )
                          ? " active"
                          : ""
                          }`}
                        onClick={() =>
                          addProductInCompare(
                            productDetails?.product?.title,
                            productDetails?.website_product_detail?.product_id
                          )
                        }
                        title={
                          getCompareProductList()?.some(
                            (item: ICompareProductsState) =>
                              item.product_id ===
                              productDetails?.website_product_detail?.product_id
                          )
                            ? "Remove from compare"
                            : "Add to compare"
                        }
                      >
                        <i
                          className={`icon jkm-copy ${getCompareProductList()?.some(
                            (item: ICompareProductsState) =>
                              item.product_id ===
                              productDetails?.website_product_detail
                                ?.product_id
                          )
                            ? " active jkm-compare-fill"
                            : ""
                            }`}
                        ></i>
                      </a>
                      <a
                        onClick={() => addtoWishList(productDetails)}
                        className={`jkm-box ${productDetails?.is_in_wishlist ? "active" : ""
                          }`}
                      >
                        <i
                          className={`icon jkm-heart ${productDetails?.is_in_wishlist
                            ? "active jkm-whishlist-fill"
                            : ""
                            }`}
                        ></i>
                      </a>
                    </div>
                    <div className="product-slider-box">
                      <button
                        onClick={handleLeftClick}
                        className="btn btn-slider btn-prev"
                      >
                        <i className="jkm-arrow-right"></i>
                      </button>
                      <div
                        className="img-wrapper"
                        style={{
                          backgroundImage: `url('${selectedImage?.path}')`,
                          backgroundSize: `${imgWidth * APPCONFIG.IMAGE_ZOOM.zoomLevel
                            }px ${imgHeight * APPCONFIG.IMAGE_ZOOM.zoomLevel}px`,
                          //calculete position of zoomed image.
                          backgroundPositionX: `${-x * APPCONFIG.IMAGE_ZOOM.zoomLevel + 728 / 2
                            }px`,
                          backgroundPositionY: `${-y * APPCONFIG.IMAGE_ZOOM.zoomLevel + 660 / 2
                            }px`,
                        }}
                      >
                        {selectedImage?.video_url ? (
                          <iframe
                            height={"660px"}
                            width={"728px"}
                            src={`https://www.youtube.com/embed/${videoLink}?rel=0&showinfo=0&disablekb=1`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        ) : (
                          <picture>
                            <source
                              src={
                                selectedImage?.path
                                  ? selectedImage?.path
                                  : IMAGE_PATH.noImagePng
                              }
                              type="image/webp"
                            />
                            <source
                              src={
                                selectedImage?.path
                                  ? selectedImage?.path
                                  : IMAGE_PATH.noImagePng
                              }
                              type="image/jpg"
                            />
                            <img
                              src={`${selectedImage?.path
                                ? selectedImage?.path
                                : IMAGE_PATH.noImagePng
                                }?w=${728}`}
                              alt={
                                selectedImage?.name
                                  ? selectedImage?.name
                                  : "No Image"
                              }
                              title={
                                selectedImage?.name
                                  ? selectedImage?.name
                                  : "No Image"
                              }
                              height={"660px"}
                              width={"728"}
                              onMouseEnter={(e) => mouseEnter(e)}
                              onMouseMove={(e) => onMouseMove(e)}
                              onMouseLeave={() => mouseLeave()}
                            />
                          </picture>
                        )}
                      </div>
                      <div
                        className="product-thumbnail"
                        id="Product-quick-view"
                      >
                        {productDetails?.images?.map(
                          (pImage, idx) =>
                            pImage?._id ? (
                              <div
                                className={
                                  "thumbnail-img" +
                                  (selectedImage?._id === pImage._id
                                    ? " active"
                                    : "")
                                }
                                key={idx + "_quick_view"}
                                ref={(el) =>
                                  // @ts-ignore
                                  (reference.current[idx] = el)
                                }
                                onClick={() => handleSelectedImageChange(idx)}
                              >
                                <CustomImage
                                  src={pImage?.path}
                                  alt={pImage?.name}
                                  title={pImage?.name}
                                  height="88px"
                                  width="88px"
                                />
                              </div>
                            ) : (
                              <div
                                key={idx}
                                className={
                                  "thumbnail-img video" +
                                  (selectedImage?.video_url == pImage?.video_url
                                    ? " active"
                                    : "")
                                }
                                onClick={() => openVideo(pImage, idx)}
                              >
                                <CustomImage
                                  // @ts-ignore
                                  src={getThumIcon(pImage?.video_url)}
                                  alt={pImage?.name}
                                  title={pImage?.name}
                                  height="88px"
                                  width="88px"
                                />
                              </div>
                            )
                        )}
                      </div>
                      <button
                        onClick={handleRightClick}
                        className="btn btn-slider btn-next"
                      >
                        <i className="jkm-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                  {/* <ImageZoom
                    src={
                      selectedImage?.path
                        ? selectedImage?.path
                        : IMAGE_PATH.noImagePng
                    }
                    imgWidth={imgWidth}
                    imgHeight={imgHeight}
                    x={x}
                    y={y}
                    showMagnifier={showMagnifier}
                  /> */}
                  <div className="details-right">
                    <h3 className="product-name">{productDetails?.product?.title}</h3>
                    <div className="review-section">
                      <div className="rating-section">
                        <CustomRatingViews
                          ratingCounts={totalRatingCount || 0}
                          type={type}
                        />
                        <div className="rating-count">
                          <a>{totalReviewCount ?? 0} Reviews</a>
                        </div>
                      </div>
                      <div className="social-links-group">
                        <SocialShare details={`${productDetails?.product?.title}`} type={1} />
                      </div>
                    </div>
                    {
                      isShowProductDetails && productDetails?.sku && (
                        <div className="sku-section">
                          <span>SKU Code : {productDetails?.sku}</span>
                        </div>
                      )
                    }
                    {showPrice ? (
                      <div className="price-section">
                        {
                          productDetails?.price_breakup?.total_price > 0 && (
                            <strong className="special-price">
                              {currencySymbol}
                              {
                                Math
                                  .round(productDetails?.price_breakup?.total_price)
                                  ?.toLocaleString(APPCONFIG.NUMBER_FORMAT_LANG)
                              }
                            </strong>
                          )
                        }
                        {
                          productDetails?.price_breakup?.is_discounted &&
                            productDetails?.price_breakup?.original_total_price > 0 ? (
                            <span className="old-price">
                              <strong
                                className="old-price"
                                style={{ marginLeft: "10px" }}
                              >
                                {currencySymbol}{" "}
                                {Math.round(
                                  productDetails?.price_breakup
                                    ?.original_total_price
                                )?.toLocaleString(APPCONFIG.NUMBER_FORMAT_LANG)}
                              </strong>
                            </span>
                          ) : (
                            <></>
                          )
                        }
                      </div>
                    ) : (
                      <></>
                    )}

                    {isShowProductDetails && details?.price_breakup?.is_fix_price !== 1 && <div className="product-options-section">
                      <div className="option-box">
                        <div className="details">
                          <strong>
                            <i className="icon jkm-gold-bars"></i>
                            {productDetails?.website_product_detail
                              ?.default_metal?.metal_purity_name ?? '' + " "}
                            {
                              productDetails?.website_product_detail
                                ?.default_metal?.metal_type_name ?? ''
                            }{" "}
                            {productDetails?.price_breakup?.net_weight ? ':' : ''}
                          </strong>
                          <p>
                            {
                              productDetails?.price_breakup?.net_weight?.toFixed(3)
                                ? `${Number(productDetails.price_breakup.net_weight).toFixed(3)} gm`
                                : ''
                            }
                            {(!getUserDetails() && isPriceDisplay && productDetails?.price_breakup?.total_metal_price > 0) ? (
                              `(${currencySymbol} ${Math.round(
                                productDetails?.price_breakup?.total_metal_price
                              )?.toLocaleString(APPCONFIG.NUMBER_FORMAT_LANG)})`
                            ) : (
                              <></>
                            )}
                          </p>
                        </div>
                      </div>
                      {productDetails?.website_product_detail?.diamond_details
                        ?.length > 0 ? (
                        <div className="option-box">
                          <div className="details">
                            <strong>
                              <i className="icon jkm-diamond-fill"></i>Diamond (ct) :
                            </strong>
                            {productDetails?.website_product_detail?.diamond_details.map(
                              (value, index) => (
                                <p key={index}>
                                  {value?.diamond_quality_name}{" "}
                                  {value?.diamond_shape_name}{" "}
                                  {value?.pcs + " pcs"} {Number(value?.carat).toFixed(3) + " ct"}
                                  {productDetails?.website_product_detail
                                    ?.diamond_details.length -
                                    1 >
                                    index
                                    ? ","
                                    : null}
                                  {(
                                    !getUserDetails() &&
                                    isPriceDisplay &&
                                    productDetails?.website_product_detail?.diamond_details.length - 1 == index &&
                                    productDetails?.price_breakup?.total_diamond_price > 0
                                  ) ? (
                                    `  (${currencySymbol} ${Math.round(
                                      productDetails?.price_breakup
                                        ?.total_diamond_price
                                    )?.toLocaleString(
                                      APPCONFIG.NUMBER_FORMAT_LANG
                                    )})`
                                  ) : (
                                    <></>
                                  )}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                      {isShowProductDetails && productDetails?.website_product_detail
                        ?.color_stone_details?.length > 0 ? (
                        <div className="option-box">
                          <div className="details">
                            <strong>
                              <i className="icon jkm-stone"></i>Color Stone
                              (ct)
                            </strong>
                            {productDetails?.website_product_detail?.color_stone_details.map(
                              (value, index) => (
                                <p key={index}>
                                  {value?.color_stone_name}{" "}
                                  {value?.color_stone_shape_name}{" "}
                                  {value?.pcs + " pcs"} {Number(value?.carat).toFixed(3) + " ct"}
                                  {productDetails?.website_product_detail
                                    ?.color_stone_details.length -
                                    1 >
                                    index
                                    ? ","
                                    : null}
                                  {
                                    (
                                      !getUserDetails() &&
                                      isPriceDisplay &&
                                      productDetails?.price_breakup?.total_color_stone_price > 0
                                    ) ? (
                                      ` (${currencySymbol} ${Math.round(
                                        productDetails?.price_breakup
                                          ?.total_color_stone_price
                                      )?.toLocaleString(
                                        APPCONFIG.NUMBER_FORMAT_LANG
                                      )})`
                                    ) : (
                                      <></>
                                    )}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>}

                    <form className="option-form">
                      <div className="form-wrap">
                        {productDetails?.product_size_list.length ? (
                          <div className="form-group">
                            <label>Size</label>
                            <select
                              className="custom-select"
                              onChange={(e) => onSizeChange(e.target.value)}
                              value={defaultSize}
                            >
                              <option value="" className="placeholder">
                                Select Size
                              </option>
                              {productDetails?.product_size_list?.map(
                                (sizeList, eInd) => (
                                  <option key={eInd} value={sizeList?._id}>
                                    {sizeList?.name}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                        ) : (
                          <> </>
                        )}

                        <div className="form-group">
                          <label>Qty</label>
                          <div className="qty">
                            <span
                              id="input_plus"
                              onClick={() => {
                                itemQty + 1 <=
                                  Number(
                                    details?.website_product_detail
                                      ?.max_order_qty
                                  ) ? setItemQty(itemQty + 1) : showError(`The quantity exceeds the maximum quantity is ${details?.website_product_detail
                                    ?.max_order_qty} to buy this product.`)
                              }}
                              className="arrow-up"
                            >
                              <i className="jkm-arrow-top"></i>
                            </span>
                            <span
                              id="input_minus"
                              onClick={() => {
                                itemQty - 1 >=
                                  Number(
                                    details?.website_product_detail
                                      ?.min_order_qty
                                      ? details?.website_product_detail
                                        ?.min_order_qty
                                      : 1
                                  ) ? setItemQty(itemQty - 1) : showError(`Please add minimum quantity ${details?.website_product_detail?.min_order_qty} to buy this product or add valid quantity.`);
                              }}
                              className="arrow-down"
                            >
                              <i className="jkm-arrow-down"></i>
                            </span>
                            <input
                              type="text"
                              value={itemQty}
                              className="form-control"
                              min={
                                details?.website_product_detail?.min_order_qty
                                  ? +details?.website_product_detail
                                    ?.min_order_qty
                                  : 1
                              }
                              max={
                                details?.website_product_detail?.max_order_qty
                              }
                              onChange={(e) => {
                                Number.isFinite(Number(e.target.value)) &&
                                  setItemQty(Number(e.target.value));
                              }}
                              onBlur={(e) =>
                                handleOnChangeProductQty(
                                  Number(e.target.value),
                                  +details?.website_product_detail
                                    ?.max_order_qty!,
                                  details?.website_product_detail?.min_order_qty
                                    ? +details?.website_product_detail
                                      ?.min_order_qty
                                    : 1
                                )
                              }
                            />
                          </div>
                        </div>
                      </div>
                      {(productDetails?.not_sure_size &&
                        productDetails?.not_sure_size?.is_size_link !== 0) ||
                        productDetails?.not_sure_size?.sizefile?.path ? (
                        <Link
                          href={
                            productDetails?.not_sure_size?.is_size_link
                              ? productDetails?.not_sure_size?.size_link
                              : productDetails?.not_sure_size?.sizefile?.path
                          }
                          target="_blank"
                        >
                          <a target="_blank" className="not-sure-link">
                            Not sure of the Size?
                          </a>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </form>

                    {productDetails?.website_product_detail?.is_available_for_order === 1 ? (
                      <>
                        <button className="btn btn-primary btn-addtocart" onClick={addCart}>
                          Add to Cart
                        </button>

                        <button
                          className="btn btn-secondary btn-buynow"
                          onClick={() => {
                            if (isB2BUser) showPlaceInquiryModal();
                            else redirectNCart();
                          }}
                        >
                          {isB2BUser ? "Place your inquiry now" : "Buy now"}
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                </div>
              </section>
            </main>
          </div>
        ) : (
          <></>
        )}
      </Modal>
    </>
  );
};
export default IQuickView1;
