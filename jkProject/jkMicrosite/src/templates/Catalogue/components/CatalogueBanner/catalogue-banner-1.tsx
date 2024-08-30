import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import React from "react";
import { ICatalogueBannerProps } from "@templates/Catalogue/components/CatalogueBanner";
import CustomImage from "@components/CustomImage/CustomImage";
import Link from "next/link";

const CatalogueBanner1 = ({ data }: ICatalogueBannerProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(
            null,
            CSS_NAME_PATH.catalogueBannerWithText
          )}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(
            null,
            CSS_NAME_PATH.catalogueBannerSaperator
          )}
        />
      </Head>
      <Link href={data?.[0]?.link || ""}>
        <a>
          <section className="banner-sec">
            <div className="banner-image-wrap">
              <CustomImage
                src={data?.[0]?.banner_image?.path}
                alt={"Catalogue"}
                title={"Catalogue"}
                height="780px"
                width="1920px"
              />
              <div className="banner-content">
                <h2>{data?.[0]?.banner_title}</h2>
                <div className="seperator"></div>
                {/* <h4>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry</h4> */}
              </div>
            </div>
          </section>
        </a>
      </Link>
    </>
  );
};

export default CatalogueBanner1;
