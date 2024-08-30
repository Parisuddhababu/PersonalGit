import React, { useEffect } from "react";
import { getComponents } from "@templates/ProductDetails/components";
import Head from "next/head";
import { IProductDetailsMain } from "@templates/ProductDetails";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { API_SECTION_NAME } from "@config/apiSectionName";
import { getTypeBasedCSSPath, getTypeBasedCSSPathPages, setDynamicDefaultStyle } from "@util/common";

const ProductDetails = (props: IProductDetailsMain) => {

  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
  }, []);

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPathPages(null, CSS_NAME_PATH.prodDetailMain)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.toasterDesign)} />
      </Head>
      <main>
        {
          props?.sequence?.map((ele) =>
            getComponents(
                ele === API_SECTION_NAME.product_similar_views ||
                ele === API_SECTION_NAME.match_products ||
                ele === API_SECTION_NAME.pair_products ||
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
