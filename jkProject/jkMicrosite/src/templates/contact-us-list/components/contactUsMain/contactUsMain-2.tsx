import React,{useEffect} from 'react'
import { IContactList } from "@type/Pages/contactUsAddress";
import MapSection2 from "@templates/contact-us-list/components/MapSection/map-section-2";
import { IMapSection } from "@type/Pages/mapSection";
import ContactUsList2 from "@templates/contact-us-list/components/ContactUsList/contact-us-list-2";
import ContactUsAddressList2 from "@templates/contact-us-list/components/contactusAddressList/contactus-address-list-2";
import { IContactUsMain } from "@templates/contact-us-list";
import APPCONFIG from '@config/app.config';

const ContactUsMain2 = (props: IContactUsMain) => {
  const getLatLong = (data: IContactList[]) => {
    let obj = {} as IMapSection;
    let filteredData = data?.filter((a) => a?.is_default === 1);
    if (filteredData?.length > 0) {
      obj = {
        latitude: filteredData?.[0]?.latitude,
        longitude: filteredData?.[0]?.longitude,
      };
    } else {
      obj = {
        latitude: data?.[0]?.latitude,
        longitude: data?.[0]?.longitude,
      };
    }

    return obj;
  };

  const loadGoogleMapScript = (callback: any) => {
    // @ts-ignore
    if (typeof window["google" as any] === 'object' && typeof window["google" as any]?.maps === 'object') {
      callback();
    } else {
      const googleMapScript = document.createElement("script");
      googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=${APPCONFIG.gmapKey}&libraries=places`;
      window.document.body.appendChild(googleMapScript);
      googleMapScript.addEventListener("load", callback);

    }
  }

  useEffect(() => {
    loadGoogleMapScript(() => {

    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <MapSection2 data={getLatLong(props?.contactus_address_list?.data)} />
      <section className="contact-form">
        <div className="container">
          <div className="d-row">
            <ContactUsList2
              data={{
                ...props?.contact_us_list?.data?.[0],
                ...props?.contactus_address_list?.data?.[0],
              }}
            />
            <ContactUsAddressList2 />
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUsMain2;
