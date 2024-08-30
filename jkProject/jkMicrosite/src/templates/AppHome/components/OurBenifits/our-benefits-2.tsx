import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { IOurBenifits1Props } from ".";

const OurBenifits2 = ({ data, dynamic_title }: IOurBenifits1Props) => {
  return (
    <>
      <section className="our-benefits">
        <div className="container">
          <div className="heading">
            <h2>{dynamic_title?.our_benefit_title}</h2>
          </div>
          <div className="row">
            {data?.length !== 0 &&
              data?.map((ele, index) => {
                return (
                  <div className="d-col d-col-4 mb-0" key={index}>
                    <div className="benefit-wrapper">
                      <div className="before">
                        <CustomImage
                          src={ele?.logo?.path}
                          height="70px"
                          width="87px"
                        ></CustomImage>
                        <h5>{ele?.title}</h5>
                      </div>
                      <div className="benefit-section">
                        <h5>{ele?.title}</h5>
                        <p>{ele?.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.homeOurBenifits2)}
        />
      </Head>
    </>
  );
};

export default OurBenifits2;
