import { uuid } from "@util/uuid";
import { IMAGE_PATH } from "@constant/imagepath";
import APPCONFIG from "@config/app.config";
import React from "react";
import {
    covertPriceInLocalString, getDymanicBgTagColorAndImg,
    getTypeBasedCSSPath,
    getUserDetails
} from "@util/common";
import useCompareProduct from "@components/Hooks/compareProduct/useCompareProduct";
import { ICompareProductsState } from "@components/Hooks/compareProduct";
import useAddtoCart from "@components/Hooks/addtoCart/addtoCart";
import usePriceDisplay from "@components/Hooks/priceDisplay";
import { useSelector } from "react-redux";
import Link from "next/link";
import { ISignInReducerData } from "@type/Common/Base";
import Cookies from "js-cookie";
import CustomImage from "@components/CustomImage/CustomImage";
import { IPDPProductBox } from ".";
import useCurrencySymbol from "@components/Hooks/currencySymbol/useCurrencySymbol";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";


const PDPProductBox = ({ product_tags_detail, key, data, addtoWishList,
    wishListData, setIsQuickView, setQuickViewSlug, props }: IPDPProductBox) => {
    const { addProductInCompare, getCompareProductList } = useCompareProduct();
    const { adddtoCartProduct } = useAddtoCart();
    const { isPriceDisplay } = usePriceDisplay();
    const reduxData = useSelector((state: ISignInReducerData) => state?.displayQuickViewSKUReducer);
    const showPrice = parseInt(Cookies.get("showPrice") ?? '') === 1 ? true : false;
    const baseTemplate = parseInt(Cookies.get("baseTemplate") ?? '');

    const getProductTagBGColorAndImage = (tagTitle: string) => {
        const bgTagColorAndImg = getDymanicBgTagColorAndImg(tagTitle, product_tags_detail)
        return bgTagColorAndImg
    }
    const currencySymbol = useCurrencySymbol();

    return (
        <>
            {
                baseTemplate == 1 ?
                    <>
                        <Head>
                            <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.prodDetailSimilaProd)} />
                        </Head>
                        <div key={key} className="d-col d-col-4">
                            <div className="card">
                                <div className="card-head">
                                    <>
                                        <Link href={`/product/detail/${data?.product?.slug}`} >
                                            <a className="product-hover-link">

                                                <img
                                                    src={
                                                        data?.images?.[0]?.path
                                                            ? data?.images?.[0]?.path
                                                            : IMAGE_PATH.noImagePng
                                                    }
                                                    alt={data?.images?.[0]?.name}
                                                    title={data?.images?.[0]?.name}
                                                    height="348px"
                                                    width="349px"
                                                />
                                            </a>
                                        </Link>
                                        <a
                                            onClick={() => addtoWishList()}
                                            className={`wishlist-link ${(!reduxData?.showAddToCart && (getUserDetails() || (!getUserDetails() && isPriceDisplay)) && !reduxData?.showQuickView) ? 'no-mask' : ''}`}
                                        >
                                            {getUserDetails() ? (
                                                <i
                                                    className={`icon jkm-heart ${data?.is_in_wishlist ? "active jkm-whishlist-fill" : ""
                                                        }`}
                                                ></i>
                                            ) : (
                                                <i
                                                    className={`icon jkm-heart ${wishListData.length && wishListData?.some((ele) => ele == data?.product?._id ? data?.product?._id : '')
                                                        ? "active jkm-whishlist-fill"
                                                        : ""
                                                        }`}
                                                ></i>
                                            )}
                                        </a>

                                        <div className="badge-wrapper">
                                            {data?.price_breakup?.is_discounted && props?.title ? (
                                                <div className="badge discount-badge">
                                                    {data?.price_breakup?.discount_per}% OFF
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                            {data?.discount_percentage && !props?.title ? (
                                                <div className="badge discount-badge">
                                                    {data?.discount_percentage}% OFF
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                            {data?.is_available_for_order !== 1 ? (
                                                <div className="badge out-of-stock-badge">
                                                    Out Of Stock
                                                </div>
                                            ) : (
                                                <></>
                                            )}
                                            {data?.product_tag_name?.length > 0 && (
                                                <div
                                                    className={"badge badge-featured"}
                                                    key={uuid()}
                                                    style={
                                                        getProductTagBGColorAndImage(
                                                            data?.product_tag_name
                                                        ).style
                                                    }
                                                >
                                                    {getProductTagBGColorAndImage(data?.product_tag_name).imgPath && (
                                                        <div className="product-tag-img">
                                                            <img src={getProductTagBGColorAndImage(data?.product_tag_name).imgPath} alt="productTag Img" />
                                                        </div>
                                                    )}

                                                    {data?.product_tag_name}
                                                </div>
                                            )}
                                        </div>
                                        {((reduxData?.showAddToCart && (getUserDetails() || (!getUserDetails() && isPriceDisplay))) || reduxData?.showQuickView) &&
                                            <div className="product-overlay">
                                                {
                                                    reduxData?.showQuickView && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-small btn-quick-view"
                                                            onClick={() => {
                                                                setIsQuickView();
                                                                setQuickViewSlug();
                                                            }}
                                                        >
                                                            Quick View <i className="icon jkm-eye"></i>
                                                        </button>)
                                                }
                                                {reduxData?.showAddToCart && (getUserDetails() || (!getUserDetails() && isPriceDisplay)) ? (
                                                    <button
                                                        type="button"
                                                        className="btn btn-secondary btn-small btn-add-cart"
                                                        onClick={() =>
                                                            adddtoCartProduct({
                                                                item_id: data?._id,
                                                                qty: APPCONFIG.DEFAULT_QTY_TYPE,
                                                                is_from_product_list: 1,
                                                                productId: data?.product_id ? data?.product_id : data?.product?._id
                                                            })
                                                        }
                                                    >
                                                        Add To Cart{" "}
                                                        <i className="icon jkm-add-to-cart"></i>
                                                    </button>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>}
                                    </>
                                </div>
                                <div className="card-body">
                                    {
                                        reduxData?.showProductSku && (
                                            <div className="sort-desc">
                                                <span>{data.product?.sku}</span>
                                                {(props?.sectionName !== "recently_view" ? data?.is_fix_price !== 1 : data?.price_breakup?.is_fix_price !== 1) && <>
                                                    {data?.diamond_total_carat ? (
                                                        <span>
                                                            DW : {Number(data?.diamond_total_carat).toFixed(2) + "ct"}
                                                        </span>
                                                    ) : (
                                                        <></>
                                                    )}
                                                    {data?.net_weight ? (
                                                        <span>
                                                            MW : {Number(data?.net_weight).toFixed(2) + "gm"}
                                                        </span>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </>}
                                            </div>)
                                    }
                                    <h3 className="product-name">
                                        {" "}
                                        {data?.product?.title}
                                    </h3>
                                    <div className="price-section">
                                        {getUserDetails() ||
                                            (!getUserDetails() && isPriceDisplay) ? (
                                            <div className="price-section">
                                                {
                                                    showPrice &&
                                                        data?.price_breakup?.original_total_price > 0 &&
                                                        data?.price_breakup?.is_discounted ? (
                                                        <strong className="old-price" style={{ marginRight: "10px" }}>
                                                            {data?.price_breakup?.original_total_price &&
                                                                currencySymbol +
                                                                " " +
                                                                covertPriceInLocalString(Math.round(data?.price_breakup?.original_total_price))}
                                                        </strong>
                                                    ) : null
                                                }
                                                {" "}
                                                <strong className="special-price">
                                                    {
                                                        props.sectionName === "recently_view" ?
                                                            data?.price_breakup?.total_price > 0 &&
                                                            showPrice &&
                                                            currencySymbol +
                                                            " " +
                                                            covertPriceInLocalString(Math.round(data?.price_breakup?.total_price))
                                                            : data?.total_price > 0 &&
                                                            showPrice &&
                                                            currencySymbol
                                                            + " "
                                                            + covertPriceInLocalString(Math.round(data?.total_price))
                                                    }
                                                </strong>
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        <a
                                            onClick={() => addProductInCompare(data?.product?.title, data?.product_id ? data?.product_id : data?.product?._id)}
                                            title={
                                                getCompareProductList()?.some(
                                                    (item: ICompareProductsState) => item.product_id === data?.product_id ? data?.product_id : data?.product?._id
                                                )
                                                    ? "Remove from compare"
                                                    : "Add to compare"
                                            }
                                            className="procuct-compare-section"
                                        >
                                            <i
                                                className={`icon jkm-copy ${getCompareProductList()?.some(
                                                    (item: ICompareProductsState) => item.product_id === data?.product_id ? data?.product_id : data?.product?._id
                                                )
                                                    ? "active jkm-compare-fill"
                                                    : ""
                                                    }`}
                                            ></i>
                                        </a>
                                    </div>
                                    {(reduxData?.showQuickView || reduxData?.showAddToCart) && (
                                        <Link href={`/product/detail/${data?.product?.slug}`}>
                                            <a className="product-hover-link"></a>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <>
                        <Head>
                            <link
                                rel="stylesheet"
                                href={getTypeBasedCSSPath(
                                    '2',
                                    CSS_NAME_PATH.prodDetailSimilaProd
                                )}
                            />
                        </Head>
                        <div key={key} className="d-col d-col-4">
                            <div className="card">
                                <div className="card-head">
                                    <CustomImage
                                        src={
                                            data?.images?.[0]?.path
                                                ? data?.images?.[0]?.path
                                                : IMAGE_PATH.noImagePng
                                        }
                                        alt={data?.images?.[0]?.name}
                                        title={data?.images?.[0]?.name}
                                        height="348px"
                                        width="349px"
                                    />
                                    <div className="badge-wrapper">
                                        {data?.price_breakup?.is_discounted && props?.title ? (
                                            <div className="badge discount-badge">
                                                {data?.price_breakup?.discount_per}% OFF
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        {data?.discount_percentage && !props?.title ? (
                                            <div className="badge discount-badge">
                                                {data?.discount_percentage}% OFF
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        {data?.is_available_for_order !== 1 ? (
                                            <div className="badge out-of-stock-badge">
                                                Out Of Stock
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                        {data?.product_tag_name?.length > 0 && (
                                            <div
                                                className={"badge badge-featured"}
                                                key={uuid()}
                                                style={
                                                    getProductTagBGColorAndImage(
                                                        data?.product_tag_name
                                                    ).style
                                                }
                                            >
                                                {getProductTagBGColorAndImage(data?.product_tag_name).imgPath && (
                                                    <div className="product-tag-img">
                                                        <img src={getProductTagBGColorAndImage(data?.product_tag_name).imgPath} alt="productTag Img" />
                                                    </div>
                                                )}

                                                {data?.product_tag_name}
                                            </div>
                                        )}
                                    </div>
                                    <div className="product-overlay">
                                        <a className={`overlay-link
                                                    ${getUserDetails() && data?.is_in_wishlist ? 'active' :
                                                wishListData.length && wishListData?.some((ele) => ele == data?.product?._id ? data?.product?._id : '') ?
                                                    'active'
                                                    : ''
                                            }
                                                    
                                                    `} onClick={() => addtoWishList()}>
                                            {getUserDetails() ? (
                                                <i
                                                    className={`icon jkms2-heart ${data?.is_in_wishlist ? " jkms2-whishlist-fill" : ""
                                                        }`}
                                                ></i>
                                            ) : (
                                                <i
                                                    className={`icon jkms2-heart ${wishListData.length && wishListData?.some((ele) => ele == data?.product?._id ? data?.product?._id : '')
                                                        ? "active jkms2-whishlist-fill"
                                                        : "jkms2-whishlist-fill"
                                                        }`}
                                                ></i>
                                            )}
                                        </a>
                                        <a className="overlay-link" onClick={() =>
                                            addProductInCompare(
                                                data?.product?.title,
                                                data?.product_id ? data?.product_id : data?.product?._id
                                            )
                                        }
                                            title={
                                                getCompareProductList()?.some(
                                                    (item: ICompareProductsState) =>
                                                        item.product_id === data?.product_id ? data?.product_id : data?.product?._id
                                                )
                                                    ? "Remove from compare"
                                                    : "Add to compare"
                                            }>
                                            <i
                                                className={`icon jkms2-compare ${getCompareProductList()?.some(
                                                    (item: ICompareProductsState) =>
                                                        item.product_id ===
                                                            data?.product_id ? data?.product_id : data?.product?._id
                                                )
                                                    ? "active jkms2-compare-fill"
                                                    : ""
                                                    }`}
                                            ></i>
                                        </a>
                                        {reduxData?.showAddToCart && <a href="#" className="overlay-link" onClick={() => {
                                            setIsQuickView();
                                            setQuickViewSlug();
                                        }}><i className="icon jkms2-eye"></i></a>}
                                        {reduxData?.showAddToCart && (getUserDetails() || (!getUserDetails() && isPriceDisplay)) ? (
                                            <a href="#" className="overlay-link" onClick={() =>
                                                adddtoCartProduct({
                                                    item_id: data?._id,
                                                    qty: APPCONFIG.DEFAULT_QTY_TYPE,
                                                    is_from_product_list: 1,
                                                    productId: data?.product_id ? data?.product_id : data?.product?._id
                                                })
                                            }><i className="icon jkms2-add-to-cart"></i></a>
                                        ) : (
                                            <></>
                                        )}

                                    </div>
                                </div>

                                <div className="card-body">
                                    <Link href={`/product/detail/${data?.product?.slug}`}><a className="product-name">{data?.product?.title}</a></Link>
                                    <div className="price-section">
                                        {getUserDetails() || (!getUserDetails() && isPriceDisplay) ? (
                                            <div className="price-group">
                                                <strong className="special-price">
                                                    {
                                                        props.sectionName === "recently_view" ?
                                                            data?.price_breakup?.total_price > 0 &&
                                                            showPrice &&
                                                            currencySymbol +
                                                            " " +
                                                            covertPriceInLocalString(Math.round(data?.price_breakup?.total_price))
                                                            : data?.total_price > 0 &&
                                                            showPrice &&
                                                            currencySymbol
                                                            + " "
                                                            + covertPriceInLocalString(Math.round(data?.total_price))
                                                    }
                                                </strong>

                                                {data?.price_breakup?.is_discounted ? (
                                                    <strong
                                                        className="old-price"
                                                        style={{ marginRight: "10px" }}
                                                    >
                                                        {showPrice &&
                                                            data?.price_breakup?.original_total_price > 0 && data?.price_breakup
                                                                ?.original_total_price &&
                                                            currencySymbol +
                                                            " " +
                                                            covertPriceInLocalString(
                                                                Math.round(
                                                                    data?.price_breakup
                                                                        ?.original_total_price
                                                                )
                                                            )}
                                                    </strong>
                                                ) : null}{" "} 
                                                </div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </div>

                                {reduxData?.showProductSku && (<div className="sort-desc">
                                    <span>{data.product?.sku}</span>
                                    {(props?.sectionName !== "recently_view" ? data?.is_fix_price !== 1 : data?.price_breakup?.is_fix_price !== 1) && <>
                                        {data?.diamond_total_carat ? (
                                            <>
                                                <div className="border-right"></div>
                                                <span>
                                                    DW : {data?.diamond_total_carat + "ct"}
                                                </span>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        {data?.product?.gross_weight ? (
                                            <>
                                                <div className="border-right"></div>
                                                <span>
                                                    MW : {data?.product?.gross_weight + "gm"}
                                                </span>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </>}
                                </div>)}
                            </div>
                        </div>
                    </>
            }
        </>
    )
}

export default PDPProductBox;