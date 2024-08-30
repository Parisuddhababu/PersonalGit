import IBlogFollowUsSection1 from "@templates/BlogList/components//FollowUs/follow-us-1";
import IBlogRecenetPostSection1 from "@templates/BlogList/components/RecentPost/recent-post-1";
import IBlogTagsSection1 from "@templates/BlogList/components/BlogTags/blog-tags-1";
import IBlogListSection1 from "@templates/BlogList/components/BlogList/blog-list-1";
import { IBlogListMainData } from "@templates/BlogList/index";

const BlogListMain1 = (props: IBlogListMainData) => {
  return (
    <>
      <section className="blog-wrapper">
        <div className="container">
          <div className="d-row">
            <aside className="d-col d-col-33 flex-column mb-0">
              <>
                <IBlogFollowUsSection1 data={props?.data?.follow_us?.data} />
                <IBlogRecenetPostSection1 {...props?.data?.recent_post} />
                <IBlogTagsSection1
                  data={props?.data?.blog_tags}
                ></IBlogTagsSection1>
              </>
            </aside>
            <section className="d-col d-col-66 mb-0">
              <>
                <IBlogListSection1
                  {...props?.data?.blog_list}
                ></IBlogListSection1>
              </>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};
export default BlogListMain1;
