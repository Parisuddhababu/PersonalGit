import React from "react";
import { IAboutUsBannerProps } from ".";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

const AboutUsBanner1 = ({ data }: IAboutUsBannerProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("", CSS_NAME_PATH.homeAboutUs)}
        />
      </Head>
      <section className="banner-with-breadcrumb banner-section cms-banner">
        <figure className="banner-with-breadcrumb-bg-img">
          <picture>
            <img src={data?.banner_image?.path} alt="banner-image" title="banner-image" height="350" width="1920" />
          </picture>
        </figure>
      </section>
    </>
  );
};

export default AboutUsBanner1;



