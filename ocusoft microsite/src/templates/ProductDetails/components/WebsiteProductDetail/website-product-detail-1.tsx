import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import useSliderHook from "@components/Hooks/sliderHook";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath, getUserDetails } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { decode } from 'html-entities';
import "react-image-gallery/styles/css/image-gallery.css";
import ImageGallery from "react-image-gallery";
import ReactModal from 'react-modal';
import { IWebsiteProductDetailsProps } from ".";
import { toast } from "react-toastify";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%'
  },
};

const WebsiteProductDetails1 = (props: IWebsiteProductDetailsProps) => {
  const details = props?.data?.website_product_detail
  const [qty, setQty] = useState(1)
  const [sliderIndex, setSliderIndex] = useState(0)
  const [imageSlider, setImageSlider] = useState(false)
  const [imageSliderIndex, setImageSliderIndex] = useState(0)
  const {
    slicedData,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
  } = useSliderHook(details?.product?.media_gallery, 5);
  const router = useRouter();
  const { adddtoCartProduct } = useAddtoCart();

  const handleAddToCartClick = (is_buy_now = 0) => {
    if (!getUserDetails()) {
      router.replace("/sign-in");
    } else {
      adddtoCartProduct({
        item_id: details?._id,
        qty,
        is_buy_now
      });
    }
  };

  const _setImageSliderIndex = (image: string) => {
    if (!image) {
      return
    }
    const index = details?.product?.media_gallery?.findIndex((i: string) => i === image)
    if (index >= 0) {
      setImageSliderIndex(index)
      setImageSlider(true)
    }
  }

  return (
    <>
      <Head>
        <title>{details?.product?.name}</title>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.breadcrumbBar)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productDetail)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.overviewTab)}
        />
        <link rel="stylesheet" href="/assets/css/common/common.min.css" />
      </Head>
      <main>
        {
          details?.product?.media_gallery?.length > 0 &&
          <ReactModal
            isOpen={imageSlider}
            onRequestClose={() => setImageSlider(false)}
            style={customStyles}
          >
            <ImageGallery items={details?.product?.media_gallery?.map((i: string) => (
              {
                original: i,
                thumbnail: i,
                originalHeight: 550,
                originalWidth: 1000
              }
            ))} startIndex={imageSliderIndex}

            />
          </ReactModal>
        }
        <section className="breadcrumb-bar-section">
          <div className="container">
            <ul className="breadcrumb">
              <li>
                <Link href={'/'}>
                  <a aria-label="home-page-link">
                    <em className="osicon-home"></em>
                  </a>
                </Link>
              </li>
              {
                details?.product?.categories?.category_type?.length > 0 &&
                <li>
                  <Link href={`/${details?.product?.categories?.category_type?.[0]?.url_key}`}>
                    <a>{details?.product?.categories?.category_type?.[0]?.name}</a>
                  </Link>
                </li>
              }

              {
                details?.product?.categories?.category?.length > 0 &&
                <li>
                  <Link href={`/${details?.product?.categories?.category_type?.[0]?.url_key}/${details?.product?.categories?.category?.[0]?.url_key}`}>
                    <a>{details?.product?.categories?.category?.[0]?.name}</a>
                  </Link>
                </li>
              }
              <li>
                <a>
                  {details?.product?.name}
                </a>
              </li>
            </ul>
          </div>
        </section>
        <section className="product-buy-section">
          <div className="container">
            <div className="product-image-slider-wrap">
              <figure className="product-image-box" onClick={() => _setImageSliderIndex(slicedData[arrayIndex]?.[sliderIndex])}>
                <picture>
                  <source
                    srcSet={slicedData[arrayIndex]?.[sliderIndex] || "/assets/images/product.webp"}
                    type="image/webp"
                  />
                  <img
                    src={slicedData[arrayIndex]?.[sliderIndex] || "/assets/images/product.png"}
                    alt="product"
                    title="product"
                    height="525"
                    width="155"
                  />
                </picture>
              </figure>
              <div className="product-thumbnail-wrapper">
                <div className="product-thumbnail-box">
                  {
                    slicedData[arrayIndex]?.map((i: string, key: number) => (
                      <div className={`product-thumbnail ${sliderIndex === key ? 'active' : ''}`} key={i}
                        onClick={() => setSliderIndex(key)}
                      >
                        <picture>
                          <source
                            srcSet={i || "/assets/images/product-description.webp"}
                            type="image/webp"
                          />
                          <img
                            src={i || "/assets/images/product.png"}
                            alt="product"
                            title="product"
                            height="100"
                            width="77"
                          />
                        </picture>
                      </div>
                    ))
                  }
                  {
                    hideLeftButton &&
                    <em className="osicon-chevron-left swipe-left"
                      onClick={() => {
                        SliderButton("LEFT", arrayIndex - 1)
                        setSliderIndex(0)
                      }}
                    ></em>
                  }
                  {
                    hideRightButton &&
                    <em className="osicon-chevron-right swipe-right"
                      onClick={() => {
                        SliderButton("RIGHT", arrayIndex + 1)
                        setSliderIndex(0)
                      }}
                    ></em>
                  }

                </div>
              </div>
            </div>
            <div className="product-description-wrap">
              <h2>
                {details?.product?.name}
              </h2>
              <h2 className="product-price">${Number(details?.selling_price)?.toFixed(2)}</h2>
              <div className="product-price" dangerouslySetInnerHTML={{ __html: decode(details?.product?.short_description) }} />
              {qty < details?.product?.low_stock_qty &&
                details?.product?.backorder !== 0 && (
                  <div>
                    <span className="warning-text">
                      Availabilty: This Product inventory numbers are currently
                      low. You can still order the product, but there might be a
                      chance that the product will go on backorder.
                    </span>
                  </div>
                )}
              <br />
              <ul className="product-quality-tags-wrap">
                {
                  details?.product?.product_icons?.map((i) => (
                    <li key={i?.icon_label}>
                      <div className="product-quality-tag-img">
                        <picture>
                          <source
                            srcSet={i?.icon_image}
                            type="image/webp"
                          />
                          <img
                            src={i?.icon_image}
                            alt={i?.icon_label}
                            title={i?.icon_label}
                            height="100"
                            width="100"
                          />
                        </picture>
                      </div>
                      <h4>{i?.icon_label}</h4>
                    </li>
                  ))
                }
              </ul>
              <div className="product-sku">
                <span>SKU: {details?.product?.sku}</span>
              </div>
              {
                details?.product?.attachment_file?.length > 0 &&
                <div className="pdf-download">
                  <em className="osicon-pdf pdf-icon"></em>
                  <div>
                    <h3>SDS</h3>
                    <span>DOWNLOAD</span>
                  </div>
                  <a href={details?.product?.attachment_file?.[0]} rel="noreferrer" target="_blank">
                    <em className="osicon-download download-icon"></em>
                  </a>
                </div>
              }

              <div className="add-to-cart-wrap">
                <button
                  type="button"
                  className="qty-btn"
                  aria-label="qty-btn"
                >
                  <em className="osicon-minus"
                    onClick={() => qty > 1 && setQty(prev => prev - 1)}></em>
                  <input type="text" value={qty} disabled />
                  <em className="osicon-plus"
                    onClick={() => {
                      qty >= Number(details?.product?.product_purchase_limit) ?
                        toast.error('You have reached the purchase limit for this item.')
                        : setQty(prev => prev + 1)
                    }}></em>
                </button>
                <button
                  type="button"
                  className="btn btn-primary-with-icon"
                  aria-label="add-to-cart-btn"
                  onClick={() => handleAddToCartClick()}
                >
                  ADD TO CART<i className="osicon-bag" />
                </button>
                <button
                  type="button"
                  className="btn btn-primary-with-icon"
                  aria-label="buy-now"
                  onClick={() => handleAddToCartClick(1)}
                >
                  BUY NOW
                </button>
              </div>
              {/* <ShareProduct
                productLink={`${APPCONFIG.FrontUrl}/product/detail/${param1}`}
                productTitle={details?.product?.name}
              /> */}
            </div>
          </div>
        </section>
        <section className="overview-section">
          <div className="container">
            <div className="overview-tabbing-wrapper">
              <ul className="tab-menu">
                <li>
                  <a
                    href="javascript:void(0)"
                    className="tab-a active-a"
                    data-id="tab1"
                  >
                    Overview
                  </a>
                </li>
              </ul>
              <div className="tab tab-active" data-id="tab1">
                <div dangerouslySetInnerHTML={{
                  __html: decode(details?.product?.description)
                }} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default WebsiteProductDetails1;
