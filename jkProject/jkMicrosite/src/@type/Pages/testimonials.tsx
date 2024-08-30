import { IImage, IPagination } from "@type/Common/Base";

export interface ITestimonialsVideo extends IPagination {
    //  Main Testimonials list
    data: ITestimonialsVideoData[];
}
export interface ITestimonialsList extends IPagination {
    //  Main Testimonials list
    data: ITestimonialsListData[];
}

export interface ITestimonialsVideoData {
    _id: string;
    name: string;
    details: string;
    video_link: string;
    video_id: string;
}

export interface ITestimonialsListData {
    _id: string;
    name: string;
    details: string;
    video_link: string;
    image: IImage
}

export interface ITestimonialsBanner {
    // main Testimonials Banner
    banner_title: string;
    link: string;
    banner_image: IImage;
    is_active: number;
    created_at: string;
}

export interface ITestimonials {
    testimonial_banner: ITestimonialsBanner[];
    video_testimonials: ITestimonialsVideo;
    other_testimonials: ITestimonialsList;
}
