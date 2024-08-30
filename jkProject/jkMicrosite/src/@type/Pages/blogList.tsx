import { IFollowUs, IImage, IPagination } from "@type/Common/Base";

export interface IBlogList extends IPagination {
  //  Main Blog list
  data: IBlogListData[];
}

export interface IBlogListData {
  _id: string;
  title: string;
  description: string;
  tag: string[];
  is_featured: number;
  image: IImage;
  created_at ?: string
}

export interface IBlogFollowUs {
  // main blog follow us
  data: IFollowUs[];
  type?: number;
}

export interface IRecentPosts extends IPagination {
  // main recent Posts
  data: IBlogRecentPostsData[];
}

export interface IBlogRecentPostsData {
  _id: string;
  title: string;
  description: string;
  tag: string[];
  is_featured: number;
  image: IImage;
  created_at?: string;
}

export interface IBlogBanner {
  // main blog banner
  banner_title: string;
  banner_image: IImage;
  link: string;
  is_active: number;
  created_at: string;
  type: number;
  _id: string
}

export interface IBlogBannerData {
  data : IBlogBanner,
  tags : string[]
  blogDetailsImage : IImage
}

export interface IBlogSubscribeNewsLetter {
  // main blog subscribe news letter
  banner_title: string;
  banner_image: IImage;
  link: string;
  is_active: number;
  created_at: string;
  type: number;
}

export interface IBlogTags {
  // tags interface remaining
  data: IBlogTagsData[];
}

export interface IBlogTagsData {
  tag: string[];
}

export interface IBlog {
  blog_blog_list: IBlogList;
  blog_follow_us: IBlogFollowUs;
  blog_recent_posts: IRecentPosts;
  blog_blog_banner: IBlogBanner;
  blog_subscribe_news_letter: IBlogSubscribeNewsLetter;
}

export interface IBlogListWithSubscribe extends IPagination {
  data: IBlogListData[];
  subs?: IBlogSubscribeNewsLetter[];
}
