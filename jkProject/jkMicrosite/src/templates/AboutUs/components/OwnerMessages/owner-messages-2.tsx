import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

import Head from "next/head";
import React, { useState } from "react";
import CustomImage from "@components/CustomImage/CustomImage";
import { getTypeBasedCSSPath } from "@util/common";
import useSliderHook from "@components/Hooks/sliderHook";
import { IOwnerMessage, IOwnerMessageData } from "@type/Pages/aboutUs";

const OwnerMessages2 = ({ data, type }: IOwnerMessageData) => {
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
          href={getTypeBasedCSSPath(type, CSS_NAME_PATH.ownerMessage2)}
        />
      </Head>

      <section className="owner_messages">
        <div className="container ">
          <div className="d-row">
            <div className="d-col">
              <div className="owner-messages-wrap">
                {hideLeftButton && (
                  <button
                    type="button"
                    className="slider-arrow-btn left"
                    aria-label="left-arrow"
                    onClick={() => SliderButton("LEFT", arrayIndex - 1)}
                  >
                    <i className="jkms2-arrow-right"></i>
                  </button>
                )}
                {slicedData[arrayIndex]?.map(
                  (val: IOwnerMessage, index: number) => {
                    return (
                      <div className="message_content" key={index}>
                        <h2 className="owner-text">Owner Messages</h2>
                        <div className="message-body">
                          <div className="image">
                            <CustomImage
                              src={val?.owner_image?.path}
                              alt={"about us"}
                              title={"about us"}
                              height="200"
                              width="200"
                            />
                          </div>
                          <div className="message-body-right">
                            <i className="jkms2-quote"></i>
                            <p className="cursive">{val?.owner_message}
                            </p>
                            <p className="author-name">{`${val?.owner_name}, ${val?.owner_designation}`}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                {hideRightButton && (
                  <button
                    type="button"
                    className="slider-arrow-btn right"
                    aria-label="right-arrow"
                    onClick={() => SliderButton("RIGHT", arrayIndex + 1)}
                  >
                    <i className="jkms2-arrow-right"></i>
                  </button>
                )}                                </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default OwnerMessages2;
