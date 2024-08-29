import React, { useEffect, useState } from "react";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import APICONFIG from "@config/api.config";
import pagesServices from "@services/pages.services";
import { ChildCategory, ICatalogueList1Props, ParentCategory } from "@type/Pages/catalogue";
import { IProductData1, IProductListMainProps } from "@type/Pages/productList";

const CatalogueList1 = (props: ICatalogueList1Props) => {
  const [menu, setMenu] = useState<number>(0)
  const [productList, setProductList] = useState<IProductListMainProps>()
  const [pageParam, setPageParam] = useState<{
    page_offset: number,
    page_limit: number,
    category_type: null | string,
  }>({
    page_offset: 0,
    page_limit: 10,
    category_type: null,
  });

  const getProductListing = async () => {
    await pagesServices
      .postPage(APICONFIG.PRODUCT_LIST, { ...pageParam })
      .then((result) => {
        if (result.meta && result.status_code == 200) {
          setProductList(result?.data);
        }
      });
  };

  useEffect(() => {
    if (!pageParam?.category_type) {
      return
    }
    getProductListing()
  }, [pageParam?.page_offset, pageParam?.category_type])


  return (
    <>
      <Head>
        <title>Category List</title>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.categoriesBoxListing)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.filterBar)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productBox)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productListingBox)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.categoryListing)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.pagination)} />
      </Head>
      <section className="listing-category-section">
        <div className="container">
          {
            props?.list?.[0]?.parent_category?.length > 0 &&
            <aside className="listing-category-sidebar">
              <div className="category-menu-open" role="button" aria-label="category-menu-open-btn">
                <em className="osicon-bar"></em>
                <span>Categories</span>
              </div>
              <div className="listing-category-wrapper">
                <div className="listing-category-menu">
                  <div className="category-menu-close">
                    <em className="osicon-close" role="button" aria-label="category-menu-close-btn"></em>
                  </div>
                  {
                    props?.list?.[0]?.parent_category?.map((i: ParentCategory, index: number) => (
                      <div className={`listing-category-list-wrap ${menu === index ? 'active' : ''}`} key={i?.name}
                        onClick={() => setMenu(index)}
                      >
                        <div className="listing-category-title">
                          <span>{i?.name}</span>
                          <i className="osicon-cheveron-down"></i>
                        </div>
                        <ul>
                          {
                            i?.child_category?.map((sub: ChildCategory) => (
                              <li key={sub?.name}><a onClick={() => {
                                setPageParam({
                                  ...pageParam,
                                  category_type: `${i?.url}/${sub?.url}`
                                })
                              }}>{sub?.name}<i className="osicon-plus"></i></a></li>
                            ))
                          }
                        </ul>
                      </div>
                    ))
                  }
                  <div className="category-bottom-button">
                    <button className="btn btn-border-small" type="button" aria-label="clear-all-btn">clear all</button>
                  </div>
                </div>
              </div>
            </aside>
          }

          <div className="products-listing-main">
            <div className="product-listing-wrapper">
              {props?.list?.[0]?.parent_category?.[menu]?.child_category.length > 0 ?
                props?.list?.[0]?.parent_category?.[menu]?.child_category?.map((i: ChildCategory) => (
                  <Link href={`/products/${props?.list?.[0]?.parent_category?.[menu]?.url}/${i?.url}`} key={i?.name}>
                    <a>
                      <div className="product-listing-box" key={i?.name}>
                        <figure className="product-listing-img">
                          <picture>
                            <img src={i?.image || '../assets/images/category-1.png'} alt="product-category"
                              title="product-category" height="319" width="319" />
                          </picture>
                        </figure>
                        <div className="product-listing-content" style={{ width: '100%' }}>
                          <span>{i?.name}</span>
                          <p>
                            {i?.description}
                          </p>
                        </div>
                      </div>
                    </a>
                  </Link>
                ))
                :
                <h1>No sub category found</h1>
              }
            </div>
            <div className="showing-results-section">
              {
                !productList?.data?.length ?
                  <h1 className="no-product-found">No Products Available</h1> :
                  <>
                    <div className="filter-bar">
                      {/* <div className="filter-bar-menu">
                        <em className="osicon-dashboard"></em>
                        <em className="osicon-bar"></em>
                      </div> */}
                      <div className="filter-bar-showing-result">
                        <span>Showing {pageParam?.page_offset + 1}-{pageParam?.page_offset + 10} of {productList?.totalRecords} Results</span>
                      </div>
                      <div className="filter-bar-categories-wrap">
                        <select className="filter-bar-categories form-select" aria-label="filter-bar-categories">
                          <option>A to Z</option>
                          <option>Z to A</option>
                        </select>
                      </div>
                    </div>
                    <div className="products-wrapper">
                      {
                        productList?.data?.map((i: IProductData1) => (
                          <div className="product-box" key={i?.title}>
                            <figure>
                              <picture>
                                <img src={i?.default_image || "/assets/images/product1.jpg"} alt="product-img" title="product-img"
                                  height="280" width="280" />
                              </picture>
                            </figure>
                            <p className="product-description">{i?.title}</p>
                            <span className="product-price">${Number(i?.selling_price)?.toFixed(2)}</span>
                            <button className="btn btn-primary">ADD TO CART</button>
                          </div>
                        ))
                      }
                    </div>
                    <div className="pagination-wrap">
                      <ul className="product-pagination">
                        <li className="active"><a href="javascript:void(0)" className="active">1</a></li>
                        <li><a href="javascript:void(0)">2</a></li>
                        <li><a href="javascript:void(0)">3</a></li>
                        <li><a href="javascript:void(0)" className="dots">.....</a></li>
                        <li><a href="javascript:void(0)">23</a></li>
                        <li><a href="javascript:void(0)"><em className="osicon-cheveron-down"></em></a></li>
                      </ul>
                    </div>
                  </>
              }
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CatalogueList1;
