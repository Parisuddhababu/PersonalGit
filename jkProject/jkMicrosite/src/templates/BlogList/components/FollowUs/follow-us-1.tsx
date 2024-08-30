import React from "react";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogFollowUs } from "@type/Pages/blogList";
import BlogSocialShare from "@templates/BlogList/components/BlogSocialShareIcons/blogSocialShareIcon";

const IBlogFollowUsSection1 = (props: IBlogFollowUs) => {
  return (
    <>

      <div className="blog-follow-us">
        <div className="sec-title-wrap">
          <h3 className="title">Follow Us</h3>
        </div>
      <BlogSocialShare data={props?.data} type={1}/>
      </div>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.blogFollowUs)}
        />
      </Head>
    </>
  );
};

export default IBlogFollowUsSection1;
