
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";

import Head from "next/head";
import React from "react";
import { ICollectionBannerProps } from "@templates/Collection/components/CollectionBanner";
import CustomImage from "@components/CustomImage/CustomImage";

const CollectionBanner1 = ({ data }: ICollectionBannerProps) => {

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.collectionBannerWithText)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.collectionBannerSaperator)} />

      </Head>
      <section className="banner-sec">
        {data?.map((val, index) => {
          return (

            <div key={index} className="banner-image-wrap">
              <CustomImage
                src={val?.banner_image?.path}
                alt={"collection"}
                title={"collection"}
                height="500px"
                width="1920px"
              />

              <div className="banner-content">
                <h2>{val?.banner_title}</h2>
                <div className="seperator"></div>
                {/* <h4>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry</h4> */}
              </div>
            </div>
          )
        })}

      </section>
    </>
  );
};

export default CollectionBanner1;
