import CustomImage from "@components/CustomImage/CustomImage";
import { IVerticalSection } from "@type/Pages/eventDetail";
import { converDateMMDDYYYY, getTypeBasedCSSPath } from "@util/common";
import EventSocialShare from "@templates/EventDetails/components/EventSocialShareIcons/eventSocialShareIcon";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import Head from "next/head";

const EventVerticalSection1 = (props: IVerticalSection) => {
  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(null, CSS_NAME_PATH.eventDetailSocialIcons)}
        />
      </Head>
      <div className="event-time-location">
        <h5>
          {" "}
          <i className="jkm-calendar"></i> Date & Time
        </h5>
        <p>
          {converDateMMDDYYYY(props?.start_date)} <br />
          to {converDateMMDDYYYY(props?.end_date)}
          <br /> (India Standard Time)
        </p>
        <div className="seperator"></div>
        <h5>
          <i className="jkm-contact-location"></i>Location
        </h5 >
        <p>{props?.location_details}</p>
        <p>
          {props?.phones?.map((ele) => (
            <>
              {props?.country?.[0]?.country_phone_code}
              {ele?.phone}
              <br />
            </>
          ))}
        </p>

        <p>
          {props?.emails?.map((ele) => (
            <>
              {ele?.email}
              <br />
            </>
          ))}
        </p>
        <div className="seperator"></div>
        <h5>Share Event</h5>
        <EventSocialShare data={props?.share_event?.data} type={1} />

        <div className="seperator"></div>
        <h5>Organizers (s)</h5>
        <CustomImage
          src={props?.Logo_event?.data?.[0]?.generalconf_logo.path}
          height="30.09px"
          width="138.4px"
        />

        <p>
          {props?.organizer?.name}
          <br />
          {props?.organizer?.account_address?.[0]?.address_line1}
          <br /> {props?.organizer?.account_address?.[0]?.address_line2}
          <br />
          {props?.organizer?.account_address?.[0]?.city?.name}
          <br /> {props?.organizer?.account_address?.[0]?.state?.name}{" "}
          {props?.organizer?.account_address?.[0]?.pincode}
        </p>
      </div >
    </>
  );
};

export default EventVerticalSection1;
