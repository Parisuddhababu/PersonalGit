import { TextTruncate, formatUSPhoneNumber, getCurrentYear, getTypeBasedCSSPath, getUserDetails } from "@util/common";
import { IFooterTemplateProps } from "@type/Footer";
import Link from "next/link";
import Head from "next/head";
import { CSS_NAME_PATH } from "@constant/cssNamePath.constant";
import { useSelector } from "react-redux";
import { IReduxStore } from "@type/Common/Base";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "src/redux/rootReducers";

const FooterTemplate1 = ({ footerData,
    footerDescription,
    footerMenu,
    copyrightText }: IFooterTemplateProps) => {
    const phoneData = useSelector((state: IReduxStore) => state);
    const { whatsAppReducer: { logo } } = useSelector((state: RootState) => state);
    const [showIcons] = useState(false);
    const [footerHeaderMenu, setFooterHeaderMenu] = useState('');
    const [readMoreVisible, setReadMoreVisible] = useState(false);
    const [currentYear, setCurrentYear] = useState<number>();
    useEffect(() => {
        const presentYear = getCurrentYear();
        setCurrentYear(presentYear);
    }, [])
    const openWhatsApp = (mobileNumber: string) => {
        window.open(
            `https://api.whatsapp.com/send/?phone=${mobileNumber}&text=` +
            encodeURIComponent(phoneData?.whatsAppReducer?.whatsappFeed)
        );
    };

    const onMenuHeaderClick = (menu: string) => {
        setFooterHeaderMenu(footerHeaderMenu === menu ? '' : menu)
    }

    const isConnect = useMemo(() => {
        return footerData?.social_facebook?.length && footerData?.social_facebook?.length > 0 ||
            footerData?.social_instagram?.length && footerData?.social_instagram?.length > 0 ||
            footerData?.social_linkedin?.length && footerData?.social_linkedin?.length ||
            footerData?.social_twitter?.length && footerData?.social_twitter?.length
    }, [footerData])

    return (
        <>
            <Head>
                <link rel="stylesheet" href={getTypeBasedCSSPath(null, CSS_NAME_PATH.footer)} />
            </Head>
            <div className="footer-main">
                <div className="container">
                    <ul className="footer-main-list">
                        <li className="footer-main-list-common footer-logo-list">
                            <div className="footer-logo">
                                <picture>
                                    {logo && <a href="#" className="logo">
                                        <img src={logo} alt="logo" title="footer-logo" />
                                    </a>
                                    }
                                </picture>
                            </div>
                            <h3>
                                {!readMoreVisible && footerDescription && footerDescription?.length > 100
                                    ? TextTruncate(footerDescription, 100)
                                    : footerDescription}
                                {!readMoreVisible && footerDescription && footerDescription?.length > 100 && (
                                    <a aria-label="read-more-link" onClick={() => setReadMoreVisible(true)}>
                                        Read More <span>{">>"}</span>
                                    </a>
                                )}
                            </h3>
                        </li>
                        {footerMenu?.map(
                            (mainMenu) =>
                                mainMenu?.is_show === 1 && (getUserDetails() ? (mainMenu?.menu_header_title !== "My Account") : true) && (
                                    <li className={`footer-main-list-common ${footerHeaderMenu === mainMenu?.menu_header_title ? 'active' : ''}`} key={mainMenu?.menu_header_title}>
                                        <div className="list-title-wrap">
                                            <span className="list-title">{mainMenu?.menu_header_title}</span>
                                            <em className="osicon-cheveron-down"
                                                onClick={() => onMenuHeaderClick(mainMenu?.menu_header_title)}></em>
                                        </div>
                                        <ul className="footer-main-sublist">
                                            {mainMenu?.menu_links?.map((menuLink) => (
                                                <li key={menuLink.link}>
                                                    {menuLink.title === "About OCuSOFT" ? (
                                                        <a
                                                            href={menuLink.link}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {menuLink.title}
                                                        </a>
                                                    ) : (
                                                        <Link href={menuLink?.link || ""}>
                                                            <a>{menuLink?.title}</a>
                                                        </Link>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                )
                        )}
                        <li className={`footer-main-contact-list footer-main-list-common ${footerHeaderMenu === 'Contact' ? 'active' : ''}`}>
                            <div className="list-title-wrap">
                                <span className="list-title">Contact</span>
                                <em className="osicon-cheveron-down" onClick={() => onMenuHeaderClick('Contact')}></em>
                            </div>
                            <ul className="footer-main-sublist footer-main-sublist-address">
                                {footerData?.footer_address && footerData?.footer_address?.address_line1 != undefined &&
                                    <li>
                                        <em className="osicon-location"></em>
                                        <address> {footerData?.footer_address?.address_line1},{footerData?.footer_address?.city?.name},{footerData?.footer_address?.state?.name},{footerData?.footer_address?.country?.name} {footerData?.footer_address?.pincode}</address>
                                    </li>
                                }

                                {footerData?.mobile &&
                                    <li>
                                        <em className="osicon-call"></em>
                                        <Link href={`tel:${footerData?.country?.country_phone_code} ${footerData?.mobile}`}>
                                            <a aria-label="1(800) 233-5469">{formatUSPhoneNumber(footerData?.mobile)}</a>
                                        </Link>
                                    </li>
                                }
                                {
                                    footerData?.social_whatsapp_number?.length && footerData?.social_whatsapp_number?.length > 0 &&
                                    <li>
                                        <em className="osicon-call"></em>
                                        <Link href={`tel:${footerData?.country?.country_phone_code}${footerData?.social_whatsapp_number}`}>
                                            <a aria-label="1(800) 233-5469">{formatUSPhoneNumber(footerData?.social_whatsapp_number)}</a>
                                        </Link>
                                    </li>
                                }
                                {
                                    footerData?.email?.length && footerData?.email?.length > 0 &&
                                    <li>
                                        <em className="osicon-doctor"></em>
                                        <Link href={`mailto:${footerData?.email}`}>
                                            <a aria-label="OCuSOFT@OCuSOFT.com">{footerData?.email}</a>
                                        </Link>
                                    </li>
                                }
                            </ul>
                        </li >
                        {
                            isConnect &&
                            <li className="footer-main-list-common">
                                <div className="list-title-wrap">
                                    <span className="list-title">Connect</span>
                                </div>
                                <ul className="footer-main-iconlist">

                                    {/* facebook  */}
                                    {
                                        footerData?.social_facebook?.length && footerData?.social_facebook?.length > 0 &&
                                        <li>
                                            <a href={footerData?.social_facebook} rel="noreferrer" target="_blank" aria-label="facebook-link">
                                                <em className="osicon-facebook"></em>
                                            </a>
                                        </li>
                                    }
                                    {/* instagram  */}
                                    {
                                        footerData?.social_instagram?.length && footerData?.social_instagram?.length > 0 &&
                                        <li>
                                            <a href={footerData?.social_instagram} rel="noreferrer" target="_blank" aria-label="instagram-link">
                                                <em className="osicon-instagram"></em>
                                            </a>
                                        </li>
                                    }
                                    {/* linkedin  */}
                                    {
                                        footerData?.social_linkedin?.length && footerData?.social_linkedin?.length > 0 &&
                                        <li>
                                            <a href={footerData?.social_linkedin} rel="noreferrer" target="_blank" aria-label="linkedin-link">
                                                <em className="osicon-linkedin"></em>
                                            </a>
                                        </li>
                                    }
                                    {/* twitter  */}
                                    {
                                        footerData?.social_twitter?.length && footerData?.social_twitter?.length > 0 &&
                                        <li>
                                            <a href={footerData?.social_twitter} rel="noreferrer" target="_blank" aria-label="twitter-link">
                                                <em className="osicon-twitter"></em>
                                            </a>
                                        </li>
                                    }
                                    {/* watsapp number  */}
                                    {
                                        showIcons && (footerData?.social_whatsapp_number?.length && footerData?.social_whatsapp_number?.length > 0 &&
                                            <li>
                                                <a onClick={() => openWhatsApp(footerData?.social_whatsapp_number)}
                                                    rel="noreferrer" target="_blank" aria-label="whatsapp-link">
                                                    <em className="osicon-whatsapp"></em>
                                                </a>
                                            </li>)
                                    }

                                    {/* tumblr link  */}
                                    {
                                        showIcons && (footerData?.social_tumblr_link?.length && footerData?.social_tumblr_link?.length > 0 &&
                                            <li>
                                                <a href={footerData?.social_tumblr_link} rel="noreferrer" target="_blank" aria-label="tumblr-link">
                                                    <em className="osicon-tumblr"></em>
                                                </a>
                                            </li>)
                                    }
                                    {/* pinterest_link  */}
                                    {
                                        showIcons && (footerData?.social_pinterest_link?.length && footerData?.social_pinterest_link?.length > 0 &&
                                            <li>
                                                <a href={footerData?.social_pinterest_link} rel="noreferrer" target="_blank" aria-label="pinterest-link">
                                                    <em className="osicon-pinterest"></em>
                                                </a>
                                            </li>)
                                    }
                                    {/* meetlink  */}
                                    {
                                        showIcons && (footerData?.social_meetlink?.length && footerData?.social_meetlink?.length > 0 &&
                                            <li>
                                                <a href={footerData?.social_meetlink} rel="noreferrer" target="_blank" aria-label="meet-link">
                                                    <em className="osicon-meet"></em>
                                                </a>
                                            </li>)
                                    }

                                    {/* youtube  */}
                                    {
                                        showIcons && (footerData?.social_youtube?.length && footerData?.social_youtube?.length > 0 &&
                                            <li>
                                                <a href={footerData?.social_youtube} rel="noreferrer" target="_blank" aria-label="youtube-link">
                                                    <em className="osicon-youtube"></em>
                                                </a>
                                            </li>)
                                    }
                                    {/* google  */}
                                    {
                                        showIcons && (footerData?.social_google?.length && footerData?.social_google?.length > 0 &&
                                            <li>
                                                <a href={footerData?.social_google} rel="noreferrer" target="_blank" aria-label="google-plink">
                                                    <em className="osicon-gphotos"></em>
                                                </a>
                                            </li>)
                                    }

                                </ul>
                            </li>
                        }

                    </ul >
                </div >
            </div >
            <div className="footer-lower">
                <div className="container">
                    <span>Copyright © {currentYear + " " + copyrightText} </span>
                    <div className="card-icons-wrap">
                        <div className="card-icon">
                            <picture>
                                <img src="/assets/images/visa.jpg" alt="visa" title="visa" height="26" width="48" />
                            </picture>
                        </div>
                        <div className="card-icon">
                            <picture>
                                <img src="/assets/images/master-card.jpg" alt="master-card" title="master-card"
                                    height="26" width="48" />
                            </picture>
                        </div>
                        <div className="card-icon">
                            <picture>
                                <img src="/assets/images/americanex.png" alt="american-express"
                                    title="american-express" height="26" width="48" />
                            </picture>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FooterTemplate1;
