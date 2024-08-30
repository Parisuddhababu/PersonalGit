import CustomImage from "@components/CustomImage/CustomImage";
import Map from "@components/Map";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { IEventDetailsIndex } from "@templates/EventDetails";
import { getTypeBasedCSSPath } from "@util/common";
import Head from "next/head";
import EventSocialShare from "@templates/EventDetails/components/EventSocialShareIcons/eventSocialShareIcon";
const EventDetailsSection2 = (props: IEventDetailsIndex) => {
  return (
    <>
      <div className="event-details-content">
        <div className="d-row">
          <div className="d-col mb-0">
            <div className="content">
              <p
                dangerouslySetInnerHTML={{
                  __html: props.event_detail_with_map?.description,
                }}
              />
              <div className="seperator"></div>
              <h5>Organizers (s)</h5>
              <CustomImage
                imgClassName="logo"
                sourceClassName="logo"
                src={
                  props?.Logo_event?.data?.[0]
                    ?.generalconf_logo.path
                }
                height="30"
                width="138"
              />
              <p>
                {props?.organizer?.name}
                <br />
                {
                  props?.organizer?.account_address?.[0]
                    ?.address_line1
                }
                <br />
                {
                  props?.organizer?.account_address?.[0]
                    ?.address_line2
                }
                <br />
                {
                  props?.organizer?.account_address?.[0]?.city
                    ?.name
                }
                <br />
                {
                  props?.organizer?.account_address?.[0]
                    ?.state?.name
                }
                {
                  props?.organizer?.account_address?.[0]
                    ?.pincode
                }
              </p>
              <div className="seperator"></div>
              <h5>Share Event</h5>
              <EventSocialShare data={props?.share_event?.data} type={2} />
              <div className="seperator"></div>
              <h5>See on Map</h5>
              <div className="responsive-map">
                <Map {...props?.event_detail_with_map} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Head>
        <link
          rel="stylesheet"
          href={getTypeBasedCSSPath(props?.event_detail_with_map?.type, CSS_NAME_PATH.eventDetailsWrapper)}
        />
      </Head>
    </>
  );
};

export default EventDetailsSection2;
