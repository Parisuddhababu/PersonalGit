import IEventBannerSection1 from "@templates/EventList/components/EventBanner/event-banner-1";
import { IEvent, IEventBanner } from "@type/Pages/eventList";
export interface IEventBannerProps {
    data: IEventBanner[];
    details?: IEvent;
    type?: string | null
  }
export default IEventBannerSection1;
