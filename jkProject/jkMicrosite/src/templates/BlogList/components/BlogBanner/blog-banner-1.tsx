import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import { IMAGE_PATH } from "@constant/imagepath";
import { IBlogBannerProps } from "@templates/BlogList/components/BlogBanner";
import { uuid } from "@util/uuid";
import { useRouter } from "next/router";
import { useState } from "react";
import useSliderHook from "@components/Hooks/sliderHook";
import { IBlogBanner } from "@type/Pages/blogList";
import Link from "next/link";

const IBlogBannerSection1 = ({ data }: IBlogBannerProps) => {
  const router = useRouter();
  const [legthOfSpecificArrayChunk] = useState(1);

  const {
    slicedData,
    arrayIndex,
    //@ts-ignore
  } = useSliderHook(data?.banner, legthOfSpecificArrayChunk);

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.blogBannerSlider)}
        />
      </Head>

      <section className="banner-sec" key={uuid()}>
        {slicedData[arrayIndex]?.map((item: IBlogBanner, index: number) => {
          return (
            <>
              <div className="banner-image-wrap" key={index}>
                <Link href={item?.link || ""}>
                  <a>
                    <CustomImage
                      src={
                        item?.banner_image?.path
                          ? item?.banner_image?.path
                          : IMAGE_PATH.homeBannerPng
                      }
                      alt="blog_baner"
                      width="1920px"
                      height="778px"
                    />
                  </a>
                </Link>

              </div>
              <div className="banner-slider-wrap">
                {/* We don't have Multiple Banner so Dont Require Slider Functionality
                 {hideLeftButton && (
                  <div className="banner-slider-wrap">
                    <button
                      type="button"
                      className="btn btn-icon slider-arrow-btn left"
                      aria-label="left-arrow"
                      onClick={() => SliderButton("LEFT", arrayIndex - 1)}
                    >
                      <i className="jkm-arrow-right"></i>
                    </button>
                  </div>
                )} */}
                <div className="jk-card slider-content-wrapper">
                  <div className="slider-content">
                    <div className="date-category-info">
                      <div className="date">
                        <i className="jkm-calendar mr-10"></i>
                        {converDateMMDDYYYY(item?.created_at)}
                      </div>
                      {/* <div className="category">
                  <i className="jkm-folder mr-10"></i>Necklace Sets
                </div> */}
                    </div>
                    <h2>{item?.banner_title}</h2>
                    {/* <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been industrys...
              </p> */}
                    <button
                      type="button"
                      onClick={() => router.push(`/blog/${item?._id}`)}
                      className="btn btn-primary btn-small"
                    >
                      View Details
                    </button>
                  </div>
                </div>
                {/* We don't have Multiple Banner so Dont Require Slider Functionality

                {hideRightButton && (

                  <button
                    type="button"
                    className="btn btn-icon slider-arrow-btn right"
                    aria-label="right-arrow"
                    onClick={() => SliderButton("RIGHT", arrayIndex + 1)}
                  >
                    <i className="jkm-arrow-right"></i>
                  </button>
                )} */}
              </div>
            </>
          );
        })}
      </section>
    </>
  );
};

export default IBlogBannerSection1;
