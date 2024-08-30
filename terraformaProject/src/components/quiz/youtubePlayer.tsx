import { useMutation } from '@apollo/client';
import Button from '@components/button/button';
import { Cross, PlayIcon3 } from '@components/icons/icons';
import { UPDATE_USER_COURSE_PROGRESS } from '@framework/graphql/mutations/updateUserCourseProgress';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import ReactPlayer from 'react-player'
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {  setCoursePercentage, setMoveNext, setPlay, setUpdate, setVideoTime } from 'src/redux/courses-management-slice';
import { ChapterDataType, UserProfileType } from 'src/types/common';
import PassedAnimation from '@assets/images/trophy-animation.gif';
import { USER_TYPE, VIDEO_API_CALL_TIME } from '@config/constant';
import { useTranslation } from 'react-i18next';
import  { ChaptersProgressData } from '@components/whatIsOrganicWaste/courseLearningProgress/courseContent';


const YoutubePlayerCompoent = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const [queryParams] = useSearchParams();
    const isViewAsLearner = queryParams.get('isViewAsLearner');
    const dispatch = useDispatch();
    const [finished, setFinished] = useState(false);
    const [updateUserCourseProgress] = useMutation(UPDATE_USER_COURSE_PROGRESS);
    const { videoTime, activeChapter, play, activeIndex, courseContent } = useSelector(((state: { coursesManagement: { videoTime: number, activeChapter: ChapterDataType, percentage: number, chaptersCount: number, activeIndex: number, play: boolean,courseContent:ChaptersProgressData[] } }) => state.coursesManagement));
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const userType = isViewAsLearner==='true'?USER_TYPE?.SUPER_ADMIN:userProfileData?.getProfile?.data?.user_type;

    const handleVideoStart = useCallback(() => {
        dispatch(setPlay(true))
    }, []);

    const handleVideoProgress = (progress: { playedSeconds: number }) => {
        if (Math.ceil(progress?.playedSeconds) % VIDEO_API_CALL_TIME === 0) {
            updatedUserProgress(false, Math.ceil(progress?.playedSeconds));
        }
        dispatch(setVideoTime(Math.ceil(progress?.playedSeconds)));
    }

    const handleVideoEnded = () => {
        dispatch(setMoveNext(false));
    };

    const handleVideoPause = useCallback(() => {
        updatedUserProgress(false, videoTime)
    }, [videoTime]);

    const updatedUserProgress = (chapterCompleted: boolean, videoTimeData: number | null) => {
        if (!activeChapter?.user_course_progress?.[0]?.is_chapter_completed&&userType !==USER_TYPE?.SUPER_ADMIN) {
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
                if (+res?.data?.updateUserCourseProgress?.data?.percentage === 100) {
                    setFinished(true);
                }
                if(chapterCompleted){
                    dispatch(setUpdate(true));
                }
                
            }).catch((err) => {
                toast.error(err?.networkError?.result?.errors[0]?.message);
            })
        }

    }
    const onClose = () => {
        setFinished(false)
    }
    return <>
            {activeChapter?.chapter_content?.youtube_url !== null && activeChapter?.chapter_content?.youtube_url !== undefined ? <ReactPlayer
                url={`${activeChapter?.chapter_content?.youtube_url}&start=${activeChapter?.user_course_progress?.[0]?.video_last_check_time ?? 0}&rel=1`}
                width='100%'
                height='100%'
                playing={play}
                controls
                onStart={handleVideoStart}
                onProgress={handleVideoProgress}
                onEnded={handleVideoEnded}
                onPause={handleVideoPause}
                config={{
                    youtube:{playerVars: {
                        controls:1,
                        modestbranding: 1, // Remove YouTube logo
                        rel: 0, // Do not show related videos at the end
                        showinfo: 0, // Hide video title and uploader
                    }}
                }}
                onContextMenu={(e: SyntheticEvent) => e.preventDefault()}
                light={<img src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${activeChapter?.chapter_content?.image}`} alt="Organic Waste" title="" className='object-cover w-full h-full' />} // Use a custom play icon component
                playIcon={<span className='absolute text-5xl bg-white rounded-full w-10 h-10 lg:w-[60px] lg:h-[60px]  flex justify-center items-center'><PlayIcon3 /></span>} // Define a custom play icon
            /> : <ReactPlayer
                url={`${activeChapter?.chapter_content?.youtube_url}&start=${activeChapter?.user_course_progress?.[0]?.video_last_check_time ?? 0}&rel=1`}
                width='100%'
                height='100%'
                playing={play}
                controls
                config={{
                    youtube:{playerVars: {
                        modestbranding: 1, // Remove YouTube logo
                        rel: 0, // Do not show related videos at the end
                        showinfo: 0,
                    }}
                }}
                onContextMenu={(e: SyntheticEvent) => e.preventDefault()}
                light={<img src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${activeChapter?.chapter_content?.image}`} alt="Organic Waste" title="" className='object-cover w-full h-full' />} // Use a custom play icon component
                playIcon={<span className='absolute text-5xl bg-white rounded-full w-10 h-10 lg:w-[60px] lg:h-[60px]  flex justify-center items-center'><PlayIcon3 /></span>} // Define a custom play icon
            />}
            {finished && (
                    <div id='defaultYoutubeModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`fixed top-0 left-0 right-0 z-50 h-full bg-modal modal ${finished ? '' : 'hidden'}`}>
                        <div id='defaultYoutubeModal' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${finished ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-all duration-300 `}>
                            <div className='w-full mx-5 max-w-[640px]'>
                                <div className='p-5 bg-white rounded-xl md:p-7 relative'>
                                    <div className='flex items-center justify-end '>
                                        <Button onClick={onClose} label={''}>
                                            <Cross className='text-error' fontSize='14' />
                                        </Button>
                                    </div>
                                    <div className='max-w-[160px] md:max-w-[210px] mx-auto mb-2'>
                                        <img src={PassedAnimation} alt="Trophy Course Image" title='Trophy' />
                                    </div>
                                    <h1 className='text-center text-p-list-box-btn mb-2'>{t('Congratulations!')}</h1>
                                    <h6 className='text-center text-p-list-box-btn mb-5'>{t('You have completed the course')}</h6>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
        </>;

};


export default YoutubePlayerCompoent;