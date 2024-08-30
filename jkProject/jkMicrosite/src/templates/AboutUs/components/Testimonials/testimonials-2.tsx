import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { ITestimonialProps } from "@templates/AboutUs/components/Testimonials";
import { getTypeBasedCSSPath } from "@util/common";
import CustomImage from "@components/CustomImage/CustomImage";
import useSliderHook from "@components/Hooks/sliderHook";
import { IHomeTestimonialsData } from "@type/Pages/home";
import Link from "next/link";

const Testimonials2 = ({ data, type, testimonial_bg_image }: ITestimonialProps) => {

  const [winSize, setWinSize] = useState<number>(0);

  const [legthOfSpecificArrayChunk] = useState<number>(3);

  const {
    slicedData,
    hideRightButton,
    SliderButton,
    hideLeftButton,
    arrayIndex,
    //@ts-ignore
  } = useSliderHook(data, legthOfSpecificArrayChunk);
  useEffect(() => {
    const windowWidth = window.innerWidth;
    setWinSize(windowWidth);
  }, [winSize]);
  const setCustomHeight = () => {
    setTimeout(() => {
      const node = document.querySelector("#testimonials-height") as HTMLElement;
      if (node) {
        node.style.height = node.clientHeight + "px";
      }
    }, 500)
  };

  useEffect(() => {
    setCustomHeight();
  }, []);

  const style = {
    '--testimonial-image': `url(${testimonial_bg_image ? testimonial_bg_image : '../../images/about_us/testimonial.jpg'})`,
  } as React.CSSProperties;

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(type, CSS_NAME_PATH.aboutTestimonial)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(type, CSS_NAME_PATH.testimonailList)} />
      </Head>
      <section className="testimonial" style={style}>
        <div className="testimonial_content">
          <h2>Our Testimonials</h2>
          <h4>What They’re Talking About Company</h4>
        </div>
        <div className="container">
          <div className="testimonial-wrapper">
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
            <div className="testimonial-box">
              <div className="img-group">
                {slicedData[arrayIndex]?.map(
                  (val: IHomeTestimonialsData, index: number) => {
                    return (
                      <CustomImage
                        src={val?.image?.path}
                        alt="Testimonial"
                        title="Testimonial"
                        key={index}
                        width={`${index === 1 ? '130px' : '80px'}`}
                        height={`${index === 1 ? '130px' : '80px'}`}
                        pictureClassName={`${index === 1 ? 'testimonial-img' : (index === 0 ? 'left-img' : 'right-img')}`}
                      />
                    )
                  })}
              </div>
              {slicedData[arrayIndex]?.map(
                (val: IHomeTestimonialsData, index: number) => {
                  return (
                    index === 1 &&
                    <div className="testimonial-para">
                      <p>{val?.details} </p>
                      <h4>{val?.name}</h4>
                    </div>)
                })}
            </div>
            {hideRightButton && (
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
          <Link href={`/testimonials`} >
            <a className="btn btn-small btn-primary btn-bottom">View All</a>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Testimonials2;
