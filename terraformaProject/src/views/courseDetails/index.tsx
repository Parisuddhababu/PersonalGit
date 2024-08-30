import React, { useEffect } from 'react'
import Contents from '@components/whatIsOrganicWaste/contents'
import Faq from '@components/whatIsOrganicWaste/faq'
import Instructor from '@components/whatIsOrganicWaste/instructor'
import Overview from '@components/whatIsOrganicWaste/overview'
import Tabs from '@components/whatIsOrganicWaste/tabs'
import { Tab } from 'src/types/component'
import { Calendar, Clock, Group,} from '@components/icons/icons';
import { useQuery } from '@apollo/client'
import {  GET_COURSES_DETAILS_BY_ID_NEW } from '@framework/graphql/queries/getCourses'
import {  useNavigate, useSearchParams } from 'react-router-dom';
import { setActive, setCousreOverView} from 'src/redux/courses-management-slice'
import { useDispatch, useSelector } from 'react-redux'
import {  FormattedDate, ROUTES, USER_TYPE, convertMinutesToHoursAndMinutes } from '@config/constant'
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator'
import UpdatedHeader from '@components/header/updatedHeader'
import Button from '@components/button/button'
import { useTranslation } from 'react-i18next'
import { UserProfileType } from 'src/types/common'
import logo from '@assets/images/login-img.jpg';

function CourseDetailsPage() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [queryParams]=useSearchParams();
	const uuid = queryParams.get('uuid');
	const step= queryParams.get('step');
	const isViewAsLearner= queryParams.get('isViewAsLearner');
	const {data:getCourseByIdNew,loading:getLoding}= useQuery(GET_COURSES_DETAILS_BY_ID_NEW,{variables:{
		courseId:uuid
	},fetchPolicy:'network-only'})
	const tabs: Tab[] = [
		{ label: 'Overview', content: <Overview coursePage={false} />, id: 1 },
		{ label: 'Contents', content: <Contents />, id: 2 },
		{ label: 'FAQ', content: <Faq />, id: 3 },
	];

	useEffect(()=>{
		dispatch(setCousreOverView(getCourseByIdNew?.getCourseDetailsById?.data))
	},[getCourseByIdNew?.getCourseDetailsById])

	const onAssignedCourse = () => {
		navigate(`/${ROUTES.app}/${ROUTES.learnersManagement}/?course_uuid=${uuid}`);
	}
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
	const userType= userProfileData?.getProfile?.data?.user_type;
	const isAdmin =userProfileData?.getProfile?.data?.is_course_admin;
	const headerActionConst = () => {
		if(isViewAsLearner==='true'){
			return (
				<>
				<Button
						className='btn btn-secondary btn-normal whitespace-nowrap w-[160px]'
						type='button'
						label={t('Back')}
						onClick={() => {
							navigate(`/${ROUTES?.app}/${ROUTES.educationAndEngagement}/?uuid=${uuid}&isViewAsLearner=true`)
							if(step){
								dispatch(setActive(+step));
							}
						}}
						title={`${t('Back')}`} 
					/>
				</>
			)
		}
		if(((![USER_TYPE?.SUBSCRIBER_TENANT,USER_TYPE?.SUBSCRIBER_CONTRACTOR].includes(userType)&&isAdmin&&getCourseByIdNew?.getCourseDetailsById?.data?.is_published)||([USER_TYPE?.SUBSCRIBER_ADMIN].includes(userType)&&getCourseByIdNew?.getCourseDetailsById?.data?.is_published))){

			return (
				<>
					 <Button
						className='btn btn-secondary btn-normal whitespace-nowrap w-[160px]'
						type='button'
						label={t('Assign Course')}
						onClick={() => onAssignedCourse()}
						title={`${t('Assign Course')}`} 
					/>
				</>
			)
		}
		
	}


	return (
		<>
			<UpdatedHeader headerTitle='Course Details' headerActionConst={headerActionConst} />
			<div>
					{getLoding ? <LoadingIndicator /> :
					<>
						<div className='relative block rounded-xl overflow-hidden mb-5 md:mb-7'>
							<div className='w-full h-full'>
								<img src={(!getCourseByIdNew?.getCourseDetailsById?.data?.banner_image || getCourseByIdNew?.getCourseDetailsById?.data?.banner_image === '') ? logo :`${process.env.REACT_APP_IMAGE_BASE_URL}/${getCourseByIdNew?.getCourseDetailsById?.data?.banner_image}`} alt="Organic Waste" className='object-cover w-full h-full' />
							</div>
							<div className="absolute bottom-0 left-0 flex flex-wrap items-end justify-between w-full gap-4 p-5">
								<div className="flex flex-col gap-2">
									{getCourseByIdNew?.getCourseDetailsById?.data?.category?.title &&<button className='bg-p-list-box-btn font-bold w-fit text-white px-2.5 py-2.5 rounded-xl text-sm min-w-[80px]' title=''>{getCourseByIdNew?.getCourseDetailsById?.data?.category?.title}</button>}
									<p className='mb-2 text-2xl font-bold text-white md:text-3xl'>{getCourseByIdNew?.getCourseDetailsById?.data?.title ?? ''}</p>
									<div className='flex flex-wrap gap-3 xl:gap-5'>
										<div className="flex items-center justify-center gap-1">
											<span className='text-lg'><Clock className='fill-white/70' /></span>
											<span className="text-xs text-white">{`${convertMinutesToHoursAndMinutes(getCourseByIdNew?.getCourseDetailsById?.data?.estimate_time).hours} h ${convertMinutesToHoursAndMinutes(getCourseByIdNew?.getCourseDetailsById?.data?.estimate_time).minutes} m`}</span>
										</div>
										<div className="flex items-center justify-center gap-1">
											<span className='text-base'><Calendar className='fill-white/70' /></span>
											<span className="text-xs text-white">{FormattedDate(getCourseByIdNew?.getCourseDetailsById?.data?.createdAt ?? '')}</span>
										</div>
										<div className="flex items-center justify-center gap-1">
											<span className='text-xl'><Group className='fill-white/70' /></span>
											<span className="text-xs text-white">{`${getCourseByIdNew?.getCourseDetailsById?.data?.course_learners_count??''} People Started Learning`}</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<Tabs tabs={tabs} containerMinimize={true} />
						<Instructor />
					</>}
			</div></>
	)
}

export default CourseDetailsPage
