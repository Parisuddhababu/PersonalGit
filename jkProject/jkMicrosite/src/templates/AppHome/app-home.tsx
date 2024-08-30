import React from "react";
import { getComponents } from "@templates/AppHome/components";
import { IAppHome } from ".";
import Head from "next/head";
import { API_SECTION_NAME } from "@config/apiSectionName";
import Meta, { SlugInfoProps } from "@components/Meta";

const AppHome = (props: IAppHome) => {

  return (
    <>
      <Head>
        {/* <link rel="stylesheet" href={"/assets/css/pages/index-2.css"} /> */}
        <link rel="stylesheet" href={"/assets/css/pages/reset.css"} />
      </Head>
      <Meta meta={props.slugInfo as SlugInfoProps} domainName={props?.domainName} micrositeName={props?.micrositeName}/>
      <main>
        <div className="wrapper">
          {getComponents(props?.data?.home_banner?.banner1?.type, "banner_section", props?.data?.home_banner)}

          {props?.sequence?.map((ele) =>
            getComponents(
              ele === API_SECTION_NAME.home_subscribe_newsletter
                ? props?.data?.[`${API_SECTION_NAME.home_subscribe_newsletter}_type`]
                : props?.data?.[ele]?.type,
              ele,
              {
                data: props?.data?.[ele]?.data,
                dynamic_title: {
                  customise_jewellery_title: props?.data?.customize_jewellery?.customise_jewellery_title,
                  our_product_category_title: props?.data?.category?.our_product_category_title,
                  our_benefit_title: props?.data?.our_benefits?.our_benefit_title,
                  testimonial_title: props?.data?.testimonials?.testimonial_title,
                  testimonial_tagline: props?.data?.testimonials?.testimonial_tagline,
                  subscribe_news_title: props?.data?.aboutus_data?.subscribe_news_title,
                  subscribe_news_tagline: props?.data?.aboutus_data?.subscribe_news_tagline,
                },
                testimonial_bg_image: props?.data?.testimonials?.testimonial_bg_image?.path,
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
