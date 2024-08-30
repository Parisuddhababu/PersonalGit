import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CourseContent, { ChaptersProgressData } from '@components/whatIsOrganicWaste/courseLearningProgress/courseContent';
import { useMutation } from '@apollo/client';
import { setActiveIndex, setCoursePercentage, setMoveNext, setUpdate } from 'src/redux/courses-management-slice';
import UpdatedHeader from '@components/header/updatedHeader';
import { UPDATE_USER_COURSE_PROGRESS } from '@framework/graphql/mutations/updateUserCourseProgress';
import 'react-circular-progressbar/dist/styles.css';
import { ChapterDataType, UserProfileType } from 'src/types/common';
import { CHAPTER_TYPES_PROGRESS, NumberFixedDigit, USER_TYPE, getSignUrl } from '@config/constant';
import PlayQuiz from '@views/quiz';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';
import { toast } from 'react-toastify';
import Button from '@components/button/button';
import PassedAnimation from '@assets/images/trophy-animation.gif';
import { useTranslation } from 'react-i18next';
import YoutubePlayerCompoent from '@components/quiz/youtubePlayer';
import { Cross, ZoomIn, ZoomOut } from '@components/icons/icons';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

function CourseLearningProgressPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const [scale, setScale] = useState(1);
    const [queryParams] = useSearchParams();
    const isPublished = queryParams.get('isPublished');
    const isViewAsLearner = queryParams.get('isViewAsLearner');
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [updateUserCourseProgress, { loading: progressLoader }] = useMutation(UPDATE_USER_COURSE_PROGRESS);
    const [finished, setFinished] = useState(false);
    const { videoTime, activeChapter, percentage, chaptersCount, activeIndex, courseContent, moveNext } = useSelector(((state: { coursesManagement: { videoTime: number, activeChapter: ChapterDataType, percentage: number, chaptersCount: number, activeIndex: number, play: boolean, courseContent: ChaptersProgressData[], finished: boolean, moveNext: boolean } }) => state.coursesManagement));
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const userType = isViewAsLearner === 'true' ? USER_TYPE?.SUPER_ADMIN : userProfileData?.getProfile?.data?.user_type;
    const [numPages, setNumPages] = useState<number | null>(null);
    const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const updatedUserProgress = (chapterCompleted: boolean, videoTimeData: number | null) => {
        if (userType !== USER_TYPE?.SUPER_ADMIN && isPublished !== 'false' && !courseContent?.[activeIndex]?.user_course_progress?.is_chapter_completed) {
            updateUserCourseProgress({
                variables: {
                    userCourseProgressData: {
                        course_id: id,
                        chapter_id: courseContent?.[activeIndex]?.uuid,
                        is_chapter_completed: chapterCompleted,
                        video_last_check_time: videoTimeData,
                    }
                },
            }).then((res) => {
                dispatch(setCoursePercentage(+res?.data?.updateUserCourseProgress?.data?.percentage))
                dispatch(setUpdate(true));
                if (chaptersCount === activeIndex + 1) {
                    setFinished(true);
                } else {
                    dispatch(setActiveIndex(activeIndex + 1));
                }

            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })
        } else if (activeIndex + 1 !== chaptersCount) {
            dispatch(setActiveIndex(activeIndex + 1));
        }

    }

    const headerActionConst = () => {
        if (![USER_TYPE.SUPER_ADMIN].includes(userType)) {
            return (
                <div className='flex items-center'>
                    <div className='w-[50px] md:w-[55px] mr-3 [&_.CircularProgressbar_.CircularProgressbar-text]:text-xl-30 [&_.CircularProgressbar_.CircularProgressbar-text]:font-bold [&_.CircularProgressbar_.CircularProgressbar-text]:fill-black [&_.CircularProgressbar_.CircularProgressbar-path]:stroke-orange'>
                        <CircularProgressbar value={percentage} text={`${NumberFixedDigit(percentage)}%`} />
                    </div>
                    <span className='whitespace-nowrap'>Your Progress</span>
                </div>
            )
        }
    }

    const onPrevious = useCallback(() => {
        if (activeIndex !== 0) {
            dispatch(setActiveIndex(activeIndex - 1))
        }
    }, [activeIndex])

    const onNextActive = useCallback(() => {
        if (!progressLoader && chaptersCount !== 0) {
            if (![USER_TYPE.SUPER_ADMIN].includes(userType) && isPublished !== 'false') {
                dispatch(setMoveNext(true))
            }
            if (videoTime && [1].includes(activeChapter?.type)) {
                updatedUserProgress(true, videoTime);
            } else {
                updatedUserProgress(true, null);
            }
        }
    }, [activeChapter?.type, activeIndex, isPublished, progressLoader])

    const [file, setFile] = useState('');
    const GetFile = async (id: string) => {
        setLoading(true)
        const url = await getSignUrl(id);
        setFile(url);
        setLoading(false);
    }

    useEffect(() => {
        if (activeChapter?.chapter_content?.pdf_url) {
            GetFile(activeChapter?.chapter_content?.pdf_url);
        }
    }, [activeChapter])


    const onFinishChapter = () => {
        if (percentage !== 100 && ![USER_TYPE.SUPER_ADMIN].includes(userType)) {
            updatedUserProgress(true, null);
        }
        if (percentage === 100 || [USER_TYPE.SUPER_ADMIN].includes(userType)) {
            setFinished(true);
        }
    }
    const onClose = () => {
        setFinished(false)
    }

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setCurrentPageNumber(1);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (containerRef.current) {
                const container = containerRef.current;
                const pageElements = container.querySelectorAll<HTMLDivElement>('.pdf-page');
                let current = 1;

                for (let i = 0; i < pageElements.length; i++) {
                    const pageElement = pageElements[i];
                    const { top, bottom } = pageElement.getBoundingClientRect();

                    if (top < window.innerHeight && bottom >= 0) {
                        current = i + 1;
                        break;
                    }
                }
                setCurrentPageNumber(current);
            }
        };

        const container = containerRef.current;
        container?.addEventListener('scroll', handleScroll);

        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, [numPages]);

    useEffect(() => {
        if (activeChapter?.type === CHAPTER_TYPES_PROGRESS?.pdf && numPages !== null && currentPageNumber === numPages && activeIndex + 1 !== chaptersCount) {
            dispatch(setMoveNext(false))
        }
    }, [currentPageNumber, activeChapter, numPages])

    useEffect(() => {
        if (activeChapter?.type === CHAPTER_TYPES_PROGRESS?.text && !courseContent?.[activeIndex]?.user_course_progress?.is_chapter_completed) {
            dispatch(setMoveNext(false))
        }
    }, [activeChapter, courseContent])

    useEffect(() => {
        if (activeChapter?.type === CHAPTER_TYPES_PROGRESS?.youtube && !courseContent?.[activeIndex]?.user_course_progress?.is_chapter_completed && ![USER_TYPE?.SUPER_ADMIN].includes(userType) && moveNext) {
            dispatch(setMoveNext(true))
        } else {
            dispatch(setMoveNext(false))
        }
    }, [activeChapter, courseContent])

    useEffect(() => {
        if (courseContent?.[activeIndex]?.user_course_progress?.is_chapter_completed) {
            dispatch(setMoveNext(false))
        }
    }, [courseContent, activeIndex])

    useEffect(() => {
        if (([USER_TYPE.SUPER_ADMIN].includes(userType) || isPublished === 'false') && activeIndex + 1 !== chaptersCount) {
            dispatch(setMoveNext(false))
        }
    }, [userType, isPublished])
    const disableNext = () => {
        const disableNext = [CHAPTER_TYPES_PROGRESS?.quiz].includes(activeChapter?.type) && ![USER_TYPE.SUPER_ADMIN].includes(userType) && !activeChapter?.user_course_progress?.[0]?.is_chapter_completed;
        return disableNext;
    }
    const returnTrueValue = (condtion: boolean, success: string, error: string) => {
        return condtion ? success : error;
    }
    const youtubeCondition = [CHAPTER_TYPES_PROGRESS?.youtube].includes(activeChapter?.type) && moveNext && !courseContent?.[activeIndex]?.user_course_progress?.is_chapter_completed;
    const pdfCondition = [CHAPTER_TYPES_PROGRESS.pdf].includes(activeChapter?.type) && currentPageNumber !== numPages && !courseContent?.[activeIndex]?.user_course_progress?.is_chapter_completed;
    const zoomIn = () => setScale(prevScale => prevScale + 0.1);
    const zoomOut = () => setScale(prevScale => Math.max(prevScale - 0.1, 0.1));

    return (
        <>
            <UpdatedHeader headerTitle='Course Learning Progress Page' headerActionConst={headerActionConst} />

            <div className='flex flex-wrap justify-between 2lg:gap-2.5 2xl:gap-[0.938rem] flex-row-reverse'>
                <div className='w-full 2lg:w-[calc(40%-10px)] 2xl:w-[calc(33%-15px)] rounded-xl overflow-hidden mb-7'>
                    <CourseContent setLoading={setLoading} />
                </div>
                <div className='relative w-full 2lg:w-[calc(60%-10px)] 2xl:w-[calc(67%-15px)] min-h-340px'>
                    {(loading || progressLoader) ? <LoadingIndicator /> :
                        <>
                            {activeChapter?.type === undefined && <div className='relative overflow-auto border border-solid border-border-primary rounded-xl mb-9 aspect-video'>
                                <div className='flex w-full h-full justify-center items-center'>
                                    <div>{t('No Data Found')}</div>
                                </div>
                            </div>}
                            {[CHAPTER_TYPES_PROGRESS?.youtube].includes(activeChapter?.type) && <div className='relative overflow-auto border border-solid border-border-primary rounded-xl mb-9 aspect-video'>
                                <YoutubePlayerCompoent />
                            </div>}
                            {[CHAPTER_TYPES_PROGRESS?.quiz].includes(activeChapter?.type) && <div className='relative overflow-auto border border-solid border-border-primary rounded-xl mb-9 aspect-video'>
                                <PlayQuiz chapterData={activeChapter} />
                            </div>}
                            {activeChapter?.type === CHAPTER_TYPES_PROGRESS?.text && <div className='relative overflow-auto border border-solid border-border-primary rounded-xl mb-9 aspect-video'>
                                <div className='text-left break-all p-5' dangerouslySetInnerHTML={{ __html: activeChapter?.chapter_content?.description }} ></div>
                            </div>}

                            {activeChapter?.type === CHAPTER_TYPES_PROGRESS?.pdf &&
                                <div className='relative'>
                                    <div className="btn-group mb-4 left-0 p-1 z-10 m-4">
                                        <Button type='button' className='btn-normal btn-primary font-bold' onClick={zoomOut} label={''}><ZoomOut className='text-white fill-white' fontSize='16'/></Button>
                                        <Button type='button' className='btn-normal btn-secondary hover:fill-white' onClick={zoomIn} label={''}><ZoomIn className='text-white hover:fill-white' fontSize='16' /></Button>
                                    </div>

                                    <div ref={containerRef} className='relative overflow-auto border border-solid border-border-primary rounded-xl mb-9 aspect-video flex justify-center'>
                                        {file ? <Document file={file} onLoadSuccess={onDocumentLoadSuccess} >
                                            {Array.from(new Array(numPages), (el, index) => (
                                                <div className="pdf-page" key={`page_${index + 1}`}>
                                                    <Page pageNumber={index + 1} scale={scale} />
                                                </div>
                                            ))}
                                        </Document>
                                            : (
                                                <p>Loading PDF...</p>
                                            )}
                                    </div>
                                </div>
                            }

                        </>}
                    <div className="flex justify-between w-full gap-3 md:w-auto md:gap-5">
                        <button className='w-full btn md:w-[120px] btn-normal disabled:cursor-not-allowed' title='Previous' onClick={onPrevious} disabled={activeIndex === 0} >
                            Previous
                        </button>
                        <div className='flex gap-3'>
                            {activeIndex + 1 !== chaptersCount ? <button className='w-full btn md:w-[120px] btn-primary disabled:cursor-not-allowed' title='Next'
                                onClick={onNextActive}
                                disabled={progressLoader || loading || moveNext || disableNext()} >
                                {progressLoader ? <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" /> : 'Next'}
                            </button>
                                : <button className={`w-full btn md:w-[120px] btn-primary disabled:cursor-not-allowed ${[CHAPTER_TYPES_PROGRESS?.quiz].includes(activeChapter?.type) ? '!hidden' : ''}`} title='Finish' onClick={() => onFinishChapter()} disabled={activeIndex + 1 !== chaptersCount || progressLoader || loading || (pdfCondition) || (youtubeCondition)} >
                                    {progressLoader ? <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" /> : 'Finish'}
                                </button>}
                        </div>
                    </div>
                </div>
                {finished && (
                    <div id='defaultModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${returnTrueValue(finished, '', 'hidden')}`}>
                        <div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${returnTrueValue(finished, '', 'opacity-0 transform -translate-y-full scale-150 ')} transition-all duration-300 `}>
                            <div className='w-full mx-5 max-w-[640px]'>
                                <div className='relative p-5 bg-white rounded-xl md:p-7'>
                                    <div className='flex items-center justify-end '>
                                        <Button onClick={onClose} label={''}>
                                            <Cross className='text-error' fontSize='14' />
                                        </Button>
                                    </div>
                                    <div className='max-w-[160px] md:max-w-[210px] mb-2 mx-auto'>
                                        <img src={PassedAnimation} alt="Trophy Image" title='Trophy' />
                                    </div>
                                    <h1 className='mb-2 text-center text-p-list-box-btn'>{t('Congratulations!')}</h1>
                                    <h6 className='mb-5 text-center text-p-list-box-btn'>{t('You have completed the course')}</h6>
                                    <div className='w-full text-center'>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div></>
    )
}

export default CourseLearningProgressPage
