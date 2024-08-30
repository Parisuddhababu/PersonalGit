import Link from "next/link";
import { IReduxStore } from "@type/Common/Base";
import React from "react";
import { useSelector } from "react-redux";

const SocialIcon = (props: any) => {
  const data = props.data;
  const phoneData = useSelector((state: IReduxStore) => state);
  return (
    <div className="bottom-footer-wrap">
      <div className="bottom-footer-sec social-links-wrap">
        <ul className="social-media">
          <li title="Facebook">
            <Link href={data?.social_facebook ? data?.social_facebook : ""}>
              <a target="_blank">
                <i className="jkm-facebook-fill" />
              </a>
            </Link>
          </li>
          <li title="Instagram">
            <Link href={data?.social_instagram ? data?.social_instagram : ""}>
              <a target="_blank">
                <i className="jkm-insta-fill" />
              </a>
            </Link>
          </li>
          <li title="LinkedIn">
            <Link href={data?.social_linkedin ? data?.social_linkedin : ""}>
              <a target="_blank">
                <i className="jkm-linkedin" />
              </a>
            </Link>
          </li>
          <li title="Whatsapp">
            <Link
              href={`https://api.whatsapp.com/send?phone=${data?.social_whatsapp_number}&text=${encodeURIComponent(phoneData?.whatsAppReducer?.whatsappFeed)}`}
            >
              <a target="_blank">
                <i className="jkm-whatsapp-fill" />
              </a>
            </Link>
          </li>
          <li title="Meet App">
            <Link href={data?.social_meetlink ? data?.social_meetlink : ""}>
              <a target="_blank">
                <i className="jkm-video" />
              </a>
            </Link>
          </li>
          <li title="Mail">
            <Link
              href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${data?.contactus_email}`}
            >
              <a target="_blank">
                <i className="jkm-mail-fill" />
              </a>
            </Link>
          </li>
          <li title="Google">
            <Link href={data?.social_google ? data?.social_google : ""}>
              <a target="_blank">
                <i className="jkm-google" />
              </a>
            </Link>
          </li>
          <li title="Twitter">
            <Link href={data?.social_twitter ? data?.social_twitter : ""}>
              <a target="_blank">
                <i className="jkm-twitter" />
              </a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="bottom-footer-sec copyright-text-wrap">
        <p>{props?.details?.footer_copyright_text}</p>
      </div>
    </div>
  );
};

export default SocialIcon;
