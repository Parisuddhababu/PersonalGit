import React, { useEffect } from "react";
import Head from "next/head";
import { ICMSPageProps } from "@templates/CmsPages";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath, getTypeBasedCSSPathPages, setDynamicDefaultStyle } from "@util/common";
import Link from "next/link";
import { useRouter } from "next/router";

const CMSPage = (props: ICMSPageProps) => {
  const router = useRouter()
  const path = router.asPath
  const setDynamicColour = () => {
    if (props?.default_style && props?.theme) {
      setDynamicDefaultStyle(props?.default_style, props?.theme);
    }
  };

  useEffect(() => {
    setDynamicColour();
  }, []);

  return (
    <>
      <Head>
        <title>{props?.data?.data?.[0]?.page_title}</title>
        <link rel="stylesheet" href={getTypeBasedCSSPathPages(null, CSS_NAME_PATH.cmsPage)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.bannerWithBreadcrumb)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.categoriesBox)} />
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.aboutusContent)} />
      </Head>
      <main>
        <section className="banner-with-breadcrumb banner-section cms-banner">
          <figure className="banner-with-breadcrumb-bg-img">
            <picture>
              <img src="../assets/images/aboutus.jpg"
                alt="banner-image" title="banner-image"
                height="350" width="1920" />
            </picture>
          </figure>
          <div className="container">
            <div className="banner-with-breadcrumb-content">
              <h1>{props?.data?.data?.[0]?.page_title}</h1>
              <ul className="breadcrumb">
                <li><Link href='/'><a><em className="osicon-home"></em></a></Link></li>
                <li><Link href={props?.data?.data?.[0]?.slug}><a>{props?.data?.data?.[0]?.page_title}</a></Link></li>
              </ul>
            </div>
          </div>
        </section>
        <section className="aboutus-section">
          <div className="container">
            <div className="categories-section">

              {
                path?.includes('resources') || path?.includes('return-policy') || path?.includes('recall') ?
                  <>
                    <span>Resources</span>
                    <ul className="categories-wrap">
                      <li><Link href="/resources"><a>Resources</a></Link></li>
                      <li><Link href="/return-policy"><a>Return Policy</a></Link></li>
                      <li><Link href="/recall"><a>Recall</a></Link></li>
                    </ul>
                  </> :
                  <>
                    <span>TOPICS</span>
                    <ul className="categories-wrap">
                      <li><Link href="/contact-us"><a>Contact Us</a></Link></li>
                      <li><Link href="/about"><a>About Us</a></Link></li>
                    </ul>
                  </>
              }

            </div>
            <div className="aboutus-description-wrap">
              <h2>{props?.data?.data?.[0]?.page_title}</h2>
              <div
                dangerouslySetInnerHTML={{
                  __html: props?.data?.data?.[0]?.description || "",
                }}
              ></div>
            </div>
          </div>
        </section>
      </main >
    </>
  );
};
export default CMSPage;
