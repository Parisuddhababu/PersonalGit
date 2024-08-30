import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { API_DOWNLOAD_CERTIFICATE_END_POINT, CHAPTER_TYPES_BELONG, USER_TYPE } from '@config/constant';
import { AngleRightIcon } from '@components/icons/icons'
import { setActiveChapter, setCourseContent, setIsShowDownloadCertificate, setCoursePercentage, setChaptersCount, setUpdate, setActiveIndex } from 'src/redux/courses-management-slice';
import { useQuery } from '@apollo/client';
import { FETCH_COURSE_PROGRESS_CHAPTERS } from '@framework/graphql/mutations/updateCourses';
import { toast } from 'react-toastify';
import axios from 'axios';
import DecryptionFunction from 'src/services/decryption';
import { Loader } from '@components/icons';
import { GET_CHAPTERS_BY_COURSE_ID } from '@framework/graphql/queries/courseprogress';
import { UserProfileType } from 'src/types/common';
import { ProgressSpinner } from 'primereact/progressspinner';

export type ChaptersProgressArrayType = {
    percentage: number;
    is_show_certification_tab: boolean;
    chaptersData: {
        uuid: string;
        title: string;
        type: number;
        order: number;
        user_course_progress: {
            video_last_check_time: number;
            is_chapter_completed: boolean;
        }
    }
}

export type ChaptersProgressData = {
    uuid: string;
    title: string;
    type: number;
    order: number;
    user_course_progress: {
        video_last_check_time: number;
        is_chapter_completed: boolean;
    }
}

