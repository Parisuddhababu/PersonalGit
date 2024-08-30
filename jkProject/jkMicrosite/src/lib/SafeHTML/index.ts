import SafeHtml from "./SafeHtml";

export interface ISafeHTMLProps {
  html: any;
  removeAllTags?: boolean;
  className?: string;
}

export default SafeHtml;
