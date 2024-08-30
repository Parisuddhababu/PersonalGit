import Testimonials from "@templates/AboutUs/components/Testimonials/testimonials-1";
import { IHomeTestimonialsData } from "@type/Pages/home";
export interface ITestimonialProps {
  data: IHomeTestimonialsData[];
  type?: number
  testimonial_bg_image?: string
}

export default Testimonials;
