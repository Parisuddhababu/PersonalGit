import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

import Head from "next/head";
import React from "react";
import { IOurMissionAndVisionProps } from "@templates/AboutUs/components/OurMissionVision";
import { getTypeBasedCSSPath } from "@util/common";

const OurMissionAndVision1 = ({ data }: IOurMissionAndVisionProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.missionAndVision)}
        />
      </Head>
      <section className="mission_vision">
        <div className="container">
          <div className="d-row">
            <div className="d-col d-col-2">
              <div className="box">
                <i className="jkm-mission"></i>
                <h3>{data?.our_mission_title || "Our Mission"}</h3>
                <p>{data?.ourmission_description}</p>
              </div>
            </div>
            <div className="d-col d-col-2">
              <div className="box">
                <i className="jkm-outline"></i>
                <h3>{data?.our_vision_title || "Our Vision"}</h3>
                <p>{data?.ourvision_description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OurMissionAndVision1;
