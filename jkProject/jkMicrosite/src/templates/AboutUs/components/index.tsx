import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import AboutUsBanner1 from "@templates/AboutUs/components/AboutUsBanner";
import OurFounder1 from "@templates/AboutUs/components/OurFounder";
import OurMissionAndVision1 from "@templates/AboutUs/components/OurMissionVision";
import OurStory1 from "@templates/AboutUs/components/OurStory";
import OurStoryImages1 from "@templates/AboutUs/components/OurStoryImages";
import OwnerMessages1 from "@templates/AboutUs/components/OwnerMessages";
import Testimonials1 from "@templates/AboutUs/components/Testimonials";
import WhyUs1 from "@templates/AboutUs/components/WhyUs";
import AboutUsBanner2 from "@templates/AboutUs/components/AboutUsBanner/aboutus-banner-2";
import OurFounder2 from "@templates/AboutUs/components/OurFounder/our-founders-2";
import OurMissionAndVision2 from "@templates/AboutUs/components/OurMissionVision/our-mission-and-vision-2";
import OurStory2 from "@templates/AboutUs/components/OurStory/our-story-2";
import OurStoryImages2 from "@templates/AboutUs/components/OurStoryImages/our-story-images-2";
import OwnerMessages2 from "@templates/AboutUs/components/OwnerMessages/owner-messages-2";
import Testimonials2 from "@templates/AboutUs/components/Testimonials/testimonials-2";
import WhyUs2 from "@templates/AboutUs/components/WhyUs/why-us-2";
import FeatureFooter1 from "@templates/AppHome/components/FeatureFooter";
import FeatureFooter2 from "@templates/AppHome/components/FeatureFooter/feature-footer-2";




// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  aboutus_banner_1: AboutUsBanner1,
  aboutus_banner_2: AboutUsBanner2,
  our_story_1: OurStory1,
  our_story_2: OurStory2,
  our_story_images_1 : OurStoryImages1,
  our_story_images_2 : OurStoryImages2,
  our_founders_1 : OurFounder1,
  our_founders_2 : OurFounder2,
  our_mission_and_vision_1 : OurMissionAndVision1,
  our_mission_and_vision_2 : OurMissionAndVision2,
  owner_messages_1 : OwnerMessages1,
  owner_messages_2 : OwnerMessages2,
  why_us_1 : WhyUs1,
  why_us_2 : WhyUs2,
  testimonials_1 : Testimonials1,
  testimonials_2 : Testimonials2,
  quick_links_1: FeatureFooter1,
  quick_links_2: FeatureFooter2,
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
