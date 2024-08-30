import React, { useEffect, useState } from "react";
import { getComponents } from "@templates/ProductList/components";
import {
  ICategoryProducts,
  IProductCategories,
  IProductListProps,
  ProductListingBreadcrumbs,
} from "@templates/ProductList/index";
import { useRouter } from "next/router";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";

const ProductList = ({ domainName, slugInfo }: IProductListProps) => {
  const [breadCrumbData, setBreadCrumbData] = useState<ProductListingBreadcrumbs>([]);
  const [categories, setCategories] = useState<ICategoryProducts[]>([]);
  const router = useRouter();
  const { slug, query, param1 } = router.query;

  const getCategoryListing = async () => {
    await pagesServices
      .getPage(APICONFIG.CATEGORY_LIST, {})
      .then((result) => {
        if (!result?.meta || result?.status_code !== 200) {
          return
        }
        const categoryResult = result?.data?.categories
        const breadCrumbs: ProductListingBreadcrumbs = []
        let categoryList = []
        if (slug) {
          const category = categoryResult?.[0]
          breadCrumbs.push({
            image: category?.image,
            title: category?.name,
            slug: `/${category?.url}`
          })
          categoryList = category?.parent_category?.map((i: IProductCategories) => {
            return {
              ...i,
              url: `/${slug}/${i?.url}`
            }
          })
        }
        if (query) {
          const category = categoryResult?.[0]?.parent_category?.filter((i: IProductCategories) => i.url === query)
          breadCrumbs.push({
            image: category?.[0]?.image,
            title: category?.[0]?.name,
            slug: `/${slug}/${query}/${category?.[0]?.url}`
          })
          categoryList = category?.[0]?.child_category?.map((i: IProductCategories) => {
            return {
              ...i,
              url: `/${slug}/${query}/${i?.url}`
            }
          })
        }
        if (param1) {
          const categoryIndex = categoryResult?.[0]?.parent_category?.findIndex((i: IProductCategories) => i.url === query)
          const childCategory = categoryResult?.[0]?.parent_category?.[categoryIndex]?.child_category?.filter((i: IProductCategories) => i.url === param1)
          breadCrumbs.push({
            image: childCategory?.[0]?.image,
            title: childCategory?.[0]?.name,
            slug: `/${slug}/${query}/${childCategory?.[0]?.url}`
          })
          categoryList = [childCategory?.[0]]
        }
        setBreadCrumbData(breadCrumbs);
        setCategories(categoryList || [])
      });
  }

  useEffect(() => {
    getCategoryListing();
  }, [router.asPath]);


  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.categoriesBoxListing)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.filterBar)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productBox)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productListingBox)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.categoryListing)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.pagination)} />
        <link rel="stylesheet" href="/assets/css/common/common.min.css" />
      </Head>
      <main>
        {[
          "category_banner",
          "product_list_with_filter_options",
        ]?.map((ele) =>
          getComponents(
            // @ts-ignore
            1,
            ele,
            { breadCrumbData },
            domainName,
            slugInfo,
            {},
            categories
          )
        )}
      </main>
    </>
  );
};

export default ProductList;
