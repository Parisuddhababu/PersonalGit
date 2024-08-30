import React, { useEffect } from "react";
import { getComponents } from "@templates/contact-us-list/components";
import Head from "next/head";
import { IContactUs } from "@templates/contact-us-list";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { setDynamicDefaultStyle } from "@util/common";

const ContactUs = (props: IContactUs) => {
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
            CSS_NAME_PATH.contactUs +
            ".min.css"
          }
        />
      </Head>
      <main>
        {props?.sequence?.map((ele) =>
          getComponents(props?.data?.[ele]?.type, ele, props?.data?.[ele])
        )}
      </main>
    </>
  );
};

export default ContactUs;
