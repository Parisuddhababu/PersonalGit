import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { ITestimonial1Props } from ".";
import { useState } from "react";
import Link from "next/link";
import { IMAGE_PATH } from "@constant/imagepath";

const Testimonial2 = ({ data, dynamic_title, testimonial_bg_image }: ITestimonial1Props) => {
  
  const [testimonialIndex, setTestimonialIndex] = useState(1);
  const style = {
    '--testimonial-image': `url(${testimonial_bg_image ? testimonial_bg_image : '../../images/about_us/testimonial.jpg'})`,
  } as React.CSSProperties;

  return (
    <>
      <section className="testimonial" style={style}>
        <div className="testimonial_content">
          <h2>{dynamic_title?.testimonial_title || "Our Testimonials"}</h2>
          <h4>
            {" "}
            {dynamic_title?.testimonial_tagline ||
              "What They’re Talking About Company"}
          </h4>
        </div>
        <div className="container">
          <div className="testimonial-wrapper">
            <button
              type="button"
              onClick={() =>
                testimonialIndex > 0 &&
                setTestimonialIndex(testimonialIndex - 1)
              }
              className="slider-arrow-btn left"
            >
              <i className="jkms2-arrow-right"></i>
            </button>

            <div className="testimonial-box">
              <div className="img-group">
                {testimonialIndex !== 0 && (
                  <picture className="left-img">
                    <img
                      src={data[testimonialIndex - 1]?.image?.path ? data[testimonialIndex - 1]?.image?.path:  IMAGE_PATH.testimonialImgMinifiedPng}
                      alt="Testimonial"
                      title="Testimonial"
                      width="80"
                      height="80"
                    />
                  </picture>
                )}

                <picture className="testimonial-img">
                  <img
                    src={data[testimonialIndex]?.image?.path ? data[testimonialIndex]?.image?.path : IMAGE_PATH.testimonialImgMinifiedPng}
                    alt="Testimonial"
                    title="Testimonial"
                    width="130"
                    height="130"
                  />
                </picture>
                {data[testimonialIndex+1]?._id && testimonialIndex !== 2 && (
                  <picture className="right-img">
                    <img
                      src={data[testimonialIndex + 1]?.image?.path ? data[testimonialIndex + 1]?.image?.path : IMAGE_PATH.testimonialImgMinifiedPng}
                      alt="Testimonial"
                      title="Testimonial"
                      width="80"
                      height="80"
                    />
                  </picture>
                )}
              </div>
              <div className="testimonial-para">
                <p>{data[testimonialIndex]?.details}</p>
                <h4>{data[testimonialIndex]?.name}</h4>
              </div>
            </div>
            {
              testimonialIndex < 2 && data[testimonialIndex+1]?._id ? 
            <button
              type="button"
              onClick={() =>
                (testimonialIndex < 2 && data[testimonialIndex+1]?._id) &&
                setTestimonialIndex(testimonialIndex + 1)
              }
              className="slider-arrow-btn right"
            >
              <i className="jkms2-arrow-right"></i>
            </button>: <></>}
          </div>
          <Link href={`/testimonials`}>
            <a className="btn btn-small btn-primary btn-bottom">View All</a>
          </Link>
        </div>
      </section>

      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(
            "2",
            CSS_NAME_PATH.homeTestimonialsTemplate2
          )}
        />
      </Head>
    </>
  );
};

export default Testimonial2;
