import { Calendar, Clock, Group } from '@components/icons/icons';
import { ConvertMinutesToHours, FormattedDate, convertMinutesToHoursAndMinutes } from '@config/constant';
import React from 'react'
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { CourseClone, CourseDetailsPage } from 'src/types/common';

interface OverviewProps {
    coursePage: boolean;
}

function Overview({ coursePage }: Readonly<OverviewProps>) {
    const { t } = useTranslation();
    const { overview } = useSelector(((state: { coursesManagement: { courseDetailsPage: CourseDetailsPage ,overview:CourseClone} }) => state.coursesManagement));
    const courseDelivery = false; // For future use.

    return (
        <div className='overflow-auto max-h-[626px]'>
        {coursePage && <div className='flex flex-wrap gap-4 md:gap-x-7 bg-accents-2 px-5 py-2.5 mx-5 mt-3 rounded-xl'>
            <div className="flex items-center justify-center gap-1">
                <span className='text-lg'><Clock className='min-w-[18px]'/></span>
                <span className="text-xs md:text-sm">{ConvertMinutesToHours(overview?.estimate_time)}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
                <span className='text-base'><Calendar className='min-w-[18px]'/></span>
                <span className="text-xs md:text-sm">{FormattedDate(overview?.createdAt)}</span>
            </div>
            <div className="flex items-center justify-center gap-1">
                <span className='text-xl'><Group className='min-w-[18px]' /></span>
                <span className="text-xs md:text-sm">{`${overview?.course_learners_count} People Started Learning`}</span>
            </div>
        </div>}
        <div className='p-5 border-b border-solid border-border-primary last:border-none first:pt-2 last:pb-2'>
            <h6 className='mb-2.5'>{t('Course Description')}</h6>
            <p className='break-words' dangerouslySetInnerHTML={{ __html: overview?.description }}></p>
        </div>
        <div className='p-5 border-b border-solid border-border-primary last:border-none first:pt-2 last:pb-2'>
            <h6 className='mb-2.5'>{t('Course Duration')}</h6>
            <p>{t(`This course is designed to be completed in approximately ${convertMinutesToHoursAndMinutes(overview?.estimate_time)?.hours} h ${convertMinutesToHoursAndMinutes(overview?.estimate_time)?.minutes} m, depending on the pace of learning and level of engagement.`)}</p>
        </div>
        {courseDelivery && <div className='p-5 border-b border-solid border-border-primary last:border-none first:pt-2 last:pb-2'>
            <h6 className='mb-2.5'>{t('Course Delivery')}</h6>
            <ul className='ml-4 list-disc'>
                <li className='mb-3 md:mb-5 last:mb-0'>{t('The course will be delivered through a combination of video lectures, readings, interactive activities, and quizzes.')}</li>
                <li className='mb-3 md:mb-5 last:mb-0'>{t('Participants will have access to a discussion forum to engage with fellow learners and the instructor, ask questions, and share insights.')}</li>
                <li className='mb-3 md:mb-5 last:mb-0'>{t('Case studies and real-world examples will be provided to enhance understanding and practical application.')}</li>
            </ul>
        </div>}
        {overview?.is_certification && <div className='p-5 border-b border-solid border-border-primary last:border-none first:pt-2 last:pb-2'>
            <h6 className='mb-2.5'>{t('Assessment and Certification')}</h6>
            <ul className='ml-4 list-disc'>
                <li className='mb-3 md:mb-5 last:mb-0'>{t('Participants will be assessed through quizzes and assignments')}</li>
                <li className='mb-3 md:mb-5 last:mb-0'>{t('Upon successful completion of the course requirements, participants will receive a certificate of completion.')}</li>
            </ul>
        </div>}
        {overview?.prerequisite && <div className='p-5 border-b border-solid border-border-primary last:border-none first:pt-2 last:pb-2'>
            <h6 className='mb-2.5'>{t('Prerequisite')}</h6>
            <ul className='ml-4 list-disc'>
                <li className='mb-3 md:mb-5 last:mb-0'>{overview?.prerequisite}</li>
            </ul>
        </div>}
    </div>
    )
}

export default Overview
