import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from "next/link";
import { useRouter } from 'next/router';
import pagesServices from '@services/pages.services';
import APICONFIG from '@config/api.config';
import ProductBox from './product-box';
import APPCONFIG from '@config/app.config';
import { useDispatch } from 'react-redux';
import { setLoader } from 'src/redux/loader/loaderAction';
import Pagination from './pagination';
import { IProductBox, IProductCategories, ProductListProps } from '@templates/ProductList';

const IProductListSection1 = (props: ProductListProps) => {
  const [productList, setProductList] = useState<IProductBox[]>([])
  const [categoryVisible, setCategoryVisible] = useState(true)
  const [pageParam, setPageParam] = useState({
    page_offset: 0,
    page_limit: 10,
    sort_param: 'created_at',
    sort_type: 'desc',
    page: 1,
  });
  const router = useRouter();
  const dispatch = useDispatch();
  const [categoryToggleMobile, setCategoryToggleMobile] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const { slug, query, param1 } = router.query;

  const getProductListing = async () => {
    let obj: any = {
      ...pageParam
    };
    if (param1) {
      obj["sub_category"] = param1;
    }
    if (!param1 && query) {
      obj["category"] = query;
    }
    if (!param1 && !query && slug) {
      obj["category_type"] = slug;
    }
    dispatch(setLoader(true));
    await pagesServices
      .postPage(APICONFIG.PRODUCT_LIST, obj)
      .then((result) => {
        dispatch(setLoader(false));
        if (result.meta && result.status_code == 200) {
          setTotalRecords(result?.data?.totalRecords)
          setProductList(result?.data?.data);
        }
      }).catch(() => {
        dispatch(setLoader(false))
      })
  };

  useEffect(() => {
    getProductListing()
  }, [pageParam, router.asPath])

  const categoryToggle = () => {
    setCategoryVisible(prev => !prev)
  }
  const categoryToggleMob = () => {
    setCategoryToggleMobile(prev => !prev)
  }

  const backToPrevCategory = () => {
    router.back()
  }

  const onSort = (val: string) => {
    const sort = APPCONFIG.PRODUCT_SORT_BY.filter(i => i.name === val)
    if (!sort.length) {
      return
    }
    setPageParam({
      ...pageParam,
      sort_param: sort?.[0]?.field,
      sort_type: sort?.[0]?.sortby,
      page_limit: 10,
      page_offset: 0,
    })
  }
  const pages = useMemo(() => {
    if (!totalRecords) {
      return 0
    }
    return Math.ceil(totalRecords / pageParam?.page_limit)
  }, [totalRecords])

  const onPageChange = useCallback((page: number) => {
    const newPageOffset = page > pageParam?.page ? pageParam.page_offset + pageParam?.page_limit :
      pageParam.page_offset - pageParam?.page_limit;
    setPageParam({
      ...pageParam,
      page_offset: newPageOffset,
      page,
    });
  }, [pageParam, totalRecords]);

  return (
    <section className="listing-category-section">
      <div className="container">
        <aside className="listing-category-sidebar">
          <div className="category-menu-open" role="button"
            aria-label="category-menu-open-btn"
            onClick={categoryToggleMob}
          >
            <em className="osicon-bar"></em>
            <span>Categories</span>
          </div>
          <div className={`listing-category-wrapper ${categoryToggleMobile ? 'category-overlay' : ''}`}>
            <div className="listing-category-menu">
              <div className="category-menu-close" onClick={categoryToggleMob}>
                <em className="osicon-close" role="button" aria-label="category-menu-close-btn"></em>
              </div>
              <div className={`listing-category-list-wrap`}>
                <div className="listing-category-title" onClick={categoryToggle}>
                  <span>Categories</span>
                  <i className="osicon-cheveron-down"></i>
                </div>
                <ul>
                  {
                    categoryVisible && props?.categories?.map((category: IProductCategories) => (
                      <li key={category?.name}>
                        {
                          param1 != undefined ?
                            <a>
                              {category?.name}
                              {
                                param1 != undefined &&
                                <i className="osicon-plus" onClick={backToPrevCategory}></i>
                              }
                            </a> :
                            <Link href={category?.url}>
                              <a>
                                {category?.name}
                              </a>
                            </Link>
                        }
                      </li>
                    ))
                  }
                </ul>
              </div>
              {
                param1 != undefined &&
                <div className="category-bottom-button" onClick={backToPrevCategory}>
                  <button className="btn btn-border-small" type="button" aria-label="clear-all-btn">clear all</button>
                </div>
              }
            </div>
          </div>
        </aside>

        <div className="products-listing-main">
          <div className="showing-results-section">
            {
              !productList?.length ?
                <h1 className="no-product-found">No Products Available</h1> :
                <>
                  <div className="filter-bar">
                    <div className="filter-bar-showing-result">
                      <span>Showing {pageParam?.page_offset + 1}-{(pageParam?.page_offset + pageParam?.page_limit) > totalRecords ?
                        totalRecords : pageParam?.page_offset + pageParam?.page_limit} of {totalRecords} Results</span>
                    </div>
                    <div className="filter-bar-categories-wrap">
                      <select className="filter-bar-categories form-select" onChange={(e) => onSort(e.target.value)}>
                        {
                          APPCONFIG.PRODUCT_SORT_BY.map((i) => (
                            <option value={i.name} key={i.name}>{i.name}</option>
                          ))
                        }
                      </select>
                    </div>
                  </div>
                  <div className="products-wrapper">
                    {
                      productList?.map((i: IProductBox) => (
                        <ProductBox
                          item={{
                            product_id: i?.website_product_id,
                            slug: i?.slug,
                            base_image: i?.default_image,
                            title: i?.title,
                            selling_price: i?.total_price
                          }}
                          key={Number(i?.website_product_id)}
                        />
                      ))
                    }
                  </div>
                  {
                    totalRecords && totalRecords > 0 && pages > 1 &&
                    <Pagination
                      totalPages={pages}
                      onPageChange={onPageChange}
                    />
                  }
                </>
            }
          </div>
        </div>
      </div>
    </section>


  );
};

export default IProductListSection1;
