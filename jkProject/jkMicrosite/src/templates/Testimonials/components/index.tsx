import { getTypeWiseComponentName } from "@util/common";
import React from "react";

import TestimonialsBanner1 from "@templates/Testimonials/components/Banner/testimonials-banner-1";
import TestimonialsListing1 from "@templates/Testimonials/components/Listing/testimonials-listing-1";
import TestimonialsSlider1 from "@templates/Testimonials/components/Slider/testimonials-slider-1";

import TestimonialsBanner2 from "@templates/Testimonials/components/Banner/testimonials-banner-2";
import TestimonialsListing2 from "@templates/Testimonials/components/Listing/testimonials-listing-2";
import TestimonialsSlider2 from "@templates/Testimonials/components/Slider/testimonials-slider-2";


// All Dynamic Component name for Mapping
const componentMapping: { [key: string]: any } = {
  testimonial_banner_1: TestimonialsBanner1,
  video_testimonials_1: TestimonialsSlider1, 
  other_testimonials_1: TestimonialsListing1,
  testimonial_banner_2: TestimonialsBanner2,
  video_testimonials_2: TestimonialsSlider2, 
  other_testimonials_2: TestimonialsListing2,
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
