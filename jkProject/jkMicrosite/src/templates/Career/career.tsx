import React, { useEffect } from "react";
import { getComponents } from "@templates/Career/components/index";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import { setDynamicDefaultStyle } from "@util/common";
import { API_SECTION_NAME } from "@config/apiSectionName";
import { ICareerMain } from ".";

const Career = (props: ICareerMain) => {
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
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.careers + ".min.css"
          }
        />
      </Head>
      <main>
        <div className="wrapper">
          {props.sequence?.map((ele) =>
            getComponents(
              props?.data?.[`${ele}_type`] as string,
              ele,
              ele === API_SECTION_NAME.banner_with_searchbox
                ? props?.data?.[ele]?.[0]
                : props?.data?.[ele]
            )
          )}
        </div>
      </main>
    </>
  );
};

export default Career;
