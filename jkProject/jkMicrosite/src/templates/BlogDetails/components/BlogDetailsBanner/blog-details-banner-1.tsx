import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogBannerData } from "@type/Pages/blogList";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";

const IBlogDetailsBannerSection1 = (props: IBlogBannerData) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.blogDetailBanner)}
        />
      </Head>
      <Link href={props?.data?.link || ""}>
        <a>
          <section className="banner-sec">
            <div className="banner-image-wrap">
              <CustomImage
                src={props?.blogDetailsImage?.path}
                height=""
                width=""
              />

              <div className="banner-content">
                <div className="date-category-info">
                  <div className="date">
                    <i className="jkm-calendar mr-10"></i>
                    {converDateMMDDYYYY(props?.data?.created_at)}
                  </div>
                  <div className="category">
                    <i className="jkm-folder mr-10" />
                    {props?.tags?.map((ta: string, ind: number) => {
                      return `${ta}${props?.tags?.length - 1 > ind ? ", " : ""
                        }`;
                    })}
                  </div>
                  {/* <div className="category">
                <i className="jkm-folder mr-10"></i>Necklace Sets
              </div> */}
                </div>
                <h2>{props?.data?.banner_title}</h2>
              </div>
            </div>
          </section>
        </a>
      </Link>
    </>
  );
};

export default IBlogDetailsBannerSection1;
