import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

import Head from "next/head";
import React, { useState } from "react";
import { IOwnerMessagesProps } from "@templates/AboutUs/components/OwnerMessages";
import CustomImage from "@components/CustomImage/CustomImage";
import { getTypeBasedCSSPath } from "@util/common";
import useSliderHook from "@components/Hooks/sliderHook";
import { IOwnerMessage } from "@type/Pages/aboutUs";

const OwnerMessages1 = ({ data, director_messages }: IOwnerMessagesProps) => {
  const [legthOfSpecificArrayChunk] = useState<number>(1);

  const {
    slicedData,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
    //@ts-ignore
  } = useSliderHook(data, legthOfSpecificArrayChunk);
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.ownerMessage)}
        />
      </Head>
      <section className="owner_messages">
        <div className="container">
          <div className="d-row">
            <div className="d-col">
              {slicedData[arrayIndex]?.map(
                (val: IOwnerMessage, index: number) => {
                  return (
                    <div className="message_content" key={index}>
                      <h2>{director_messages || "Owner Messages"}</h2>
                      <div className="image">
                        <CustomImage
                          src={val?.owner_image?.path}
                          alt={"about us"}
                          title={"about us"}
                          height="200"
                          width="200"
                        />
                      </div>
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

                      <i className="jkm-quote"></i>
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
                      <p className="cursive"> {val?.owner_message}</p>
                      <p>{`${val?.owner_name}, ${val?.owner_designation}`}</p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OwnerMessages1;
