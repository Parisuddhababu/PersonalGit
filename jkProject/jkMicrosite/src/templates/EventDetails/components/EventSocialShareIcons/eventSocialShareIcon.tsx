import { IShareEvent } from "@type/Pages/eventDetail";
import Link from "next/link";
const EventSocialShare = ({ data, type }: IShareEvent) => {
  const typeBasedClass = (classString: string) => {
    if (type === 1) {
      return `jkm-${classString}`
    } else {
      return `jkms2-${classString}`
    }
  }

  let socialIcon = [
    { label: "Facebook", icon: `${typeBasedClass('meta')}`, link: data?.[0]?.social_facebook },
    { label: "Instagram", icon: `${typeBasedClass('instagram')}`, link: data?.[0]?.social_instagram },
    { label: "Linkedin", icon: `${typeBasedClass('linkedin')}`, link: data?.[0]?.social_linkedin },
    { label: "Whatsapp", icon: `${typeBasedClass('whatsapp')}`, link: data?.[0]?.social_whatsapp_number },
    { label: "Youtube", icon: `${typeBasedClass('youtube')}`, link: data?.[0]?.social_youtube }
  ];

  const getDefaultUrl = (platform: string) => {
    switch (platform) {
      case "Linkedin":
        return "http://www.linkedin.com/shareArticle?url=";

      case "Twitter":
        return "https://twitter.com/intent/tweet?url=";
      case "Facebook":
        return "https://www.facebook.com/sharer/sharer.php?u=";

      case "Google":
        return "https://plus.google.com/share";

      case "Whatsapp":
        return (
          "https://" +
          (isMobileOrTablet() ? "api" : "web") +
          ".whatsapp.com/send?text="
        );

      case "Instagram":
        return "https://www.instagram.com/";

      case "Youtube":
        return "https://www.youtube.com/";

      default:
        break;
    }
  };

  const isMobileOrTablet = () => {
    if (typeof window !== 'undefined') {
      return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
    }
  };

  return (
    <>
      <div>
        <ul className="social_icons">
          {socialIcon.map((item, eInd) => {
            return (
              <>
                <li key={eInd}>
                  <Link passHref
                    href={item?.link ? '/' + item?.link : getDefaultUrl(item?.label) || ''}
                  >
                    <a href={item?.link ? item?.link : getDefaultUrl(item?.label) || ''} target="blank">
                      <span className={`${item?.icon} ${item.label.toLowerCase()}`}></span>

                    </a >
                  </Link >
                </li >
              </>
            );
          })}
        </ul >
      </div >
    </>
  );
};

export default EventSocialShare;
