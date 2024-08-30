import { IEventDetailsMain } from "@type/Pages/eventDetail";
import EventDetailsSection1 from "@templates/EventDetails/components/EventDetails/event-detail-1";
import EventVerticalSection1 from "@templates/EventDetails/components/EventVerticalSection";

const EventDetailsMain1 = (props: IEventDetailsMain) => {
  return (
    <>
      <section className="event-details-wrapper">
        <div className="container">
          <div className="d-row">
            <aside className="d-col left_side">
              <EventVerticalSection1
                {...props?.event_detail_with_map}
                share_event={props?.share_event}
                Logo_event={props?.Logo_event}
                organizer={props?.organizer}
              />
            </aside>
            <div className="d-col right_side">
              <div className="event-details-content">
                <EventDetailsSection1 {...props?.event_detail_with_map} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetailsMain1;