function CourseContent({ setLoading }: { setLoading: React.Dispatch<React.SetStateAction<boolean>>, }) {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { id } = useParams();
    const [queryParams]=useSearchParams();
    const isViewAsLearner = queryParams.get('isViewAsLearner');
    const isPublished = queryParams.get('isPublished');
    const encryptedToken = localStorage.getItem('authToken') as string;
    const token = encryptedToken && DecryptionFunction(encryptedToken);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const { courseContent, update, activeIndex } = useSelector(((state: { coursesManagement: { courseContent: ChaptersProgressData[], isShowDownloadCertificate: boolean, update: boolean, activeIndex: number } }) => state.coursesManagement));
    const { data: chaptersArray, loading: chapterLoader, refetch: fetchProgress } = useQuery(FETCH_COURSE_PROGRESS_CHAPTERS, {
        variables: {
            view_as_learner:isViewAsLearner?true:false,
            courseId: id
        },
        fetchPolicy: 'network-only',
        skip: !id
    });
    const { data: getChapterDetails, loading: chaptersLoader, refetch } = useQuery(GET_CHAPTERS_BY_COURSE_ID, {
        variables: {
            courseId: id,
            chapterId: chaptersArray?.getUserCourseProgress?.data?.chaptersData?.[activeIndex]?.uuid
        },
        skip: (!id || !chaptersArray?.getUserCourseProgress?.data?.chaptersData?.[activeIndex]?.uuid),
        fetchPolicy: 'network-only'
    });
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const userType = userProfileData?.getProfile?.data?.user_type;

    useEffect(() => {
        if (update) {
            fetchProgress().catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            });
            dispatch(setUpdate(false));
        }
    }, [update])

    useEffect(() => {
        if (chaptersArray?.getUserCourseProgress?.data?.chaptersData.length && id) {
            dispatch(setCourseContent(chaptersArray?.getUserCourseProgress?.data?.chaptersData))
            dispatch(setIsShowDownloadCertificate(chaptersArray?.getUserCourseProgress?.data?.is_show_certification_tab))
            dispatch(setCoursePercentage(+chaptersArray?.getUserCourseProgress?.data?.percentage))
            dispatch(setChaptersCount(chaptersArray?.getUserCourseProgress?.data?.chaptersData?.length))
            const index = chaptersArray?.getUserCourseProgress?.data?.chaptersData?.findIndex((item: { user_course_progress: { is_chapter_completed: boolean } }) => !item.user_course_progress || !item?.user_course_progress?.is_chapter_completed);
            if (index !== -1) {
                dispatch(setActiveIndex(index))
            }
        }
    }, [chaptersArray, id])

    useEffect(() => {
        setLoading(chaptersLoader)
    }, [chaptersLoader])

    useEffect(() => {
        if (getChapterDetails?.getChapterByCourseId?.data) {
            dispatch(setActiveChapter(getChapterDetails?.getChapterByCourseId?.data))
        }
    }, [getChapterDetails])

    const onDownloadCertificate = useCallback(async () => {
        setLoadingData(true);
        await axios.get(`${API_DOWNLOAD_CERTIFICATE_END_POINT}/${id ?? ''}`, { headers: { authorization: token ? `Bearer ${token}` : '' } })
            .then(async (response) => {
                const signUrlRespones = await fetch(response.data.url);
                if (!signUrlRespones.ok) {
                    throw new Error('Network Respones was not ok');
                }
                const blob = await signUrlRespones.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'certificate.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
                setLoadingData(false);
                toast.success(response?.data?.message);
            })
            .catch((error) => {
                setLoadingData(false);
                toast.error(error?.message);
            });
    }, []);

    const onSelectCourse = (activeChapterIndex: number) => {
        dispatch(setActiveIndex(activeChapterIndex));
        refetch({
            courseId: id,
            chapterId: courseContent?.[activeChapterIndex]?.uuid
        }).catch((err) => {
            toast.error(err?.networkError?.result?.errors[0]?.message);
        })
    }

    return (
        <>
            {chapterLoader && <Loader />}
            <div className='border border-solid border-border-primary rounded-xl'>
                <h6 className='px-5 pt-5 pb-1'>{t('Course Content')}</h6>
                <div className='max-h-[550px] overflow-auto'>
                    <div>
                        {chaptersArray?.getUserCourseProgress?.data?.chaptersData?.map((data: ChaptersProgressData, index: number) => {
                            return (<div key={data?.uuid} className='border-b border-solid border-border-primary last:border-none'>
                                <div className={`flex flex-wrap flex-col items-start justify-start [&>label]:mb-1 border-b border-solid border-border-primary last:border-0 px-5 py-4 ${data?.user_course_progress?.is_chapter_completed ? 'bg-p-list-box-btn-bg' : ''} ${!data?.user_course_progress?.is_chapter_completed && activeIndex === index ? 'bg-light-gray' : ''} `}>
                                    <button
                                        className='flex w-full items-center text-base font-semibold cursor-pointer mb-1'
                                        title='Course'
                                        onClick={() => onSelectCourse(index)}
                                        disabled={userType !== USER_TYPE?.SUPER_ADMIN&&isPublished !=='false' ? !data?.user_course_progress?.is_chapter_completed : false}
                                    >
                                        <div className='flex items-center gap-2.5 [&>input[type=checkbox]]:rounded-full [&>input[type=checkbox]]:h-3 [&>input[type=checkbox]]:min-w-[12px] [&>input[type=checkbox]]:w-3 [&>input[type=checkbox]:checked]:bg-success [&>input[type=checkbox]:checked]:border-success [&>input[type=checkbox]:checked]:after:content-none'>
                                            <input type="checkbox" checked={data?.user_course_progress?.is_chapter_completed} readOnly />
                                        </div>
                                        <span className='ml-2 text-base font-bold break-all capitalize'>
                                            {`Chapter ${index+1}`}
                                        </span>
                                    </button>
                                    <h6 className='mb-2.5 text-lg line-clamp-2 capitalize'> {data?.title}</h6>
                                    <p className='text-base text-light-grey'>{CHAPTER_TYPES_BELONG?.[`${data?.type}`]}</p>
                                </div>
                            </div>)
                        })}
                        {!chaptersArray?.getUserCourseProgress?.data?.chaptersData?.length &&
                            <div className='border-b border-solid border-border-primary last:border-none'>
                                <div className={'flex flex-wrap flex-col items-start justify-start [&>label]:mb-1 border-b border-solid border-border-primary last:border-0 px-5 py-4  '}>
                                    <div className='flex justify-center'>
                                        <div>{t('No Chapters Found')}</div>
                                    </div>
                                </div>
                            </div>}
                    </div>
                </div>
                <div>
                    {chaptersArray?.getUserCourseProgress?.data?.is_show_certification_tab && <div className='border-t border-solid border-border-primary'>
                        <button onClick={onDownloadCertificate} className='flex items-center justify-between px-5 py-5 font-semibold text-primary' disabled={loadingData} title=''>
                        {loadingData ? <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" fill="var(--surface-ground)" animationDuration=".5s" /> : t('Claim Certificate')} 
                            <span className='text-xs ml-2'><AngleRightIcon /></span>
                        </button>
                    </div>}
                </div>
            </div>
        </>
    )
}

export default CourseContent
