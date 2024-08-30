import { IBlogListMainData } from "@templates/BlogList/index";
import IBlogListSection2 from "@templates/BlogList/components/BlogList/blog-list-2";
import IBlogTagsSection2 from "@templates/BlogList/components/BlogTags/blog-tags-2";
import IBlogFollowUsSection2 from "@templates/BlogList/components/FollowUs/follow-us-2";
import IBlogRecenetPostSection2 from "@templates/BlogList/components/RecentPost/recent-post-2";

const BlogListMain2 = (props: IBlogListMainData) => {
  return (
    <>
      <section className="blog-wrapper">
        <div className="container">
          <div className="d-row">
            <section className="d-col d-col-66 mb-0 flex-column">
              <IBlogListSection2 {...props?.data?.blog_list} />
            </section>
            <aside className="d-col d-col-33 flex-column mb-0">
              <IBlogFollowUsSection2 data={props?.data?.follow_us?.data} />
              <IBlogRecenetPostSection2 {...props?.data?.recent_post} />
              <IBlogTagsSection2 data={props?.data?.blog_tags} />
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

export default BlogListMain2;
