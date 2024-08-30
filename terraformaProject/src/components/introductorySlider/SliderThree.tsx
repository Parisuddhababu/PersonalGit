import React from 'react'
import Button from '@components/button/button'
import RadioButtonNew from '@components/radiobutton/radioButtonNew'
import { useTranslation } from 'react-i18next';
import IntroductoryImg3 from '@assets/images/introductory/intro-img3.png';

interface StepThree {
    next: () => void;
    previous: () => void
}

const SliderThree = ({ next,previous }:StepThree) => {
    const { t } = useTranslation();
    const CURRENCY = [
        { name: 'CAD', key: '1' },
        { name: 'USD', key: '2' },
    ];
    return (
        <div className='relative p-10 bg-white lg:py-20 lg:pl-20 lg:pr-12 rounded-xl'>
            <h2 className='mb-2 text-xl md:text-2xl lg:text-xl-30 md:mb-6 lg:leading-normal'>{t('Select your Preferred Currency?')}</h2>
            <a href='#' className='absolute text-xs font-bold text-success sm:text-xs-14 top-5 right-5 sm:top-7 sm:right-7' onClick={next}>{t('SKIP')} &gt;&gt;</a>
            <div className='flex max-sm:flex-wrap'>
                <div className='mb-2.5 w-full sm:w-[56%] sm:max-w-[460px] [&_label]:w-full [&_label]:py-2.5 lg:[&_label]:py-4 [&_label]:border-b [&_span]:ml-3 [&_span]:font-semibold [&_span]:text-sm md:[&_span]:text-base'>
                    <RadioButtonNew required={true} name={'status'} radioOptions={CURRENCY} />
                </div>
                <picture className='sm:pl-5 max-sm:my-2 sm:-mt-3 max-sm:mx-auto w-[80%] max-sm:max-w-[350px] sm:w-[44%] ml-auto'>
                    <img src={IntroductoryImg3} alt="Introductory Image" className='w-full' height='363' width='417' title='Introductory Image'/>
                </picture>
            </div>
            <Button className='w-full sm:w-[140px] btn-normal btn-secondary btn-normal btn-login' type='submit' label={t('Back')} onClick={previous}  title={`${t('Back')}`} />
            <Button className='w-full sm:ml-5 max-sm:mt-2.5 lg:ml-7 sm:w-[140px] btn-primary btn-normal btn-login' type='submit' label={t('Next')} onClick={next}  title={`${t('Next')}`} />
        </div>
    )
}

export default SliderThree