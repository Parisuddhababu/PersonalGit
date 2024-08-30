import React from 'react'
import Button from '@components/button/button'
import { EducationEngagement, Menuicon, RecyclingWasteManagement, ReportsTracking } from '@components/icons/icons'
import IntroductoryImg2 from '@assets/images/introductory/intro-img2.png';
import { t } from 'i18next';
interface StepTwo {
    next: () => void;
    previous: () => void
}

const SliderTwo = ({ next,previous }:StepTwo) => {
    return (
        <div className='relative p-10 bg-white lg:py-20 lg:pl-20 lg:pr-12 rounded-xl'>
            <h2 className='mb-2 text-xl md:text-2xl lg:text-xl-30 md:mb-6 lg:leading-normal'>{t('Let’s make the change Together')}</h2>
            <a href='#' className='absolute text-xs font-bold text-success sm:text-xs-14 top-5 right-5 sm:top-7 sm:right-7' onClick={next} >{t('SKIP')} &gt;&gt;</a>
            <div className='flex max-sm:flex-wrap'>
                <div className='w-full sm:w-[56%] mb-2.5 sm:max-w-[460px]'>
                    <div className='flex items-center py-2.5 border-b border-solid lg:py-4 border-border-primary last:border-none'>
                        <span className='text-xl-22 md:text-2xl mr-2.5'><Menuicon className='fill-success' /></span>
                        <p className='font-semibold'>{t('Comprehensive Dashboards')}</p>
                    </div>
                    <div className='flex items-center py-2.5 border-b border-solid lg:py-4 border-border-primary last:border-none'>
                        <span className='text-xl-22 md:text-2xl mr-2.5'><EducationEngagement className='fill-success' /></span>
                        <p className='font-semibold'>{t('Empowering Education Portal')}</p>
                    </div>
                    <div className='flex items-center py-2.5 border-b border-solid lg:py-4 border-border-primary last:border-none'>
                        <span className='text-xl-22 md:text-2xl mr-2.5'><ReportsTracking className='fill-success' /></span>
                        <p className='font-semibold'>{t('Effortless Report Tracking')}</p>
                    </div>
                    <div className='flex items-center py-2.5 border-b border-solid lg:py-4 border-border-primary last:border-none'>
                        <span className='text-xl-22 md:text-2xl mr-2.5'><RecyclingWasteManagement className='fill-success' /></span>
                        <p className='font-semibold'>{t('Streamlined Waste Management')}</p>
                    </div>
                </div>
                <picture className='sm:pl-5 mx-2 mb-2 lg:-mt-2 max-sm:mx-auto w-[80%] max-sm:max-w-[350px] sm:w-[44%] ml-auto'>
                    <img src={IntroductoryImg2} alt="Introductory Image" className='w-full' height='363' width='417' title='Introductory Image'/>
                </picture>
            </div>
            <Button className='w-full sm:w-[140px] btn-normal btn-secondary btn-normal btn-login' type='submit' label={t('Back')} onClick={previous}  title={`${t('Back')}`} />
            <Button className='w-full sm:ml-5 max-sm:mt-2.5 lg:ml-7 sm:w-[140px] btn-primary btn-normal btn-login' type='submit' label={t('Next')}  onClick={next}  title={`${t('Next')}`} />
        </div>
    )
}

export default SliderTwo