import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import React, { useEffect } from "react";
import Head from "next/head";
import pagesServices from "@services/pages.services";
import APICONFIG from "@config/api.config";

const HomeAboutUs1 = () => {
  const getAboutUsData = async () => {
    pagesServices
      .getPage(APICONFIG.ABOUT_US, {})
  };

  useEffect(() => {
    getAboutUsData();
  }, [])

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("", CSS_NAME_PATH.homeAboutUs)}
        />
      </Head>
      <section className="dryeye-banner banner-section">
        <figure className="dryeye-banner-background-img">
          <picture>
            <img src="../assets/images/aboutus.jpg" alt="banner-image" title="banner-image" height="350" width="1920" />
          </picture>
        </figure>
        <div className="container">
          <div className="dryeye-banner-content">
            <h1>About Us</h1>
            <ul className="breadcrumb">
              <li><a href="javascript:void(0)"><em className="osicon-home"></em></a></li>
              <li><a href="javascript:void(0)">About Us</a></li>
            </ul>
          </div>
        </div>
      </section>
      <section className="aboutus-section">
        <div className="container">
          <div className="categories-section">
            <span>TOPICS</span>
            <ul className="categories-wrap">
              <li><a href="javascript:void(0)">About Us</a></li>
              <li><a href="javascript:void(0)">Executive Team</a></li>
              <li><a href="javascript:void(0)">Our Distriutors</a></li>
              <li><a href="javascript:void(0)">In The Community</a></li>
              <li><a href="javascript:void(0)">Affiliate Organizations</a></li>
              <li><a href="javascript:void(0)">National/International</a></li>
              <li><a href="javascript:void(0)">Sponsorships</a></li>
              <li><a href="javascript:void(0)">Community Involvement</a></li>
            </ul>
          </div>
          <div className="aboutus-description-wrap">
            <h2>About Us</h2>
            <p>The HCP (Healthcare Provider) Details Page allows users to access comprehensive information about a specific healthcare provider, including details about their background, qualifications, and contact information. This page
              serves as a valuable resource for users seeking information about a healthcare professional.
            </p>
            <figure className="aboutus-image">
              <picture>
                <img src="../assets/images/lid-scrub.jpg" alt="lid-scrub" title="lid-scrub" height="440" width="1040" />
              </picture>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeAboutUs1;



