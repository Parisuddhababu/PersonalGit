
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";

import Head from "next/head";
import React from "react";
import { IReferEarnBannerProps } from "@templates/refer-earn/components/Banner/index";
import CustomImage from "@components/CustomImage/CustomImage";

const ReferEarnBanner1 = ({ data }: IReferEarnBannerProps) => {

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.bannerWithText)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.bannerSaperator)} />

      </Head>
      <section className="banner-sec">
        {data?.map((val, index) => {
          return (
            <div className="banner-image-wrap" key={index}>
              <CustomImage
                  src={val?.banner_image?.path}
                  alt={"Refer and Earn"}
                  title={"Refer and Earn"}
                  height="500px"
                  width="1920px"
                />
              <div className="banner-content">
                <h2>{val?.banner_title}</h2>
                <div className="seperator"></div>
                <p>Share your referral Code and invite your friends.</p>
              </div>
            </div>
          )
        })}

      </section>
    </>
  );
};

export default ReferEarnBanner1;
