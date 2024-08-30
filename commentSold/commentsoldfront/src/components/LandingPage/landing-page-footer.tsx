"use client";
import { ROUTES } from "@/config/staticUrl.config";
import { APP_NAME } from "@/constant/common";
import { IMAGE_PATH } from "@/constant/imagePath";
import useDetectDomain from "@/framework/hooks/useDetectDomain";
import { setOpenLandingPageForm, setShowLandingPagePlans } from "@/framework/redux/reducers/commonSlice";
import { CommonSliceTypes } from "@/framework/redux/redux";
import "@/styles/components/landing-page-footer.scss";
import { checkToShowHeaderAndFooter } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

const LandingPageFooter = () => {
    const { landingPage,headerMenu } = useSelector((state: CommonSliceTypes) => state.common)
    const domain = useDetectDomain()
    const pathname = usePathname()
    const dispatch = useDispatch()
    const router = useRouter();

    const HandleHomepageNavigation = (isForPlans : boolean) => {
        if(pathname !== '/'){
            router.push("/")
        }
        if(isForPlans){
            dispatch(setShowLandingPagePlans(true))
            return;
        }
        dispatch(setOpenLandingPageForm(true))
    }

    if(checkToShowHeaderAndFooter(pathname)){
        return null;
    }
    if (landingPage === undefined || !headerMenu) {
        return null
    }

    return (
        <div>
            <div className="footer" id="footer">
                <div className="footer-inner">
                    <div className="container-md">
                        <div className="row footer-row">
                            <div className="col social">
                                <Image className="" src={IMAGE_PATH.footerLogoNew} alt="Footer Logo" width={236} height={34} style={{objectFit:"contain"}}/>
                                <div className="spacing-40"></div>
                                <ul className="list-unstyled social-bar">
                                    <li><Link href="" target="_blank" className="facebook" aria-label="Facebook"><span className="icon-facebook icon"></span></Link></li>
                                    <li><Link href="" target="_blank" className="instagram" aria-label="Instagram"><span className="icon-instagram icon"></span></Link></li>
                                    <li><Link href="" target="_blank" className="globe" aria-label="Website"><span className="icon-globe icon"></span></Link></li>
                                </ul>
                            </div>
                            <div className="col cs-links">
                                <p className="h3 foooter-sub-title">WHI Marketing</p>
                                <div className="spacing-40"></div>
                                <ul className="list-unstyled footer-menu">
                                    {
                                        domain === 'Influencer' && landingPage &&
                                        <Fragment>
                                            <li><Link className="menu-item" href={`/${ROUTES.public.signUp}`}>Register As A Influender</Link></li>
                                            <li>
                                                <Link href="" onClick={(e)=> {
                                                    e.preventDefault();
                                                    HandleHomepageNavigation(false)}} 
                                                    className="menu-item">Register As A Brand
                                                </Link>
                                            </li>
                                        </Fragment>
                                    }
                                    <li><Link href="" className="menu-item">About {APP_NAME}</Link></li>
                                </ul>
                            </div>
                            <div className="col support">
                                <p className="h3 foooter-sub-title">Support</p>
                                <div className="spacing-40"></div>
                                <ul className="list-unstyled footer-menu">
                                    <li><Link href={`/${ROUTES.public.contactUs}`}>Contact Us</Link></li>
                                    <li><Link href={`/${ROUTES.public.privacyPolicy}`}>Privacy Policy</Link></li>
                                    <li><Link href={`/${ROUTES.public.termsOfUse}`}>Terms of Use</Link></li>
                                    {landingPage && 
                                    <li>
                                        <Link href="" onClick={(e) => {
                                        e.preventDefault();
                                        HandleHomepageNavigation(true)}}>Subscription Plan
                                        </Link>
                                    </li>}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPageFooter