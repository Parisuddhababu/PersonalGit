import IEventListSection1 from "@templates/EventList/components/EventList/event-list-1";
import { IEventListPageData } from "@type/Pages/eventList";

export interface IEventListDetails {
  data: IEventListPageData;
  // eslint-disable-next-line
  updateDetails: (data: any) => void;
}

export default IEventListSection1;
