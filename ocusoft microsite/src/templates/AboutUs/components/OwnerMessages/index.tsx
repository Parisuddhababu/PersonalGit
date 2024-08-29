import OwnerMessages from "@templates/AboutUs/components/OwnerMessages/owner-messages-1";
import { IOwnerMessage } from "@type/Pages/aboutUs";
export interface IOwnerMessagesProps {
  data: IOwnerMessage[];
  director_messages?: string
}

export default OwnerMessages;
