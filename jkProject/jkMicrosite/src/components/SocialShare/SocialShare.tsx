// Util
import { ISocialShareProps } from "@components/SocialShare";
import { useToast } from "@components/Toastr/Toastr";
import { uuid } from "@util/uuid";
import { useState } from "react";
const SocialShare = ({ details, ulClassName, url, type, pageName, isPdp = false }: ISocialShareProps) => {
  const [active, SetActive] = useState(false);
  const { showSuccess } = useToast();

  const typeBasedClass = (classString: string) => {
    if (type === 1) {
      return `jkm-${classString}`
    } else {
      return `jkms2-${classString}`
    }
  }
  let socialIcon = [
    { label: "Facebook", icon: `${typeBasedClass('meta')}` },
    { label: "Twitter", icon: `${typeBasedClass('twitter')}` },
    { label: "Linkedin", icon: `${typeBasedClass('linkedin')}` },
    { label: "Google", icon: `${typeBasedClass('mail1')}` },
    { label: "Whatsapp", icon: `${typeBasedClass('whatsapp')}` },
    { label: "Copy", icon: `${typeBasedClass('copy')}` },
  ];

  const handleCopyToClipboard = async () => {
    const pageUrl = window.location.href;
    try {
      await navigator.clipboard.writeText(pageUrl);
      showSuccess('Product url copied to clipboard!')
    } catch (error) {
    }
  };

  const redirect = (platform: any, dUrl: any) => {
    const title = document.title;
    const str = window.location.href.slice(
      0,
      window.location.href.lastIndexOf("/careers")
    );
    const url =
      dUrl === "" || dUrl === undefined ? window.location.href : str + dUrl;
    const summary = !details ? `Be a part of Our team!` : details;
    switch (platform) {
      case "Linkedin":
        window.open(
          "http://www.linkedin.com/shareArticle?url=" +
          url +
          "&title=" +
          title +
          "&summary=" +
          summary
        );
        break;

      case "Twitter":
        window.open(
          "https://twitter.com/intent/tweet?url=" +
          url +
          "&text=" +
          encodeURIComponent(title + "\n" + summary)
        );
        break;

      case "Facebook":
        window.open(
          "https://www.facebook.com/sharer/sharer.php?u=" +
          url +
          "&description=" +
          summary
        );
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

      case "Copy":
        handleCopyToClipboard()
        break;
      default:
        break;
    }
  };

  const isMobileOrTablet = () => {
    return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
  };

  return (
    <>
      <div className={`share-social-media ${active ? 'active' : ''}`}>
        {pageName !== 'career' && isPdp ?
          <i className={`icon ${type == 1 ? 'jkm-share' : 'jkms2-share'}`} onClick={() => SetActive(!active)}></i>
          : <></>}

        <ul
          className={
            !ulClassName ? `d-flex d-flex-row d-just-center d-wrap ` : ulClassName
          }
        >
          {socialIcon.map((item) => {
            return (
              <>
                <li
                  key={uuid()}
                  title={item.label}
                  onClick={() => redirect(item.label, url)}
                >
                  <a className={`icon ${item?.icon}`}></a>
                </li>
              </>
            );
          })}
        </ul>
        <span></span>
      </div>
    </>
  );
};

export default SocialShare;
