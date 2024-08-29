import SafeHtml from "@lib/SafeHTML/SafeHtml";

export interface ISafeHTMLProps {
  html: string;
  removeAllTags?: boolean;
  className?: string;
}

export default SafeHtml;
