import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { ITestimonialProps } from "@templates/AboutUs/components/Testimonials";
import { getTypeBasedCSSPath } from "@util/common";
import Testimonial1 from "@templates/AppHome/components/Testimonial";

const Testimonials1 = ({ data}: ITestimonialProps) => {

  const [winSize, setWinSize] = useState<number>(0);
  useEffect(() => {
    const windowWidth = window.innerWidth;
    setWinSize(windowWidth);
  }, [winSize]);
  const setCustomHeight = () => {
    setTimeout(()=>{
    const node = document.querySelector("#testimonials-height") as HTMLElement;
    if (node) {
        node.style.height = node.clientHeight + "px";
      }
    },500)
  };

  useEffect(() => {
    setCustomHeight();
  }, []);
  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.homeTestimonial)} />
      </Head>
      <Testimonial1 data={data} />
    </>
  );
};

export default Testimonials1;
