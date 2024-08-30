import CustomImage from "@components/CustomImage/CustomImage";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IMAGE_PATH } from "@constant/imagepath";
import { IContactUsMain } from "@templates/contact-us-list";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const BannerTemplateType1 = (props: IContactUsMain) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.contactBanner)}
        />
      </Head>

      <div className="banner-image-wrap">
        <Link href={`${props?.link}` || ""}>
          <a>
            <CustomImage
              src={IMAGE_PATH.contactUsBanner}
              alt="contactus_banner"
              title="contactus_banner"
              height="330px"
              width="1920px"
            />
          </a>
        </Link>
      </div>
    </>
  );
};

export default BannerTemplateType1;
