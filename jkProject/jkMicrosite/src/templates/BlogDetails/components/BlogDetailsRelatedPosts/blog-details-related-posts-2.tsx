import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogDetailsRelatedPosts } from "@type/Pages/blogDetails";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";

const IBlogDetailsRelatedPostSection2 = (props: IBlogDetailsRelatedPosts) => {
  return (
    <>
      <section className="related-post-wrapper">
        <div className="container">
          <div className="d-row">
            {props?.type === 1 ? <aside className="d-col d-col-33 flex-column mb-0"></aside> : <></>}
            <section className="d-col d-col-66 mb-0">
              <div className="d-row">
                <div className="d-col">
                  {props?.data?.length !== 0 && (
                    <div className="blog-related-posts">
                      <div className="sec-title-wrap">
                        <h3 className="title">Related Posts</h3>
                      </div>
                      <div className="blog-highlight-list">
                        <div className="d-row">
                          {props?.data?.length !== 0 &&
                            props?.data?.map((ele, index) => {
                              return (
                                <div className="d-col d-col-2" key={index}>
                                  <div className="blog-highlight-post ">
                                    <CustomImage
                                      height="150px"
                                      width="150px"
                                      src={ele?.banner_image?.path}
                                    />

                                    <div className="blog-post-detail">
                                      <h4 className="blog-highlight-title">
                                        <Link href={`/blog/${ele._id}` || ""}>
                                          <a>{ele?.title}</a>
                                        </Link>
                                      </h4>
                                      <span className="blog-highlight-date">
                                        {converDateMMDDYYYY(ele.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
            {props?.type === 2 ? <aside className="d-col d-col-33 flex-column mb-0"></aside> : <></>}
          </div>
        </div>
      </section >

      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(2, CSS_NAME_PATH.blogRelatedPosts)}
        />
      </Head>
    </>
  );
};

export default IBlogDetailsRelatedPostSection2;
