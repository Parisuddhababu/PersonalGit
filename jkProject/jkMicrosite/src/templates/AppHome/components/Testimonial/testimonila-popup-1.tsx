import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IHomeTestimonialsData } from "@type/Pages/home";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";

const TestimonialPopup1 = (props: IHomeTestimonialsData) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.popupBoxDesign)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.testimonailPopup)}
        />
      </Head>
      <div className="modal-content">
        <div className="testimonial-text">
          <i className="icon jkm-quote1"></i>
          <p>{props?.details}</p>
          <span>- {props?.name}</span>
        </div>
        <div className="testimonial-img">
          <CustomImage
            src={props?.image?.path
            }
            alt="imagePreview"
            title="imagePreview"
            width="160"
            height="160"
            pictureClassName="testimonial-img"
          />
        </div>
      </div>
    </>
  );
};

export default TestimonialPopup1;
