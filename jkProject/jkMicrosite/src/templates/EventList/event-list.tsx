import React, { useEffect } from "react";
import { getComponents } from "./components";
import { IEventListMain } from "@templates/EventList";
import { setDynamicDefaultStyle } from "@util/common";
import { API_SECTION_NAME } from "@config/apiSectionName";

const EventList = (props: IEventListMain) => {
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
      <main>
        {props.sequence?.map((ele) =>
          getComponents(
            ele === API_SECTION_NAME.event_banner
              ? props?.data?.["event_banner_type"]
              : (props?.data?.[ele as keyof IEventListMain]?.type as string),
            ele,
            ele === API_SECTION_NAME.event_banner
              ? {
                data: props?.data?.[ele as keyof IEventListMain],
                details: props?.data,
                type: props?.data?.["event_banner_type"],
              }
              : { data: props?.data?.[ele as keyof IEventListMain] }
          )
        )}
      </main>
    </>
  );
};

export default EventList;
