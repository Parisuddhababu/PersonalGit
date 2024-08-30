import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogFollowUs } from "@type/Pages/blogList";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import BlogSocialShare from "@templates/BlogList/components/BlogSocialShareIcons/blogSocialShareIcon";

const IBlogFollowUsSection2 = (props: IBlogFollowUs) => {
  return (
    <>
       <div className="blog-follow-us">
        <div className="sec-title-wrap">
          <h3 className="title">Follow Us</h3>
        </div>
      <BlogSocialShare data={props?.data} type={2}/>
      </div>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.blogFollowUs2)}
        />
      </Head>
    </>
  );
};

export default IBlogFollowUsSection2;
