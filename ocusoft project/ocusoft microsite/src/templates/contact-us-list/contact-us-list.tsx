import React, { useEffect } from "react";
import { getComponents } from "@templates/contact-us-list/components";
import Head from "next/head";
import { IContactUs } from "@templates/contact-us-list";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath, setDynamicDefaultStyle } from "@util/common";

const ContactUs = (props: IContactUs) => {
  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
  }, []);

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.bannerWithBreadcrumb)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.categoriesBox)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.contactusContent)} />
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
