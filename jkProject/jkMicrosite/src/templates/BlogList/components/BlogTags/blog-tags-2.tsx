import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogTags } from "@type/Pages/blogList";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";

const IBlogTagsSection2 = (props: IBlogTags) => {
  return (
    <>
      <div className="blog-tags">
        <div className="sec-title-wrap">
          <h3 className="title">Tags</h3>
        </div>

        <div className="tags-list">
          {props?.data?.map((ele) =>
            ele?.tag?.map((e, index) => (
              <Link href={e} key={index}>
                <a className="badges">{e}</a>
              </Link>
            ))
          )}
        </div>
      </div>

      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(2, CSS_NAME_PATH.blogTags2)}
        />
      </Head>
    </>
  );
};

export default IBlogTagsSection2;
