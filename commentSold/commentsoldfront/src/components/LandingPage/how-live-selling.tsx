import { IMAGE_PATH } from "@/constant/imagePath";
import "@/styles/components/how-live-selling.scss";
import Image from "next/image";

const HowLiveSelling = () => {
    return (
        <section className="how-live-selling">
            <div className="container-md">
                <h2 className="section-title h1 font-700 spacing-20 text-center">3 Steps to Live Selling Success</h2>
                <p className="section-subtitle text-center spacing-40">Live commerce is taking the world by storm! Let's break it down into 3 simple steps to turn viewers into paying customers:</p>
                <div className="how-live-selling-row">
                    <div className="how-live-selling-item">
                        <Image src={IMAGE_PATH.landingPageLive1} alt="Live Feature 1" className="spacing-40 how-live-selling-item-image" width={440} height={346} style={{objectFit:"contain",width: "100%"}}/>
                        <h3 className="h2 spacing-20 how-live-selling-item-title text-center">Captivate</h3>
                        <p className="how-live-selling-item-description text-center">Reach your audience across all major platforms simultaneously. Host interactive demos, answer questions in real-time, and offer exclusive deals to spark excitement.</p>
                    </div>
                    <div className="how-live-selling-item">
                        <Image src={IMAGE_PATH.landingPageLive2} alt="Live Feature 2" className="spacing-40 how-live-selling-item-image" width={440} height={346} style={{objectFit:"contain",width: "100%"}}/>
                        <h3 className="h2 spacing-20 how-live-selling-item-title text-center">Convert</h3>
                        <p className="how-live-selling-item-description text-center">Let viewers purchase directly within the live stream. Showcase product benefits, address concerns to build trust, and encourage buying decisions with special offers.</p>
                    </div>
                    <div className="how-live-selling-item">
                        <Image src={IMAGE_PATH.landingPageLive3} alt="Live Feature 3" className="spacing-40 how-live-selling-item-image" width={440} height={346} style={{objectFit:"contain",width: "100%"}}/>
                        <h3 className="h2 spacing-20 how-live-selling-item-title text-center">Conquer</h3>
                        <p className="how-live-selling-item-description text-center">Optimize your future live streams with insights. Create a thriving brand community. Manage multiple streams and seamlessly integrate live commerce into your overall strategy.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowLiveSelling