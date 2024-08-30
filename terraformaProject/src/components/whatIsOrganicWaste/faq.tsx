import React, { useState } from 'react'
import { Minus, Plus } from '@components/icons/icons';
import { useQuery } from '@apollo/client';
import { GET_FAQS_COURSE_DETAILS } from '@framework/graphql/queries/getCourses';
import { useSearchParams } from 'react-router-dom';

interface FaqItem {
    question: string;
    answer: string;
    uuid: string;
}

function Faq() {
    const [activeItem, setActiveItem] = useState<number | null>(null);
    const [queryParams]= useSearchParams();
    const {data:getFaqsByCourseDetails}=useQuery(GET_FAQS_COURSE_DETAILS,{variables:{
        courseId:queryParams.get('uuid')
    },fetchPolicy:'network-only'});

    const toggleItem = (index: number) => {
        if (activeItem === index) {
            setActiveItem(null); // Close the currently open item if clicked again
        } else {
            setActiveItem(index); // Open the clicked item
        }
    };

    return (
        <>
             {getFaqsByCourseDetails?.getFaqsByCourseDetails?.data?.faqData?.map((item: FaqItem, index: number) => (
                <div className="py-5 pr-5 border-b border-solid faq-item pl-11 border-border-primary first:pt-2 last:pb-2 last:border-none" key={item.uuid}>
                    <div
                        className={`faq-question font-bold relative cursor-pointer ${activeItem === index ? 'active mb-2.5 text-primary' : ''}`}
                        onClick={() => toggleItem(index)}
                    >
                        {activeItem === index ? <span className='absolute -left-7 top-[4px]'><Minus /></span> : <span className='absolute -left-7 top-[4px]'><Plus /></span>}
                        {item.question}
                    </div>
                    {activeItem === index && (
                        <div className="faq-answer break-words" dangerouslySetInnerHTML={{ __html: item.answer }}></div>
                    )}
                </div>
            ))}
            {!getFaqsByCourseDetails?.getFaqsByCourseDetails?.data?.faqData?.length&&<p className='text-light-grey p-4'>No FAQ Found </p>}
        </>
    )
}

export default Faq
