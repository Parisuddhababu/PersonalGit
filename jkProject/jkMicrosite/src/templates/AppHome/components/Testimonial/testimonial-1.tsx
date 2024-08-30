import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath, TextTruncate } from "@util/common";
import React, { useEffect, useState } from "react";
import { ITestimonial1Props } from "@templates/AppHome/components/Testimonial";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import Modal from "@components/Modal";
import TestimonialPopup1 from "./testimonila-popup-1";
import { IHomeTestimonialsData } from "@type/Pages/home";
import Link from "next/link";
import { IMAGE_PATH } from "@constant/imagepath";

const Testimonial1 = ({ data, dynamic_title, testimonial_bg_image }: ITestimonial1Props) => {
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const [winSize, setWinSize] = useState<number>(0);
  useEffect(() => {
    const windowWidth = window.innerWidth;
    setWinSize(windowWidth);
  }, [winSize]);
  const setCustomHeight = () => {
    setTimeout(() => {
      const node = document.querySelector(
        "#testimonials-height"
      ) as HTMLElement;
      if (node) {
        node.style.height = node.clientHeight + "px";
      }
    }, 500);
  };
  const [modal, setModal] = useState<boolean>(false);
  const [modalItems, setModalItems] = useState<IHomeTestimonialsData>(
    data?.[activeIndex]
  );
  const toggleModal = () => {
    setModal(!modal);
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
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeTestimonial2)}
        />
      </Head>
      <section className="testimonial" style={style}>
        <div className="testimonial-main-content">
          <h2>{dynamic_title?.testimonial_title || "Our Testimonials"}</h2>
          <h3 className="h4">
            {dynamic_title?.testimonial_tagline ||
              "What They’re Talking About Company"}
          </h3>
        </div>
        <div className="container">
          <div className="d-row" id="testimonials-height">
            {data?.slice(0, 3)?.map((ele, index) => (
              <div
                key={index + "testimonial"}
                onMouseOver={() => {
                  setActiveIndex(index);
                }}
                className={`d-col d-col-3 testimonial-wrapper ${winSize >= 991 && index === activeIndex ? "active" : ""
                  }`}
              >
                <div className="testimonial-content">
                  {winSize >= 991 && (
                    <CustomImage
                      src={ele?.image?.path ? ele?.image?.path : IMAGE_PATH.testimonialImgMinifiedPng}
                      alt="Testimonial"
                      title="Testimonial"
                      width="160px"
                      height="160px"
                      pictureClassName="testimonial-img"
                    />
                  )}

                  <h4 className="testimonial-title title__effet">
                    {ele?.name}
                  </h4>
                  <p className="testimonial-para">
                    {" "}
                    {TextTruncate(ele?.details, 90)}
                  </p>
                  {ele?.details?.length > 90 && (
                    <button
                      onClick={() => {
                        setModalItems(ele);
                        toggleModal();
                      }}
                      type="button"
                      className="btn btn-secondary btn-small"
                    >
                      Read More
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {data?.length > 0 && (
            <Link href="/testimonials">
              <a className="btn btn-small btn-primary btn-bottom">View All</a>
            </Link>
          )}
        </div>
      </section>
      {modal ? (
        <Modal
          className="testimonial-popup"
          open={true}
          onClose={toggleModal}
          dimmer={false}
        >
          <TestimonialPopup1 {...modalItems} />
        </Modal>
      ) : null}
    </>
  );
};

export default Testimonial1;
