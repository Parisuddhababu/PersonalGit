import React, { useEffect } from "react";
import Head from "next/head";
import IBannerSection1 from "@templates/ProductList/components/BannerSection";
import IProductListSection1 from "@templates/ProductList/components/ProductListSection/product-list-section-1";
import APPCONFIG from "@config/app.config";
import { ICollectionueDetailsProps } from "@templates/CollectionDetails";
import { setDynamicDefaultStyle } from "@util/common";

interface CollectionDetailsProps extends ICollectionueDetailsProps {
  type?: number
}

const CollectionDetails = (props: CollectionDetailsProps) => {
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
        title={props?.data?.collection_banner?.[0]?.title}
        image={props?.data?.collection_banner?.[0]?.banner_image?.path}
        mobileImage={props?.data?.collection_banner?.[0]?.mobile_image?.path}
        description={props?.data?.collection_banner?.[0]?.description}
      />

      <IProductListSection1
        commingFromOther={true}
        pageName={APPCONFIG.PRODUCT_LIST_WITH_FILTER.collection}
        domainName={props?.domainName}
        slugInfo={props?.slugInfo}
        type={props?.data?.product_list_type}
      />
    </>
  );
};

export default CollectionDetails;
