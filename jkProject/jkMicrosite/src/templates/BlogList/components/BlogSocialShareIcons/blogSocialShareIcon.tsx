// Util
import { IBlogFollowUs } from "@type/Pages/blogList";
import Link from "next/link";
const BlogSocialShare = ({ data, type }: IBlogFollowUs) => {

    const typeBasedClass = (classString: string) => {
      if (type === 1) {
        return `jkm-${classString}`
      } else {
        return `jkms2-${classString}`
      }
    }

    let socialIcon = [
        { label: "Facebook", icon: `facebook ${typeBasedClass('meta')}`, link: data?.[0]?.social_facebook },
        { label: "Instagram", icon: `instagram ${typeBasedClass('instagram')}`, link: data?.[0]?.social_instagram },
        { label: "Linkedin", icon: `linkedin ${typeBasedClass('linkedin')}`, link: data?.[0]?.social_linkedin }
    ];

    const getDefaultUrl = (platform: string, link: string) => {
        switch (platform) {
            case "Linkedin":
                return `http://www.linkedin.com/shareArticle?url=${link}`

            case "Twitter":
                return `https://twitter.com/intent/tweet?url=${link}`
            case "Facebook":
                return `https://www.facebook.com/sharer/sharer.php?u=${link}`

            case "Google":
                return `https://plus.google.com/share?url=${link}`

            case "Whatsapp":
                return "https://" +
                    (isMobileOrTablet() ? "api" : "web") +
                    `.whatsapp.com/send?text=${link}`

            case "Instagram":
                return `https://www.instagram.com/?url=${link}`

            default:
                return ""
        }
    };

    const isMobileOrTablet = () => {
        return /(android|iphone|ipad|mobile)/i.test(navigator.userAgent);
    };

    return (
        <div>
            <ul className="social-media-menu-list">
                {socialIcon.map((item, iInd) => {
                    return (
                      <>
                        <li key={iInd}>
                          <Link href={getDefaultUrl(item?.label, item?.link)}>
                            <a target="_blank">
                              <i className={item?.icon}></i>
                            </a>
                          </Link>
                        </li>
                      </>
                    );
                })}
            </ul>
        </div>
    );
};

export default BlogSocialShare;
