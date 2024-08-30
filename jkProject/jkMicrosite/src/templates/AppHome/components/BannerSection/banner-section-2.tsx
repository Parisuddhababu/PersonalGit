import BookAppointment from "@components/BookAppointments/BookAppointment";
import Modal from "@components/Modal";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IMAGE_PATH } from "@constant/imagepath";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { useEffect, useState } from "react";
import { IBanner, IBannerProps } from ".";

const IBannerSection2 = (props : IBannerProps) => {
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
      <section className="banner-with-title">
        <div className="banner-wrapper">
          <div className="banner-item">
                {
                  // @ts-ignore
                  bannerImgList?.map(
                    (bList: IBanner, bListIndex: number) =>
                    bListIndex === activeIndex && (
                        <>
                        <a href={bList?.link || ""} key={bListIndex}>
                        <picture key={bListIndex}>
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
                            height={"778px"}
                            width={"1920px"}
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
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.homeBannerSection2)}
        />
      </Head>
    </>
  );
};

export default IBannerSection2;
