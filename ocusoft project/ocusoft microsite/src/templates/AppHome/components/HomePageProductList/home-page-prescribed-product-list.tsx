import React, { Fragment, useEffect, useState } from "react";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { IHomeSection } from "@type/Pages/home";
import HomePagePrescription from "@components/HomePagePrescription";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";
import HomePageRecommededProducts from "@components/homepageRecommendedProducts/RecommendedProducts";

export const HomePagePrescribedProductList = (props: IHomeSection) => {
  const [prescribedProducts, setPrescribedProducts] = useState([]);
  const [recommendedProducts,setRecommendedProducts]=useState([]);
  

  useEffect(() => {
    getHomePage()
  }, [])
  const getHomePage = () => {
    pagesServices
      .getPage(APICONFIG.HOME_PAGE, {})
      .then((result) => {
        if (result?.data?.prescribed_products?.length) {
          setPrescribedProducts(result?.data?.prescribed_products)
        }
        if (result?.data?.recommended_products?.length){
          setRecommendedProducts(result?.data?.recommended_products);
        }
      })
  }
  return (
    <Fragment>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeProducts)} />
      </Head>
      {
        prescribedProducts?.length > 0 &&
        <HomePagePrescription data={prescribedProducts} />
      }
        {
        recommendedProducts?.length > 0 &&
        <HomePageRecommededProducts data={recommendedProducts} />
      }
    </Fragment>
  );
};

export default HomePagePrescribedProductList;
