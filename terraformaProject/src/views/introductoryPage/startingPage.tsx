import React from 'react';
import Button from '@components/button/button';
import IntroductoryImg from '@assets/images/introductory/intro-img1.png';
import Logo from '@assets/images/logo.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { t } from 'i18next';

const WelcomePage = () => {    
    return (
        <div className='container w-full [&_.slick-track]:flex [&_.slick-slide]:h-full [&_.slick-slide]:my-auto px-6 md:px-7 max-w-introductory-container z-1 [&_.slick-list]:rounded-xl [&_.slick-list]:bg-white [&_.slick-list]:shadow-outline '>
                <div className='p-10 bg-white lg:py-20 lg:pl-20 lg:pr-12 rounded-xl'>
                    <picture className='max-md:max-w-[210px] block sm:mb-9'>
                        <img src={Logo} alt="Introductory Background" height='80' width='301' />
                    </picture>
                    <div className='flex max-sm:flex-wrap max-sm:mb-5'>
                        <h1 className='text-xl md:text-2xl lg:text-xl-30 max-sm:text-center max-sm:order-2 sm:mb-10 sm:w-[56%] lg:leading-normal'>Welcome to Terra Forma Systems Introductory Journey</h1>
                        <picture className='sm:pl-5 max-sm:mb-5 max-sm:mx-auto sm:-mt-20 lg:-mt-24 w-[80%] max-sm:max-w-[350px] sm:w-[44%]'>
                            <img src={IntroductoryImg} alt="Introductory Image" className='w-full' height='363' width='417' />
                        </picture>
                    </div>
                    <Button className='w-full sm:w-[166px] btn-primary btn-normal btn-login' type='submit' label={t('Get Started')} 
                     title={`${t('Get Started')}`} />
                </div>
        </div>
    );
};
export default WelcomePage;
