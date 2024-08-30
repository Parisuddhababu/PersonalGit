import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import React from "react";
import { IWhyUsProps } from "@templates/AboutUs/components/WhyUs";
import CustomImage from "@components/CustomImage/CustomImage";
import { getTypeBasedCSSPath } from "@util/common";

const WhyUs1 = ({ data }: IWhyUsProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.whyUs)}
        />
      </Head>
      <section className="why_us">
        <div className="container">
          <h2>{data?.whyus_title || "Why Us ?"}</h2>
          <p>{data?.whyus_description}</p>
          <div className="d-row">
            <div className="d-col d-col-4 just-center">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <i className="jkm-solution"></i>
                    <h3>{data?.whyus_image1_title}</h3>
                  </div>
                  <div className="flip-card-back">
                    <div className="image">
                      <CustomImage
                        src={data?.whyus_image1?.path}
                        alt={"about us"}
                        title={"about us"}
                        height="340"
                        width="350"
                      />
                    </div>
                    <div className="overlap-content">
                      <h3>{data?.whyus_image1_title}</h3>
                      <p>
                        {data?.whyus_image1_description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-col d-col-4 just-center">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <i className="jkm-mission"></i>
                    <h3>{data?.whyus_image2_title}</h3>
                  </div>
                  <div className="flip-card-back">
                    <div className="image">
                      <CustomImage
                        src={data?.whyus_image2?.path}
                        alt={"about us"}
                        title={"about us"}
                        height="340px"
                        width="350px"
                      />
                    </div>
                    <div className="overlap-content">
                      <h3>{data?.whyus_image2_title}</h3>
                      <p>
                        {data?.whyus_image2_description}
                      </p>
                    </div> 

                  </div>
                </div>
              </div>
            </div>
            <div className="d-col d-col-4 just-center">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <i className="jkm-hours-delivery"></i>
                    <h3>{data?.whyus_image3_title}</h3>
                  </div>
                  <div className="flip-card-back">
                    <div className="image">
                      <CustomImage
                        src={data?.whyus_image3?.path}
                        alt={"about us"}
                        title={"about us"}
                        height="340px"
                        width="350px"
                      />
                    </div>
                    <div className="overlap-content">

                      <h3>{data?.whyus_image3_title}</h3>
                      <p>
                        {data?.whyus_image3_description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-col d-col-4 just-center">
              <div className="flip-card">
                <div className="flip-card-inner">
                  <div className="flip-card-front">
                    <i className="jkm-inspiration"></i>
                    <h3>
                      {data?.whyus_image4_title}
                    </h3>
                  </div>
                  <div className="flip-card-back">
                    <div className="image">
                      <CustomImage
                        src={data?.whyus_image4?.path}
                        alt={"about us"}
                        title={"about us"}
                        height="340px"
                        width="350px"
                      />
                    </div>
                    <div className="overlap-content">

                      <h3>{data?.whyus_image4_title}</h3>
                      <p>
                        {data?.whyus_image4_description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhyUs1;
