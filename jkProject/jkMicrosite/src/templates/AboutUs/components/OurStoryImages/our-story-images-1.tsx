import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

import Head from "next/head";
import React, { useState } from "react";
import { IOurStoryImagesProps } from "@templates/AboutUs/components/OurStoryImages";
import CustomImage from "@components/CustomImage/CustomImage";
import { getTypeBasedCSSPath } from "@util/common";
import useSliderHook from "@components/Hooks/sliderHook";
import { IImage } from "@type/Common/Base";

const OurStoryImages1 = ({ data }: IOurStoryImagesProps) => {
  const [legthOfSpecificArrayChunk] = useState<number>(3);

  const {
    slicedData,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
    //@ts-ignore
  } = useSliderHook(data?.ourstory_image, legthOfSpecificArrayChunk);

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productSlider3items)} />
      </Head>
      <section className="product_slider">
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
        <div className="slider-content">
          {slicedData[arrayIndex]?.map((val: IImage, index: number) => {
            return (
              <div className="slider_image" key={index}>
                <CustomImage src={val?.path} alt={"about us"} title={"about us"} height="480" width="640" />
              </div>
            );
          })}
        </div>
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
      </section>
    </>
  );
};

export default OurStoryImages1;
