import React from "react";
import { getComponents } from "@templates/AboutUs/components";
import Head from "next/head";
import { API_SECTION_NAME } from "@config/apiSectionName";
import { setDynamicDefaultStyle } from "@util/common";
// import { getTypeBasedCSSPath } from "@util/common";
import { useEffect } from "react";
import { IAboutUs } from "@templates/AboutUs";
// import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

const AboutUs = (props: IAboutUs) => {
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
        <link rel="stylesheet" href={"/assets/css/pages/reset.css"} />
      </Head>
      <main>
        {props?.sequence?.map((ele) =>
          ele === API_SECTION_NAME.aboutus_banner
            ? getComponents(props?.data?.aboutus_banner_type, ele, {
              data: props?.data?.[ele]?.[0],
            })
            : getComponents(
              props?.data?.[ele]?.type,
              ele,
              ele === API_SECTION_NAME.owner_messages ||
                ele === API_SECTION_NAME.testimonials
                ? {
                  data: props?.data?.[ele]?.data,
                  type: props?.data?.[ele]?.type,
                }
                : {
                  data: props?.data?.[ele],
                }
            )
        )}
      </main>

      {/* <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.aboutUs)}
        />
      </Head> */}
    </>
  );
};

export default AboutUs;
