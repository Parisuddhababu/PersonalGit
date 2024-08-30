import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import {
  covertPriceInLocalString,
  getParseUser,
  getTypeBasedCSSPath,
  getUserDetails,
  getVideoId,
  getDymanicBgTagColorAndImg
} from "@util/common";
import Head from "next/head";
import { IWebsiteProductDetailsProps } from "@templates/ProductDetails/components/WebsiteProductDetail";
import { useEffect, useRef, useState } from "react";
import { IImageVideo, IProductDetails } from "@type/Pages/productDetails";
import useCompareProduct from "@components/Hooks/compareProduct/useCompareProduct";
import { ICompareProductsState } from "@components/Hooks/compareProduct";
import useCustomImageSlider from "@components/Hooks/products/useCustomImageSlider";
import { IMAGE_PATH } from "@constant/imagepath";
import useZoomImageHook from "@components/Hooks/ImageZoom/ImageZoomHooks";
import CustomImage from "@components/CustomImage/CustomImage";
// import ImageZoom from "@components/Hooks/ImageZoom/ImageZoom";
import SocialShare from "@components/SocialShare/SocialShare";
import Wrapper from "@components/Wrapper";
import useCheckPincode from "@components/Hooks/checkPincode";
import ViewPriceBreakup from "@templates/ProductDetails/components/ViewPriceBreakup";
import CustomiseProductPopup from "@templates/ProductDetails/components/customiseProduct";
import useReviewRatings from "@components/Hooks/ReviewRatings/useReviewRatings";
import CustomRatingViews from "@components/customRatings/customRatingViews";
import APPCONFIG from "@config/app.config";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import useAddtoWishList from "@components/Hooks/addtoWishList/addtoWishList";
import {
  IAddtoWishList,
  IRemoveWishList,
} from "@components/Hooks/addtoWishList";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import usePriceDisplay from "@components/Hooks/priceDisplay";
import useCustomiseProductDetails from "@components/Hooks/customiseProductDetails/useCustomiseProductDetails";
import { getCurrentWishListItems } from "@util/addGuestCartData";
import { useDispatch, useSelector } from "react-redux";
import { IImage, IReduxStore, ISignInReducerData } from "@type/Common/Base";
import { IAddtoCart } from "@components/Hooks/addtoCart";
import { useRouter } from "next/router";
import Loader from "@components/customLoader/Loader";
import useSliderHook from "@components/Hooks/sliderHook";
import Link from "next/link";
import { useToast } from "@components/Toastr/Toastr";
import Cookies from "js-cookie";
import { uuid } from "@util/uuid";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import { Action_SetProductDetails } from "src/redux/priceDisplay/priceDisplayAction";

