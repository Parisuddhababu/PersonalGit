import EventDetailsSection2 from "@templates/EventDetails/components/EventDetails/event-detail-2";
import EventVerticalSection2 from "@templates/EventDetails/components/EventVerticalSection/event-vertical-section-2";

const EventDetailsMain2 = (props: any) => {
  return (
    <section className="event-details-wrapper">
      <div className="container">
        <EventVerticalSection2 {...props} />
        <EventDetailsSection2 {...props} />
      </div>
    </section>
  );
};

export default EventDetailsMain2;
