import BlogList from "@templates/BlogList/blog-list";
import { IBaseTemplateProps } from "@templates/index";
import { IBlog, IBlogFollowUs, IBlogList, IBlogTagsData, IRecentPosts } from "@type/Pages/blogList";

export interface IBlogListMainData {
  data: {
    blog_list: IBlogList;
    blog_tags: IBlogTagsData[];
    follow_us: IBlogFollowUs;
    recent_post: IRecentPosts;
    type: string;
  }
}

export interface IBlogListMain extends IBaseTemplateProps, IBlog {}

export default BlogList;
