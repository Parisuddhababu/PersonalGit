import React from "react";
import { getComponents } from "@templates/ForgotPassword/components";
import Head from "next/head";
import { setDynamicDefaultStyle } from "@util/common";
import { useEffect } from "react";
import { IForgotPasswordProps } from "@templates/ForgotPassword";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

const ForgotPassword = (props: IForgotPasswordProps) => {
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
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.forgotPassword + ".min.css"} />
      </Head>

      {props?.sequence?.map((ele) =>
        getComponents(props?.data?.[ele]?.type, ele, {
          data: props?.data?.[ele]?.banner_detail?.[0],
        })
      )}

      {/* {getComponents("1", "forgot_password_form", {})} */}
    </>
  );
};

export default ForgotPassword;
