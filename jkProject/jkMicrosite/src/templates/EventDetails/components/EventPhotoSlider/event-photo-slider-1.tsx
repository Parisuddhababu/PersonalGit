import CustomImage from "@components/CustomImage/CustomImage";
import useSliderHook from "@components/Hooks/sliderHook";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IImage } from "@type/Common/Base";
import { Ievent_detail_with_map } from "@type/Pages/eventDetail";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { useState } from "react";

const EventDetailsPhotoSliderSection1 = (props: Ievent_detail_with_map) => {

  const [legthOfSpecificArrayChunk] = useState(4)

  const {
    slicedData,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
    //@ts-ignore
  } = useSliderHook(props?.event_detail_with_map?.images_of_event, legthOfSpecificArrayChunk);

  return (
    <>
      <section className="carousel">
        <div className="container">
          <h5>Event Photos</h5>
          <div className="d-row product_slider">
            {hideLeftButton && (
              <button
                type="button"
                className="slider-arrow-btn left"
                aria-label="left-arrow"
                onClick={() => SliderButton("LEFT", arrayIndex - 1)}
              >
                <i className="jkm-arrow-right"></i>
              </button>
            )}

            {slicedData[arrayIndex]?.map((ele: IImage, eInd: number) => {
              return (
                <div className="d-col d-col-4 just-center" key={eInd}>
                  <div className="col-box">
                    <CustomImage src={ele?.path} height="248px" width="350px" />
                  </div>
                </div>
              );
            })}
            {hideRightButton && (
              <button
                type="button"
                className="slider-arrow-btn right"
                aria-label="right-arrow"
                onClick={() => SliderButton("RIGHT", arrayIndex + 1)}
              >
                <i className="jkm-arrow-right"></i>
              </button>
            )}
          </div>
        </div>
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.eventDetailCarousel)}
        />
      </Head>
    </>
  );
};

export default EventDetailsPhotoSliderSection1;
