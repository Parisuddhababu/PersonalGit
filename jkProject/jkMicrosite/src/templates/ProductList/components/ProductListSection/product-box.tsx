import { IProductBox } from "@templates/ProductList/components/ProductListSection";
import { uuid } from "@util/uuid";
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
import { useRouter } from "next/router";
import Link from "next/link";
import { ISignInReducerData } from "@type/Common/Base";
import Cookies from "js-cookie";
import CustomImage from "@components/CustomImage/CustomImage";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";


const ProductBox = ({ product_tags_detail, key, product, addtoWishList,
    wishListData, setIsQuickView, setQuickViewSlug, type, addCart, deleteWishList, isWishList, IsSlider }: IProductBox) => {
    const { addProductInCompare, getCompareProductList } = useCompareProduct();
    const { adddtoCartProduct } = useAddtoCart();
    const { isPriceDisplay } = usePriceDisplay();
    const reduxData = useSelector((state: ISignInReducerData) => state?.displayQuickViewSKUReducer);
    const showPrice = parseInt(Cookies.get("showPrice") ?? '') === 1 ? true : false;
    const forceLogin = parseInt(Cookies.get("forceLogin") ?? '') === 1 ? true : false;
    const baseTemplate = parseInt(Cookies.get("baseTemplate") ?? '');
    const isB2B = parseInt(Cookies.get("isB2BUser") ?? '') === 1 ? true : false;

    const router = useRouter();

    const getProductTagBGColorAndImage = (tagTitle: string) => {
        const bgTagColorAndImg = getDymanicBgTagColorAndImg(tagTitle, product_tags_detail)
        return bgTagColorAndImg
    }


    const isPriceVisible = (!isPriceDisplay || (isB2B && !getUserDetails())) ? false : true

    return (
        baseTemplate == 1 ?
            <>
                <Head>
                    <link rel="stylesheet"
                        href={getTypeBasedCSSPath(null, CSS_NAME_PATH.prodDetailSimilaProd)} />
                </Head>
                <div className={IsSlider ? "product-slick-iteam" : `d-col  ${type == 1 ? 'd-col-4' : 'd-col-3'}`} key={key}>
                    <div className="card">
                        <div className="card-head">
                            <Link href={
                                !getUserDetails() && forceLogin ?
                                    "/sign-in" :
                                    `/product/detail/${product?.slug}`
                                // getUserDetails() ||
                                //   (!getUserDetails() && forceLogin)
                                //   ? `/product/detail/${product?.slug}`
                                //   : "/sign-in"
                            }
                            >
                                <a className="product-hover-link">
                                    <img
                                        src={product.image}
                                        alt={product?.title}
                                        title={product?.title}
                                        height="348px"
                                        width="349px"
                                    />
                                </a>
                            </Link>
                            {
                                isWishList &&
                                <a href="#" className="wishlist-link">
                                    <i
                                        className="icon jkm-trash"
                                        onClick={() => {
                                            if (deleteWishList) {
                                                deleteWishList()
                                            }
                                        }
                                        }
                                    ></i>
                                </a>
                            }

                            {
                                !isWishList &&
                                <a
                                    href="#"
                                    onClick={() => {
                                        if (!getUserDetails() && forceLogin) router.replace("/sign-in");
                                        else {
                                            if (addtoWishList) {
                                                addtoWishList();
                                            }
                                        }
                                    }}
                                    className={`wishlist-link ${(!(reduxData?.showAddToCart && (getUserDetails() ||
                                        (!getUserDetails() &&
                                            isPriceDisplay) &&
                                        product?.is_available_for_order === 1)) && !reduxData?.showQuickView) ? 'no-mask' : ''}`}
                                >
                                    <i
                                        className={`icon jkm-heart ${wishListData &&
                                            wishListData?.some((ele) => ele == product?.product_id)
                                            ? "active jkm-whishlist-fill"
                                            : ""
                                            }`}
                                    ></i>
                                </a>
                            }

                            <div className="badge-wrapper">
                                {product?.is_discounted === 1 && showPrice ? (
                                    <div className="badge discount-badge">
                                        {product?.discount_per}% OFF
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {product?.is_available_for_order !== 1 ? (
                                    <div className="badge out-of-stock-badge">
                                        Out Of Stock
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {product?.product_tag_name?.length > 0 && (
                                    <div
                                        className={"badge badge-featured"}
                                        key={uuid()}
                                        style={
                                            getProductTagBGColorAndImage(
                                                Array.isArray(product?.product_tag_name) ? product?.product_tag_name[0] : product?.product_tag_name
                                            ).style
                                        }
                                    >
                                        {getProductTagBGColorAndImage(Array.isArray(product?.product_tag_name) ? product?.product_tag_name[0] : product?.product_tag_name).imgPath && (
                                            <div className="product-tag-img">
                                                <img src={getProductTagBGColorAndImage(Array.isArray(product?.product_tag_name) ? product?.product_tag_name[0] : product?.product_tag_name).imgPath} alt="productTag Img" />
                                            </div>
                                        )}

                                        {Array.isArray(product?.product_tag_name) ? product?.product_tag_name[0] : product?.product_tag_name}
                                    </div>
                                )}
                            </div>
                            {(getUserDetails() || (!getUserDetails() && isPriceDisplay)) &&
                                ((reduxData?.showQuickView || (reduxData?.showAddToCart && product?.is_available_for_order === 1)) ?
                                    <div className="product-overlay">
                                        {
                                            !isWishList && reduxData?.showQuickView && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (getUserDetails() || !forceLogin) {
                                                            if (setIsQuickView && setQuickViewSlug) {
                                                                setIsQuickView();
                                                                setQuickViewSlug();
                                                            }
                                                        } else {
                                                            router.replace("/sign-in");
                                                        }
                                                    }}
                                                    className="btn btn-small btn-quick-view"
                                                >
                                                    Quick View <i className="icon jkm-eye"></i>
                                                </button>
                                            )
                                        }

                                        {
                                            reduxData?.showAddToCart &&
                                                product?.is_available_for_order === 1 ? (
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-small btn-add-cart"
                                                    onClick={() => {
                                                        if (!getUserDetails() && forceLogin) {
                                                            router.replace("/sign-in");
                                                        } else {
                                                            if (isWishList && addCart) {
                                                                addCart()
                                                            }
                                                            else {
                                                                adddtoCartProduct({
                                                                    item_id: product?.website_product_id,
                                                                    qty: APPCONFIG.DEFAULT_QTY_TYPE,
                                                                    is_from_product_list: 1,
                                                                    productId: product?.product_id
                                                                });
                                                            }
                                                        }
                                                    }}
                                                >
                                                    Add To Cart{" "}
                                                    <i className="icon jkm-add-to-cart"></i>
                                                </button>
                                            ) : (
                                                <></>
                                            )
                                        }
                                    </div> : <></>
                                )}
                        </div>
                        <div className="card-body">
                            {reduxData?.showProductSku && (
                                <div className="sort-desc">
                                    <span>{product?.sku}</span>
                                    {product?.is_fix_price !== 1 && (
                                        <>
                                            {product?.diamond_total_carat ? (
                                                <>
                                                    <div className="border-right"></div>
                                                    <span>
                                                        DW :{" "}
                                                        {Number(product?.diamond_total_carat).toFixed(
                                                            2
                                                        ) + "ct"}
                                                    </span>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                            {product?.net_weight ? (
                                                <>
                                                    <div className="border-right"></div>
                                                    <span>
                                                        MW :{" "}
                                                        {Number(product?.net_weight).toFixed(2) +
                                                            "gm"}
                                                    </span>
                                                </>
                                            ) : (
                                                ""
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                            <Link
                                href={
                                    !getUserDetails() && forceLogin ?
                                        "/sign-in" :
                                        `/product/detail/${product?.slug}`
                                }
                            >
                                <a className="product-name">{product?.title}</a>
                            </Link>
                            {/* <h3 className="product-name">{product?.title}</h3> */}
                            <div className="price-section">
                                {isPriceVisible && product?.total_price > 0 ? (
                                    <div className="price-group">
                                        <strong className="special-price">
                                            {
                                                product?.currency_symbol
                                                + " "
                                                + covertPriceInLocalString(Math.round(product?.total_price))
                                            }
                                        </strong>

                                        {product?.is_discounted ? (
                                            <strong
                                                className="old-price"
                                                style={{ marginRight: "10px" }}
                                            >
                                                {product.original_total_price > 0 &&
                                                    product?.currency_symbol +
                                                    " " +
                                                    covertPriceInLocalString(
                                                        Math.round(
                                                            product?.original_total_price
                                                        )
                                                    )}
                                            </strong>
                                        ) : null}{" "}
                                    </div>
                                ) : (
                                    <></>
                                )}
                                <a
                                    onClick={() => {
                                        if (!getUserDetails() && forceLogin) router.replace("/sign-in");
                                        else addProductInCompare(product?.title, product?.product_id);
                                    }}
                                    className="procuct-compare-section"
                                    title={
                                        getCompareProductList()?.some(
                                            (item: ICompareProductsState) => item.product_id === product?.product_id
                                        )
                                            ? "Remove from compare"
                                            : "Add to compare"
                                    }
                                >
                                    <i
                                        className={`icon jkm-copy ${getCompareProductList()?.some(
                                            (item: ICompareProductsState) =>
                                                item.product_id === product?.product_id
                                        )
                                            ? "active jkm-compare-fill"
                                            : ""
                                            }`}
                                    ></i>
                                </a>
                            </div>
                            {(reduxData?.showQuickView || reduxData?.showAddToCart) && (
                                <Link
                                    href={
                                        !getUserDetails() && forceLogin ?
                                            "/sign-in" :
                                            `/product/detail/${product?.slug}`
                                    }
                                ><a className="product-hover-link"></a></Link>
                            )}
                        </div >
                    </div >
                </div >
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
                <div key={key} className={IsSlider ? "product-slick-iteam" : `d-col ${type == 1 ? 'd-col-4' : 'd-col-3'}`}>
                    <div className="card">
                        <div className="card-head">
                            <CustomImage
                                src={product.image}
                                alt={product?.title}
                                title={product?.title}
                                height="348"
                                width="349"
                            />
                            <div className="badge-wrapper">
                                {(product?.is_discounted === 1 && showPrice) ? (
                                    <div className="badge discount-badge">
                                        {product?.discount_per}% OFF
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {product?.is_available_for_order !== 1 ? (
                                    <div className="badge out-of-stock-badge">
                                        Out Of Stock
                                    </div>
                                ) : (
                                    <></>
                                )}
                                {product?.product_tag_name?.length > 0 && (
                                    <div
                                        className={"badge badge-featured"}
                                        key={uuid()}
                                        style={
                                            getProductTagBGColorAndImage(
                                                Array.isArray(product?.product_tag_name) ? product?.product_tag_name[0] : product?.product_tag_name
                                            ).style
                                        }
                                    >
                                        {getProductTagBGColorAndImage(Array.isArray(product?.product_tag_name) ? product?.product_tag_name[0] : product?.product_tag_name).imgPath && (
                                            <div className="product-tag-img">
                                                <img src={getProductTagBGColorAndImage(Array.isArray(product?.product_tag_name) ? product?.product_tag_name[0] : product?.product_tag_name).imgPath} alt="productTag Img" />
                                            </div>
                                        )}

                                        {Array.isArray(product?.product_tag_name) ? product?.product_tag_name[0] : product?.product_tag_name}
                                    </div>
                                )}
                            </div>
                            {
                                (getUserDetails() || (!getUserDetails() && isPriceDisplay)) &&
                                <div className="product-overlay"
                                    onClick={() => {
                                        if (!getUserDetails() && forceLogin) {
                                            router.replace('/sign-in')
                                        } else {
                                            router.push(`/product/detail/${product?.slug}`)
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        top: 0,
                                    }}
                                >
                                    {
                                        !isWishList &&
                                        <a className={`overlay-link ${getUserDetails() && product?.is_in_wishlist ? 'active' :
                                            wishListData?.length && wishListData?.some((ele) => ele == product?.product_id) ?
                                                'active'
                                                : ''
                                            }`}
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (!getUserDetails() && forceLogin) {
                                                    router.push('/sign-in');
                                                    return
                                                }
                                                if (addtoWishList) {
                                                    addtoWishList()
                                                }
                                            }}>
                                            {getUserDetails() ? (
                                                <i
                                                    className={`icon jkms2-heart ${product?.is_in_wishlist ? " jkms2-whishlist-fill" : ""
                                                        }`}
                                                ></i>
                                            ) : (
                                                <i
                                                    className={`icon jkms2-heart ${wishListData.length && wishListData?.some((ele) => ele == product.product_id)
                                                        ? "active jkms2-whishlist-fill"
                                                        : "jkms2-whishlist-fill"
                                                        }`}
                                                ></i>
                                            )}
                                        </a>
                                    }
                                    <a className="overlay-link" onClick={(e) => {
                                        e.stopPropagation()
                                        if (!getUserDetails() && forceLogin) {
                                            router.push('/sign-in');
                                            return
                                        }
                                        addProductInCompare(
                                            product?.title,
                                            product?.product_id
                                        )
                                    }

                                    }
                                        title={
                                            getCompareProductList()?.some(
                                                (item: ICompareProductsState) =>
                                                    item.product_id === product?.product_id
                                            )
                                                ? "Remove from compare"
                                                : "Add to compare"
                                        }>
                                        <i
                                            className={`icon jkms2-compare ${getCompareProductList()?.some(
                                                (item: ICompareProductsState) =>
                                                    item.product_id ===
                                                    product?.product_id
                                            )
                                                ? "active jkms2-compare-fill"
                                                : ""
                                                }`}
                                        ></i>
                                    </a>
                                    {!isWishList && reduxData?.showQuickView &&
                                        <a href="#" className="overlay-link"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                if (!getUserDetails() && forceLogin) {
                                                    router.push('/sign-in');
                                                    return
                                                }
                                                if (setIsQuickView && setQuickViewSlug) {
                                                    setIsQuickView();
                                                    setQuickViewSlug();
                                                }
                                            }}>
                                            <i className="icon jkms2-eye"></i>
                                        </a>
                                    }
                                    {reduxData?.showAddToCart && product?.is_available_for_order === 1 && (getUserDetails() || (!getUserDetails() && isPriceDisplay)) ? (
                                        <a href="#" className="overlay-link" onClick={(e) => {
                                            e.stopPropagation()
                                            if (!getUserDetails() && forceLogin) {
                                                router.push('/sign-in');
                                                return
                                            }
                                            if (addCart && isWishList) {
                                                addCart()
                                            } else {
                                                adddtoCartProduct({
                                                    item_id: product?.website_product_id,
                                                    qty: APPCONFIG.DEFAULT_QTY_TYPE,
                                                    is_from_product_list: 1,
                                                    productId: product?.product_id
                                                })
                                            }
                                        }
                                        }><i className="icon jkms2-add-to-cart"></i></a>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            }
                        </div>
                        <div className={`card-body ${(getUserDetails() || (!getUserDetails() && isPriceDisplay)) ?
                            "" : "hide-icons"}`}>
                            <Link
                                href={
                                    !getUserDetails() && forceLogin ?
                                        "/sign-in" :
                                        `/product/detail/${product?.slug}`
                                }
                            >
                                <a className="product-name">{product?.title}</a>
                            </Link>

                            {isPriceVisible && product?.total_price > 0 ? (
                                <div className="price-section">
                                    <div className="price-group">
                                        <strong className="special-price">
                                            {
                                                product?.currency_symbol
                                                + " "
                                                + covertPriceInLocalString(Math.round(product?.total_price))
                                            }
                                        </strong>
                                        {product?.is_discounted && product.original_total_price > 0 ? (
                                            <strong
                                                className="old-price"
                                            // style={{ marginRight: "10px" }}
                                            >
                                                {
                                                    product?.currency_symbol +
                                                    " " +
                                                    covertPriceInLocalString(
                                                        Math.round(
                                                            product?.original_total_price
                                                        )
                                                    )
                                                }
                                            </strong>
                                        ) : null}{" "}
                                    </div>
                                </div>
                            ) : (
                                <></>
                            )}

                        </div>

                        {reduxData?.showProductSku ?
                            <div className="sort-desc">
                                <span>{product?.sku}</span>
                                {product?.is_fix_price !== 1 && (
                                    <>
                                        {product?.diamond_total_carat ? (
                                            <>
                                                <div className="border-right"></div>
                                                <span>
                                                    DW :{" "}
                                                    {Number(product?.diamond_total_carat).toFixed(
                                                        2
                                                    ) + "ct"}
                                                </span>
                                            </>
                                        ) : (
                                            ""
                                        )}
                                        {product?.net_weight ? (
                                            <>
                                                <div className="border-right"></div>
                                                <span>
                                                    MW :{" "}
                                                    {Number(product?.net_weight).toFixed(2) +
                                                        "gm"}
                                                </span>
                                            </>
                                        ) : (
                                            ""
                                        )}
                                    </>
                                )}
                            </div> : <></>}
                    </div>
                </div>
            </>
    )
}

export default ProductBox;