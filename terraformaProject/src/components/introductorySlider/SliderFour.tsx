import React from 'react'
import Button from '@components/button/button'
import RadioButtonNew from '@components/radiobutton/radioButtonNew'
import IntroductoryImg4 from '@assets/images/introductory/intro-img4.png';
import { t } from 'i18next';
interface StepFour {
    next: () => void;
    previous: () => void
}

const SliderFour = ({ next, previous }: StepFour) => {
    const WEIGHT = [
        { name: 'Kg', key: '1' },
        { name: 'Metric Tones', key: '2' },
    ];
    return (
        <div className='relative p-10 bg-white lg:py-20 lg:pl-20 lg:pr-12 rounded-xl'>
            <h2 className='mb-2 md:mb-5 lg:mb-0 text-xl md:text-2xl lg:text-xl-30 lg:leading-normal lg:max-w-[440px]'>{t('Select your preferred Weight Matrices?')}</h2>
            <div className='flex max-sm:flex-wrap'>
                <div className='mb-2.5 w-full sm:w-[56%] sm:max-w-[460px] [&_label]:w-full [&_label]:py-2.5 lg:[&_label]:py-4 [&_label]:border-b [&_span]:ml-3 [&_span]:font-semibold [&_span]:text-sm md:[&_span]:text-base'>
                    <RadioButtonNew required={true} name={'status'} radioOptions={WEIGHT} />
                </div>
                <picture className='sm:pl-5 max-sm:my-2 lg:-mt-8 max-sm:mx-auto w-[80%] max-w-[362px] sm:w-[44%] ml-auto'>
                    <img src={IntroductoryImg4} alt="Introductory Image" className='w-full' height='363' width='417' title='Introductory Image'/>
                </picture>
            </div>
            <Button className='w-full sm:w-[140px] btn-normal btn-secondary btn-normal btn-login' type='submit' label={t('Back')} onClick={previous}  title={`${t('Back')}`}/>
            <Button className='w-full sm:ml-5 max-sm:mt-2.5 lg:ml-7 sm:w-[140px] btn-primary btn-normal btn-login' type='submit' label={t('Next')} onClick={next}  title={`${t('Next')}`}/>
        </div>

    )

}

export default SliderFour