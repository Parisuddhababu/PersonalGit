import CustomImage from "@components/CustomImage/CustomImage";
import useSliderHook from "@components/Hooks/sliderHook";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IEventListData } from "@type/Pages/eventList";
import {
  converDateMMDDYYYY,
  getTypeBasedCSSPath,
  TextTruncate,
} from "@util/common";
import Head from "next/head";
import { useState } from "react";
import { IEventBannerProps } from "@templates/EventList/components/EventBanner";
import Link from "next/link";

const EventBannerSection2 = ({ data, type, details }: IEventBannerProps) => {
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
            height="734px"
            width="1920px"
          />
        </div>
        {slicedData[arrayIndex]?.map((item: IEventListData, index: number) => (
          <div className="banner-slider-wrap" key={"t2_event" + index}>
            <div className=" slider-content-wrapper">
              <div className="container">
                <div className="slider-content">
                  <div className="date-category-info">
                    <div className="date">
                      {converDateMMDDYYYY(item?.start_date)}
                    </div>
                    {/* <div className="border-right">|</div>
                      <div className="category">Necklace Sets</div> */}
                  </div>
                  <h2 title={item?.title}>{item?.title}</h2>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: TextTruncate(item?.description, 150),
                    }}
                  />
                  <Link href={`/event/${item?._id}`}>
                    <button type="button" className="btn btn-primary btn-small">
                      View Details
                    </button>
                  </Link>
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
        ))}
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(type, CSS_NAME_PATH.eventBanner)}
        />
      </Head>
    </>
  );
};
export default EventBannerSection2;
