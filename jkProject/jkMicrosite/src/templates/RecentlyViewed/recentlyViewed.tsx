import React, { useEffect } from "react";
import { getComponents } from "./components";
import { IRecentlyViewedListMain } from "@templates/RecentlyViewed";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import { setDynamicDefaultStyle } from "@util/common";

const RecentlyViewed = (props: IRecentlyViewedListMain) => {
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
        {/* For Template 1 */}
        {/* <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.recenltyViewed + ".min.css"} /> */}

        {/* For Template 2 */}

        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.recenltyViewed2 +
            ".min.css"
          }
        />
      </Head>
      <main>
        {props.sequence?.map((ele) =>
          getComponents(
            props?.data?.type as string,
            ele,
            props?.data,
            props?.slugInfo?.product_tags_detail,
          )
        )}
      </main>
    </>
  );
};

export default RecentlyViewed;
