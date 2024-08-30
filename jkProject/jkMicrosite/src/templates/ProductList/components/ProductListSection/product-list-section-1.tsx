import { getComponents } from "@templates/ProductList/components";
import Head from "next/head";
import { IProductListMainProps } from "@templates/ProductList/components/ProductListSection";
import { uuid } from "@util/uuid";
import APPCONFIG from "@config/app.config";
import useProductListFilter from "@components/Hooks/products/useProductListFilter";
import { IListMainProductProps } from "@type/Pages/productList";
import { useEffect, useState } from "react";
import { IFilterOptions } from "@type/Pages/ProductFilters";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getParseUser, getTypeBasedCSSPath, getUserDetails } from "@util/common";
import { usePagination } from "@components/Hooks/products/usePagination";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import useAddtoWishList from "@components/Hooks/addtoWishList/addtoWishList";
import { IAddtoWishList, IRemoveWishList } from "@components/Hooks/addtoWishList";
import usePriceDisplay from "@components/Hooks/priceDisplay";
import { useSelector } from "react-redux";
import Loader from "@components/customLoader/Loader";
import { getCurrentWishListItems } from "@util/addGuestCartData";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import ProductBox from "./product-box";
import { IMAGE_PATH } from "@constant/imagepath";

const IProductListSection1 = ({ FilterOptions, commingFromOther, pageName, domainName,
  slugInfo, product_tags_detail, type }: IProductListMainProps) => {
  const {
    filter,
    urlFilterData,
    sortByOption,
    totalRecords,
    productList,
    sortByProd,
    page,
    templateType,
    onAppliedFilterChange,
    onSortChange,
    setPage,
    getProductList,
    getLeftFilterList,
  } = useProductListFilter({
    FilterOptions: FilterOptions,
    commingFromOther: commingFromOther,
    pageName: pageName,
  });
  const { adddtoWishListProduct, removeWishListProduct, getWishListData } = useAddtoWishList();
  const { isPriceDisplay } = usePriceDisplay();
  const [wishListData, setWishListData] = useState([]);
  const loaderData = useSelector((state) => state);
  const paginationRange = usePagination({
    totalCount: totalRecords,
    pageSize: parseInt(APPCONFIG.PRODUCT_LIST_PAGE_LIMIT),
    siblingCount: 1,
    currentPage: page,
  });
  const forceLogin = parseInt(Cookies.get("forceLogin") ?? '') === 1 ? true : false;

  const [isQuickView, setIsQuickView] = useState<boolean>(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const [mainProductList, setMainProductList] = useState<IListMainProductProps[]>(productList);
  const [filterList, setFilterList] = useState<IFilterOptions[]>(filter);
  const [url, setURL] = useState<string>(router.asPath);

  useEffect(() => {
    if (productList) {
      setMainProductList(productList);
    }
  }, [productList]);
  useEffect(() => {
    if (filter) {
      setFilterList(filter);
    }
  }, [filter]);

  useEffect(() => {
    getWishList();
    // eslint-disable-next-line
  }, []);


  const getWishList = async () => {
    if (getUserDetails()) {
      const resposne = await getWishListData();
      setWishListData(resposne?.data[0]?.item_id);
    } else {
      const gueatWishlist = getCurrentWishListItems();
      const itemArray = gueatWishlist.map((ele: IAddtoWishList) => ele?.item_id);
      setWishListData(itemArray);
    }
  };
  const onNext = () => {
    setPage(page + 1);
  };
  const onPrevious = () => {
    setPage(page - 1);
  };
  const lastPage = paginationRange ? paginationRange[paginationRange.length - 1] : null;

  const onCloseQuickView = () => {
    setIsQuickView(false);
  };

  const addtoWishList = async (data: IListMainProductProps) => {
    setIsLoading(true);
    const getUserDetails: any = getParseUser();
    // @ts-ignore
    if (!wishListData?.includes(data?.product_id) || !wishListData.length) {
      let wishListObj = {
        type: APPCONFIG.DEFAULT_QTY_TYPE,
        account_id: getUserDetails?.user_detail?.register_from as string,
        item_id: data?.product_id,
      };
      await adddtoWishListProduct(wishListObj as IAddtoWishList);
      getWishList();
      setIsLoading(false);
    } else {
      let arr = [];
      arr.push(data?.product_id);
      let wishListObj = {
        account_id: getUserDetails?.user_detail?.register_from as string,
        item_id: arr,
      };
      await removeWishListProduct(wishListObj as IRemoveWishList);
      getWishList();
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (url !== router.asPath) {
      getProductList();
      setURL(router.asPath);
      setPage(1);
      const splitPath = router.asPath.split("?");
      const urlSplitPath = url.split("?");
      if (splitPath?.length > 0 && urlSplitPath?.length > 0) {
        if (splitPath[0] !== urlSplitPath[0]) {
          getLeftFilterList(true);
        }
      }
    }

    // eslint-disable-next-line
  }, [router.asPath]);

  return (
    <>
      <Head>
        {/* <link
          rel="preload"
          as="style"
          href={APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.productListMain + ".css"}
        /> */}
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.productListMain + ".css"} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productListGrid)} />
        {/* <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productCard)} /> */}
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_COMPONENT + CSS_NAME_PATH.toasterDesign + ".css"} />
        <title>{slugInfo?.slug_info?.slug_detail?.meta_title ? slugInfo?.slug_info?.slug_detail?.meta_title : domainName}</title>
      </Head>
      {/* @ts-ignore */}


      {loaderData?.loaderRootReducer?.loadingState && <Loader />}
      {isLoading && <Loader />}
      <section className="listing-wrapper">
        <div className="container">
          {filterList &&
            filterList?.length > 0 &&
            getComponents(templateType, "filter_section", {
              options: filterList,
              applyFilterData: (data: any, url: string) => onAppliedFilterChange(data, url),
              URLFilterData: urlFilterData,
            })}
          {getComponents(templateType, "compare_product_section", {})}

          <div className="products-grid-section" id="main-product-list">
            <div className="products-results">
              <div className="left-section">
                <p>
                  Showing{" "}
                  {mainProductList?.length
                    ? page === 1
                      ? page
                      : (page - 1) * parseInt(APPCONFIG.PRODUCT_LIST_PAGE_LIMIT)
                    : 0}{" "}
                  –{" "}
                  {page === 1
                    ? mainProductList?.length > 0
                      ? mainProductList?.length < Number(APPCONFIG.PRODUCT_LIST_PAGE_LIMIT)
                        ? mainProductList?.length
                        : APPCONFIG.PRODUCT_LIST_PAGE_LIMIT
                      : 0
                    : (page - 1) * parseInt(APPCONFIG.PRODUCT_LIST_PAGE_LIMIT) +
                      parseInt(APPCONFIG.PRODUCT_LIST_PAGE_LIMIT) >=
                      totalRecords
                      ? totalRecords
                      : (page - 1) * parseInt(APPCONFIG.PRODUCT_LIST_PAGE_LIMIT) +
                      parseInt(APPCONFIG.PRODUCT_LIST_PAGE_LIMIT)}{" "}
                  Of {totalRecords} Results
                </p>
              </div>
              <div className="right-section">
                <label className="sort-label">Sort By:</label>
                <select
                  onChange={(e) => {
                    if (!getUserDetails() && forceLogin) {
                      router.replace("/sign-in");
                    } else {
                      onSortChange(e);
                    }
                  }}
                  value={sortByProd}
                >
                  <option value="">Select Sort By </option>
                  {sortByOption?.map((option) => (
                    <option label={option?.name} key={uuid()} value={option?.urlValue}>
                      {option?.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid-section d-row">
              {mainProductList?.map((product, pInd) => (
                <ProductBox
                  product={{
                    slug: product.slug,
                    image: product?.default_image
                      ? product?.default_image
                      : IMAGE_PATH.noImagePng,
                    title: product.title,
                    is_available_for_order: product.is_available_for_order,
                    product_id: product.product_id,
                    website_product_id: product.website_product_id,
                    is_discounted: product.is_discounted,
                    discount_per: product.discount_per,
                    product_tag_name: product.product_tag_name,
                    is_fix_price: product.is_fix_price,
                    diamond_total_carat: product.diamond_total_carat,
                    net_weight: product.net_weight,
                    total_price: product.total_price,
                    currency_symbol: product.currency_symbol,
                    original_total_price: product.original_total_price,
                    sku: product.sku,
                    is_in_wishlist: product?.is_in_wishlist
                  }}
                  setIsQuickView={() => setIsQuickView(true)}
                  setQuickViewSlug={() => setQuickViewSlug(product?.slug)}
                  product_tags_detail={product_tags_detail}
                  wishListData={wishListData}
                  key={pInd}
                  addtoWishList={() => addtoWishList(product)}
                  type={type}
                />
              ))}
            </div >
            {totalRecords !== 0 ? (
              paginationRange &&
              paginationRange?.length > 1 && (
                <div className="product-pagination">
                  <ul>
                    <li
                      onClick={() => {
                        if (getUserDetails() || (!getUserDetails() && isPriceDisplay)) {
                          onPrevious();
                        } else {
                          router.replace("/sign-in");
                        }
                      }}
                    >
                      <a className={`btn btn-previous ${page === 1 ? "hidden" : ""}`}>
                        <i className="icon jkm-arrow-right jkms2-arrow-right"></i>
                      </a>
                    </li>
                    {paginationRange &&
                      paginationRange.map((pageNumber, eInd) => {
                        return (
                          <li key={eInd}>
                            <a
                              onClick={() => {
                                if (!getUserDetails() && forceLogin) {
                                  router.replace("/sign-in");
                                } else {
                                  setPage(
                                    (pageNumber === APPCONFIG.DOTS
                                      ? page != lastPage
                                        ? page + 1
                                        : page - 1
                                      : pageNumber) as number
                                  );
                                }
                              }}
                              className={pageNumber === page ? "active" : ""}
                            >
                              {pageNumber}
                            </a>
                          </li>
                        );
                      })}
                    {
                      <li
                        onClick={() => {
                          if (!getUserDetails() && forceLogin) {
                            router.replace("/sign-in");
                          } else {
                            onNext();
                          }
                        }}
                      >
                        <a
                          className={`btn btn-next ${page === lastPage ||
                            totalRecords < parseInt(APPCONFIG.PRODUCT_LIST_PAGE_LIMIT) ? "hidden" : ''
                            }
                          `}
                        >
                          <i className="icon jkm-arrow-right jkms2-arrow-right"></i>
                        </a>
                      </li>
                    }
                  </ul>
                </div>
              )
            ) : // @ts-ignore
              !loaderData?.loaderRootReducer?.loadingState ? (
                <NoDataAvailable title="No Products found..!!">
                  <Link href="/">
                    <a className="btn btn-secondary btn-small">Go to Home</a>
                  </Link>
                </NoDataAvailable>
              ) : (
                <></>
              )}
          </div >
        </div >
      </section >

      {/* Product Quick View - Start */}
      {isQuickView ? (
        getComponents(templateType, "quick_view", {
          isModal: isQuickView,
          slug: quickViewSlug,
          onClose: onCloseQuickView,
        }, domainName, slugInfo)
      ) : (
        <></>
      )}
      {/* Product Quick View - End */}
    </>
  );
};

export default IProductListSection1;
