import EventDetails from "@templates/EventDetails/event-details";
import { IEventDetailsMain } from "@type/Pages/eventDetail";
import { IBaseTemplateProps } from "@templates/index";

export interface IEventDetailsIndex
  extends IBaseTemplateProps,
    IEventDetailsMain {}

export default EventDetails;
