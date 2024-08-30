// import { getComponents } from "@templates/ProductList/components";
import Head from "next/head";
import { IProductListMainProps } from "@templates/ProductList/components/ProductListSection";
import APPCONFIG from "@config/app.config";
import useProductListFilter from "@components/Hooks/products/useProductListFilter";
import { IListMainProductProps } from "@type/Pages/productList";
import { useEffect, useState } from "react";
import { IFilterOptions } from "@type/Pages/ProductFilters";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import {
  getParseUser,
  getTypeBasedCSSPath,
  getUserDetails,
} from "@util/common";
import { usePagination } from "@components/Hooks/products/usePagination";
import NoDataAvailable from "@components/NoDataAvailable/NoDataAvailable";
import useAddtoWishList from "@components/Hooks/addtoWishList/addtoWishList";
import {
  IAddtoWishList,
  IRemoveWishList,
} from "@components/Hooks/addtoWishList";
import { useSelector } from "react-redux";
import Loader from "@components/customLoader/Loader";
import { getCurrentWishListItems } from "@util/addGuestCartData";
import { useRouter } from "next/router";
import Link from "next/link";
import { getComponents } from "@templates/ProductList/components";
import Cookies from "js-cookie";
import ProductBox from "./product-box";
import { IMAGE_PATH } from "@constant/imagepath";

const ProductListSection2 = ({
  FilterOptions,
  commingFromOther,
  pageName,
  product_tags_detail,
  domainName,
  slugInfo,
  type
}: IProductListMainProps) => {
  const t2ListPageLimit = "15";
  const {
    filter,
    urlFilterData,
    onAppliedFilterChange,
    sortByOption,
    totalRecords,
    productList,
    sortByProd,
    templateType,
    page,
    onSortChange,
    setPage,
    getProductList,
    getLeftFilterList
  } = useProductListFilter({
    FilterOptions: FilterOptions,
    commingFromOther: commingFromOther,
    pageName: pageName,
    ListLimit: t2ListPageLimit,
  });
  const { adddtoWishListProduct, removeWishListProduct, getWishListData } =
    useAddtoWishList();
  const [wishListData, setWishListData] = useState([]);
  const loaderData = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const paginationRange = usePagination({
    totalCount: totalRecords,
    pageSize: parseInt(t2ListPageLimit),
    siblingCount: 1,
    currentPage: page,
  });
  const forceLogin = parseInt(Cookies.get("forceLogin") ?? '') === 1 ? true : false;


  const [isQuickView, setIsQuickView] = useState<boolean>(false);
  const [quickViewSlug, setQuickViewSlug] = useState<string>();
  const router = useRouter();

  const [mainProductList, setMainProductList] =
    useState<IListMainProductProps[]>(productList);
  const [filterList, setFilterList] = useState<IFilterOptions[]>(filter);
  const [url, setURL] = useState<string>(router.asPath);

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
      const itemArray = gueatWishlist.map(
        (ele: IAddtoWishList) => ele?.item_id
      );
      setWishListData(itemArray);
    }
  };
  const onNext = () => {
    setPage(page + 1);
  };
  const onPrevious = () => {
    setPage(page - 1);
  };
  const lastPage = paginationRange
    ? paginationRange[paginationRange.length - 1]
    : null;

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

  return (
    <>
      {/* @ts-ignore */}
      {loaderData?.loaderRootReducer?.loadingState && <Loader />}
      {isLoading && <Loader />}
      <section className="listing-sec" id="main-product-list">
        <div className="container">
          <div className="listing-wrape">
            <section className="product-section">
              <div className="products-grid-section">
                <div className="products-results">
                  <div className="left-section">
                    <p>
                      Showing{" "}
                      {mainProductList?.length
                        ? page === 1
                          ? page
                          : (page - 1) * parseInt(t2ListPageLimit)
                        : 0}{" "}
                      –{" "}
                      {page === 1
                        ? mainProductList?.length > 0
                          ? mainProductList?.length < Number(t2ListPageLimit)
                            ? mainProductList?.length
                            : t2ListPageLimit
                          : 0
                        : (page - 1) * parseInt(t2ListPageLimit) +
                        parseInt(t2ListPageLimit)}{" "}
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
                      {sortByOption?.map((option, eInd) => (
                        <option
                          label={option?.name}
                          key={eInd}
                          value={option?.urlValue}
                        >
                          {option?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid-section row">
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
                        is_in_wishlist: product.is_in_wishlist
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
                </div>

                {totalRecords !== 0 ? (
                  <div className="product-pagination">
                    <ul>
                      <li
                        onClick={() => {
                          if (
                            getUserDetails() ||
                            (!getUserDetails() && forceLogin)
                          ) {
                            onPrevious();
                          } else {
                            router.replace("/sign-in");
                          }
                        }}
                      >
                        <a
                          className={`btn btn-previous ${page === 1 ? "hidden" : ""
                            }`}
                        >
                          <i className="icon jkms2-arrow-right"></i>
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
                            if (
                              getUserDetails() ||
                              (!getUserDetails() && forceLogin)
                            ) {
                              onNext();
                            } else {
                              router.replace("/sign-in");
                            }
                          }}
                        >
                          <a
                            className={`btn btn-next ${page === lastPage ||
                              totalRecords < parseInt(t2ListPageLimit)
                              ? "hidden"
                              : ""
                              }`}
                          >
                            <i className="icon jkms2-arrow-right"></i>
                          </a>
                        </li>
                      }
                    </ul>
                  </div>
                ) : (
                  <NoDataAvailable title="No Products found..!!">
                    <Link href="/">
                      <a className="btn btn-secondary btn-small">Go to Home</a>
                    </Link>
                  </NoDataAvailable>
                )}
              </div>
            </section>
            {filterList &&
              filterList?.length > 0 &&
              getComponents(templateType, "filter_section", {
                options: filterList,
                applyFilterData: (data: any, url: string) => onAppliedFilterChange(data, url),
                URLFilterData: urlFilterData,
              })}
          </div>
        </div>
      </section>
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
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.productListGrid2)}
        />
        {/* <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.productCard2)}
        /> */}
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />
      </Head>
    </>
  );
};

export default ProductListSection2;
