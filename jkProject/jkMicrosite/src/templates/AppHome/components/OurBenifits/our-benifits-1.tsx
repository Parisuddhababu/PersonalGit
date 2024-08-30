import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import React from "react";
import { IOurBenifits1Props } from "@templates/AppHome/components/OurBenifits";
import Head from "next/head";
import CustomImage from "@components/CustomImage/CustomImage";
import SafeHtml from "@lib/SafeHTML";

const OurBenifits1 = ({ data ,dynamic_title }: IOurBenifits1Props) => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeOurBenifits)} />
      </Head>
      <section className="our-benefits">
        <div className="container">
          <h2>{dynamic_title?.our_benefit_title ||"Our Benefits"}</h2>
          <div className="row">
            {data?.map((ele, eInd) => (
              <div key={eInd} className="d-col d-col-4 mb-0">
                <div className="benefit-wrapper">
                  <CustomImage
                    alt={ele.title}
                    title={ele.title}
                    src={ele?.logo?.path}
                    className="our-benifits-icon"
                    width="80px"
                    height="80px"
                  />
                  <h3 className="h5">{ele?.title}</h3>
                    <SafeHtml className="mb-0" removeAllTags={true} html={ele?.description} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default OurBenifits1;
