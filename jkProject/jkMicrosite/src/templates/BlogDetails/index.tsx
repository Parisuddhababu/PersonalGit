import BlogDetails from "@templates/BlogDetails/blog-details";
import { IBlogDetailsBlogDetails, IBlogDetailsMain } from "@type/Pages/blogDetails";
import { IBaseTemplateProps } from "@templates/index";
import { IBlogBanner, IBlogFollowUs, IBlogTagsData, IRecentPosts } from "@type/Pages/blogList";

export interface IBlogOtherDetails {
  blog_banner: IBlogBanner[];
  blog_detail: IBlogDetailsBlogDetails;
  blog_tags: IBlogTagsData[];
  follow_us: IBlogFollowUs;
  recent_post: IRecentPosts;
  type: string;
}

export interface IBlogDetails extends IBaseTemplateProps, IBlogDetailsMain{}

export default BlogDetails;

