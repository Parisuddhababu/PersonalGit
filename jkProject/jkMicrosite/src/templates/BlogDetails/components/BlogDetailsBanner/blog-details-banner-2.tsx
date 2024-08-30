import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IBlogBannerData } from "@type/Pages/blogList";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";

const IBlogDetailsBannerSection2 = (props: IBlogBannerData) => {
  return (
    <>
      <section className="banner-sec">
        <div className="banner-image-wrap">
          <CustomImage
            src={props?.data?.banner_image?.path}
            height="606px"
            width="1519px"
          />
        </div>
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(2, CSS_NAME_PATH.blogDetail)}
        />
      </Head>
    </>
  );
};

export default IBlogDetailsBannerSection2;
