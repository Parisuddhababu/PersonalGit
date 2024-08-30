import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import { IBannerSection1Props } from "@templates/ProductList/components/BannerSection";
import { IMAGE_PATH } from "@constant/imagepath";
import CustomImage from "@components/CustomImage/CustomImage";
import { useEffect, useState } from "react";

const IBannerSection1 = ({ image, mobileImage, title }: IBannerSection1Props) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the threshold as needed
    };
    // Initial check on mount
    handleResize();
    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.productListBannerSection)} />
      </Head>
      <section className="banner-sec">
        <div className="banner-image-wrap">
          <CustomImage
            src={(!isMobile && image) ? image : (isMobile && mobileImage) ? mobileImage : IMAGE_PATH.productBannerJpg}
            alt={"Product Banner Image"}
            title={"Product Banner Image"}
            height="330px"
            width="1920px"
          />
          <div className="banner-content">
            <h2>{title}</h2>
            {/* <div className="subTitle">{description}</div> */}
          </div>
        </div>
      </section>
    </>
  );
};

export default IBannerSection1;
