import { IImage, IPagination, IWebsite } from "@type/Common/Base";

export interface IHomeTestimonials extends IPagination {
  data: IHomeTestimonialsData[];
}
export interface IHomeTestimonialsData {
  _id: string;
  name: string;
  details: string; // Use SafeHtml as the details will be HTML content
  is_active: number;
  image: IImage;
  website: IWebsite;
}

export interface IHomeBlog extends IPagination {
  data: IHomeBlogData[];
}
export interface IHomeBlogData {
  _id: string;
  title: string;
  description: string;
  tag: string[];
  is_featured: number;
  is_active: number;
  website: IWebsite;
  sorting: number;
  created_at: Date;
  image: IImage;
}

export interface IHomeCustomizeJewellery extends IPagination {
  data: IHomeCustomizeJewelleryData[];
}
export interface IHomeCustomizeJewelleryData {
  _id: string;
  title: string;
  description: string;
  is_active: number;
  website: IWebsite;
  image: IImage;
}

export interface IHomeDigitalStore extends IPagination {
  data: IHomeDigitalStoreData[];
}
export interface IHomeDigitalStoreData {
  _id: string;
  digitalstore_text: string;
  website: IWebsite;
  digitalstore_logo: any;
  created_at: string;
}

export interface IHomeOurClients extends IPagination {
  data: IHomeOurClientsData[];
}
export interface IHomeOurClientsData {
  _id: string;
  website: IWebsite;
  link: string;
  logo: IImage;
  sorting: number;
}

export interface IHomeSocial extends IPagination {
  data: IHomeSocialData[];
}
export interface IHomeSocialData {
  _id: string;
  website: IWebsite;
  social_facebook: string;
  social_google: string;
  social_instagram: string;
  social_linkedin: string;
  social_twitter: string;
  social_youtube: string;
}

export interface IDownloadAppLandingPageImage {
  _id: string;
  name: string;
  file_name: string;
  path: string;
  relative_path: string;
}

export interface IHomeDownloadApp extends IPagination {
  data: IHomeDownloadAppData[];
}
export interface IHomeDownloadAppData {
  _id: string;
  website: IWebsite;
  created_at: string;
  downloadapp_appstore_link: string;
  downloadapp_description: string;
  downloadapp_playstore_link: string;
  downloadapp_landing_page_image: IDownloadAppLandingPageImage;
  downloadapp_title : string
}

export interface IHomeOurBenefitsImg {
  _id: string;
  name: string;
  file_name: string;
  path: string;
  relative_path: string;
}

export interface IHomeOurBenefits extends IPagination {
  data: IHomeOurBenefitsData[];
}
export interface IHomeOurBenefitsData {
  _id: string;
  title: string;
  description: string;
  is_active: number;
  website: IWebsite;
  sorting: number;
  updated_at: string;
  created_at: string;
  website_id: string;
  logo: IHomeOurBenefitsImg;
}

export interface ISubscription extends IPagination {
  data: ISubscriptionData[];
}
export interface ISubscriptionData {
  _id: string;
  plan_type: string;
  duration: string;
  price: number;
  plan_description: string;
  updated_at: string;
  created_at: string;
}

export interface ICategory extends IPagination {
  data: ICategoryData[];
}
export interface ICategoryData {
  images: any;
  homecategory: any;
  image: IImage;
  category_type: ICategoryTypeData;
  customization_id: string;
  is_active: number;
  name: string;
  parent_id: number;
  parent_name: string;
  slug: string;
  template: string;
  type: number;
  _id: string;
  desktop_image: IImage;
  mobile_image: IImage;
  menu_logo: IImage;
  new_arrival_image: IImage;
  recently_viewed_image: IImage;
  home_category_image: IImage;
  home_category_rectangle_image : IImage;
  home_category_wide_image : IImage;
  home_category_square_image : IImage
}

export interface ICategoryTypeData {
  category_type_id: string;
  name: string;
}

export interface IHomeBannerDetails {
  banner_image: IImage;
  banner_title: string;
  created_at: string;
  created_by: string;
  updated_at: string;
  link?:string
}
export interface IHomeBanner {
  data: IHomeBannerDetails[];
  type: number;
}

export interface IAboutUsData {
  _id: string;
  website: IWebsite;
  ourstory_video: string;
  ourstory_description: string;
  ourstory_image: IImage[];
  ourfounder_image: IImage;
  ourfounder_description: string;
  ourmission_description: string;
  ourvision_description: string;
  whyus_description: string;
  whyus_images: IImage[];
  is_active: number;
  created_at: string;
  is_video_avail?: number
  ourstory_single_image:IImage
}

export interface IAboutUsSection extends IPagination {
  data: IAboutUsData[];
}

export interface INewCollectionProps {
  data: INewCollectionData[];
}

export interface INewCollectionData {
  collection_slug: string;
  desktop_image: IImage;
  title: string;
}

export interface IHome {
  banner1: IHomeBanner;
  banner2: IHomeBanner;
  testimonials: IHomeTestimonials;
  blog: IHomeBlog;
  customize_jewellery: IHomeCustomizeJewellery;
  digital_store: IHomeDigitalStore;
  our_clients: IHomeOurClients;
  social: IHomeSocial;
  download_app: IHomeDownloadApp;
  our_benefits: IHomeOurBenefits;
  subscription_plan: ISubscription;
  category: ICategory;
  aboutus_data: IAboutUsSection;
}
