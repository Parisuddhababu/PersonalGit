import React from "react";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogDetailsBlogDetails } from "@type/Pages/blogDetails";
import SafeHtml from "@lib/SafeHTML";
import CustomImage from "@components/CustomImage/CustomImage";
import { useRouter } from "next/router";
import Link from "next/link";

const IBlogDetailsSection1 = (props: IBlogDetailsBlogDetails) => {
  const router = useRouter();

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.blogDetail)}
        />
      </Head>

      <div className="blog-details-content">
        <div className="blog-post-content">
          <SafeHtml html={props?.description} />
        </div>
        <div className="blog-post-image">
          <CustomImage src={props?.image?.path ? props?.image?.path : props?.banner_image?.path} height="" width="" />
        </div>
      </div>
      <div className="blog-details-pagination">
        <ul>
          {typeof props?.previous_blog_uuid !== "undefined" &&
            props?.previous_blog_uuid !== null && (
              <li>
                <button
                  onClick={() =>
                    router.replace(`/blog/${props?.previous_blog_uuid}`)
                  }
                  type="button"
                  className="btn btn-icon previous mr-10"
                >
                  <i className="jkm-arrow-right"></i>
                </button>

                <Link href={`/blog/${props?.previous_blog_uuid}`}>
                  <a className="mr-10">Previous</a>
                </Link>
              </li>
            )}

          {typeof props?.next_blog_uuid !== "undefined" &&
            props?.next_blog_uuid !== null && (
              <li>
                <Link href={`/blog/${props?.next_blog_uuid}`}>
                  <a className="mr-10">Next</a>
                </Link>

                <button
                  onClick={() =>
                    router.replace(`/blog/${props?.next_blog_uuid}`)
                  }
                  type="button"
                  className="btn btn-icon next"
                >
                  <i className="jkm-arrow-right"></i>
                </button>
              </li>
            )}
        </ul >
      </div >
    </>
  );
};

export default IBlogDetailsSection1;
