import Wrapper from "@components/Wrapper";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IEventDetailsIndex } from "@templates/EventDetails";
import { ConvertDateCommonDisplay, getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";

const EventVerticalSection2 = (props: IEventDetailsIndex) => {
  return (
    <>
      <div className="event-time-locations">
        <div className="d-row">
          <div className="d-col d-col-3 mb-0 border-right border-bottom">
            <h5>
              <i className="jkms2-calendar"></i> Date & Time
            </h5>
            <p>
              {ConvertDateCommonDisplay(props?.event_detail_with_map?.start_date)}
              <br />
              to {ConvertDateCommonDisplay(props?.event_detail_with_map?.end_date)}
              {/* <br /> (India Standard Time) */}
            </p>
          </div>
          <div className="d-col d-col-3 mb-0 border-right border-bottom">
            <h5>
              <i className="jkms2-contact-location"></i>Location
            </h5>
            <p>{props?.event_detail_with_map?.location_details}</p>
          </div>
          <div className="d-col d-col-3 mb-0">
            <h5>
              <i className="jkms2-contact-call"></i>Contact
            </h5>
            <p>
              <>
                {props?.event_detail_with_map?.phones?.map((ele, pIndex) => (
                  <Wrapper key={pIndex}>
                    {props?.event_detail_with_map?.country?.[0]?.country_phone_code}
                    {ele?.phone}
                    <br />
                  </Wrapper>
                ))}
                {props?.event_detail_with_map?.emails?.map((email, eIndex) => {
                  <Wrapper key={eIndex}>
                    {email?.email}
                    <br />
                  </Wrapper>;
                })}
              </>
            </p>
          </div>
        </div>
      </div>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.eventTimeLocation)}
        />
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath("2", CSS_NAME_PATH.eventDetailSocialIcons)}
        />
      </Head>
    </>
  );
};

export default EventVerticalSection2;
