import { ROUTES } from "@/config/staticUrl.config";
import { IMAGE_PATH } from "@/constant/imagePath";
import { setOpenLandingPageForm } from "@/framework/redux/reducers/commonSlice";
import "@/styles/components/landing-page-hero.scss";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";

const LandingPageHero = () => {
    const dispatch = useDispatch();

    return (
        <div className="landing-page-hero">
            <div className="container-md">
                <div className="landing-page-hero-row">
                    <div className="landing-page-hero-left">
                        <h1 className="spacing-20">Stream, Sell, Scale Everywhere</h1>
                        <p className="spacing-40">Convert viewers into paying customers from a single, powerful dashboard. [WHI] is the all-in-one solution to expand your reach, captivate your fans, and drive sales like never before. Join the future of commerce - go live and thrive!</p>
                        <div className="landing-page-buttons">
                            <Link href={`/${ROUTES.public.contactUs}`}>
                            <button className="btn btn-primary">Get A Demo</button>
                            </Link>
                            <button className="btn btn-white" onClick={()=> dispatch(setOpenLandingPageForm(true))}>Need Corporate plan</button>
                        </div>
                    </div>
                    <div className="landing-page-hero-right">
                        <Image src={IMAGE_PATH.landingPageHero} className="landing-page-hero-image" alt="hero" width={650} height={363} style={{objectFit:"contain"}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPageHero