import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import { getTypeBasedCSSPath, setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";
import { getComponents } from "@templates/MyProfile/components/index";
import { IMyProfileMain } from ".";
import { useState } from "react"

const MyProfile = (props: IMyProfileMain) => {
  const [type] = useState(props?.data?.user_account_details_type ?? 1)
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
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            CSS_NAME_PATH.myAccount +
            ".min.css"
          }
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myaccountBanner)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.avatar)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(type, CSS_NAME_PATH.accountTabs)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myAccountCard)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.myAccountLoadMore)}
        />
      </Head>
      <main>
        {props.sequence?.map((ele) =>
          getComponents(
            "1",
            ele,
            props?.data?.[ele]?.[0]
          )
        )}
      </main>
    </>
  );
};

export default MyProfile;
