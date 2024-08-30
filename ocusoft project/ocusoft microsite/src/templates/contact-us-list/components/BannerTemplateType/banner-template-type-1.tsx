import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IContactUsMain } from "@templates/contact-us-list";
import { getTypeBasedCSSPathPages } from "@util/common";
import Head from "next/head";
import Link from "next/link";
import React from "react";

const BannerTemplateType1 = (props: IContactUsMain) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPathPages(null, CSS_NAME_PATH.contactUs)}
        />
      </Head>
      <section className="banner-with-breadcrumb banner-section cms-banner">
        <figure className="banner-with-breadcrumb-bg-img">
          <picture>
            <img src="../assets/images/contactus.jpg" alt="banner-image" title="banner-image" height="350"
              width="1920" />
          </picture>
        </figure>
        <div className="container">
          <div className="banner-with-breadcrumb-content">
            <h1>Contact US</h1>
            <ul className="breadcrumb">
              <li><Link href="/"><a><em className="osicon-home"></em></a></Link></li>
              <li><Link href="/contact-us"><a>Contact Us</a></Link></li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default BannerTemplateType1;
