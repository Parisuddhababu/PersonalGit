import CustomImage from "@components/CustomImage/CustomImage";
import useSliderHook from "@components/Hooks/sliderHook";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IEventDetailsIndex } from "@templates/EventDetails";
import { IImage } from "@type/Common/Base";

import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { useState } from "react";

const EventDetailsPhotoSliderSection2 = (props: IEventDetailsIndex) => {
  const [legthOfSpecificArrayChunk] = useState(4);

  const {
    slicedData,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
    //@ts-ignore
  } = useSliderHook(
    props?.event_detail_with_map?.images_of_event,
    legthOfSpecificArrayChunk
  );

  return (
    <>
      <section className="carousel">
        <div className="container">
          <h5>Event Photos</h5>
          <div className="product_slider">
            {hideLeftButton && (
              <button
                type="button"
                onClick={() => SliderButton("LEFT", arrayIndex - 1)}
                className="slider-arrow-btn left"
              >
                <i className="jkms2-arrow-right"></i>
              </button>
            )}
            <div className="d-row">
              {slicedData[arrayIndex]?.map((ele: IImage, index: number) => (
                <div
                  className="d-col d-col-4 just-center"
                  key={"img_slider_event" + index}
                >
                  <div className="col-box">
                    <CustomImage src={ele?.path} height="248px" width="350px" />
                  </div>
                </div>
              ))}
            </div>
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
      </section>

      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.eventDetailCarousel)}
        />
      </Head>
    </>
  );
};

export default EventDetailsPhotoSliderSection2;
