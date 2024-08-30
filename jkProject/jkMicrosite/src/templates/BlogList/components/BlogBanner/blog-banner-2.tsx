import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IMAGE_PATH } from "@constant/imagepath";
import {
  converDateMMDDYYYY,
  getTypeBasedCSSPath,
  TextTruncate,
} from "@util/common";
import Head from "next/head";
import { useRouter } from "next/router";
import { IBlogBannerProps } from ".";
import { useState } from "react";
import useSliderHook from "@components/Hooks/sliderHook";
import SafeHtml from "@lib/SafeHTML";
import { IBlogListData } from "@type/Pages/blogList";

const IBlogBannerSection2 = ({ data, blogListData }: IBlogBannerProps) => {
  const router = useRouter();
  const [legthOfSpecificArrayChunk] = useState(1);

  const {
    slicedData,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
    //@ts-ignore
  } = useSliderHook(blogListData, legthOfSpecificArrayChunk);
  return (
    <>
      <section className="banner-sec">
        <div className="banner-image-wrap">
          <CustomImage
            src={
              data?.banner?.[0]?.banner_image?.path
                ? data?.banner?.[0]?.banner_image?.path
                : IMAGE_PATH.homeBannerPng
            }
            alt="blog_baner"
            width="1519px"
            height="606px"
          />
        </div>

        {slicedData[arrayIndex]?.map((ele: IBlogListData, index: number) => {
          return (
            <div className="banner-slider-wrap" key={index}>
              <div className=" slider-content-wrapper">
                <div className="container">
                  <div className="slider-content">
                    <div className="date-category-info">
                      <div className="date">
                        {/* @ts-ignore */}
                        {converDateMMDDYYYY(ele?.created_at)}
                      </div>
                      <div className="border-right">|</div>
                      <div className="category">{ele?.tag?.[0] || ""}</div>
                    </div>
                    <h2>{ele?.title}</h2>
                    <SafeHtml html={TextTruncate(ele?.description, 150)} />
                    <button
                      type="button"
                      className="btn btn-primary btn-small"
                      onClick={() => router.push(`/blog/${ele?._id}`)}
                    >
                      View Details
                    </button>
                    {hideLeftButton && (
                      <button
                        type="button"
                        className="slider-arrow-btn left"
                        onClick={() => SliderButton("LEFT", arrayIndex - 1)}
                      >
                        <i className="jkms2-arrow-right"></i>
                      </button>
                    )}

                    {hideRightButton && (
                      <button
                        type="button"
                        className="slider-arrow-btn right"
                        onClick={() => SliderButton("RIGHT", arrayIndex + 1)}
                      >
                        <i className="jkms2-arrow-right"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(2, CSS_NAME_PATH.blogBannerSlider2)}
        />
      </Head>
    </>
  );
};

export default IBlogBannerSection2;
