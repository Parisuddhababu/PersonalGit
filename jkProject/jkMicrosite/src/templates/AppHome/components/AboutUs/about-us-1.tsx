import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IMAGE_PATH } from "@constant/imagepath";
import { getTypeBasedCSSPath } from "@util/common";
import React, { useState } from "react";
import { IHomeAboutUs1Props } from "@templates/AppHome/components/AboutUs";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import Modal from "@components/Modal";
import { TextTruncate } from "@util/common";
import Link from "next/link";

const HomeAboutUs1 = ({ data }: IHomeAboutUs1Props) => {
  const [modal, setModal] = useState<boolean>(false);
  const [videoLink, setVideoLink] = useState<string | null>(null);

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleVideoLink = () => {
    setVideoLink(data?.[0]?.ourstory_video);
    toggleModal();
  };
  return (
    <>
      <section className="our_story">
        <div className="container">
          <div className="d-row">
            <div className="d-col d-col-2 pr-0 f_img">
              {data[0]?.is_video_avail == 1 ? (
                <div className="founder_image">
                  <CustomImage
                    src={
                      data?.[0]?.ourstory_video
                        ? `https://img.youtube.com/vi/${data?.[0]?.ourstory_video?.split("=")[1]
                        }/hqdefault.jpg`
                        : IMAGE_PATH.aboutUsStoryFrontJpg
                    }
                    alt="Founder Image"
                    title="Founder Image"
                    width="760px"
                    height="610px"
                  />
                  {data?.[0]?.ourstory_video ? (
                    <a onClick={() => handleVideoLink()}>
                      <i
                        className="icon jkm-play-icon"
                        onClick={() => setVideoLink(data?.[0]?.ourstory_video)}
                      />
                    </a>
                  ) : (
                    <a>
                      <i className="icon jkm-video-play1" />
                    </a>
                  )}
                </div>
              ) : (
                <div className="founder_image">
                  <CustomImage
                    src={
                      data?.[0]?.ourstory_single_image?.path
                        ? data?.[0]?.ourstory_single_image?.path
                        : IMAGE_PATH.aboutUsStoryFrontJpg
                    }
                    alt="Founder Image"
                    title="Founder Image"
                    width="760px"
                    height="610px"
                  />
                </div>
              )}
            </div>
            <div className="d-col d-col-2">
              <div className="box">
                <h2>About Us</h2>

                {data?.map((ele, eIndex: number) => (
                  <p key={eIndex}>
                    {ele?.ourstory_description &&
                      TextTruncate(ele?.ourstory_description, 485)}
                  </p>
                ))}
                {data?.length > 0 && (
                  <Link href="/about-us">
                    <a className="btn btn-small btn-primary">Read More</a>
                  </Link>
                )}

                {data?.map((ele, elIndex) => (
                  <div key={elIndex} className="about-person">
                    <div className="person-image">
                      <CustomImage
                        src={ele?.ourfounder_image?.path}
                        alt="Profile Image"
                        title="Profile Image"
                        width="220px"
                        height="236px"
                      />
                    </div>
                    <div className="person-details">
                      <p>
                        {ele?.ourfounder_description &&
                          TextTruncate(ele?.ourfounder_description, 442)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {modal ? (
          <Modal
            open={modal}
            onClose={toggleModal}
            dimmer={false}
            className={"about-modal"}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoLink?.split("=")[1]}?autoplay=1&rel=0&showinfo=0&disablekb=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </Modal>
        ) : null}
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("", CSS_NAME_PATH.homeAboutUs)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("", CSS_NAME_PATH.popupBoxDesign)}
        />
      </Head>
    </>
  );
};

export default HomeAboutUs1;
