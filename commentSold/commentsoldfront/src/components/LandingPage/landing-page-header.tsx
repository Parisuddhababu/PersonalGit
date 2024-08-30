import { IMAGE_PATH } from "@/constant/imagePath";
import "@/styles/components/landing-page-header.scss";
import Image from "next/image";
import Link from "next/link";

const LandingPageHeader = () => {
    return (
        <div className="landing-page-header">
            <div className="container-md">
                <div className="landing-page-header-row">
                    <div className="landing-page-left-col">
                        <Link href="" className="landing-page-logo">
                            <Image className="" src={IMAGE_PATH.WHIMarketingNewLogo} alt="Logo" width={236} height={34} style={{objectFit:"contain"}}/>
                        </Link>
                    </div>
                    <div className="landing-page-right-col">
                        <Link className="btn btn-primary" href="/html-pages/landing-page">SignIn</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LandingPageHeader