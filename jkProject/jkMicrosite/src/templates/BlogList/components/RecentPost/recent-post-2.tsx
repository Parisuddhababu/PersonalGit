import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogRecentPostsData, IRecentPosts } from "@type/Pages/blogList";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import { TextTruncate } from "@util/common";

const IBlogRecenetPostSection2 = (props: IRecentPosts) => {
  return (
    <>
      <div className="blog-recent-posts">
        <div className="sec-title-wrap">
          <h3 className="title">Recent Posts</h3>
        </div>

        {props?.data?.map((ele: IBlogRecentPostsData, index) => (
          <div className="d-row" key={index}>
            <div className="d-col blog-highlight-post">
              <CustomImage
                src={ele?.image?.path}
                height="150px"
                width="150px"
              />

              <div className="blog-post-detail">
                <h4 className="blog-highlight-title">
                  <Link href={`/blog/${ele?._id}`}>
                    <a>{TextTruncate(ele?.title, 150)}</a>
                  </Link>
                </h4>
                <span className="blog-highlight-date">
                  {/* @ts-ignore */}
                  {converDateMMDDYYYY(ele?.created_at)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(2, CSS_NAME_PATH.blogRecentPosts2)}
        />
      </Head>
    </>
  );
};

export default IBlogRecenetPostSection2;
