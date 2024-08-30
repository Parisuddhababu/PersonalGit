import React,{useEffect} from 'react'
import { IContactList } from "@type/Pages/contactUsAddress";
import BannerTemplateType1 from "@templates/contact-us-list/components/BannerTemplateType/banner-template-type-1";
import ContactUsList1 from "@templates/contact-us-list/components/ContactUsList/contact-us-list-1";
import MapSection1 from "@templates/contact-us-list/components/MapSection/map-section-1";
import ContactUsAddressList1 from "@templates/contact-us-list/components/contactusAddressList/contactus-address-list-1";
import { IMapSection } from "@type/Pages/mapSection";
import { IContactUsMain } from "@templates/contact-us-list";
import APPCONFIG from '@config/app.config';

const ContactUsMain1 = (props: IContactUsMain) => {
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

    <section className="banner-sec">
      <BannerTemplateType1 {...props} />
      <ContactUsList1 data={{...props?.contact_us_list?.data?.[0], ...props?.contactus_address_list?.data?.[0]}} />
    </section>
      <ContactUsAddressList1 />
      <MapSection1
        data={getLatLong(
          props?.contactus_address_list?.data
        )}
      />
    </>
  );
};

export default ContactUsMain1;
