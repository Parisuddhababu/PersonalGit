import React, { useEffect } from "react";
import { getComponents } from "./components";
import { ICustomiseDesignListMain } from "@templates/Customise-Design";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import { setDynamicDefaultStyle } from "@util/common";

const CustomiseDesign = (props: ICustomiseDesignListMain) => {
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
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.customiseDesign + ".min.css"} />
      </Head>
      <div className="page-wrapper">
        <main>
          <div className="wrapper">
            {props.sequence?.map((ele) =>
              getComponents(props?.data?.[ele as keyof ICustomiseDesignListMain]?.type as string, ele, props?.data)
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default CustomiseDesign;
