import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button'
import { Certificate, Clock, Prerequisites } from '@components/icons/icons';
import { useSelector } from 'react-redux';
import { ROUTES, USER_TYPE, convertMinutesToHoursAndMinutes } from '@config/constant';
import { CourseClone, UserProfileType } from 'src/types/common';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { ASSIGN_LOGGED_IN_USER_COURSE } from '@framework/graphql/mutations/updateUserCourseProgress';
import { toast } from 'react-toastify';
import logo from '@assets/images/default-user-image.png';

function Instructor() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [queryParams] = useSearchParams();
    const [assignLoggedInUserCourse, loading] = useMutation(ASSIGN_LOGGED_IN_USER_COURSE);
    const uuid = queryParams.get('uuid');
    const isViewAsLearner = queryParams.get('isViewAsLearner');
    const { overview } = useSelector(((state: { coursesManagement: { overview: CourseClone } }) => state.coursesManagement));
    const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
    const userType = userProfileData?.getProfile?.data?.user_type ?? ''
    const onCourseStarted = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/${ROUTES.courseLearningProgressPage}/${uuid}?isPublished=${overview?.is_published}`)
    }, [overview])

    const onCourseViewAsLearner = useCallback(() => {
        navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/${ROUTES.courseLearningProgressPage}/${uuid}?isViewAsLearner=true`)
    }, [overview])

    const onCourseAssigned = useCallback(() => {
        assignLoggedInUserCourse({
            variables: {
                courseId: uuid
            },
        })
            .then((res) => {
                const data = res?.data
                toast.success(data?.assignLoggedInUserCourse?.message);
                navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/${ROUTES.courseLearningProgressPage}/${uuid}?isPublished=${overview?.is_published}`)
            })
            .catch((err) => {
                toast.error(err?.networkError?.result?.errors?.[0]?.message);
            })
    }, [overview])

    return (
        <div className='p-5 border border-solid border-border-primary rounded-xl w-full 2lg:w-[calc(40%-10px)] xl:w-[calc(34%-14px)] float-right mb-5 md:mb-7'>
            <h6 className='mb-2.5'>Instructor</h6>
            <div className='flex p-5 border border-solid border-border-light-blue-shade bg- rounded-xl gap-2.5 items-center mb-5 bg-light-blue1'>
                <div className='h-[60px] min-w-[60px] max-w-[60px] flex items-center justify-center rounded-full overflow-hidden border border-solid border-border-primary'>
                    <img src={(!overview?.instructor_profile || overview?.instructor_profile === '') ? logo : `${process.env.REACT_APP_IMAGE_BASE_URL}/${overview?.instructor_profile}`} alt='User Image' title='User Image' className='object-cover w-full h-full' />
                </div>
                <div>
                    <h6 className='mb-2 font-semibold'>{overview?.instructor_name}</h6>
                    <p className='text-sm'>{overview?.instructor_qualification}</p>
                </div>
            </div>
            <div className='mb-4'>
                <h6 className='mb-3'>{t('This Course included')}</h6>
                <ul>
                    {overview?.highlights?.map((data: { uuid: string; name: string }) => (
                        <li className='before:content-[""] before:min-w-[8px] before:h-2 before:md:min-w-[12px] before:md:h-3 before:bg-primary flex items-center gap-2.5 before:inline-block before:rounded-full mb-3 break-all' key={data?.uuid}>{data.name}</li>
                    ))}
                </ul>
            </div>
            {
                (userType !== USER_TYPE.SUPER_ADMIN&&(isViewAsLearner||overview?.is_draft||(!overview?.is_published&&!overview?.is_draft)))
                &&
                <Button className='w-full text-white btn btn-normal bg-p-list-box-btn md:h-[50px] whitespace-nowrap' label={t('View Course')} type='button' onClick={() => onCourseViewAsLearner()} title={`${t('View Course')}`} />
            }

            {
                userType === USER_TYPE.SUPER_ADMIN && !isViewAsLearner
                &&
                <Button className='w-full text-white btn btn-normal bg-p-list-box-btn md:h-[50px] whitespace-nowrap' label={t('View Course')} type='button' onClick={() => onCourseStarted()} title={`${t('View Course')}`} />
            }
             {
                userType === USER_TYPE.SUPER_ADMIN && isViewAsLearner
                &&
                <Button className='w-full text-white btn btn-normal bg-p-list-box-btn md:h-[50px] whitespace-nowrap' label={t('View Course')} type='button' onClick={() => onCourseViewAsLearner()} title={`${t('View Course')}`} />
            }
            {
                (userType !== USER_TYPE.SUPER_ADMIN && overview?.is_assign &&overview?.is_published&&!isViewAsLearner)
                &&
                <Button className='w-full text-white btn btn-normal bg-p-list-box-btn md:h-[50px] whitespace-nowrap' label={t('View Course')} type='button' onClick={() => onCourseStarted()} title={`${t('View Course')}`} />
            }
            
            {
                (!overview?.is_assign && userType !== USER_TYPE.SUPER_ADMIN && !isViewAsLearner&&overview?.is_published)
                &&
                <Button className='w-full text-white btn btn-normal bg-p-list-box-btn md:h-[50px] whitespace-nowrap' label={t('View Course')} type='button' onClick={() => onCourseAssigned()} disabled={loading?.loading} title={`${t('View Course')}`} />
            }

            <div className='mt-2'>
                <ul>
                    <li className='py-3 font-semibold leading-6 border-b border-solid border-border-primary last:border-none flex gap-2.5 items-center last:pb-0'><span className='text-lg'><Clock fontSize='18' className='fill-orange min-w-[18px] ' /></span><span className='break-all'>{`Course Duration: ${convertMinutesToHoursAndMinutes(overview?.estimate_time ?? '')?.hours} h ${convertMinutesToHoursAndMinutes(overview?.estimate_time ?? '')?.minutes} m`}</span></li>
                    {overview?.is_certification && <li className='py-3 font-semibold leading-6 border-b border-solid border-border-primary last:border-none flex gap-2.5 items-center last:pb-0'><span className='text-lg'><Certificate fontSize='18' className='fill-orange min-w-[18px]' /></span><span className='break-all'>Assured Certificate</span></li>}
                    {overview?.prerequisite && <li className='py-3 font-semibold leading-6 border-b border-solid border-border-primary last:border-none flex gap-2.5 items-center last:pb-0'><span className='text-lg'><Prerequisites fontSize='18' className='fill-orange min-w-[18px]' /></span><span className='break-all'>No Prerequisites</span></li>}
                </ul>
            </div>
        </div>
    )
}

export default Instructor
