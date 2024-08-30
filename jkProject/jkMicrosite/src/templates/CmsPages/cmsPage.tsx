import React, { useEffect } from "react";
import Head from "next/head";
import { ICMSPageProps } from "@templates/CmsPages";
import CMSPageContent from "./components";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { setDynamicDefaultStyle } from "@util/common";

const CMSPage = (props: ICMSPageProps) => {
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
      <title>{props?.meta?.title ? props?.meta?.title : props?.domainName}</title>

        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.cmsPage + ".min.css"
          }
        />
      </Head>
      <main>
        <div className="wrapper">
          <div className="terms-conditions-wrapper">
            <CMSPageContent list={props?.data} />
          </div>
        </div>
      </main>
    </>
  );
};
export default CMSPage;
