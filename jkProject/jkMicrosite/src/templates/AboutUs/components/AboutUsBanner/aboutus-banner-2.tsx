import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";

import Head from "next/head";
import React, { useState } from "react";
import { IAboutUsBannerProps } from "@templates/AboutUs/components/AboutUsBanner";
import CustomImage from "@components/CustomImage/CustomImage";
import Modal from "@components/Modal";
import BookAppointment from "@components/BookAppointments/BookAppointment";

const AboutUsBanner2 = ({ data }: IAboutUsBannerProps) => {
  const [modal, setModal] = useState<boolean>(false);

  const toggleModal = () => {
    setModal(!modal);
  };
  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath("2", CSS_NAME_PATH.banner2)} />
      </Head>

      <section className="banner-sec">
        <div className="banner-image-wrap">
          <CustomImage src={data?.banner_image?.path} alt={"about us"} title={"about us"} height="" width="" />

          <div className="banner-content">
            <h2>{data?.banner_title}</h2>
            <button type="button" onClick={toggleModal} className="btn btn-secondary btn-medium">
              Book an Appointment
            </button>
          </div>
        </div>
      </section>

      {modal ? (
        <Modal
          className="book-appointment-popup"
          headerName="Book an Appointment Now"
          open={true}
          onClose={toggleModal}
          dimmer={false}
        >
          <BookAppointment toggleModal={toggleModal} />
        </Modal>
      ) : null}
    </>
  );
};

export default AboutUsBanner2;
