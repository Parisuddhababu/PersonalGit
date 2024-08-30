import { ISocialShareNameState } from "@components/Hooks/socialShare";

const useSocialShareLinksGeneration = () => {
  const isMobileOrTablet = () => {
    return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
  };

  const generateLink = (socialName: ISocialShareNameState, dUrl?: string, details?: string) => {
    const title = document.title;
    const str = window.location.href.slice(0, window.location.href.lastIndexOf("/careers"));
    const url = dUrl === "" || dUrl === undefined ? window.location.href : str + dUrl;
    const summary = !details ? `Be a part of Our team!` : details;
    switch (socialName.name) {
      case "Linkedin":
        window.open("http://www.linkedin.com/shareArticle?url=" + url + "&title=" + title + "&summary=" + summary);
        break;

      case "Twitter":
        window.open(
          "https://twitter.com/intent/tweet?url=" + url + "&text=" + encodeURIComponent(title + "\n" + summary)
        );
        break;

      case "Facebook":
        window.open("https://www.facebook.com/sharer/sharer.php?u=" + url + "&description=" + summary);
        break;

      case "Google":
        window.open("https://plus.google.com/share?url=" + url);
        break;

      case "Whatsapp":
        window.open(
          "https://" +
            (isMobileOrTablet() ? "api" : "web") +
            ".whatsapp.com/send?text=" +
            encodeURIComponent(title + "\n" + summary + "\n" + url)
        );
        break;

      default:
        break;
    }
  };

  return {
    generateLink,
  };
};

export default useSocialShareLinksGeneration;
