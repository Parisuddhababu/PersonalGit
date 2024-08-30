import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import React from "react";
import { IBlog1Props } from "@templates/AppHome/components/Blog";
import Head from "next/head";
import Link from "next/link";
import BlogHomeBox from "./blog-box";
const Blog1 = ({ data }: IBlog1Props) => {
  return (
    <>
      <section className="our-blog">
        <div className="container">
          <h2>Our Blog</h2>
          <div className="d-row">
            {data?.map((ele, eleIndex: number) => (
              <BlogHomeBox
                ele={ele}
                key={eleIndex}
              />
            ))}
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
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homePostCard)}
        />
      </Head>
    </>
  );
};

export default Blog1;
