import React from "react";
import CustomImage from "@components/CustomImage/CustomImage";
import { IMAGE_PATH } from "@constant/imagepath";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { getTypeBasedCSSPath } from "@util/common";
import Link from "next/link";

const NotFound = () => {
  <Head>
    <link
      rel="stylesheet"
      href={getTypeBasedCSSPath("", CSS_NAME_PATH.NotFound)}
    />
  </Head>;
  return (
    <main>
      <section className="error404">
        <div className="container">
          <div className="error404-content">
            <h2>Ooooops!</h2>
            <div className="image">
              <CustomImage
                src={IMAGE_PATH.NotFoundPng}
                alt="No Records Found"
                title="No Records Found"
                width="430"
                height="191"
              />
            </div>
            <p>Sorry! The Page Not Found!!</p>
            <Link href="/">
              <a className="btn btn-secondary btn-small">Go to Home</a>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
