import React, { Fragment } from "react";
import HomePageMiddleSectionProducts from "@components/HomePageMiddleSection";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { IHomeSection, IMiddleSection } from "@type/Pages/home";

export const HomePageProductList = (props: IHomeSection) => {
  return (
    <Fragment>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeProducts)} />
      </Head>
      {
        props?.middle_section?.map((i:IMiddleSection) => (
          <HomePageMiddleSectionProducts
            data={i}
            key={i?._id}
          />
        ))
      }
    </Fragment>
  );
};

export default HomePageProductList;
