import SafeHtml from "@lib/SafeHTML";
import { Ievent_detail_with_map } from "@type/Pages/eventDetail";
import Map from "@components/Map";
import Link from "next/link";
import APPCONFIG from "@config/app.config";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";


const EventDetailsSection1 = (props: Ievent_detail_with_map) => {
  return (
    <>
      <link
        rel="stylesheet"
        href={
          APPCONFIG.STYLE_BASE_PATH_PAGES +
          CSS_NAME_PATH.eventDetails +
          ".min.css"
        }
      />
      <SafeHtml html={props?.description} />
      <Link href={props?.link}><a>
        {props?.link}</a></Link>
      <div className="seperator"></div>
      <h5>See on Map</h5>
      <div className="responsive-map">
        <Map {...props} />
      </div>
    </>
  );
};

export default EventDetailsSection1;
