import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import SlideOne from './SlideOne';
import SliderTwo from './SliderTwo';
import FinalStep from './FinalStep';

const IntroductorySlider = () => {
    const sliderRef = useRef<Slider>(null);
     const next = () => {
        if (sliderRef.current) {
            sliderRef.current.slickNext();
        }
    };

    const previous = () => {
        if (sliderRef.current) {
            sliderRef.current.slickPrev();
        }
    };

    const settings = {
        dots: true,
        infinite: false,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 0,
    };


    return (
        <div className='container w-full [&_.slick-track]:flex [&_.slick-slide]:h-full [&_.slick-slide]:my-auto px-6 md:px-7 max-w-introductory-container z-1 [&_.slick-list]:rounded-xl [&_.slick-list]:bg-white [&_.slick-list]:shadow-outline '>
            <Slider {...settings} ref={sliderRef}>
                <div className='p-10 bg-white lg:py-20 lg:pl-20 lg:pr-12 rounded-xl'>
                    <SlideOne next={next} />
                </div>
                <div className='p-10 bg-white lg:py-20 lg:pl-20 lg:pr-12 rounded-xl'>
                    <SliderTwo next={next} previous={previous} />
                </div>
                <div className='p-10 bg-white lg:py-20 lg:pl-20 lg:pr-12 rounded-xl'>
                    <FinalStep previous={previous} />
                </div>
            </Slider>
        </div>
    );
};
export default IntroductorySlider;


