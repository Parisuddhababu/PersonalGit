import { IMapProps } from "@components/Map/index";
import Script from "next/script";
import { useEffect } from "react";
import APPCONFIG from "@config/app.config";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";

// Yet To configure this component Dynamically , will be doing that as Reusability needs

const Map = (props: IMapProps) => {
  // useEffect(() => {
  //   setTimeout(() => {
  //     initMap()
  //   }, 1000)
  //   // @ts-ignore
  //   // eslint-disable-next-line
  // }, window["google" as any])

  useEffect(() => {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        initMap();
      }
    }, 1000);
    // eslint-disable-next-line
  }, [typeof window !== 'undefined' && window["google" as any]]);


  const initMap = () => {
    // The location of Uluru
    // @ts-ignore
    const uluru = { lat: parseFloat(props?.latitude), lng: parseFloat(props?.longitude) };
    // The map, centered at Uluru
    // @ts-ignore
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 18,
      center: uluru,
    });
    // The marker, positioned at Uluru
    // @ts-ignore
    new google.maps.Marker({
      position: uluru,
      map: map,
    });
  };


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
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${APPCONFIG.gmapKey}`}
        async
      ></Script>
      <div id="map" className="map"></div>
    </>
  );
};

export default Map;
