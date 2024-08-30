import pagesServices from "@services/pages.services";
import CONFIG from "@config/api.config";
import React, { useEffect, useState } from "react";
import { IFooterProps } from "@components/Footer";
import { IFooterMenus } from "@type/Footer";
import http from "@util/axios";
import FooterTemplate1 from "@components/Footer/FooterTemplate1";
import { useDispatch } from "react-redux";
import {
  Action_UpdateWhatsAppNumber,
  Action_Update_Country_code,
  Action_Update_Mobile_number,
  Action_Update_email,
  Action_Update_text_feed,
} from "src/redux/whatsApp/whatsAppAction";
import Head from "next/head";
import { getTypeBasedCSSPath } from "@util/common";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { SCRIPT_AND_DEVIDE } from "@constant/regex";

const Footer = () => {
  const dispatch = useDispatch();
  const [footerData, setFooterData] = useState({} as IFooterProps);
  const [footerDescription, setFooterDescription] = useState<string>("");
  const [copyRightText, setCopyRightText] = useState<string>("");
  const [renderFooter, setRenderFooter] = useState(false);
  const [footerMenu, setFooterMenu] = useState<IFooterMenus[] | null>(null);
  const extractTagName = (tagString: string) => {
    const regex = /<\s*(\w+)/;
    const match = regex.exec(tagString);
    if (match) {
      return match[1];
    } else {
      return null;
    }
  };

  const updateWhatsAppNumber = (whatsAppNumber: string) => {
    dispatch(Action_UpdateWhatsAppNumber(whatsAppNumber));
  };

  const updateEmailValue = (email: string) => {
    dispatch(Action_Update_email(email));
  };

  const updateMobileNumber = (mobile: string) => {
    dispatch(Action_Update_Mobile_number(mobile));
  };

  const updateCountryCode = (countryCode: string) => {
    dispatch(Action_Update_Country_code(countryCode));
  };

  const getScriptAndDivide = (scriptValueCheck: any, count: number) => {
    const doc = new DOMParser().parseFromString(scriptValueCheck, "text/html");
    const regex = SCRIPT_AND_DEVIDE; // To get the unique html tags without it's closing tag
    const tagsArray = scriptValueCheck.match(regex);
    const tagsotherThanScript = tagsArray?.filter((tag: any) => {
      const regex = /^<script/i; // Regular expression to match the other tags than script tag
      return !regex.test(tag);
    });

    let extractedTagName: any;
    tagsotherThanScript?.map((tagAsString: any) => {
      extractedTagName = extractTagName(tagAsString);
    });

    const scriptElements = doc.querySelectorAll("script");
    const otherElementThanScript = doc.querySelectorAll(extractedTagName);

    if (extractedTagName) {
      const scriptElement = document.createElement("script");

      if (scriptElements[0]?.attributes?.length != 0) {
        scriptElement.src = scriptElements[0]?.src;
        scriptElement.defer = scriptElements[0]?.defer;
        scriptElement.async = scriptElements[0]?.async;
        scriptElement.draggable = scriptElements[0]?.draggable;

        scriptElement.addEventListener("load", () => {
          const anyElement = document.createElement(extractedTagName);
          if (otherElementThanScript[0].className) {
            anyElement.classList.add(otherElementThanScript[0].className);
          }
          if (otherElementThanScript[0].id) {
            anyElement.id = otherElementThanScript[0].id;
          }
          if (otherElementThanScript[0].innerHTML) {
            anyElement.innerHTML = otherElementThanScript[0].innerHTML;
          }
          document.body.appendChild(anyElement);
        });
        document.head.appendChild(scriptElement);
      } else {
        scriptElement.addEventListener("load", () => {
          const anyElement = document.createElement(extractedTagName);
          if (otherElementThanScript[0].className) {
            anyElement.classList.add(otherElementThanScript[0].className);
          }
          if (otherElementThanScript[0].id) {
            anyElement.id = otherElementThanScript[0].id;
          }

          document.body.appendChild(anyElement);
        });
        document.head.appendChild(scriptElement);
      }
    } else {
      if (scriptElements.length > 1) {
        for (let i = 0; i < scriptElements.length; i++) {
          const scriptElement = document.createElement("script");
          if (scriptElements[i]?.attributes?.length != 0) {
            scriptElement.defer = scriptElements[i]?.defer;
            scriptElement.async = scriptElements[i]?.async;
            scriptElement.draggable = scriptElements[i]?.draggable;
            scriptElement.integrity = scriptElements[i]?.integrity;
            scriptElement.crossOrigin = scriptElements[i]?.crossOrigin;
            if (
              scriptElements[i]?.attributes?.length != 0 &&
              scriptElements[i + 1]?.attributes?.length === 0
            ) {
              scriptElement.onload = function () {
                if (scriptElements[i + 1]?.attributes?.length === 0) {
                  const anotherScriptElement = document.createElement("script");
                  const data = `
                      ${scriptElements[i + 1].innerHTML}
                    `;
                  anotherScriptElement.innerHTML = data;
                  anotherScriptElement.id = count + '_script';
                  document.head.appendChild(anotherScriptElement);
                }
              };
            }
            scriptElement.src = scriptElements[i]?.src;
            document.head.appendChild(scriptElement);

          }
        }
      } else {
        const scriptElement = document.createElement("script");
          scriptElement.innerHTML = scriptElements?.[0]?.innerHTML;
          document.head.appendChild(scriptElement);
      }
    }
  };

  const getFooterData = async () => {
    pagesServices
      .getPage(CONFIG.FOOTER, {})
      .then((resp) => {
        setRenderFooter(true);
        setFooterData({ ...resp?.data?.footer_contact?.data?.[0], footer_address: resp?.data?.footer_address });
        const email = resp.data?.footer_contact?.data?.[0]?.email;
        const mobile = resp.data?.footer_contact?.data?.[0]?.mobile;
        const countryCode =
          resp.data?.footer_contact?.data?.[0]?.country?.country_phone_code;
        const whatsAppNumber =
          resp.data?.footer_contact?.data?.[0]?.social_whatsapp_number ?? "";
        updateWhatsAppNumber(whatsAppNumber);
        updateEmailValue(email);
        updateMobileNumber(mobile);
        updateCountryCode(countryCode);
        setCopyRightText(
          resp.data?.footer_details?.data?.[0]?.footer_copyright_text
        );
        if (resp.data?.footer_details?.data?.length > 0) {
          setFooterMenu(resp.data?.footer_details?.data?.[0]?.footer_menus);
        }
        setFooterDescription(resp?.data?.footer_description);
        if (resp?.data?.script_details?.available_scripts?.length > 0) {
          resp?.data?.script_details?.available_scripts?.map(
            (ele: { script_value: string }, ind: number) => {
              getScriptAndDivide(ele?.script_value, ind);
            }
          );
        }
      })
  };

  useEffect(() => {
    if (http.defaults.headers.common["Accountcode"]) {
      getFooterData();
      pagesServices.getSlugInfo("/").then((res) => {
        if (res?.status) {
          dispatch(Action_Update_text_feed(res?.data?.social_text_display));
        }
      });
    }
  }, [http.defaults.headers.common["Accountcode"]]);

  return (
    <>
      <Head>
        <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.newsLetter)} />
      </Head>
      {renderFooter && (
        <footer>
          <FooterTemplate1
            footerData={footerData}
            footerDescription={footerDescription}
            copyrightText={copyRightText}
            footerMenu={footerMenu}
          />
        </footer>
      )}
    </>
  );
};

export default Footer;
