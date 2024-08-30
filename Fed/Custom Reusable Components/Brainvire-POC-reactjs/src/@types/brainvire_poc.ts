export interface ICaseStudyHomePage {
  category_title: string;
  data: ICaseStudyHomeList[];
  item_view_all_url: string;
}

export interface ICaseStudyHomeList {
  page_link: ILink;
  category_icon: string;
  industry: string;
  casestudy: ICaseStudyDetailList[];
}

export interface ICaseStudyDetailList {
  title: string;
  description: string;
  image: string;
  link: ILink;
}
//--------------------------------------------------

export interface ILink {
  title: string;
  url: string;
  target: string;
}

//------------------------------------------------

export interface IServiceWeServedData {
  service_title: string;
  service_icon: string;
  links: ILink[];
}

export interface IServiceWeServed {
  title: string;
  sub_line: string;
  case_study_url: ILink;
  text_for_the_search_product: string;
  data: IServiceWeServedData[];
}
//------------------------------------------------
export interface ISectionTwo {
  title: string;
  list: IListItem[];
}
export interface IListItem {
  image: string;
  title: string;
  cta: ILink;
  description: string;
}

//--------------------------------------------------


export interface IindustryData {
  industry_title: string;
  industry_sub_title: string;
  descriptions: string;
  cta: ILink;
  industry_image: string;
}
export interface IIndustrySection {
  industry_items: IindustryData[];
}

//-------------------------------------------------------

export interface IOurCompanyInfo {
  title: string;
  description: string;
  company_info: ICompanyInfoItem[];
  other_page_links: ILink[];
  video_thumb_url: string;
  video_url: string;
}

export interface ICompanyInfoItem {
  title: string;
  count: string;
}

//--------------------------------------------------------------------

export interface IClutchReview {
  title: string;
  sub_title: string;
  rating: string;
  reviews: string;
  total_review: string;
  link: ILink;
  data: IClutchReviewsList[];
}

export interface IClutchReviewsList {
  title: string;
  designation: string;
  description: string;
  featured_image: string;
  rating: string;
  date: string;
}

//-----------------------------------------------------------------------

export interface IBrands {
  title: string;
  client_logo: IBrandsList[];
}

export interface IBrandsList {
  title: string;
  logo: string;
}

//---------------------------------------------------------------------------


export interface ILatestThinkingSection {
  title: string;
  description: string;
  list: ILatestThinkingItem[];
}

export interface ILatestThinkingItem {
  image: string;
  title: string;
  description: string;
  link: string;
}