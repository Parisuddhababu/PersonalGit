import pagesServices from "@services/pages.services";
import CONFIG from "@config/api.config";
import React, { useEffect, useState } from "react";
import { IFooterProps } from "@components/Footer";
import { IFooterLogo, IFooterMenus } from "@type/Footer";
import http from "@util/axios";
import FooterTemplate2 from "./FooterTemplate2";
import FooterTemplate1 from "./FooterTemplate1";
import { useDispatch } from "react-redux";
import { Action_UpdateWhatsAppNumber, Action_Update_text_feed } from "src/redux/whatsApp/whatsAppAction";

const Footer = () => {
  const dispatch = useDispatch();

  const [footerData, setFooterData] = useState({} as IFooterProps);
  const [footerMenu, setFooterMenu] = useState<IFooterMenus[] | null>(null);
  const [footerDescription, setFooterDescription] = useState<string>("");
  const [footerLogo, setFooterLogo] = useState<IFooterLogo[] | null>([]);
  const [copyrightText, setCopyRightText] = useState<string>("");
  const [footerType, setFooterType] = useState(1);
  const [renderFooter, setRenderFooter] = useState(false);
  const [isInstagramScript, setIsInstagramScript] = useState<boolean>(false)

  const extractTagName = (tagString: any) => {
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
  }

  const getScriptAndDivide = (scriptValueCheck: any, count: number) => {
    const doc = new DOMParser().parseFromString(scriptValueCheck, "text/html");
    const regex = /<([a-z][^>\s\/]*)[^>]*>/gi; // To get the unique html tags without it's closing tag
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
      // get in if script is like this (<script src=\"https://apps.elfsight.com/p/platform.js\" defer></script> <div class=\"elfsight-app-9c7e4069-4efa-4d19-8625-405908340069\"></div>)
      const scriptElement = document.createElement("script");

      if (scriptElements[0]?.attributes?.length != 0) {
        // If attributes Like Src , defer , async Exists then Go Inside IF otherWise in else , where we are not going to need any src and other attributes
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
        // get in if script is like this (<script async src="https://www.googletagmanager.com/gtag/js?id=G-VH3HP2YNFQ"></script> <script>   window.dataLayer = window.dataLayer || [];   function gtag(){dataLayer.push(arguments);}   gtag('js', new Date());    gtag('config', 'G-VH3HP2YNFQ'); </script>)
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
        // get in if script is like this (<script>var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date(); (function(){ var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0]; s1.async=true; s1.src='https://embed.tawk.to/64100f9331ebfa0fe7f26bc4/1grfbpmel'; s1.charset='UTF-8'; s1.setAttribute('crossorigin','*'); s0.parentNode.insertBefore(s1,s0); })();</script>)
        // if (scriptElements[0]?.attributes?.length) {
        //   const scriptElement = document.createElement("script");
        //   scriptElement.innerHTML = scriptElements[0].innerHTML;
        //   document.head.appendChild(scriptElement);
        // }
        const scriptElement = document.createElement("script");
        scriptElement.innerHTML = scriptElements[0].innerHTML;
        document.head.appendChild(scriptElement);
      }
    }
  };
  const getFooterData = async () => {
    pagesServices
      .getPage(CONFIG.FOOTER, {})
      .then((resp) => {
        setRenderFooter(true);
        setFooterType(resp?.data?.type);
        setFooterLogo(resp?.data?.footer_logo?.data);
        setFooterData(resp.data?.footer_contact?.data?.[0]);
        
        const instagramScript = resp?.data?.script_details?.available_scripts?.filter(({script_name} : {script_name : string}) => script_name === "instagram");
        (instagramScript?.length === 1 ) ? setIsInstagramScript(true) : setIsInstagramScript(false);

        const whatsAppNumber = resp.data?.footer_contact?.data?.[0]?.social_whatsapp_number ?? '';
        updateWhatsAppNumber(whatsAppNumber);

        setCopyRightText(
          resp.data?.footer_details?.data?.[0]?.footer_copyright_text
        );
        if (resp.data?.footer_details?.data?.length > 0) {
          setFooterMenu(resp.data?.footer_details?.data?.[0]?.footer_menus);
        }
        setFooterDescription(resp.data?.footer_description);
        if (resp?.data?.script_details?.available_scripts?.length > 0) {
          resp?.data?.script_details?.available_scripts?.map(
            (ele: any, ind: number) => {
              getScriptAndDivide(ele?.script_value, ind);
            }
          );
        }
      })
      .catch((err) => {
        console.log("error happend While fetching Response", err);
      });
  };

  useEffect(() => {
    if (http.defaults.headers.common["Accountcode"]) {
      getFooterData();
      pagesServices.getSlugInfo('/').then(res => {
        if (res?.status) {
          dispatch(Action_Update_text_feed(res?.data?.social_text_display));
        }
      })
    }
    // eslint-disable-next-line
  }, [http.defaults.headers.common["Accountcode"]]);

  const getDynamicFooter = () => {
    if (footerType === 1) {
      return (
        <FooterTemplate1
          // @ts-ignore
          footerData={footerData}
          footerMenu={footerMenu}
          footerDescription={footerDescription}
          footerLogo={footerLogo}
          copyrightText={copyrightText}
          footerType={footerType}
        />
      );
    } else if (footerType === 2) {
      return (
        <FooterTemplate2
          // @ts-ignore
          footerData={footerData}
          footerMenu={footerMenu}
          footerDescription={footerDescription}
          footerLogo={footerLogo}
          copyrightText={copyrightText}
          footerType={footerType}
        />
      );
    } else {
      return (
        <FooterTemplate1
          // @ts-ignore
          footerData={footerData}
          footerMenu={footerMenu}
          footerDescription={footerDescription}
          footerLogo={footerLogo}
          copyrightText={copyrightText}
          footerType={footerType}
        />
      );
    }
  };

  return (
    <>
      {
        renderFooter && (
          <>
            {isInstagramScript && <div className="elfsight-script-custom">
              <div className="elfsight-app-3135349f-f0d5-409f-8a78-590409bf21f2" data-elfsight-app-lazy></div>
            </div>}
            <footer>
              <div className="container">{getDynamicFooter()}</div>
            </footer>
          </>
        )
      }
    </>
  );
};

export default Footer;
