import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import EventDetailsBannerSection1 from "@templates/EventDetails/components/EventDetailsBanner/event-details-banner-1";
import EventDetailsPhotoSliderSection1 from "@templates/EventDetails/components/EventPhotoSlider/event-photo-slider-1";
import EventDetailsBannerSection2 from "@templates/EventDetails/components/EventDetailsBanner/event-details-banner-2";
import EventDetailsPhotoSliderSection2 from "@templates/EventDetails/components/EventPhotoSlider/event-photo-slider-2";
import EventDetailsMain1 from "./EventDetailsMain/event-details-main-1";
import EventDetailsMain2 from "./EventDetailsMain/event-details-main-2";

// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  event_detail_banner_1: EventDetailsBannerSection1,
  event_detail_with_map_1: EventDetailsMain1,
  photo_slider_1: EventDetailsPhotoSliderSection1,

  event_detail_banner_2: EventDetailsBannerSection2,
  event_detail_with_map_2: EventDetailsMain2,
  photo_slider_2: EventDetailsPhotoSliderSection2,
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
