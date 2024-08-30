import { IBlogOtherDetails } from "@templates/BlogDetails";
import IBlogDetailsSection1 from "@templates/BlogDetails/components/BlogDetails/blog-details-1";
import IBlogDetailsBannerSection1 from "@templates/BlogDetails/components/BlogDetailsBanner/blog-details-banner-1";
import IBlogDetailsFollowUsSection1 from "@templates/BlogDetails/components/BlogDetailsFollowUs/blog-details-follow-us-1";
import IBlogDetailsRecentPostSection1 from "@templates/BlogDetails/components/BlogDetailsRecentPosts/blog-details-recent-posts-1";
import IBlogDetailsTagsSection1 from "@templates/BlogDetails/components/BlogDetailsTags/blog-details-tags-1";

const BlogOtherDetails1 = (props: IBlogOtherDetails) => {
  return (
    <>
      <IBlogDetailsBannerSection1
        data={props?.blog_banner?.[0]}
        tags={props?.blog_tags?.[0]?.tag}
        blogDetailsImage={props?.blog_detail?.banner_image}
      />
      <section className="blog-wrapper">
        <div className="container">
          <div className="d-row">
            <aside className="d-col d-col-33 flex-column mb-0">
              <IBlogDetailsFollowUsSection1 {...props?.follow_us} />
              <IBlogDetailsRecentPostSection1 {...props?.recent_post} />
              <IBlogDetailsTagsSection1 data={props?.blog_tags} />
            </aside>

            <section className="d-col d-col-66 mb-0">
              <div className="d-row align-item-start">
                <div className="d-col">
                  <IBlogDetailsSection1 {...props?.blog_detail} />
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};
export default BlogOtherDetails1;
