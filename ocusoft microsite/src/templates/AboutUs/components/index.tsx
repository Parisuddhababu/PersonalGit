import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import AboutUsBanner1 from "@templates/AboutUs/components/AboutUsBanner";
import OurFounder1 from "@templates/AboutUs/components/OurFounder";
import OurMissionAndVision1 from "@templates/AboutUs/components/OurMissionVision";
import OurStory1 from "@templates/AboutUs/components/OurStory";
import OurStoryImages1 from "@templates/AboutUs/components/OurStoryImages";
import OwnerMessages1 from "@templates/AboutUs/components/OwnerMessages";
import WhyUs1 from "@templates/AboutUs/components/WhyUs";




// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  aboutus_banner_1: AboutUsBanner1,
  our_story_1: OurStory1,
  our_story_images_1 : OurStoryImages1,
  our_founders_1 : OurFounder1,
  our_mission_and_vision_1 : OurMissionAndVision1,
  owner_messages_1 : OwnerMessages1,
  why_us_1 : WhyUs1,
};

/**
 * Render Dynamic Component
 * @param type
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
