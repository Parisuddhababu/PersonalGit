import React from "react";
import { getComponents } from "@templates/AppHome/components";
import { IAppHome } from "@templates/AppHome/index";
import { API_SECTION_NAME } from "@config/apiSectionName";
import Head from "next/head";

const AppHome = (props: IAppHome) => {
  const banner1Data = props?.data?.home_banner?.banner1?.data;
  const banner2Data = props?.data?.home_banner?.banner2?.data;
  const componentData = {} as any
  if (banner1Data && banner1Data.length > 0) {
    componentData.banner1 = banner1Data;
  }
  if (banner2Data && banner2Data.length > 0) {
    componentData.banner2 = banner2Data;
  }
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <main>
        <div className="wrapper">
          {getComponents(props?.data?.home_banner?.banner1?.type, "banner_section", componentData)}
          {getComponents('2', "prescribed_products", {})}
          {getComponents('2', "middle_section", props?.data)}
          {props?.sequence?.map((ele) =>
            getComponents(
              ele === API_SECTION_NAME.home_subscribe_newsletter
                ? props?.data?.[`${API_SECTION_NAME.home_subscribe_newsletter}_type`]
                : props?.data?.[ele]?.type,
              ele,
              {
                data: props?.data?.[ele]?.data,
                dynamic_title: {
                  our_product_category_title: props?.data?.category?.our_product_category_title,
                  subscribe_news_title: props?.data?.aboutus_data?.subscribe_news_title,
                  subscribe_news_tagline: props?.data?.aboutus_data?.subscribe_news_tagline,
                },
                product_tags_detail: props?.slugInfo?.product_tags_detail
              }
            )
          )}
        </div>
      </main>
    </>
  );
};

export default AppHome;
