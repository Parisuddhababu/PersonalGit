import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogDetailsRelatedPosts } from "@type/Pages/blogDetails";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const IBlogDetailsRelatedPostSection1 = (props: IBlogDetailsRelatedPosts) => {

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.blogRelatedPosts)}
        />
      </Head>
      <section className="related-post-wrapper">
        <div className="container">
          <div className="d-row">
            <aside className="d-col d-col-33 flex-column mb-0">
            </aside>

            <section className="d-col d-col-66 mb-0">
              <div className="d-row">
                <div className="d-col">
                  {props?.data?.length > 0 && (
                    <div className="blog-related-posts">
                      <div className="sec-title-wrap">
                        <h3 className="title">Related Posts</h3>
                      </div>

                      <div className="blog-highlight-list">
                        <div className="d-row">
                          {props?.data?.map((ele, eIndex) => (
                            <div className="d-col d-col-3" key={eIndex}>
                              <div className="blog-highlight-post">
                                <CustomImage
                                  height="180px"
                                  width="306px"
                                  src={ele?.banner_image?.path}
                                />

                                <h4 className="blog-highlight-title">
                                  <Link href={`/blog/${ele._id}`}>
                                    <a>{ele?.title}</a>
                                  </Link>
                                </h4>
                                <span className="blog-highlight-date">
                                  <i className="jkm-calendar mr-10"></i>{" "}
                                  {converDateMMDDYYYY(ele.created_at)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
};

export default IBlogDetailsRelatedPostSection1;
