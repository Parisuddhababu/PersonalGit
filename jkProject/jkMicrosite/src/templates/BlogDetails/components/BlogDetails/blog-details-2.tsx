import CustomImage from "@components/CustomImage/CustomImage";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import SafeHtml from "@lib/SafeHTML";
import { IBlogDetailsBlogDetails } from "@type/Pages/blogDetails";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";

const IBlogDetailsSection2 = (props: IBlogDetailsBlogDetails) => {
  return (
    <>
      <div className="blog-details-content">
        <div className="date-category-info">
          <div className="date">{converDateMMDDYYYY(props?.created_at)}</div>
          <div className="border-right">|</div>
          <div className="category">{props?.tag?.[0] || ""}</div>
        </div>
        <h2>{props?.title}</h2>
        <div className="blog-post-content">
          <SafeHtml html={props?.description} />
        </div>
        <div className="blog-post-image">
          <CustomImage
            src={props?.banner_image?.path ? props?.banner_image?.path : props?.image?.path}
            height=""
            width=""
          />
        </div>
      </div>
      <div className="pagination">
        <ul className="arrow">
          {typeof props?.previous_blog_uuid !== "undefined" && props?.previous_blog_uuid !== null && (
            <li>
              <Link href={`/blog/${props?.previous_blog_uuid}` || ""}>
                <a>
                  <i className="jkms2-arrow-right left"></i>Previous
                </a>
              </Link>
            </li>
          )}

          {typeof props?.next_blog_uuid !== "undefined" && props?.next_blog_uuid !== null && (
            <li>
              <Link href={`/blog/${props?.next_blog_uuid}` || ""}>
                <a>
                  Next<i className="jkms2-arrow-right right"></i>
                </a>
              </Link>
            </li>
          )}
        </ul>
      </div>
      <Head>
        <link rel="stylesheet" href={APPCONFIG.STYLE_BASE_PATH_COMPONENT + CSS_NAME_PATH.blogDetail2 + ".min.css"} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(2, CSS_NAME_PATH.pagination)} />
      </Head>
    </>
  );
};

export default IBlogDetailsSection2;
