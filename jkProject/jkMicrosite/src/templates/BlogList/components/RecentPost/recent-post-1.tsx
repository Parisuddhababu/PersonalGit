import React from "react";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogRecentPostsData, IRecentPosts } from "@type/Pages/blogList";
import CustomImage from "@components/CustomImage/CustomImage";
import Link from "next/link";

const IBlogRecenetPostSection1 = (props: IRecentPosts) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.blogRecentPosts)}
        />
      </Head>

      <div className="blog-recent-posts">
        <div className="sec-title-wrap">
          <h3 className="title">Recent Posts</h3>
        </div>

        <div className="d-row">
          {props?.data?.map((ele: IBlogRecentPostsData, eInd: number) => (
            <div className="d-col d-col-2" key={eInd}>
              <div className="blog-highlight-post">
                <CustomImage
                  src={ele?.image?.path}
                  alt="Blog Image"
                  width="220px"
                  height="180px"
                />
                <h4 className="blog-highlight-title">
                  <Link href={`/blog/${ele._id}`}><a>{ele?.title}</a></Link>
                </h4>
                {/* <span className="blog-highlight-date">
                    <i className="jkm-calendar mr-10"></i> 28 April 2022
                  </span> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default IBlogRecenetPostSection1;
