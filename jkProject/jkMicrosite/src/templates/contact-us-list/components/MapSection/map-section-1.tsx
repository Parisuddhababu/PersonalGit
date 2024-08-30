import React from "react";
import { IMapSectionProps } from "@templates/contact-us-list/components/MapSection";
import Map from "@components/Map";
import Head from "next/head";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

const MapSection1 = ({ data }: IMapSectionProps) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={
            APPCONFIG.STYLE_BASE_PATH_COMPONENT +
            CSS_NAME_PATH.contactUsMap +
            ".css"
          }
        />
      </Head>
      <section className="responsive-map">
        <Map
          latitude={data?.latitude ?? ""}
          longitude={data?.longitude ?? ""}
        />
      </section>
    </>
  );
};

export default MapSection1;
