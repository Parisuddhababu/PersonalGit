import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IMAGE_PATH } from "@constant/imagepath";
import { getTypeBasedCSSPath } from "@util/common";
import React, { useEffect, useState } from "react";
import { IBanner, IBannerProps } from "@templates/AppHome/components/BannerSection";
import Head from "next/head";
import Modal from "@components/Modal";
import BookAppointment from "@components/BookAppointments/BookAppointment";
const IBannerSection1 = (props : IBannerProps) => {
  console.log(props,"prop")
  const [bannerImgList,setBannerImgList] = useState<IBanner[]>([]);

  
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const delay = 10000;
  const [modal, setModal] = useState<boolean>(false);
  
  useEffect(()=>{
    setBannerImgList(props?.data)
  },[])

  /**
   * Auto Slider
   *
   */
  useEffect(() => {
    const bannerTimeOut = setTimeout(
      () =>
        setActiveIndex((prevIndex) =>
          prevIndex === bannerImgList?.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );
    // eslint-disable-next-line
    return () => { clearTimeout(bannerTimeOut) };
    // eslint-disable-next-line
  }, [activeIndex]);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeBannerSection)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.bookAppointmentPopup)}
        />
      </Head>
      <section className="banner-with-title">
        <div className="banner-wrapper">
          <div className="banner-item">
                {
                  // @ts-ignore
                  bannerImgList?.map(
                    (bList: IBanner, bListIndex: number) =>
                    bListIndex === activeIndex && (
                        <>
                          {/* <div className="container">
                            {bList?.banner_title && (
                              <h1>{bList?.banner_title}</h1>
                            )}
                          </div> */}
                          <a href={bList?.link || ""} key={bListIndex}>
                            <picture >
                              <source
                                src={
                                  bList?.banner_image?.path
                                    ? bList?.banner_image?.path
                                    : IMAGE_PATH.homeBannerPng
                                }
                                type="image/webp"
                              />
                              <source
                                src={
                                  bList?.banner_image?.path
                                    ? bList?.banner_image?.path
                                    : IMAGE_PATH.homeBannerPng
                                }
                                type="image/jpg"
                              />
                              <img
                                decoding="async"
                                src={`${bList?.banner_image?.path
                                  ? bList?.banner_image?.path
                                  : IMAGE_PATH.homeBannerPng
                                  }?w=1920px`}
                                alt={bList?.banner_title}
                                title={bList?.banner_title}
                              // height={"778px"}   as of Now Removed Height and width because it was causing issue in initial load
                              // width={"1920px"}   of Our Product Category and Forcing that component to stay in desktop mode even in Mobile view
                              />
                            </picture>

                          </a>
                        </>
                      )
                  )
                }
            
            {/* <div className="container">
              <h1>Not Sure Which Design To Pick?</h1>
              <a onClick={toggleModal} className="btn btn-secondary btn-medium">
                Book an Appointment
              </a>
            </div> */}
          </div>
        </div>
        <ul>
          {bannerImgList?.map((ele, ind) => (
            <li key={ind} className={ind === activeIndex ? "active" : ""}>
              <button onClick={() => setActiveIndex(ind)} type="button" />
            </li>
          ))}
        </ul>
      </section>

      {modal ? (
        <Modal
          className="book-appointment-popup"
          open={true}
          onClose={toggleModal}
          dimmer={false}
          headerName="Book an Appointment Now"
        >
          <BookAppointment toggleModal={toggleModal} />
        </Modal>
      ) : null}
    </>
  );
};

export default IBannerSection1;
