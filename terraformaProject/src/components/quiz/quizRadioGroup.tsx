import { Check, Cross } from '@components/icons/icons';
import { ChaptersProgressData } from '@components/whatIsOrganicWaste/courseLearningProgress/courseContent';
import React, { ReactElement, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedOptions, setNextEnable } from 'src/redux/courses-management-slice';
import { ChapterDataType } from 'src/types/common';

interface RadioGroupProps {
    options: Array<{
        uuid: string; option: string; is_correct: boolean;
        order: number;
    }>;
    question?: string;
    previous: boolean;
}

const QuizRadioGroup: React.FC<RadioGroupProps> = ({ options, previous,question }) => {
    const dispatch = useDispatch();
    const { selectedOptions,activeChapter,courseContent,activeIndex } = useSelector(
        (state: { coursesManagement: {selectedOptions:Array<{option_uuid:string,question_uuid:string,is_correct:boolean}>,activeChapter:ChapterDataType,courseContent:ChaptersProgressData[],activeIndex:number} }) => state.coursesManagement
    );

    useEffect(()=>{
        if(activeChapter?.chapter_quiz?.length>0){
            checkAllCorrectAnswer(selectedOptions)
        }
    },[selectedOptions,options])

    const handleOptionChange = useCallback((option: {
        uuid: string; option: string; is_correct: boolean;
        order: number;
    }) => {
        // Only keep the selected option for the current question and discard others.
        const req = selectedOptions?.some((data:{option_uuid:string}) => data?.option_uuid === option?.uuid);
        if (!req&&question) {
            dispatch(setSelectedOptions([...selectedOptions, {option_uuid:option.uuid,question_uuid:question,is_correct:option.is_correct}]));
            if(activeChapter?.chapter_quiz?.length>0){
                checkAllCorrectAnswer([...selectedOptions, {option_uuid:option.uuid,question_uuid:question,is_correct:option.is_correct}]);
            }
        }
    },[selectedOptions,options]);

    const checkAllCorrectAnswer = (selectedArray:{option_uuid:string;question_uuid:string,is_correct:boolean}[]) => {
        const correctAnswers = options?.filter((data: { is_correct: boolean; }) => data?.is_correct === true);
        const selectCorrectAnswers = selectedArray.filter((data:{option_uuid:string;question_uuid:string,is_correct:boolean}) => data?.question_uuid === question&&data?.is_correct);
        if (selectCorrectAnswers?.length === correctAnswers.length) {
            dispatch(setNextEnable(true))
        }
    }
    const optionsNameColorCondition = (option: { uuid: string }, error: string | ReactElement, success: string | ReactElement,) => {
       
        if (!!selectedOptions?.length && selectedOptions.some(
            (item: { option_uuid: string; is_correct: boolean }) =>
                item?.option_uuid === option?.uuid
        )) {
            return selectedOptions.some(
                (item: { option_uuid: string; is_correct: boolean }) =>
                    item?.option_uuid === option?.uuid && item?.is_correct
            ) ? success : error;
        } 
    }
   
    return (
        <div>
            <div>
                {!previous&&!courseContent?.[activeIndex]?.user_course_progress?.is_chapter_completed &&
                    <>
                        {options?.map((option) => (
                            <div key={option.uuid} className="mb-4 md:mb-5 last:mb-0">
                                <label className="flex items-center">
                                    <span className="relative w-full h-10 md:h-[50px]">
                                        <span
                                            className={`${optionsNameColorCondition(option, 'text-error', 'text-p-list-box-btn')} absolute font-normal -translate-y-1/2 text-xs-14 md:text-base top-1/2 left-5 right-12`}
                                        > 
                                            {option.option}
                                        </span>
                                        <input
                                            type="radio"
                                            name={option.uuid} 
                                            value={option.uuid}
                                            checked={selectedOptions.some(
                                                (item: { option_uuid: string; is_correct: boolean }) =>
                                                    item.option_uuid === option.uuid
                                            )}
                                            onChange={() => handleOptionChange(option)}
                                            className={`w-full h-full border appearance-none border-border-primary rounded-xl focus:outline-none focus:border checked:bg-border-secondary focus:bg-border-secondary ${selectedOptions.some(
                                                (item: { option_uuid: string; is_correct: boolean }) =>
                                                    item.option_uuid === option.uuid && item.is_correct
                                            ) ? 'checked:border-p-list-box-btn focus:border-p-list-box-btn' : 'checked:bg-light-red checked:border-error focus:border-error focus:bg-light-red'}`}
                                        />
                                        {!!selectedOptions?.length && <span className='absolute top-1/2 transform -translate-y-1/2 right-5'>
                                            {optionsNameColorCondition(option, <Cross className='text-error !w-[0.9em] !h-[0.9em]' />, <Check className='text-p-list-box-btn' />)}
                                        </span>}
                                    </span>
                                </label>
                            </div>
                        ))}
                    </>
                }
                {previous||courseContent?.[activeIndex]?.user_course_progress?.is_chapter_completed &&
                    <>
                        {options?.map((option) => (
                            <div key={option.uuid} className="mb-4 md:mb-5 last:mb-0">
                                <label className="flex items-center">
                                    <span className="relative w-full h-10 md:h-[50px]">
                                        <span
                                            className={`${option?.is_correct ? 'text-p-list-box-btn' : 'text-error'} absolute font-normal -translate-y-1/2 text-xs-14 md:text-base top-1/2 left-5 right-12`}
                                        >
                                            {option.option}
                                        </span>
                                        <input
                                            type="radio"
                                            name={option.uuid} 
                                            value={option.uuid}
                                            checked={option?.uuid !== ''}
                                            disabled={true}
                                            className={`w-full h-full border appearance-none border-border-primary rounded-xl focus:outline-none focus:border checked:bg-border-secondary focus:bg-border-secondary ${option?.is_correct}  ${option?.is_correct ? 'checked:border-p-list-box-btn focus:border-p-list-box-btn' : 'checked:bg-light-red checked:border-error focus:border-error focus:bg-light-red'}`}
                                        />
                                        <span className='absolute top-1/2 transform -translate-y-1/2 right-5'>
                                            {option?.is_correct ? <Check className='text-p-list-box-btn' /> : <Cross className='text-error !w-[0.9em] !h-[0.9em]' />}
                                        </span>
                                    </span>
                                </label>
                            </div>
                        ))}
                    </>
                }
            </div>
        </div>
    );
};

export default QuizRadioGroup;
