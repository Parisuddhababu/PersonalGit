import EventList from "@templates/EventList/event-list";
import { IBaseTemplateProps } from "@templates/index";
import { IEvent } from "@type/Pages/eventList";

export interface IEventListMain extends IBaseTemplateProps, IEvent {}

export default EventList;
