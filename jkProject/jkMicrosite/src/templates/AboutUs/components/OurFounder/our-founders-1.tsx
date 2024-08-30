import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

import Head from "next/head";
import React from "react";
import { IOurFounderProps } from "@templates/AboutUs/components/OurFounder";
import CustomImage from "@components/CustomImage/CustomImage";
import { getTypeBasedCSSPath } from "@util/common";

const OurFounder1 = ({ data }: IOurFounderProps) => {
  return (
    <>
      
      <section className="our_founder">
        <div className="container">
          <div className="d-row">
            <div className="d-col d-col-2">
              <div className="box">
                <h2>{data?.our_founder_title || "Our Founder" }</h2>
                <p>{data?.ourfounder_description}</p>
              </div>
            </div>
            <div className="d-col d-col-2 align-item-center just-center">
              <div className="founder_image">
                <CustomImage
                  src={data?.ourfounder_image?.path}
                  alt={"about us"}
                  title={"about us"}
                  height="400"
                  width="560"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.ourFounder)}
        />
      </Head>
    </>
  );
};

export default OurFounder1;
