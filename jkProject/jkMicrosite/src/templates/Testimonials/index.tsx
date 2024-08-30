import Testimonials from "@templates/Testimonials/testimonials";
import { IBaseTemplateProps } from "@templates/index";
import { ITestimonials } from "@type/Pages/testimonials";

export interface ITestimonialListMain extends IBaseTemplateProps, ITestimonials {}

export default Testimonials;
