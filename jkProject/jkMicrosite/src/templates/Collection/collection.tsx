import React from "react";
import { getComponents } from "@templates/Collection/components";
import Head from "next/head";
import { ICollectionProps } from "@templates/Collection";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { API_SECTION_NAME } from "@config/apiSectionName";
import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";


const ReferEarn = (props: ICollectionProps) => {

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
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.collection + ".css"} />
      </Head>
      <main>
        {props?.sequence?.map((ele) =>
          getComponents(props?.data?.[ele]?.type, ele,
            ele === API_SECTION_NAME.collection_list ? {
              data: props?.data?.[ele]?.original
            } :
              {
                data: props?.data?.[ele],
              })
        )}
      </main>

    </>
  );
};

export default ReferEarn;
