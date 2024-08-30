import React from "react";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogTags } from "@type/Pages/blogList";
import Link from "next/link";

const IBlogTagsSection1 = (props: IBlogTags) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.blogTags)}
        />
      </Head>

      <div className="blog-tags">
        <div className="sec-title-wrap">
          <h3 className="title">Tags</h3>
        </div>

        <div className="tags-list">
          {props?.data?.map((ele, eInd) =>
            ele?.tag?.map((e) => (
              <Link href={e} key={eInd}>
                <a className="badges">{e}</a>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default IBlogTagsSection1;
