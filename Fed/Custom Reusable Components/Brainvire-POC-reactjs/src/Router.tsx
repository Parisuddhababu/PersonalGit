import { BrowserRouter, Route, Routes } from "react-router-dom";
import MasonryStore from "./components/masonry-store/masonry-store";
import { masonry_store } from "./constant/masonry_store";
import IndustryWeServe from "./components/industry-we-serve/IndustryWeServe";
import { industry_serve } from "./constant/industry_serve";
import YoutubePlay from "./components/youtube_video/YoutubePlay";
import { youtube_video } from "./constant/youtube_video";
import ServicesWeServed from "./components/ServicesWeServed/ServicesWeServed";
import { service_box } from "./constant/service_box";
import OurSuccessStories from "./components/OurSuccessStories/OurSuccessStories";
import { case_study } from "./constant/case_study";
import OurClientSay from "./components/OurClientSay/OurClientSay";
import { clutch_review_data } from "./constant/clutch_review";
import MarqueeSlider from "./components/marquee_slider/MarqueeSlider";
import ReadMoreLess from "./components/readmore_less/ReadMoreLess";
import { scoll_data } from "./constant/scroll_data";
import { readMore_Less } from "./constant/readMore_less";
import HomePage from "./components/home/HomePage";


const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/masonry-store"
          element={<MasonryStore {...masonry_store.section_two} />}
        />
        <Route
          path="/industry-we-serve"
          element={<IndustryWeServe {...industry_serve.industry_section} />}
        />
        <Route
          path="/youtube_video"
          element={
            <YoutubePlay {...youtube_video.our_company_section_services} />
          }
        />
        <Route
          path="/ServicesWeServed"
          element={<ServicesWeServed {...service_box.service_we_served} />}
        />
        <Route
          path="/OurSuccessStories"
          element={<OurSuccessStories {...case_study.case_study_section} />}
        />
        <Route
          path="/OurClientSay"
          element={<OurClientSay {...clutch_review_data.clutch_reviews} />}
        />
        <Route
          path="/marquee_slider"
          element={<MarqueeSlider {...scoll_data.client_section} />}
        />
        <Route
          path="/readmore_less"
          element={<ReadMoreLess {...readMore_Less.latest_thinking_section} />}
        />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
