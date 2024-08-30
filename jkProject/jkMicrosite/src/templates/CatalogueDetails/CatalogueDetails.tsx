import React, { useEffect } from "react";
import Head from "next/head";
import IBannerSection1 from "@templates/ProductList/components/BannerSection";
import IProductListSection1 from "@templates/ProductList/components/ProductListSection/product-list-section-1";
import APPCONFIG from "@config/app.config";
import { ICatalogueDetailsProps } from "@templates/CatalogueDetails";
import { setDynamicDefaultStyle } from "@util/common";

interface CatalogDetailsProps extends ICatalogueDetailsProps {
  type?: number
}
const CatalogDetails = (props: CatalogDetailsProps) => {
  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
    // eslint-disable-next-line
  }, []);
  return (
    <>
      <Head>
        <title>{props?.meta?.title ? props?.meta?.title : props?.domainName}</title>
      </Head>
      <IBannerSection1
        title={props?.data?.catalogue_banner?.[0]?.title}
        image={props?.data?.collection_banner?.[0]?.desktop_image?.path}
        mobileImage={props?.data?.collection_banner?.[0]?.mobile_image?.path}
        description={props?.data?.catalogue_banner?.[0]?.description}
      />

      <IProductListSection1
        commingFromOther={true}
        pageName={APPCONFIG.PRODUCT_LIST_WITH_FILTER.catalogue}
        domainName={props?.domainName}
        slugInfo={props?.slugInfo}
        type={props?.type}
      />
    </>
  );
};

export default CatalogDetails;
