import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { IBlog1Props } from ".";
import Link from "next/link";
import BlogHomeBox from "./blog-box";


const Blog2 = ({ data }: IBlog1Props) => {
  return (
    <>
      <section className="our-blog">
        <div className="container">
          <div className="heading">
            <h2>Our Blog</h2>
          </div>
          <div className="d-row">
            {data?.length !== 0 &&
              data?.map((ele, index) => {
                return (
                  <BlogHomeBox
                    ele={ele}
                    key={index}
                  />
                );
              })}
          </div>
          {data?.length > 0 && (
            <Link href="/blog">
              <a className="btn btn-small btn-primary btn-bottom">View All</a>
            </Link>
          )}
        </div>
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.homePostCard)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.blogPostCard2)}
        />
      </Head>
    </>
  );
};

export default Blog2;
