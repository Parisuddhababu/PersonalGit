import React from "react";
import { getComponents } from "@templates/refer-earn/components";
import Head from "next/head";
import { IReferEarn } from "@templates/refer-earn";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { API_SECTION_NAME } from "@config/apiSectionName";
import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";

const ReferEarn = (props: IReferEarn) => {
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

      {props?.sequence?.map((ele) =>
        getComponents(props?.data?.[ele]?.type, ele,
          ele === API_SECTION_NAME.refer_earn_detail ? {
            data: props?.data?.[ele]?.data[0]
          } :
            {
              data: props?.data?.[ele],
            })
      )}

      <Head>
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.referEarn + ".min.css"} />
      </Head>

    </>
  );
};

export default ReferEarn;
