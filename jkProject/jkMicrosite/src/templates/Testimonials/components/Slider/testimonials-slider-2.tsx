import React, { useEffect, useState } from "react";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ITestimonials, ITestimonialsVideoData } from "@type/Pages/testimonials";
import CustomImage from "@components/CustomImage/CustomImage";
import useSliderHook from "@components/Hooks/sliderHook";
import Modal from "@components/Modal";

const TestimonialsSlider2 = (props: ITestimonials) => {
  const [ListData] = useState<ITestimonialsVideoData[]>(props?.video_testimonials?.data);
  const [legthOfSpecificArrayChunk] = useState<number>(3);
  const [winSize, setWinSize] = useState<number>(0);

  const [modal, setModal] = useState<boolean>(false);
  const [videoLink, setVideoLink] = useState<string | null>(null);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleVideoLink = (ele: ITestimonialsVideoData) => {
    setVideoLink(ele?.video_id);
    toggleModal();
  };

  const {
    SliderButton,
    hideLeftButton,
    hideRightButton,
    arrayIndex,
    slicedData
    //@ts-ignore
  } = useSliderHook(props?.video_testimonials.data, typeof window !== 'undefined' && window.innerWidth <= 991 ? 2 : legthOfSpecificArrayChunk);
  useEffect(() => {
    const windowWidth = window.innerWidth;
    setWinSize(windowWidth);
  }, [winSize]);

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath('2', CSS_NAME_PATH.testimonailSlider)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath("", CSS_NAME_PATH.popupBoxDesign)} />
      </Head>
      <section className="testimonial-slider-sec">
        <div className="container">
          <div className="testimonial-slider-wrap">
            <div className="d-row product_slider">
              {hideLeftButton && ListData.length >= 3 && (
                <button
                  type="button"
                  className="slider-arrow-btn left"
                  aria-label="left-arrow"
                  onClick={() => SliderButton("LEFT", arrayIndex - 1)}
                >
                  <i className="jkms2-arrow-right"></i>
                </button>

              )}

              {slicedData[arrayIndex]?.map((ele: ITestimonialsVideoData, eInd: number) => (
                <div key={eInd} className="d-col d-col-3 testimonial-col">
                  <div className="slider-container">
                    <CustomImage
                      src={`https://img.youtube.com/vi/${ele?.video_id}/0.jpg`}
                      alt="testimonial_slider"
                      width="480"
                      height="522"
                      pictureClassName="testimonial-slider-img"
                    />
                    <div className="slider-content">
                      <p title={ele?.details} className="slider-para">{ele?.details?.length > 30 ? `${ele?.details.substring(0, 30)}....` : ele?.details}</p>
                      <h6 className="author-name">{ele?.name} </h6>
                      {/* <div className="author-post">Designer</div> */}
                    </div>
                    <div className="slider-play-icon" onClick={() => handleVideoLink(ele)}>
                      <i className="jkms2-play-icon play-icon"></i>
                    </div>
                  </div>
                </div>
              ))}

              {hideRightButton && ListData.length >= 3 && (
                <button
                  type="button"
                  className="slider-arrow-btn right"
                  aria-label="right-arrow"
                  onClick={() => SliderButton("RIGHT", arrayIndex + 1)}
                >
                  <i className="jkms2-arrow-right"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        {modal ? (
          <Modal className="open-video" headerName="Testimonial Video" open={modal} onClose={toggleModal} dimmer={false}>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoLink}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </Modal>
        ) : null}
      </section>
    </>
  );
};

export default TestimonialsSlider2;
