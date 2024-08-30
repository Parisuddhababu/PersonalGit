import { IHomeTestimonialsData } from "@type/Pages/home";
import Testimonial1 from "./testimonial-1";
export interface ITestimonial1Props {
  data: IHomeTestimonialsData[];
  dynamic_title?: {
    testimonial_title:string
    testimonial_tagline:string
  }
  testimonial_bg_image?:string
}

export default Testimonial1;
