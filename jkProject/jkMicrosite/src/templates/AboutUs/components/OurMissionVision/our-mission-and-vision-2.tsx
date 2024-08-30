import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

import Head from "next/head";
import React from "react";
import { IOurMissionAndVisionProps } from "@templates/AboutUs/components/OurMissionVision";
import { getTypeBasedCSSPath } from "@util/common";

const OurMissionAndVision2 = ({ data }: IOurMissionAndVisionProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(data.type, CSS_NAME_PATH.missionAndVision2)}
        />
      </Head>
      <section className="mission_vision">
        <div className="container">
          <div className="d-row">
            <div className="d-col d-col-2">
              <div className="box">
                <i className="jkms2-delivery-truck"></i>
                <div className="mv-content">
                  <h3>{data?.our_mission_title || "Our Mission"}</h3>
                  <p className="content-para">
                    {data?.ourmission_description}
                  </p>
                </div>
              </div>
            </div>
            <div className="d-col d-col-2">
              <div className="box">
                <i className="jkms2-outline"></i>
                <div className="mv-content">
                  <h3>{data?.our_vision_title || "Our Vision"}</h3>
                  <p className="content-para">{data?.ourvision_description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </>
  );
};

export default OurMissionAndVision2;
