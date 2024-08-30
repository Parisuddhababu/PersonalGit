import { IAccount, IImage } from "@type/Common/Base";
import {IBlogFollowUs,IRecentPosts,IBlogBanner} from "@type/Pages/blogList"

export interface IBlogDetailsBlogDetails{
    title: string,
    description: string,
    tag: string[],
    is_featured: number,
    is_active: number,
    image: IImage,
    account: IAccount,
    created_at: string,
    next_blog_uuid: string | null
    previous_blog_uuid: string | null
    type: number
    banner_image:IImage
}


export interface IBlogDetailsRelatedPosts {
    data:IBlogDetailsRelatedPostsData[]
    type?: number;
}

export interface IBlogDetailsRelatedPostsData {
    title: string,
    description: string,
    tag: string[],
    banner_image: IImage,
    account: IAccount,
    created_at: string,
    _id:string
}


export interface IBlogDetailsMain {
    IBlogDetailsBlogDetails: IBlogDetailsBlogDetails,
    blog_follow_us: IBlogFollowUs;
    blog_recent_posts: IRecentPosts;
    blog_blog_banner: IBlogBanner;

}