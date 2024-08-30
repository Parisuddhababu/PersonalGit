import { API_SECTION_NAME } from "@config/apiSectionName";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import React, { useEffect } from "react";
import { getComponents } from "./components";
import { IEventDetailsIndex } from "@templates/EventDetails/index";
import { setDynamicDefaultStyle } from "@util/common";

const EventDetails = (props: IEventDetailsIndex) => {
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
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.toasterDesign +
            ".css"
          }
        />
      </Head>
      <main>
        {props?.sequence?.map((ele) => (
          getComponents(
            ele === API_SECTION_NAME.event_detail_with_map ? props?.data?.[ele]?.type :
            props?.data?.[
            `${ele}_type` as keyof IEventDetailsIndex
            ] as string,
            ele,
            props?.data
          )
        ))}
      </main>
    </>
  );
};

export default EventDetails;
