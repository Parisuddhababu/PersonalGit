import React, { useEffect } from "react";
import { getComponents } from "@templates/ProductDetails/components";
import Head from "next/head";
import { IProductDetailsMain } from "@templates/ProductDetails";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { API_SECTION_NAME } from "@config/apiSectionName";
import { setDynamicDefaultStyle } from "@util/common";

const ProductDetails = (props: IProductDetailsMain) => {
  const metaTitle = props?.slugInfo?.slug_info?.slug_detail?.meta_title || (props?.data?.seo_details?.meta_title ? props?.data?.seo_details?.meta_title : `${props.data?.title} | ${props?.domainName}`);

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
      {/* <NextSeo
        title={metaTitle}
        openGraph={{
          title: metaTitle,
        }}
      /> */}
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.prodDetailMain +
            ".min.css"
          }
        />
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />
        <title>{metaTitle}</title>
        {/* <meta
          name="title"
          content={metaTitle}
        /> */}
      </Head>
      <main>
        {
          props?.sequence?.map((ele) =>
            getComponents(
              ele ===
                API_SECTION_NAME.product_and_shipping_details ||
                ele === API_SECTION_NAME.product_similar_views ||
                ele === API_SECTION_NAME.match_products ||
                ele === API_SECTION_NAME.pair_products ||
                ele === API_SECTION_NAME.explore_other_designs ||
                ele === API_SECTION_NAME.QUICK_LINKS
                ? props?.data?.[ele]?.type
                : props?.data?.[ele + "_type"],
              ele,
              {
                data: props?.data,
              },
              props?.slugInfo?.product_tags_detail,
            )
          )
        }
      </main>
    </>
  );
};

export default ProductDetails;
