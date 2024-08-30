import React, { useState } from "react";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { ITestimonials, ITestimonialsBanner } from "@type/Pages/testimonials";
import CustomImage from "@components/CustomImage/CustomImage";

const TestimonialsBanner1 = (props: ITestimonials) => {
  const [ListData] = useState<ITestimonialsBanner[]>(props?.testimonial_banner);
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.testimonialBanner)}
        />
      </Head>
      <section className="banner-sec">
        {ListData?.map((ele: ITestimonialsBanner, eInd: number) => (
          <div key={eInd} className="banner-image-wrap">
            <CustomImage
              src={ele?.banner_image?.path}
              height="330"
              width="1920"
              pictureClassName="testimonial-img"
            />
            <div className="banner-content">
              <h2>{ele?.banner_title}</h2>
              {/* <div className="subTitle">Doing it for LOVE</div> */}
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default TestimonialsBanner1;
