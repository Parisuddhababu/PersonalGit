import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath, getUserDetails, getVideoId, getDymanicBgTagColorAndImg } from "@util/common";
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
// import ImageZoom from "@components/Hooks/ImageZoom/ImageZoom";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import { IAddtoCart } from "@components/Hooks/addtoCart";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import usePriceDisplay from "@components/Hooks/priceDisplay";
import SocialShare from "@components/SocialShare/SocialShare";
import { useRouter } from "next/router";
import useReviewRatings from "@components/Hooks/ReviewRatings/useReviewRatings";
import CustomRatingViews from "@components/customRatings/customRatingViews";
import Link from "next/link";
import useSliderHook from "@components/Hooks/sliderHook";
import { IImageVideo } from "@type/Pages/productDetails";
import { IProductDetailsData } from "@type/Pages/Products";
import Cookies from "js-cookie";
import { uuid } from "@util/uuid";
import { useToast } from "@components/Toastr/Toastr";

const QuickView2 = ({ onClose, slug, isModal, product_tags_detail, type }: IQuickView1Props) => {
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
  const [videoLink, setVideoLink] = useState<any>(null);
  const [productDetails, setProductDetails] =
    useState<IProductDetailsData | null>(null);
  const { totalReviewCount, totalRatingCount, getReviewRatings } =
    useReviewRatings({
      product_id: productDetails?.website_product_detail?.product_id as string,
      callApi: true,
    });
  const isB2BUser =
    parseInt(Cookies.get("isB2BUser") ?? "") === 1 ? true : false;
  const showPrice =
    parseInt(Cookies.get("showPrice") ?? "") === 1 ? true : false;

  const { addProductInCompare, getCompareProductList } = useCompareProduct();
  const reference = useRef<HTMLDivElement[] | null[]>([]);
  const {
    selectedImageIndex,
    selectedImage,
    handleRightClick,
    handleLeftClick,
    handleSelectedImageChange,
  } = useCustomImageSlider({
    images: productDetails?.images || [],
    refrence: reference,
  });
  const isShowProductDetails = parseInt(Cookies.get("isShowProductDetails") ?? '') === 1 ? true : false;

  const currencySymbol = useCurrencySymbol();
  const { isPriceDisplay } = usePriceDisplay();
  const {
    mouseEnter,
    onMouseMove,
    mouseLeave,
    imgWidth,
    imgHeight,
    x,
    y,
    // showMagnifier,
  } = useZoomImageHook();
  const { adddtoCartProduct } = useAddtoCart();
  const Router = useRouter();
  const [legthOfSpecificArrayChunk] = useState(4);
  const [isAcceptebleQty, setIsAcceptebleQty] = useState<boolean>(true);
  const [errorMessage, setErrorMesage] = useState<string>("");
  const { showError } = useToast();

  useEffect(() => {
    setProductDetails(details);
  }, [details]);

  const {
    slicedData,
    SliderButton,
    arrayIndex,
    splitDataArray,
    //@ts-ignore
  } = useSliderHook(
    productDetails?.images,
    legthOfSpecificArrayChunk
  );

  useEffect(() => {
    if (productDetails?.images) {
      splitDataArray(productDetails?.images || []);
    }
    // eslint-disable-next-line
  }, [productDetails?.images]);

  const showErrorHandler = () => {
    showError(errorMessage)
  }

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
        Router.push("/guest-user-cart/");
      }
    } else {
      showErrorHandler()
    }
  };

  const onSizeChange = async (id: string) => {
    setDefaultSize(id);
    const updatedData = (await updateDefaultSizeData(
      id,
      productDetails
    )) as IProductDetailsData;
    setProductDetails(updatedData);
  };

  const showPlaceInquiryModal = () => {
    if (getUserDetails()) redirectNCart();
    else Router.replace("/sign-in");
  };

  const openVideo = (data: any) => {
    const { video_url } = data;
    const videoId = getVideoId(video_url);
    setVideoLink(videoId);
    handleSelectedImageChange(slicedData.flat().findIndex((ele: any) => ele?.video_url === video_url));
  };

  const getThumIcon = (url: string) => {
    const videoId = getVideoId(url);
    return (url && videoId) ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : IMAGE_PATH.noImagePng
  }

  const getProductTagBGColorAndImage = (tagTitle: string) => {
    const bgTagColorAndImg = getDymanicBgTagColorAndImg(tagTitle, product_tags_detail)
    return bgTagColorAndImg
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

  useEffect(() => {
    SliderButton("", Math.floor(selectedImageIndex / 4))
  }, [selectedImageIndex, SliderButton])

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={APPCONFIG.STYLE_BASE_PATH_PAGES + "quick-view.min.css"}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.productQuickView2)}
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
                    <div className="details-left-container">
                      <div className="product-thumbnail">
                        {arrayIndex !== 0 && (
                          <button
                            className="btn btn-slider btn-up"
                            aria-label="btn up"
                            onClick={() =>
                              SliderButton("LEFT", arrayIndex - 1)
                            }
                          >
                            <i className="jkms2-arrow-right"></i>
                          </button>
                        )}

                        {/* <button aria-label="btn up" className="btn btn-slider btn-up"
                                ><i className="jkms2-arrow-right"></i></button> */}
                        {slicedData[arrayIndex] &&
                          slicedData[arrayIndex]?.map(
                            (pImage: IImageVideo, idx: number) =>
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
                                  onClick={() => handleSelectedImageChange(slicedData.flat().findIndex((ele: any) => ele?._id === pImage?._id))}
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
                                    (selectedImage?.video_url ==
                                      pImage.video_url
                                      ? " active"
                                      : "")
                                  }
                                  onClick={() => openVideo(pImage)}
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
                        {/* <button aria-label="btn down" className="btn btn-slider btn-down" ><i className="jkms2-arrow-right"></i></button> */}
                        {slicedData[arrayIndex]?.length >= 4 && (
                          <button
                            aria-label="btn down"
                            className="btn btn-slider btn-down"
                            onClick={() =>
                              SliderButton("RIGHT", arrayIndex + 1)
                            }
                          >
                            <i className="jkms2-arrow-right"></i>
                          </button>
                        )}
                      </div>
                      <div className="product-slider-box">
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
                        <button
                          aria-label="btn prev"
                          className="btn btn-slider btn-prev"
                          onClick={handleLeftClick}
                        >
                          <i className="jkms2-arrow-right"></i>
                        </button>
                        <div
                          className="img-wrapper"
                          style={{
                            backgroundImage: `url('${selectedImage?.path}')`,
                            backgroundSize: `${imgWidth * APPCONFIG.IMAGE_ZOOM.zoomLevel
                              }px ${imgHeight * APPCONFIG.IMAGE_ZOOM.zoomLevel
                              }px`,
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
                              src={`https://www.youtube.com/embed/${videoLink}`}
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
                                type="image/png"
                              />
                              <img
                                src={`${selectedImage?.path
                                  ? selectedImage?.path
                                  : IMAGE_PATH.noImagePng
                                  }?w=${728}`}
                                alt={
                                  selectedImage?.name
                                    ? selectedImage?.name
                                    : details?.title
                                }
                                title={
                                  selectedImage?.name
                                    ? selectedImage?.name
                                    : details?.title
                                }
                                height={"660px"}
                                width={"728px"}
                                onMouseEnter={(e) => mouseEnter(e)}
                                onMouseMove={(e) => onMouseMove(e)}
                                onMouseLeave={() => mouseLeave()}
                              />
                            </picture>
                          )}
                        </div>
                        <button
                          aria-label="btn next"
                          className="btn btn-slider btn-next"
                          onClick={handleRightClick}
                        >
                          <i className="jkms2-arrow-right"></i>
                        </button>
                      </div>
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
                    <h3>{productDetails?.product?.title}</h3>
                    <div className="review-section">
                      <div className="rating-section">
                        <div className="star-rating">
                          <CustomRatingViews
                            ratingCounts={totalRatingCount || 0}
                            type={type}
                          />
                        </div>
                        <a className="rating-count">
                          {totalReviewCount ?? 0} Reviews
                        </a>
                      </div>
                      <div className="social-links-group">
                        <SocialShare
                          details={`${productDetails?.product?.title}`}
                          type={2}
                        />
                      </div>
                    </div>
                    {
                      isShowProductDetails &&
                      <div className="sku-section">
                        <span>SKU Code : {productDetails?.product?.sku}</span>
                      </div>
                    }

                    {showPrice ? (
                      <div className="price-section">
                        <div className="price">
                          <strong className="special-price">
                            {currencySymbol}{" "}
                            {Math.round(
                              productDetails?.price_breakup?.total_price
                            )?.toLocaleString(APPCONFIG.NUMBER_FORMAT_LANG)}
                          </strong>

                          {/* ####  Comment Due to Product Tag Changes #### 
                          {productDetails?.price_breakup?.is_discounted ? (
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
                          )} */}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                    <div className="button-group-section">
                      <div className="access-link">
                        <a
                          onClick={() => addtoWishList(productDetails)}
                          className={`link-access ${productDetails?.is_in_wishlist ? "active" : ""
                            }`}
                        >
                          <i
                            className={`icon jkms2-heart ${productDetails?.is_in_wishlist ? "active" : ""
                              }`}
                          ></i>
                        </a>
                        <a
                          className={`link-access ${getCompareProductList()?.some(
                            (item: ICompareProductsState) =>
                              item.product_id ===
                              productDetails?.website_product_detail
                                ?.product_id
                          )
                            ? " active"
                            : ""
                            }`}
                          onClick={() =>
                            addProductInCompare(
                              productDetails?.title,
                              productDetails?.website_product_detail?.product_id
                            )
                          }
                          title={
                            getCompareProductList()?.some(
                              (item: ICompareProductsState) =>
                                item.product_id ===
                                productDetails?.website_product_detail
                                  ?.product_id
                            )
                              ? "Remove from compare"
                              : "Add to compare"
                          }
                        >
                          <i
                            className={`icon jkms2-compare ${getCompareProductList()?.some(
                              (item: ICompareProductsState) =>
                                item.product_id ===
                                productDetails?.website_product_detail
                                  ?.product_id
                            )
                              ? " active jkms2-compare-fill"
                              : ""
                              }`}
                          ></i>
                        </a>
                      </div>
                    </div>
                    {isShowProductDetails && details?.price_breakup?.is_fix_price !== 1 && <div className="product-options-section">
                      {
                        (
                          productDetails?.website_product_detail?.default_metal?.
                            metal_purity_name || productDetails?.website_product_detail
                              ?.default_metal?.metal_type_name || productDetails?.website_product_detail
                                ?.default_metal?.weight || productDetails?.price_breakup?.total_metal_price
                        ) ?

                          <div className="option-box">
                            {(productDetails?.website_product_detail?.default_metal?.
                              metal_purity_name || productDetails?.website_product_detail
                                ?.default_metal?.metal_type_name) && (
                                <strong>
                                  <i className="icon jkms2-gold-bars"></i>
                                  {productDetails?.website_product_detail?.default_metal?.
                                    metal_purity_name + " "}
                                  {
                                    productDetails?.website_product_detail
                                      ?.default_metal?.metal_type_name
                                  }{" "}
                                </strong>
                              )}
                            <p>
                              {
                                productDetails?.website_product_detail
                                  ?.default_metal?.weight
                              }{" "}
                              {productDetails?.website_product_detail?.default_metal?.weight ? " gm" : " "}
                              {((getUserDetails() ||
                                (!getUserDetails() && isPriceDisplay)) && productDetails?.price_breakup?.total_metal_price) ? (
                                `(${currencySymbol} ${Math.round(
                                  productDetails?.price_breakup?.total_metal_price
                                )?.toLocaleString(APPCONFIG.NUMBER_FORMAT_LANG)})`
                              ) : (
                                <></>
                              )}
                            </p>
                          </div> : <></>}
                      {productDetails?.website_product_detail?.diamond_details
                        ?.length > 0 ? (
                        <div className="option-box">
                          {/* <div className="details"> */}
                          <strong>
                            <i className="icon jkms2-diamond-fill"></i>Diamond
                            (ct) :
                          </strong>
                          {productDetails?.website_product_detail?.diamond_details.map(
                            (value, index) => (
                              <p key={index}>
                                {value?.diamond_quality_name}{" "}
                                {value?.diamond_shape_name}{" "}
                                {value?.pcs + " pcs"} {value?.carat + " ct"}
                                {productDetails?.website_product_detail
                                  ?.diamond_details.length -
                                  1 >
                                  index
                                  ? ","
                                  : null}
                                {getUserDetails() ||
                                  (!getUserDetails() &&
                                    isPriceDisplay &&
                                    productDetails?.website_product_detail
                                      ?.diamond_details.length -
                                    1 ==
                                    index) ? (
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
                          {/* </div> */}
                        </div>
                      ) : (
                        <></>
                      )}
                      {productDetails?.website_product_detail
                        ?.color_stone_details?.length > 0 ? (
                        <div className="option-box">
                          {/* <div className="details"> */}
                          <strong>
                            <i className="icon jkms2-stone"></i>Color Stone (ct)
                          </strong>
                          {productDetails?.website_product_detail?.color_stone_details.map(
                            (value, index) => (
                              <p key={index}>
                                {value?.color_stone_name}{" "}
                                {value?.color_stone_shape_name}{" "}
                                {value?.pcs + " pcs"} {value?.carat + " ct"}
                                {productDetails?.website_product_detail
                                  ?.color_stone_details.length -
                                  1 >
                                  index
                                  ? ","
                                  : null}
                                {getUserDetails() ||
                                  (!getUserDetails() && isPriceDisplay) ? (
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
                          {/* </div> */}
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
                            <span id="input_plus" className="arrow-up">
                              <i
                                className="jkms2-arrow-top"
                                onClick={() => {
                                  itemQty + 1 <=
                                    Number(
                                      details?.website_product_detail
                                        ?.max_order_qty
                                    )
                                    ? setItemQty(itemQty + 1)
                                    : showError(
                                      `The quantity exceeds the maximum quantity is ${details?.website_product_detail?.max_order_qty} to buy this product.`
                                    );
                                }}
                              ></i>
                            </span>
                            <span id="input_minus" className="arrow-down">
                              <i
                                className="jkms2-arrow-down"
                                onClick={() => {
                                  itemQty - 1 >=
                                    Number(
                                      details?.website_product_detail
                                        ?.min_order_qty
                                        ? details?.website_product_detail
                                          ?.min_order_qty
                                        : 1
                                    )
                                    ? setItemQty(itemQty - 1)
                                    : showError(
                                      `Please add minimum quantity ${details?.website_product_detail?.min_order_qty} to buy this product or add valid quantity.`
                                    );
                                }}
                              ></i>
                            </span>
                            <input
                              type="text"
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
                              value={itemQty}
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
                          className="not-sure-link"
                        >
                          <a target="_blank" classNamenot-sure-link>
                            Not sure of the Size?
                          </a>
                        </Link>
                      ) : (
                        <></>
                      )}
                    </form>
                    {productDetails?.website_product_detail
                      ?.is_available_for_order === 1 ? (
                      <div className="button-section">
                        <button
                          className="btn btn-primary btn-addtocart"
                          onClick={addCart}
                        >
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
                      </div>
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
export default QuickView2;
