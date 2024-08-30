import { getTypeWiseComponentName } from "@util/common";
import React from "react";
import IEventListSection1 from "@templates/EventList/components/EventList/event-list-1";
import IEventBannerSection1 from "@templates/EventList/components/EventBanner/event-banner-1";
import EventBannerList2 from "@templates/EventList/components/EventBanner/event-banner-2";
import EventListSection2 from "@templates/EventList/components/EventList/event-list-2";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  event_list_1: IEventListSection1,
  event_banner_1: IEventBannerSection1,
  event_banner_2: EventBannerList2,
  event_list_2: EventListSection2,
};

/**
 * Render Dynamic Component
 * @param type Template Type of Dynamic Component
 * @param name component Name
 * @param props required props
 * @returns
 */
export const getComponents = (type: string, name: string, props: any) => {
  const ComponentName = getTypeWiseComponentName(type, name);
  const RenderComponent = componentMapping[ComponentName];
  if (RenderComponent) {
    return <RenderComponent {...props} />;
  }
};
