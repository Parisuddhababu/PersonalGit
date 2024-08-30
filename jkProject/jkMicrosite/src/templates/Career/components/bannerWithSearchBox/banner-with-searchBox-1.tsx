import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IMAGE_PATH } from "@constant/imagepath";
import { ICareerBannerWithSearchBox } from "@type/Pages/career";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";

const BannerWithSearchBoxSection1 = (props: ICareerBannerWithSearchBox) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.careerBanner)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.careerFilterSection)}
        />
      </Head>

      <section className="banner-sec">
        <div className="banner-image-wrap">
          <CustomImage
            src={
              props?.banner_image?.path
                ? props?.banner_image?.path
                : IMAGE_PATH.blogPostSevenJpg
            }
            alt="Banner Image"
            width="783px"
            height="106px"
          />

          <div className="banner-content">
            <h2>{props?.banner_title}</h2>
          </div>
        </div>
      </section>
    </>
  );
};

export default BannerWithSearchBoxSection1;
