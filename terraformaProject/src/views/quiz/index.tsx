import React, { useCallback, useEffect, useState, memo } from 'react';
import { toast } from 'react-toastify';
import QuizRadioGroup from '@components/quiz/quizRadioGroup';
import { useParams, useSearchParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { ChapterDataType, UserProfileType, } from 'src/types/common';
import { setCoursePercentage, setMoveNext, setNextEnable, setSelectedOptions, setUpdate } from 'src/redux/courses-management-slice';
import { UPDATE_USER_COURSE_PROGRESS } from '@framework/graphql/mutations/updateUserCourseProgress';
import { ChaptersProgressData } from '@components/whatIsOrganicWaste/courseLearningProgress/courseContent';
import Button from '@components/button/button';
import { Cross } from '@components/icons/icons';
import PassedAnimation from '@assets/images/trophy-animation.gif';
import { useTranslation } from 'react-i18next';
import { ProgressSpinner } from 'primereact/progressspinner';
import { USER_TYPE } from '@config/constant';


const QuizProgressMemo = memo(function QuizProgressMemo({ dynamicWidth }: { dynamicWidth: number }) {
    return (
        <div className='min-h-[6px] h-1.5 rounded-xl bg-border-primary mb-7 md:mb-7.5'>
            <div className="block h-full bg-gradient-to-l from-p-list-box-btn to-primary rounded-xl" style={{ width: `${dynamicWidth}%` }} />
        </div>
    )
})

function PlayQuiz({ chapterData }: { chapterData: ChapterDataType }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [queryParams]=useSearchParams();
    const isPublished = queryParams.get('isPublished');
    const isViewAsLearner = queryParams.get('isViewAsLearner');
    const [finished, setFinished] = useState(false);
    const [updateUserCourseProgress, { loading }] = useMutation(UPDATE_USER_COURSE_PROGRESS);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const { nextEnable, chaptersCount, activeChapter, activeIndex, courseContent } = useSelector(((state: {
        coursesManagement: {
            selectedOptions: Array<{
                uuid: string; option: string; is_correct: boolean;
                order: number;
            }>, nextEnable: boolean, chaptersCount: number, activeChapter: ChapterDataType, activeIndex: number, courseContent: ChaptersProgressData[], finished: boolean
        }
    }) => state.coursesManagement));
    const totalQuestions = (chapterData?.chapter_quiz || []).map((quizMainData: { question: string, uuid: string }) => { return { question: quizMainData?.question, uuid: quizMainData?.uuid } });
    const totalQuestionCount = totalQuestions.flat().length;
    const [previous, setPrevious] = useState<boolean>(false);
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const userType = isViewAsLearner==='true'?USER_TYPE?.SUPER_ADMIN:userProfileData?.getProfile?.data?.user_type;

    useEffect(() => {
        return () => {
            dispatch(setSelectedOptions([]));
            dispatch(setNextEnable(false));
        }
    }, [])

    useEffect(()=>{
        if(userType===USER_TYPE?.SUPER_ADMIN){
            dispatch(setNextEnable(true));
        }
    },[userType])

    const handleNextQuestion = useCallback((questionData: { length: number }) => {
        if (currentQuestionIndex < questionData?.length - 1) {
            setPrevious(false);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            if (![USER_TYPE.SUPER_ADMIN].includes(userType)) {
                dispatch(setNextEnable(false))
            }
        }
    }, [currentQuestionIndex, chapterData]);

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
        if (!previous) {
            dispatch(setNextEnable(true));
        }
    };


    const dynamicWidth = ((currentQuestionIndex + 1) / totalQuestionCount) * 100

    const onFinishQuiz = useCallback(() => {
        if (!activeChapter?.user_course_progress?.[0]?.is_chapter_completed && userType !== USER_TYPE?.SUPER_ADMIN&&isPublished!=='false') {
            updateUserCourseProgress({
                variables: {
                    userCourseProgressData: {
                        course_id: id,
                        chapter_id: activeChapter?.uuid,
                        is_chapter_completed: true,
                        video_last_check_time: null,
                    }
                },
            }).then((res) => {
                dispatch(setCoursePercentage(+res?.data?.updateUserCourseProgress?.data?.percentage))
                if (+res?.data?.updateUserCourseProgress?.data?.percentage === 100) {
                    setFinished(true);
                }
                dispatch(setUpdate(true));
                if (chaptersCount !== activeIndex + 1) {
                    dispatch(setMoveNext(true));
                }
            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })
        }
        if (activeIndex+1 === chaptersCount && userType !== USER_TYPE?.SUPER_ADMIN) {
            setFinished(true)
        }
        if(activeIndex+1 === chaptersCount &&isViewAsLearner){
            setFinished(true);
        }

    }, [activeChapter, chaptersCount])

    const nextQuestionButtonCondition = () => {
        if ((courseContent?.[activeIndex]?.user_course_progress?.is_chapter_completed || isPublished==='false') && currentQuestionIndex + 1 !== chapterData?.chapter_quiz?.length) {
            return false;
        }
        else if (currentQuestionIndex + 1 !== chapterData?.chapter_quiz?.length && nextEnable) {
            return false;
        } else {
            return true;
        }
    }

    const onClose = () => {
        setFinished(false)
    }
    return (
        <>
            <div className='px-5 pt-5 md:h-full overflow-auto flex flex-col'>
                <div className='flex justify-between items-center'>
                    <h6 className='mb-5'>{`Question ${currentQuestionIndex + 1}/${totalQuestionCount}`}</h6>
                    {(chapterData?.chapter_quiz?.[currentQuestionIndex]?.type === 2) && <p className='text-right mb-5 text-light-grey italic inline-flex'>{'(There are  mutiple answers.)'}</p>}
                </div>
                <QuizProgressMemo dynamicWidth={dynamicWidth} />
                <div className='flex flex-col h-full'>
                    <p className='mb-5 text-base font-bold md:text-lg md:mb-7.5 break-words'>{chapterData?.chapter_quiz?.[currentQuestionIndex]?.question}</p>
                    <div className='md:max-w-[487px] mb-7'>
                        <QuizRadioGroup options={chapterData?.chapter_quiz?.[currentQuestionIndex]?.quiz_question} previous={previous} question={chapterData?.chapter_quiz?.[currentQuestionIndex]?.uuid} />
                    </div>
                    <div className='flex flex-wrap gap-3 mt-auto pb-5 justify-between'>

                        <button className='w-full btn md:w-[120px] btn-normal disabled:cursor-not-allowed' title='Previous' onClick={() => handlePreviousQuestion()} disabled={currentQuestionIndex === 0} >
                            Previous
                        </button>
                        <div className='flex gap-3' >
                            {currentQuestionIndex + 1 !== chapterData?.chapter_quiz?.length ? <button className='w-full btn md:w-[120px] btn-primary disabled:cursor-not-allowed' title='Next' onClick={() => handleNextQuestion({ length: chapterData?.chapter_quiz?.length })} disabled={nextQuestionButtonCondition() || loading} >
                                Next
                            </button> :
                                <button className={'w-full btn md:w-[120px] btn-primary disabled:cursor-not-allowed'} title='Finish' onClick={() => onFinishQuiz()} disabled={currentQuestionIndex + 1 !== chapterData?.chapter_quiz?.length || chapterData?.user_course_progress?.[0]?.is_chapter_completed || loading || !nextEnable} >
                                    {loading ? <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" /> : 'Finish'}
                                </button>}
                        </div>
                    </div>
                </div>

            </div>
            {finished && (
                <div id='defaultCongratsModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${finished ? '' : 'hidden'}`}>
                    <div id='defaultCongratsModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${finished ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
                        <div className='w-full max-w-[640px]  mx-5'>
                            <div className='relative bg-white rounded-xl md:p-7 p-5'>
                                <div className='flex items-center justify-end '>
                                    <Button onClick={onClose} label={''}>
                                        <Cross className='text-error' fontSize='14' />
                                    </Button>
                                </div>
                                <div className='max-w-[160px] mx-auto md:max-w-[210px] mb-2'>
                                    <img src={PassedAnimation} alt="Trophy Image" title='Trophy' />
                                </div>
                                <h1 className='mb-2 text-p-list-box-btn text-center'>{t('Congratulations!')}</h1>
                                <h6 className='mb-5 text-p-list-box-btn text-center'>{t('You have completed the course')}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default PlayQuiz
