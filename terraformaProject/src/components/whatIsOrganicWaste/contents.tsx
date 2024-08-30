import {  useQuery } from '@apollo/client';
import { COURSE_TYPE } from '@config/constant';
import { GET_COURSE_CHAPTER_DETAILS } from '@framework/graphql/queries/getCourses';
import React from 'react'
import { useSearchParams } from 'react-router-dom';

function Contents() {
    const [queryParams]= useSearchParams();
    const {data:courseContent}= useQuery(GET_COURSE_CHAPTER_DETAILS,{variables:{
        courseId:queryParams.get('uuid')
    },fetchPolicy:'network-only'});

    return (
        <div className='overflow-auto max-h-[626px]'>
             {courseContent?.findCourseChaptersDetails?.data?.courseChapters?.map((chapterData: {uuid:string,title:string,type:number}) => (
                <div className='p-5 border-b border-solid border-border-primary last:border-none first:pt-2 last:pb-2' key={chapterData.uuid}>
                    <h6 className='mb-2.5'>{chapterData.title}</h6>
                    <p className='text-base text-light-grey'>{COURSE_TYPE?.[chapterData?.type]}</p>
                </div>
            ))}
            {!courseContent?.findCourseChaptersDetails?.data?.courseChapters?.length&&<p className='text-light-grey p-4' >No Content</p>}

        </div>
    )
}

export default Contents;
