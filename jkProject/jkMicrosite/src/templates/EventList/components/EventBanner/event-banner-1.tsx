import Head from "next/head";
import React, { useState } from "react";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import CustomImage from "@components/CustomImage/CustomImage";
import { IEventBannerProps } from "@templates/EventList/components/EventBanner";
import useSliderHook from "@components/Hooks/sliderHook";
import { IEventListData } from "@type/Pages/eventList";
import { TextTruncate } from "@util/common";
import Link from "next/link";

const IEventBannerSection1 = ({ data, details }: IEventBannerProps) => {
  const [legthOfSpecificArrayChunk] = useState(1);

  const {
    slicedData,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
    //@ts-ignore
  } = useSliderHook(details?.event_list?.data, legthOfSpecificArrayChunk);
  return (
    <>
      <section className="banner-sec">
        <div className="banner-image-wrap">
          <CustomImage
            src={data?.[0]?.banner_image?.path}
            height="778px"
            width="1920px"
          />
        </div>
        {slicedData[arrayIndex]?.map((item: IEventListData, index: number) => {
          return (
            <>
              <div className="banner-slider-wrap" key={index + "event_list"}>
                <div className="jk-card slider-content-wrapper">
                  {hideLeftButton && (
                    <button
                      type="button"
                      className="btn btn-icon slider-arrow-btn left"
                      aria-label="left-arrow"
                      onClick={() => SliderButton("LEFT", arrayIndex - 1)}
                    >
                      <i className="jkm-arrow-right"></i>
                    </button>
                  )}
                  <div className="slider-content">
                    <div className="date-category-info">
                      <div className="date">
                        <i className="jkm-calendar mr-10"></i>
                        {converDateMMDDYYYY(item?.start_date)}
                      </div>
                      {/* <div className="category">
                  <i className="jkm-folder mr-10"></i>Necklace Sets
                </div> */}
                    </div>
                    <h2>{data?.[0]?.banner_title}</h2>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: TextTruncate(item?.description, 150),
                      }}
                    />
                    <Link href={`/event/${item?._id}`}>
                      <button
                        type="button"
                        className="btn btn-primary btn-small"
                      >
                        View Details
                      </button>
                    </Link>
                  </div>
                  {hideRightButton && (
                    <button
                      type="button"
                      className="btn btn-icon slider-arrow-btn right"
                      aria-label="right-arrow"
                      onClick={() => SliderButton("RIGHT", arrayIndex + 1)}
                    >
                      <i className="jkm-arrow-right"></i>
                    </button>
                  )}
                </div>
              </div>
            </>
          );
        })}
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.eventBanner)}
        />
      </Head>
    </>
  );
};

export default IEventBannerSection1;
