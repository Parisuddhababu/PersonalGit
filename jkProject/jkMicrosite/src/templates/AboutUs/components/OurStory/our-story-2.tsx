import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

import Head from "next/head";
import React, { useState } from "react";
import { IOurStoryProps } from "@templates/AboutUs/components/OurStory";
import CustomImage from "@components/CustomImage/CustomImage";
import SafeHtml from "@lib/SafeHTML";
import { getTypeBasedCSSPath } from "@util/common";
import Modal from "@components/Modal";
import { IMAGE_PATH } from "@constant/imagepath";

const OurStory2 = ({ data }: IOurStoryProps) => {
  const [modal, setModal] = useState<boolean>(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <>
      <section className="our-story">
        <div className="container">
          <div className="our-story-wrap d-row">
            <div className="d-col d-col-2">
              <div className="box">
                <h2>{data?.ourstory_title || "Our Story"}</h2>
                <SafeHtml
                  removeAllTags={true}
                  html={data?.ourstory_description}
                />
              </div>
            </div>
            <div className="d-col d-col-2 f-img">
              <div className="founder-image">
                {data?.is_video_avail === 1 ? <> <CustomImage
                  src={
                    data?.ourstory_video
                      ? `https://img.youtube.com/vi/${data?.ourstory_video?.split("=")[1]
                      }/hqdefault.jpg`
                      : IMAGE_PATH.aboutUsStoryFrontJpg
                  }
                  alt={"about us"}
                  title={"about us"}
                  height=""
                  width=""
                />
                  <a onClick={toggleModal}>
                  <span>
                    <i className="icon jkms2-play-icon"></i>
                  </span>
                </a>
                  </> 
                  : <CustomImage src={data?.ourstory_single_image?.path ?? IMAGE_PATH.aboutUsStoryFrontJpg} height="472px" width="720px" />}

              </div>
            </div>

          </div>
        </div>
        {modal ? (
          <Modal
            open={true}
            onClose={toggleModal}
            dimmer={false}
            className={"about-modal"}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${data?.ourstory_video?.split("=")[1]
                }`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;"
            />
          </Modal>
        ) : null}
      </section>


      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(data.type, CSS_NAME_PATH.ourStory2)}
        />
      </Head>
    </>
  );
};

export default OurStory2;
