import SubscribeNewsLetter from "@components/SubscribeNewsLetter/SubscribeNewsLetter";
export interface ISubScriptionState {
  email: string;
}

export interface ISubscriptionProps {
  maindata?: {
    banner_title?: string;
  };
  dynamic_title?: {
    subscribe_news_title:string,
    subscribe_news_tagline:string
  }
}

export default SubscribeNewsLetter;
