import { IImage } from "@type/Common/Base";

export interface IAboutUsBannerData {
  _id: string;
  banner_title: string;
  link: string;
  is_active: number;
  banner_image: IImage;
  created_at: string;
}

export interface IAboutUsOurStory {
    _id : string;
    created_at : string;
    ourstory_description : string;
    ourstory_video : string;
    type : number
    is_video_avail?:number
    ourstory_single_image?: IImage
    ourstory_title?:string
}

export interface IOurStoryImages {
    _id : string;
    created_at : string;
    ourstory_image : IImage[];
    type : number
}

export interface IOurFounderImages {
    _id : string;
    created_at : string;
    ourfounder_image : IImage,
    ourfounder_description : string,
    type ?: number
    our_founder_title?:string
}

export interface IOwnerMessageData {
    data : IOwnerMessage[];
    type : number
}

export interface IOurMissionVision { 
    _id : string;
    our_mission_title?: string
    our_vision_title?: string
    created_at : string;
    ourmission_description : string;
    ourvision_description : string;
    type : number
}

export interface IOwnerMessage {
    _id : string;
    owner_message : string;
    owner_image : IImage;
    owner_name : string;
    owner_designation : string;
    is_active : number
    director_messages?: string
}

export interface IWhyUs {
    _id : string;
    created_at : string;
    whyus_description : string;
    whyus_image1 : IImage;
    whyus_image2 : IImage;
    whyus_image3 : IImage;
    whyus_image4 : IImage;
    type : number;
    whyus_image1_title : string;
    whyus_image1_description : string;
    whyus_image2_title : string;
    whyus_image2_description : string;
    whyus_image3_title : string;
    whyus_image3_description : string;
    whyus_image4_title : string;
    whyus_image4_description : string;
    whyus_title?: string
}

export interface ITestimonial {
    _id : string;
    name : string;
    details : string;
    image : IImage;
    video_link : string
}



export interface IAboutUsData {
    aboutus_banner: IAboutUsBannerData[];
    our_story: IAboutUsOurStory;
    our_story_images : IOurStoryImages ;
    our_founders : IOurFounderImages;
    our_mission_and_vision : IOurMissionVision,
    owner_messages : IOwnerMessage[],
    why_us : IWhyUs;
    testimonials : ITestimonial[]
}