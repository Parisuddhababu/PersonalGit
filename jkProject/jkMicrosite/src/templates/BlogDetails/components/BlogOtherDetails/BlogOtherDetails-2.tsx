import { IBlogOtherDetails } from "@templates/BlogDetails";
import IBlogDetailsSection2 from "@templates/BlogDetails/components/BlogDetails/blog-details-2";
import IBlogDetailsBannerSection2 from "@templates/BlogDetails/components/BlogDetailsBanner/blog-details-banner-2";
import IBlogDetailsFollowUsSection2 from "@templates/BlogDetails/components/BlogDetailsFollowUs/blog-details-follow-us-2";
import IBlogDetailsRecentPostSection2 from "@templates/BlogDetails/components/BlogDetailsRecentPosts/blog-details-recent-posts-2";
import IBlogDetailsTagsSection2 from "@templates/BlogDetails/components/BlogDetailsTags/blog-details-tags-2";

const BlogOtherDetails2 = (props: IBlogOtherDetails) => {
  return (
    <>
      <IBlogDetailsBannerSection2
        data={props?.blog_banner?.[0]}
        tags={props?.blog_tags?.[0]?.tag}
        blogDetailsImage={props?.blog_detail?.banner_image}
      />
      <section className="blog-wrapper">
        <div className="container">
          <div className="d-row">
            <section className="d-col d-col-66 mb-0">
              <div className="d-row align-item-start">
                <div className="d-col">
                  <IBlogDetailsSection2 {...props?.blog_detail} />
                </div>
              </div>
            </section>
            <aside className="d-col d-col-33 flex-column mb-0">
              <IBlogDetailsFollowUsSection2 {...props?.follow_us} />
              <IBlogDetailsRecentPostSection2 {...props?.recent_post} />
              <IBlogDetailsTagsSection2 data={props?.blog_tags} />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogOtherDetails2;
