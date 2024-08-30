import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '@assets/images/login-img.jpg';
import { Clock } from '@components/icons/icons';
import Button from '@components/button/button';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

type RelatedCoursesProps = {
    slider: boolean
};

const RelatedCourses = ({ slider }: RelatedCoursesProps) => {
    const { t } = useTranslation();

    const onClick = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
    }

    const settings = {
        dots: false,
        infinite: false,
        arrows: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    const sameRelatedCourseData = useCallback(() => {
        return (
            <div className='2xl:w-[calc(25%-15px)] xl:w-[calc(33.3%-15px)] lg:w-[calc(50%-15px)] border-border-primary rounded-t-xl h-full px-2.5'>
                <picture className='w-full max-h-[200px] block relative'>
                    <img src={logo} alt="Related Course Data" title="" className='object-cover w-full rounded-t-xl' />
                </picture>

                <div className="w-full p-5 border-b border-solid border-x border-border-primary rounded-b-xl">

                    <div className="group flex flex-wrap items-center justify-between mb-2.5 gap-2 xmd:min-h-[62px]">
                        <button className='bg-p-list-box-btn font-bold text-white md:mb-0 px-2.5 py-2 rounded-xl text-sm' title='Composters'>Composters</button>
                        <div className="flex items-center justify-center gap-1 time">
                            <span className='text-base'><Clock className='fill-secondary' /></span>
                            <span className="text-xs">3 Hours</span>
                        </div>
                    </div>

                    <p className='leading-5 font-bold hover:text-primary mb-2.5'>Waste Minimization and Source Reduction</p>
                    <p className='mb-5 max-h-[72px] overflow-auto'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry.</p>

                    <div className="flex justify-start items-center gap-[10px]">
                        <picture>
                            <img src={logo} alt="" title='' className='rounded-full min-w-[40px] h-10' />
                        </picture>
                        <p className='font-semibold'>Guy Hawkins</p>
                    </div>
                </div>
            </div>
        )
    }, [])

    return (
        <div className='clear-both mb-7'>
            <div className='p-5 border border-solid border-border-primary rounded-xl'>
                <div className="flex justify-between gap-5 mb-3">
                    <h6 className='leading-7'>{t('Related Courses')}</h6>
                    {slider && <Button className='btn-normal bg-primary text-white text-xs w-full md:w-[80px] h-[36px] whitespace-nowrap' label={t('View All')}  title={`${t('View All')}`}/>}
                </div>

                {!slider && <div className="flex flex-wrap items-start justify-center gap-5 mb-7 sm:justify-start">

                    {sameRelatedCourseData()}
                </div>}

                {!slider && <div className="flex items-center justify-center">
                    <Button className='btn-secondary btn-normal w-full md:w-[120px]' label={t('Load More')} onClick={onClick} />
                </div>}

                {slider && <Slider {...settings}>
                    {sameRelatedCourseData()}
                </Slider>}
            </div>
        </div>
    );
};
export default RelatedCourses;