const WebsiteProductDetails2 = (props: IWebsiteProductDetailsProps) => {
  const showPrice = parseInt(Cookies.get("showPrice") ?? '') === 1 ? true : false;
  const [details, setDetails] = useState<IProductDetails>(props?.data);
  const [cartQty, setCartQty] = useState<number>(1);
  const { addProductInCompare, getCompareProductList } = useCompareProduct();
  const reference = useRef<HTMLDivElement[] | null[]>([]);
  const [isAcceptebleQty, setIsAcceptebleQty] = useState<boolean>(true)
  const { showError } = useToast();
  const [errorMessage, setErrorMesage] = useState<string>("");
  const [allImgAndVideo, setAllImgAndVideo] = useState<IImage[]>([])
  const {
    selectedImageIndex,
    selectedImage,
    handleRightClick,
    handleLeftClick,
    handleSelectedImageChange,
  } = useCustomImageSlider({
    images: allImgAndVideo || [],
    refrence: reference,
  });
  const currencySymbol = useCurrencySymbol();
  const { isPriceDisplay } = usePriceDisplay();
  const { adddtoCartProduct, addCartCustomiseData } = useAddtoCart();
  const { adddtoWishListProduct, removeWishListProduct } = useAddtoWishList();
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
  const phoneData = useSelector((state: IReduxStore) => state);
  const isB2BUser = parseInt(Cookies.get("isB2BUser") ?? '') === 1 ? true : false;
  const [pincode, setPincode] = useState<string>("");
  const { checkPincodeDelivery, pinCodeMsgTimer, pinCodeMsg, isLoading } =
    useCheckPincode();
  const [isPriceBreakupView, setPriceBreakupView] = useState<boolean>(false);
  const [isCustomiseView, setCustomiseView] = useState<boolean>(false);
  const { totalReviewCount, totalRatingCount, getReviewRatings } =
    useReviewRatings({
      product_id: props?.data?.website_product_detail?.product_id,
      callApi: true,
    });
  const [customDetails, setCustomDetails] = useState({});
  const [customData, setCustomData] = useState({});
  const loaderData = useSelector((state) => state);
  const [phone, setPhone] = useState('');
  const [generalConNumber, setGeneralConNumber] = useState('')
  const [generalCountryCode, setGeneralCountryCode] = useState('')
  const [reviewCount, setReviewCount] = useState<number | null>(
    totalReviewCount
  );
  const [ratingCount, setRatingCount] = useState<number | null>(
    totalRatingCount
  );
  const [sizeId, setsizeId] = useState<any>(
    details?.website_product_detail?.default_size_details?.default_size_id
  );
  const [defaultSizeId, setDefaultSizeId] = useState<any>(
    details?.website_product_detail?.default_size_details?.default_size_id ??
    details?.product_size_list?.[0]?._id
  );
  // const [defaultId] = useState<any>(details?.product_size_list?.[0]?._id);
  const [videoLink, setVideoLink] = useState<any>(null);
  const signIndata = useSelector((state: ISignInReducerData) => state);
  const [productCount, setProductCount] = useState(false);
  const isShowProductDetails = parseInt(Cookies.get("isShowProductDetails") ?? '') === 1 ? true : false;
  const [Remark, setRemark] = useState<string>("");
  // const { getCustomiseProductData } = useCustomiseProductDetails();
  // const [callPriceBreakupFirst, setCallPriceBreakupFirst] =
  //   useState<boolean>(true);

  const Router = useRouter();
  const dispatch = useDispatch();
  const {
    slicedData,
    SliderButton,
    arrayIndex,
    // splitDataArray,
    //@ts-ignore
  } = useSliderHook(details?.website_product_detail?.images || [], 4);

  useEffect(() => {
    dispatch(Action_SetProductDetails(details))
  }, [details])

  useEffect(() => {
    getWishList();
    setDetails(props?.data);
    setCartQty(props?.data?.website_product_detail?.min_order_qty ? +props?.data?.website_product_detail?.min_order_qty : 1)
    // setDefaultId(props?.data?.product_size_list?.[0]?._id);
    setDefaultSizeId(
      props?.data?.website_product_detail?.default_size_details?.default_size_id ??
      props?.data?.product_size_list?.[0]?._id
    );
    setsizeId(
      props?.data?.website_product_detail?.default_size_details?.default_size_id
    );

    const { images, video } = props?.data?.website_product_detail || {};

    if (images?.length > 0 || video) {
      const videos = [...(images || [])]
      if (video?.path) {
        videos.push(video)
      }
      setAllImgAndVideo(videos.filter(Boolean));
    }

    getProductDetailCount();
    // eslint-disable-next-line
  }, [props]);

  const getProductDetailCount = () => {
    if (productCount)
      return
    const { param1 } = Router.query;
    if (param1) {
      setProductCount(true)
      pagesServices.postPage(APICONFIG.POST_PRODUCT_DETAIL_COUNT, {
        slug: param1
      })
    }
  }

  useEffect(() => {
    getUpdateReviewCount();
    // eslint-disable-next-line
  }, [signIndata?.signIn?.review_count]);

  useEffect(() => {
    setPhone(phoneData?.whatsAppReducer?.whatsAppNumber ?? '');
    setGeneralConNumber(phoneData?.whatsAppReducer?.generalConNumber ?? '')
    setGeneralCountryCode(phoneData?.whatsAppReducer?.generalCountryCode ?? '')
  }, [phoneData]);

  const openWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send/?phone=${phone}&text=` +
      encodeURIComponent(phoneData.whatsAppReducer.whatsappFeed)
    );
  };

  const getUpdateReviewCount = async () => {
    const response = await getReviewRatings();
    setReviewCount(response?.data?.product_total_reviews);
    setRatingCount(response?.data?.product_total_ratting);
  };

  const getWishList = async () => {
    if (!getUserDetails()) {
      const gueatWishlist = getCurrentWishListItems();
      const itemArray = gueatWishlist.map(
        (ele: IAddtoWishList) => ele?.item_id
      );
      const result = itemArray?.some(
        (ele: string) => ele == details?.price_breakup?.product_id
      );
      setDetails({ ...details, ["is_in_wishlist"]: result ? 1 : 0 });
    }
  };

  const getTotalDiamondCarat = () => {
    let totalCarat = 0 as number;
    details?.website_product_detail?.diamond_details.forEach((ele) => {
      // @ts-ignore
      totalCarat =
        // @ts-ignore
        parseFloat(totalCarat as number) + parseFloat(ele?.carat as number);
    });
    return covertPriceInLocalString(totalCarat);
  };
  const { sizeChange } = useCustomiseProductDetails();

  const getTotalColorStone = () => {
    let totalColorCarat = 0;
    details?.website_product_detail?.color_stone_details?.forEach((ele) => {
      totalColorCarat =
        // @ts-ignore
        parseFloat(totalColorCarat as number) +
        // @ts-ignore
        parseFloat(ele?.carat as number);
    });
    return covertPriceInLocalString(totalColorCarat);
  };

  const addtoWishList = async (data: IProductDetails) => {
    const getUserDetails: any = getParseUser();
    if (!data?.is_in_wishlist) {
      let wishListData = {
        type: APPCONFIG.DEFAULT_QTY_TYPE,
        account_id: getUserDetails?.user_detail?.register_from as string,
        item_id: data?.price_breakup?.product_id,
      };
      const response = await adddtoWishListProduct(
        wishListData as IAddtoWishList
      );
      if (response?.meta?.status_code == 201) {
        setDetails({ ...details, ["is_in_wishlist"]: 1 });
      } else getWishList();
    } else {
      let arr = [];
      arr.push(data?.price_breakup?.product_id);
      let wishListData = {
        account_id: getUserDetails?.user_detail?.register_from as string,
        item_id: arr,
      };
      const response = await removeWishListProduct(
        wishListData as IRemoveWishList
      );
      // @ts-ignore
      if (response?.meta?.status_code == 200) {
        setDetails({ ...details, ["is_in_wishlist"]: 0 });
      } else getWishList();
    }
  };

  useEffect(() => {
    if (customDetails) {
      setDetails({ ...details, ...customDetails });
    }
    // eslint-disable-next-line
  }, [customDetails]);

  useEffect(() => {
    if (defaultSizeId != sizeId) getPriceBasedonUpdateSize(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeId]);

  const getPriceBasedonUpdateSize = async () => {
    let data;
    let newData;
    let oldData = { ...props?.data };
    data = {
      new_size_id: sizeId,
      product_id: details?.website_product_detail?._id,
    };
    if (Object.entries(customData).length) {
      let temp = { ...(customData as any) };
      delete temp.new_size_id;
      delete temp.product_id;
      oldData = { ...props?.data };
      newData = { data: { ...data, ...temp }, oldData: oldData };
    } else {
      newData = { data: data, oldData: oldData };
    }
    if (newData?.data?.new_size_id) {
      const response = await sizeChange(newData as any);
      setDefaultSizeId("");
      setDetails({ ...details, ...response });
    }
  };

  const customProductDetails = (data: any) => {
    setCustomDetails(data);
  };

  const customProductData = (data: any) => {
    setCustomData(data);
  };

  const setNewId = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setsizeId(event?.target?.value);
  };

  const addtoCart = () => {
    if (isAcceptebleQty) {
      if (details?.website_product_detail?.is_available_for_order === 0) {
        showError('Product is not available for order');
        return
      }
      let obj: IAddtoCart = {
        item_id: details?.price_breakup?.website_product_id,
        qty: cartQty,
        remark: Remark,
      };

      if (Object.entries(customData).length) {
        obj['net_weight'] = details?.price_breakup?.net_weight;
        //@ts-ignore
        addCartCustomiseData({
          ...obj, ...customData,
          new_size_id: sizeId,
          size_id: sizeId
        });
      }
      else {
        obj["size_id"] = sizeId;
        obj['net_weight'] = details?.price_breakup?.net_weight;
        adddtoCartProduct(obj as IAddtoCart);
      }
      setCartQty(details?.website_product_detail?.min_order_qty ? +details?.website_product_detail?.min_order_qty : 1);
    } else {
      showErrorHandler();
    }
  };

  const redirectNCart = async () => {
    if (isAcceptebleQty) {
      if (details?.website_product_detail?.is_available_for_order === 0) {
        showError('Product is not available for order');
        return
      }
      if (getUserDetails()) {
        let obj: IAddtoCart = {
          item_id: details?.price_breakup?.website_product_id,
          qty: cartQty,
        };
        if (Object.entries(customData).length) {
          obj['net_weight'] = details?.price_breakup?.net_weight;
          //@ts-ignore
          await addCartCustomiseData({
            ...obj, ...customData,
            new_size_id: sizeId,
            size_id: sizeId
          });
        }
        else {
          // if (sizeId != defaultId) obj["size_id"] = sizeId;
          // await adddtoCartProduct({
          //   item_id: details?.price_breakup?.website_product_id as string,
          //   qty: cartQty,
          // });
          obj["size_id"] = sizeId;
          obj['net_weight'] = details?.price_breakup?.net_weight;
          await adddtoCartProduct(obj as IAddtoCart);
        }
        Router.push("/cart/list/");
      } else {
        addtoCart();
        Router.push("/cart/list/");
      }
    } else {
      showErrorHandler();
    }
  };

  const showErrorHandler = () => {
    showError(errorMessage)
  }

  const scrollToReview = () => {
    if (reviewCount) {
      const reviewElement = document.getElementById("review");
      window.scrollTo({
        behavior: "smooth",
        top: reviewElement?.offsetTop,
      });
    }
  };

  const openVideo = (data: any) => {
    const { video_url } = data;
    const videoId = getVideoId(video_url);
    setVideoLink(videoId);
    handleSelectedImageChange(slicedData.flat().findIndex((ele: any) => ele?.video_url === video_url));
  };

  // const initialPriceBreakup = () => {
  //   const customise = {
  //     diamond_quality_id:
  //       details?.website_product_detail?.diamond_details?.[0]
  //         ?.diamond_quality_id,
  //     color_stone_id:
  //       details?.website_product_detail?.color_stone_details?.[0]
  //         ?.color_stone_id,
  //     hall_mark_charge: details?.price_breakup.is_hallmark.toString(),
  //     product_id: details?.website_product_detail?._id,
  //     metal_purity_id:
  //       details?.website_product_detail?.default_metal?.metal_purity_id,
  //     metal_type_id:
  //       details?.website_product_detail?.default_metal?.metal_type_id,
  //   };
  //   if (
  //     !details?.website_product_detail?.color_stone_details?.[0]?.color_stone_id
  //   ) {
  //     // @ts-ignore
  //     delete customise.color_stone_id;
  //   }
  //   if (
  //     !details?.website_product_detail?.diamond_details?.[0]?.diamond_quality_id
  //   ) {
  //     // @ts-ignore
  //     delete customise.diamond_quality_id;
  //   }
  //   const response = getCustomiseProductData(details, { ...customise });
  //   // @ts-ignore
  //   customProductDetails(response?.newData as any);
  //   // @ts-ignore
  //   // customProductData(response?.customiseObj as any);
  // };

  // useEffect(() => {
  //   if (callPriceBreakupFirst && details) {
  //     initialPriceBreakup();
  //     setCallPriceBreakupFirst(false);
  //   }
  //   // eslint-disable-next-line
  // }, [details]);

  const handleOnChangeProductQty = (addedQty: number, maxQty: number, minQty: number) => {
    setCartQty(addedQty)
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

  const getThumIcon = (url: string) => {
    const videoId = getVideoId(url);
    return (url && videoId) ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : IMAGE_PATH.noImagePng
  }

  const getProductTagBGColorAndImage = (tagTitle: string) => {
    const bgTagColorAndImg = getDymanicBgTagColorAndImg(tagTitle, props?.product_tags_detail)
    return bgTagColorAndImg
  }

  const showPlaceInquiryModal = () => {
    if (getUserDetails()) redirectNCart();
    else Router.replace("/sign-in");
  }

  useEffect(() => {
    SliderButton("", Math.floor(selectedImageIndex / 4))
  }, [selectedImageIndex])

  return (
    <>
      {isLoading && <Loader />}
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.prodDetailComponent)}
        />
      </Head>
      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState && <Loader />}
      <section className="detils-wrapper">
        <div className="container">
          <div className="details-left">
            <div className="details-left-container">
              <div className="product-thumbnail">
                {arrayIndex !== 0 && (
                  <button
                    className="btn btn-slider btn-up"
                    aria-label="btn up"
                    onClick={() => SliderButton("LEFT", arrayIndex - 1)}
                  >
                    <i className="jkms2-arrow-right"></i>
                  </button>
                )}

                {/* <button aria-label="btn up" className="btn btn-slider btn-up"
                                ><i className="jkms2-arrow-right"></i></button> */}
                {slicedData?.[arrayIndex]?.map(
                  (pImage: IImageVideo, idx: number) =>
                    pImage?._id ? (
                      <div
                        className={
                          "thumbnail-img" +
                          (selectedImage?._id === pImage._id ? " active" : "")
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
                          (selectedImage?.video_url == pImage.video_url
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
                {
                  details?.website_product_detail?.video?.path &&
                  <div
                    key={details?.website_product_detail?.images?.length}
                    className={
                      "thumbnail-img video" +
                      (selectedImage?._id === details?.website_product_detail?.video?._id ? " active"
                        : "")
                    }
                    onClick={() => handleSelectedImageChange(details?.website_product_detail?.images?.length)}
                  >
                    <CustomImage
                      // @ts-ignore
                      src={details?.website_product_detail?.thumbnail?.path ?? '/assets/images/video.png'}
                      alt={'Custom video'}
                      height="88px"
                      width="88px"
                    />
                  </div>
                }
                {/* <button aria-label="btn down" className="btn btn-slider btn-down" ><i className="jkms2-arrow-right"></i></button> */}
                {slicedData[arrayIndex]?.length >= 4 &&
                  slicedData[arrayIndex + 1]?.length
                  && (
                    <button
                      aria-label="btn down"
                      className="btn btn-slider btn-down"
                      onClick={() => SliderButton("RIGHT", arrayIndex + 1)}
                    >
                      <i className="jkms2-arrow-right"></i>
                    </button>
                  )}
              </div>
              <div className="product-slider-box">
                <div className="badge-wrapper">
                  {details?.price_breakup?.is_discounted && showPrice ? (
                    <div className="badge discount-badge">{details?.price_breakup?.discount_per}% OFF</div>
                  ) : (
                    <></>
                  )}
                  {details?.website_product_detail?.is_available_for_order !== 1 ? (
                    <div className="badge out-of-stock-badge">Out Of Stock</div>
                  ) : (
                    <></>
                  )}
                  {details?.website_product_detail?.product_tag_name?.length > 0 && (
                    <div
                      className={"badge badge-featured"}
                      key={uuid()}
                      style={
                        getProductTagBGColorAndImage(details?.website_product_detail?.product_tag_name)
                          .style
                      }
                    >
                      {getProductTagBGColorAndImage(details?.website_product_detail?.product_tag_name).imgPath && (
                        <div className="product-tag-img">
                          <img src={getProductTagBGColorAndImage(details?.website_product_detail?.product_tag_name).imgPath} alt="productTag Img" />
                        </div>
                      )}

                      {details?.website_product_detail?.product_tag_name}
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
                      }px ${imgHeight * APPCONFIG.IMAGE_ZOOM.zoomLevel}px`,
                    //calculete position of zoomed image.
                    backgroundPositionX: `${-x * APPCONFIG.IMAGE_ZOOM.zoomLevel + 728 / 2
                      }px`,
                    backgroundPositionY: `${-y * APPCONFIG.IMAGE_ZOOM.zoomLevel + 660 / 2
                      }px`,
                  }}
                >
                  {(selectedImageIndex < details?.website_product_detail?.images?.length) &&
                    (selectedImage?.video_url ? (
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
                    ))}
                  {
                    details?.website_product_detail?.video?.path && (selectedImageIndex >= details?.website_product_detail?.images?.length) &&
                    <video width="728px" height="660px" controls autoPlay loop playsInline >
                      <source src={selectedImage?.path} type="video/mp4" />
                      <source src={selectedImage?.path} type="video/quicktime" />
                      <source src={selectedImage?.path} type="video/avi" />
                      <source src={selectedImage?.path} type="video/x-avi" />
                      <source src={selectedImage?.path} type="video/webm" />
                    </video>

                  }
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
                            selectedImage?.path ? selectedImage?.path : IMAGE_PATH.noImagePng
                        }
                        imgWidth={imgWidth}
                        imgHeight={imgHeight}
                        x={x}
                        y={y}
                        showMagnifier={showMagnifier}
                    /> */}

          <div className="details-right">
            <h3 className="product-name">{details?.title}</h3>
            <div className="review-section">
              <div className="rating-section">
                <CustomRatingViews ratingCounts={ratingCount || 0} type={props.type} />
                <div className="rating-count">
                  <a href="#" onClick={() => scrollToReview()}>
                    {reviewCount || 0} Reviews
                  </a>
                </div>
              </div>
              <div className="social-links-group">
                <SocialShare
                  ulClassName="product-social-media"
                  spanClassName="social-icon-link"
                  details={`${details?.title}`}
                  type={2}
                  isPdp={true}
                />
              </div>
            </div>
            <div className="sku-section">
              <span>SKU Code : {details?.sku}</span>
            </div>
            {getUserDetails() || (!getUserDetails() && isPriceDisplay) ? (
              <div className="price-section">
                <div className="price">
                  <strong className="special-price">
                    {details?.price_breakup?.total_price &&
                      currencySymbol +
                      " " +
                      covertPriceInLocalString(
                        Math.round(details?.price_breakup?.total_price)
                      )}
                  </strong>
                  {details?.price_breakup?.is_discounted && isPriceDisplay ? (
                    <strong className="old-price" style={{ marginLeft: "10px" }}>
                      {details?.price_breakup?.original_total_price > 0 &&
                        `${currencySymbol ? currencySymbol : ''}` +
                        " " +
                        covertPriceInLocalString(
                          Math.round(
                            details?.price_breakup?.original_total_price
                          )
                        )}
                    </strong>
                  ) : null}
                  {/* Commented Due to Product Tag Changes for Template 2  */}
                  {/* {details?.price_breakup?.is_discounted ? (
                    <strong className="old-price" style={{ marginLeft: "10px" }}>
                      {details?.price_breakup?.original_total_price &&
                        currencySymbol +
                        " " +
                        covertPriceInLocalString(
                          Math.round(
                            details?.price_breakup?.original_total_price
                          )
                        )}
                    </strong>
                  ) : null} */}
                  {/* {details?.price_breakup?.is_discounted ? (
                  <div className="badge discount-badge">
                    {`${details?.price_breakup?.discount_per}%`} OFF
                  </div>
                ) : (
                  <></>
                )} */}
                </div>
              </div>
            ) : (
              <></>
            )}
            
            {details?.is_view_price_breakup === 1 ||
              details?.website_product_detail?.is_customizable === 1}
            <div className="button-group-section">
              {details?.website_product_detail?.is_customizable === 1 && (
                <button
                  type="button"
                  onClick={() => setCustomiseView(!isCustomiseView)}
                  className="btn btn-secondary btn-customize"
                >
                  Customize This Product
                </button>
              )}
              {details?.is_view_price_breakup === 1 && (
                <button
                  type="button"
                  onClick={() => setPriceBreakupView(true)}
                  className="btn btn-secondary btn-view-price"
                >
                  View Price Breakup
                </button>
              )}
              <div className="access-link">
                <a
                  href="#"
                  className={`link-access ${details?.is_in_wishlist
                    ? "active jkms2-whishlist-fill"
                    : ""
                    }`}
                  onClick={() => addtoWishList(details)}
                >
                  <i
                    className={`icon jkms2-heart `}
                  ></i>
                </a>
                {/* <a href="#" className="link-access "><i className="icon jkms2-compare"></i></a> */}
                <a
                  href="#"
                  className={`link-access  jkms2-box ${getCompareProductList()?.some(
                    (item: ICompareProductsState) =>
                      item.product_id ===
                      details?.website_product_detail?.product_id
                  )
                    ? "active"
                    : ""
                    }`}
                  onClick={() =>
                    addProductInCompare(
                      details?.title,
                      details?.website_product_detail?.product_id
                    )
                  }
                  title={
                    getCompareProductList()?.some(
                      (item: ICompareProductsState) =>
                        item.product_id ===
                        details?.website_product_detail?.product_id
                    )
                      ? "Remove from compare"
                      : "Add to compare"
                  }
                >
                  <i
                    className={`icon jkms2-compare ${getCompareProductList()?.some(
                      (item: ICompareProductsState) =>
                        item.product_id ===
                        details?.website_product_detail?.product_id
                    )
                      ? "active jkms2-compare-fill"
                      : ""
                      }`}
                  ></i>
                </a>
              </div>
            </div>
            {isShowProductDetails && details?.price_breakup?.is_fix_price !== 1 && <div className="product-options-section">
              {details?.website_product_detail?.default_metal?.weight && (
                <div className="option-box">
                  <strong>
                    <i className="icon jkms2-gold-bars"></i>
                    {`${details?.price_breakup?.metal_quality} :`}
                  </strong>
                  <p>
                    {details?.price_breakup?.net_weight && isPriceDisplay &&
                      details?.price_breakup?.net_weight?.toFixed(3) +
                      ` gm  ${(details?.is_view_price_breakup === 1 && details?.price_breakup?.total_metal_price > 0)
                        ? `(${currencySymbol} ${covertPriceInLocalString(
                          Math.round(
                            details?.price_breakup?.total_metal_price
                          )
                        )})`
                        : ""
                      }`}
                  </p>
                  {
                    details?.price_breakup?.metal_discount != undefined &&
                    details?.price_breakup?.metal_discount > 0 &&
                    <div className="discount-badge-container">
                      <div className="badge-wrapper">
                        {details?.price_breakup?.metal_discount_type === "PERCENTAGE" && <div className="badge discount-badge">{details?.price_breakup?.metal_discount}% OFF</div>}
                        {details?.price_breakup?.metal_discount_type === "FLAT" && <div className="badge discount-badge">{currencySymbol} {details?.price_breakup?.metal_discount} OFF</div>}
                      </div>
                    </div>
                  }

                </div>
              )}
              {details?.website_product_detail?.diamond_details?.length ? (
                <div className="option-box">
                  <strong>
                    <i className="icon jkms2-diamond-fill"></i>Diamond{" "}
                    {details?.website_product_detail?.diamond_details?.map(
                      (value, dIndex) =>
                        dIndex === 0 && (
                          <Wrapper key={dIndex}>
                            {`(${value?.diamond_quality_name}) :`}{" "}
                          </Wrapper>
                        )
                    )}{" "}
                  </strong>
                  <div className="tooltip-wrapper">
                    <a className="jkms2-info-circle"></a>
                    <div className="tooltip">
                      <span>
                        {details?.website_product_detail?.diamond_details?.map(
                          (value, index) => (
                            <p key={index}>
                              {value?.diamond_quality_name}{" "}
                              {value?.diamond_shape_name} {value?.pcs + " pcs"}{" "}
                              {Number(value?.carat).toFixed(3) + " ct"}
                              {details?.website_product_detail?.diamond_details
                                ?.length -
                                1 >
                                index
                                ? ","
                                : null}
                            </p>
                          )
                        )}
                      </span>
                    </div>
                  </div>
                  {getUserDetails() || (!getUserDetails() && isPriceDisplay) ? (
                    <p>
                      {getTotalDiamondCarat() +
                        ` ct ${details?.is_view_price_breakup === 1
                          ? `(${currencySymbol} ${covertPriceInLocalString(
                            Math.round(
                              details?.price_breakup?.total_diamond_price
                            )
                          )})`
                          : ""
                        } `}
                    </p>
                  ) : (
                    <></>
                  )}
                  {
                    details?.price_breakup?.diamond_discount != undefined &&
                    details?.price_breakup?.diamond_discount > 0 &&
                    <div className="discount-badge-container">
                      <div className="badge-wrapper">
                        {details?.price_breakup?.diamond_discount_type === "PERCENTAGE" && <div className="badge discount-badge">{details?.price_breakup?.diamond_discount}% OFF</div>}
                        {details?.price_breakup?.diamond_discount_type === "FLAT" && <div className="badge discount-badge">{currencySymbol} {details?.price_breakup?.diamond_discount} OFF</div>}
                      </div>
                    </div>
                  }
                </div>
              ) : (
                <></>
              )}
              {details?.website_product_detail?.color_stone_details?.length ? (
                <div className="option-box">
                  <strong>
                    <i className="icon jkms2-stone"></i>Color Stone{" "}
                    {details?.website_product_detail?.color_stone_details?.map(
                      (value, cInde) =>
                        cInde === 0 && (
                          <Wrapper key={cInde}>
                            {`(${value?.color_stone_name})`}{" "}
                            {/* {value?.color_stone_shape_name} {value?.pcs + " pcs"}{" "}
                          {value?.carat + " ct"}
                          {details?.website_product_detail?.color_stone_details
                            ?.length -
                            1 >
                          index
                            ? ","
                            : null} */}
                          </Wrapper>
                        )
                    )}
                  </strong>

                  <div className="tooltip-wrapper">
                    <a className="jkms2-info-circle"></a>
                    <div className="tooltip">
                      <span>
                        {details?.website_product_detail?.color_stone_details?.map(
                          (value, index) => (
                            <p key={index}>
                              {value?.color_stone_name}{" "}
                              {value?.color_stone_shape_name}{" "}
                              {value?.pcs + " pcs"} {Number(value?.carat).toFixed(3) + " ct"}
                              {details?.website_product_detail
                                ?.color_stone_details?.length -
                                1 >
                                index
                                ? ","
                                : null}
                            </p>
                          )
                        )}
                      </span>
                    </div>
                  </div>
                  {
                    details?.price_breakup?.colorstone_discount != undefined &&
                    details?.price_breakup?.colorstone_discount > 0 &&
                    <div className="discount-badge-container">
                      <div className="badge-wrapper">
                        {details?.price_breakup?.colorstone_discount_type === "PERCENTAGE" && <div className="badge discount-badge">{details?.price_breakup?.colorstone_discount}% OFF</div>}
                        {details?.price_breakup?.colorstone_discount_type === "FLAT" && <div className="badge discount-badge">{currencySymbol} {details?.price_breakup?.colorstone_discount} OFF</div>}
                      </div>
                    </div>
                  }
                  {getUserDetails() || (!getUserDetails() && isPriceDisplay) ? (
                    <p>
                      {getTotalColorStone() +
                        ` ct ${details?.is_view_price_breakup === 1
                          ? `(${currencySymbol} ${covertPriceInLocalString(
                            Math.round(
                              details?.price_breakup
                                ?.total_color_stone_price
                            )
                          )})`
                          : ""
                        }`}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <></>
              )}
            </div>}
            {/* Product Customise View - Start */}
            {isCustomiseView ? (
              <CustomiseProductPopup
                data={{ ...props?.data, ...{ new_size_id: sizeId } }}
                isModal={isCustomiseView}
                onClose={() => setCustomiseView(false)}
                customProductDetails={customProductDetails}
                customProductData={customProductData}
                customiseData={customData}
              />
            ) : (
              <></>
            )}
            {/* Product Customise View - End */}


            <form className="option-form">
              <div className="form-wrap">
                {details?.product_size_list &&
                  details?.product_size_list?.length > 0 ? (
                  <div className="form-group">
                    <label>Size</label>
                    <select
                      className="custom-select"
                      value={sizeId}
                      onChange={setNewId}
                    >
                      {details?.product_size_list?.map((sizeList: any) => (
                        <option value={sizeList?._id} key={sizeList?._id}>
                          {sizeList?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <></>
                )}

                <div className="form-group">
                  <label>Qty</label>
                  <div className="qty">
                    <span id="input_plus" className="arrow-up">
                      <i
                        className="jkms2-arrow-top"
                        onClick={() => {
                          cartQty + 1 <=
                            Number(details?.website_product_detail?.max_order_qty) ? setCartQty(cartQty + 1) : showError(`The quantity exceeds the maximum quantity is ${details?.website_product_detail
                              ?.max_order_qty} to buy this product.`)
                        }}
                      ></i>
                    </span>
                    <span
                      id="input_minus"
                      className="arrow-down"
                      onClick={() => {
                        cartQty - 1 >=
                          Number(
                            details?.website_product_detail?.min_order_qty
                              ? details?.website_product_detail?.min_order_qty
                              : 1
                          ) ? setCartQty(cartQty - 1) : showError(`Please add minimum quantity ${details?.website_product_detail?.min_order_qty} to buy this product or add valid quantity.`);

                      }}
                    >
                      <i className="jkms2-arrow-down"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      min={
                        details?.website_product_detail?.min_order_qty
                          ? +details?.website_product_detail?.min_order_qty
                          : 1
                      }
                      max={details?.website_product_detail?.max_order_qty}
                      value={cartQty}
                      onChange={(e) => { Number.isFinite(Number(e.target.value)) && setCartQty(Number(e.target.value)) }}
                      onBlur={(e) => handleOnChangeProductQty(Number(e.target.value), +details?.website_product_detail?.max_order_qty, details?.website_product_detail?.min_order_qty
                        ? +details?.website_product_detail?.min_order_qty
                        : 1)}
                    />
                  </div>
                </div>
                {/* <div className="pincode-wrapper"> */}
                {
                  isB2BUser && !showPrice ? null : (
                    <>
                      <div className="form-group ">
                        <label>Check Your Pincode</label>
                        <input
                          type="text"
                          className="form-control"
                          name="pincode"
                          placeholder="Pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                        />
                        {
                          pinCodeMsg?.message && pinCodeMsgTimer && (
                            <span
                              id="countdown"
                              className={`pincode-error ${pinCodeMsg?.isValid ? "available" : "not-available"}`}
                            >
                              {pinCodeMsg.message}
                            </span>
                          )
                        }
                      </div>
                      <div className="form-action">
                        <button
                          type="button"
                          onClick={() => checkPincodeDelivery(pincode)}
                          className="btn btn-secondary btn-check"
                        >
                          Check
                        </button>
                      </div>
                    </>
                  )}
                {/* </div> */}
              </div>
              {(details?.not_sure_size &&
                details?.not_sure_size?.is_size_link !== 0) ||
                details?.not_sure_size?.sizefile?.path ? (
                <Link
                  href={
                    details?.not_sure_size?.is_size_link
                      ? details?.not_sure_size?.size_link
                      : details?.not_sure_size?.sizefile?.path
                  }
                  target="_blank"
                >
                  <a className="not-sure-link" target="_blank">
                    Not sure of the Size?
                  </a>
                </Link>
              ) : (
                <></>
              )}
            </form>
            <div className="contact-us-section">
              <ul>
                {isB2BUser && phone !== "" && <li title="Whatsapp" className="whatsapp">
                  <a onClick={() => openWhatsApp()}>
                    <i className="icon jkms2-whatsapp"></i>
                    <span >{phone}</span>
                  </a>
                </li>}
                {isB2BUser && generalConNumber !== "" && <li title="call">
                  <a href={generalConNumber
                    ? `tel:${generalCountryCode}${generalConNumber}`
                    : "#"}>
                    <i className="icon jkms2-call"></i>
                    <span className="call-wrapper">
                      <span>{generalCountryCode} {generalConNumber}</span>
                      <span className="call-text">Need help? Call us</span>
                    </span>
                  </a>
                </li>}
              </ul>
            </div>
            <div className="d-col option-remark">
              <label>Remark</label>
              <textarea
                name="remark"
                rows={5}
                value={Remark}
                onChange={(e) => setRemark(e.target.value)}
                className="form-control"
                placeholder="Add Product customisation like Metal, Purity, Size, Diamond etc"
              />
            </div>
            <div className="button-section">
              {(
                <>
                  <button
                    onClick={() => addtoCart()}
                    className="btn btn-primary btn-addtocart"
                  >
                    Add to Cart
                  </button>

                  {
                    <button
                      className="btn btn-secondary btn-buynow"
                      onClick={() => {
                        if (isB2BUser) showPlaceInquiryModal();
                        else redirectNCart();
                      }}
                    >
                      {`${isB2BUser ? "Inquire" : "Buy"} now`}
                    </button>
                  }
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {details?.website_product_detail?.product_certificate?.length > 0 ? (
        <section className="certification-sec">
          <div className="container">
            <div className="our-certified-section">
              <h3>Certified By</h3>
              <div className="certified-list">
                {details?.website_product_detail?.product_certificate?.map(
                  (data, eInd) => (
                    <picture key={eInd}>
                      <source
                        src={
                          data.image
                            ? data?.image.path
                            : IMAGE_PATH.noImagePng
                        }
                        type="image/webp"
                      />
                      <source
                        src={
                          data.image
                            ? data?.image.path
                            : IMAGE_PATH.noImagePng
                        }
                        type="image/jpg"
                      />
                      <img
                        decoding="async"
                        src={
                          data.image
                            ? data?.image.path
                            : IMAGE_PATH.noImagePng
                        }
                        alt={data?.name}
                        title={data?.name}
                        height="113"
                        width="113"
                      />
                    </picture>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}
      {/* Product Price Breakup View - Start */}
      {isPriceBreakupView ? (
        <ViewPriceBreakup
          data={props?.data}
          isModal={isPriceBreakupView}
          onClose={() => setPriceBreakupView(false)}
        />
      ) : (
        <></>
      )}
      {/* Product Price Breakup View - End */}
      {/* Product Customise View - Start */}
      {/* {isCustomiseView ? (
        <CustomiseProductPopup
          data={{ ...props?.data, ...{ new_size_id: sizeId } }}
          isModal={isCustomiseView}
          onClose={() => setCustomiseView(false)}
          customProductDetails={customProductDetails}
          customProductData={customProductData}
          customiseData={customData}
        />
      ) : (
        <></>
      )} */}
      {/* Product Customise View - End */}
    </>
  );
};

export default WebsiteProductDetails2;
