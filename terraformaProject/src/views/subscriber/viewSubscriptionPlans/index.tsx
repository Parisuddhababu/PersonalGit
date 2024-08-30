import React from 'react'
import UpdatedHeader from '@components/header/updatedHeader'
import { useTranslation } from 'react-i18next';
import { Check } from '@components/icons/icons';
import Button from '@components/button/button';

function PlanFeature(){
    const { t } = useTranslation();
    return (
        <>
            <div className='max-w-[364px] pl-3 md:pl-7 w-full mb-7 md:mb-10 flex flex-col justify-between min-h-[210px] md:min-h-[240px] lg:min-h-[294px]'>
                <p className='flex items-center'>
                    <span className='inline-block p-[3px] mr-2.5 overflow-hidden rounded-full bg-success text-xs-10 min-w-[16px]'><Check className='fill-white' /></span>
                    <p className='text-base md:text-lg'>{t('Dashboard')}</p>
                </p>
                <p className='flex items-center'>
                    <span className='inline-block p-[3px] mr-2.5 overflow-hidden rounded-full bg-success text-xs-10 min-w-[16px]'><Check className='fill-white' /></span>
                    <p className='text-base md:text-lg'>{t('Reports')}</p>
                </p>
                <p className='flex items-center'>
                    <span className='inline-block p-[3px] mr-2.5 overflow-hidden rounded-full bg-success text-xs-10 min-w-[16px]'><Check className='fill-white' /></span>
                    <p className='text-base md:text-lg'>{t('Education & Engagement')}</p>
                </p>
                <p className='flex items-center'>
                    <span className='inline-block p-[3px] mr-2.5 overflow-hidden rounded-full bg-success text-xs-10 min-w-[16px]'><Check className='fill-white' /></span>
                    <p className='text-base md:text-lg'>{t('Diversion Reports')}</p>
                </p>
                <p className='flex items-center'>
                    <span className='inline-block p-[3px] mr-2.5 overflow-hidden rounded-full bg-success text-xs-10 min-w-[16px]'><Check className='fill-white' /></span>
                    <p className='text-base md:text-lg'>{t('Waste Audit Reports')}</p>
                </p>
                <p className='flex items-center'>
                    <span className='inline-block p-[3px] mr-2.5 overflow-hidden rounded-full bg-success text-xs-10 min-w-[16px]'><Check className='fill-white' /></span>
                    <p className='text-base md:text-lg'>{t('Allowed User : ')}<span className='font-bold'>30</span></p>
                </p>
            </div>
        </>
    )
}

function Index() {
    const { t } = useTranslation();

    return (
        <>
            <UpdatedHeader />
            <div className='border border-solid border-border-primary rounded-xl h-[calc(100%-133px)] md:h-[calc(100%-141px)]  md:w-[calc(100%-56px)] w-[calc(100%-40px)] overflow-hidden'>
                <div className='flex flex-wrap items-center justify-center w-full h-full p-4 overflow-auto md:p-5'>
                    <div className='w-full max-w-[464px] pt-[84px] md:pt-44 -mt-7 md:-mt-20 lg:mx-3'>
                        <div className='flex flex-col items-center w-full px-5 pb-8 transition-all duration-300 ease-in-out border border-solid 2xl:pb-12 border-border-primary rounded-xl bg-gradient-to-t from-white via-accents-2 to-white hover:shadow-outline-3'>
                            <div className='py-5 md:pt-7 md:pb-8 pr-5 text-white pl-7 bg-orange md:min-w-[290px] rounded-xl w-full max-w-[364px] -mt-14 md:-mt-20 mb-7 md:mb-10'>
                                <h6>{t('BASIC')}</h6>
                                <div className='flex flex-wrap mt-5 md:mt-7'>
                                    <p className='font-extrabold text-xl-28 md:text-3xl pt-2.5'>$</p>
                                    <p className='font-extrabold text-xl-44 md:text-xxl-70'>199</p>
                                    <p className='pt-2 ml-2 text-base md:text-lg'>per month</p>
                                </div>
                            </div>
                            <PlanFeature />
                            <div className='flex justify-center w-full mt-auto'>
                                <Button className='btn-secondary btn-normal w-full max-w-[364px]' type='submit' label={'Choose Plan'} title='Choose Plan'/>
                            </div>
                        </div>
                    </div>
                    <div className='w-full max-w-[464px] pt-[105px] md:pt-44 -mt-7 md:-mt-20 lg:mx-3'>
                        <div className='flex flex-col items-center w-full px-5 pb-8 transition-all duration-300 ease-in-out border border-solid 2xl:pb-12 border-border-primary rounded-xl bg-gradient-to-t from-white via-accents-2 to-white hover:shadow-outline-3'>
                            <div className='py-5 md:pt-7 md:pb-8 pr-5 text-white pl-7 bg-accents-3 md:min-w-[290px] rounded-xl w-full max-w-[364px] -mt-14 md:-mt-20 mb-7 md:mb-10'>
                                <h6>{t('STANDARD')}</h6>
                                <div className='flex flex-wrap mt-5 md:mt-7'>
                                    <p className='font-extrabold text-xl-28 md:text-3xl pt-2.5'>$</p>
                                    <p className='font-extrabold text-xl-44 md:text-xxl-70'>299</p>
                                    <p className='pt-2 ml-2 text-base md:text-lg'>per month</p>
                                </div>
                            </div>
                            <PlanFeature />
                            <div className='flex justify-center w-full mt-auto'>
                                <Button className='btn-secondary btn-normal w-full max-w-[364px]' type='submit' label={'Choose Plan'} title='Choose Plan'/>
                            </div>
                        </div>
                    </div>
                    <div className='w-full max-w-[464px] pt-[105px] md:pt-44 -mt-7 md:-mt-20 lg:mx-3'>
                        <div className='flex flex-col items-center w-full px-5 pb-8 transition-all duration-300 ease-in-out border border-solid 2xl:pb-12 border-border-primary rounded-xl bg-gradient-to-t from-white via-accents-2 to-white hover:shadow-outline-3'>
                            <div className='py-5 md:pt-7 md:pb-8 pr-5 text-white pl-7 bg-p-list-box-btn md:min-w-[290px] rounded-xl w-full max-w-[364px] -mt-14 md:-mt-20 mb-7 md:mb-10'>
                                <h6>{t('PREMIUM')}</h6>
                                <div className='flex flex-wrap mt-5 md:mt-7'>
                                    <p className='font-extrabold text-xl-28 md:text-3xl pt-2.5'>$</p>
                                    <p className='font-extrabold text-xl-44 md:text-xxl-70'>599</p>
                                    <p className='pt-2 ml-2 text-base md:text-lg'>per month</p>
                                </div>
                            </div>
                            <PlanFeature />
                            <div className='flex justify-center w-full mt-auto'>
                                <Button className='btn-secondary btn-normal w-full max-w-[364px]' type='submit' label={'Choose Plan'}title='Choose Plan' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Index
