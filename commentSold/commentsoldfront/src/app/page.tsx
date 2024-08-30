"use client";
import GrowSales from "@/components/LandingPage/grow-sales";
import HowLiveSelling from "@/components/LandingPage/how-live-selling";
import LandingPageHero from "@/components/LandingPage/landing-page-hero";
import StartGrowing from "@/components/LandingPage/start-growing";
import { ROUTES } from "@/config/staticUrl.config";
import { APP_NAME } from "@/constant/common";
import { IMAGE_PATH } from "@/constant/imagePath";
import { CommonSliceTypes } from "@/framework/redux/redux";
import "@/styles/pages/home.scss";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";

export default function Home() {
  const { landingPage } = useSelector((state: CommonSliceTypes) => state.common)

  if (landingPage === undefined) {
    return null
  }

  if (landingPage) {
    return (
      <div>
        <LandingPageHero />
        <HowLiveSelling />
        <GrowSales />
        <StartGrowing/>
      </div>
    )
  }
  
  return (
    <div>
      <section className="hero-main-section">
        <div className="container-md">
          <div className="hero-section">
            <div className="hero-left-column">
              <h1 className="hero-section-title">Create personal shopping experiences at {APP_NAME} with live video.</h1>
              <p className="description">As a beacon of {APP_NAME} in the digital realm, I&apos;m here to ignite your passions, broaden your horizons, and invite you on a journey of discovery. From lifestyle tips to travel adventures, fashion statements to culinary delights, this is your one-stop destination for all things extraordinary.</p>
            </div>
            <div className="hero-right-column">
            <Image src={IMAGE_PATH.homeHero}  alt="home hero" width={620} height={387} layout={'fit'} objectFit={'contain'}/>
            </div>
          </div>
        </div>
      </section>
      <section className="connect-to-channels-section">
        <div className="container-md">
          <div className="connect-to-channels-row">
            <div className="connect-to-channels-right connect-card">
              <ul className="social-icon list-unstyled spacing-40">
                <li><Link href="#" className="social-icon-btn" aria-label="Facebook Icon"><i className="icon-facebook"></i></Link></li>
                <li><Link href="#" className="social-icon-btn" aria-label="Instagram Icon"><i className="icon-instagram"></i></Link></li>
                <li><Link href="#" className="social-icon-btn" aria-label="Globe Icon"><i className="icon-globe"></i></Link></li>
              </ul>
              <p className="text-center spacing-10 h3">Connect to Channels</p>
              <p className="text-center spacing-30">As a beacon of {APP_NAME} in the digital realm app to capture the video and audio for your live sales.</p>
              <div className="btn-group">
                <Link href={`/${ROUTES.private.myAccount}`}><button className="btn btn-primary m-auto">Manage Channels</button></Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
