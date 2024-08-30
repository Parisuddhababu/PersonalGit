import React, { useEffect } from "react";
import { getComponents } from "./components";
import { ITestimonialListMain } from "@templates/Testimonials";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import APPCONFIG from "@config/app.config";
import { setDynamicDefaultStyle } from "@util/common";
import { API_SECTION_NAME } from "@config/apiSectionName";

const Testimonials = (props: ITestimonialListMain) => {
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
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_PAGES + CSS_NAME_PATH.testimonials + ".min.css"} />
        {/* <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_PAGES +
            'testimonials-2' +
            ".min.css"
          }
        /> */}
      </Head>
      <main>
        <div className="wrapper">
          {props.sequence?.map((ele) =>
            getComponents(
              ele === API_SECTION_NAME.testimonial_banner
                ? props?.data?.testimonial_banner_type
                : (props?.data?.[ele as keyof ITestimonialListMain]?.type as string),
              ele,
              props?.data
            )
          )}
        </div>
      </main>
    </>
  );
};

export default Testimonials;
