import React, { useEffect } from 'react';

import AllCourses from '@components/allCourses/AllCourses';
import AssignedCourses from '@components/assignedCourses/assignedCourses';
import CoursesInProgress from '@components/coursesInProgress/coursesInProgress';
import ChooseFavoriteCourseFromTopCategory from '@components/chooseFavoriteCourseFromTopCategory/chooseFavoriteCourseFromTopCategory';
import Playlists from '@components/playlists/playlists';

import UpdatedHeader from '@components/header/updatedHeader';
import { useQuery } from '@apollo/client';
import { GET_USER_COURSE_COUNT_DETAILS } from '@framework/graphql/queries/courseDashboard';

import 'primereact/resources/primereact.min.css'
import 'primereact/resources/themes/lara-light-indigo/theme.css' // theme
import 'primereact/resources/primereact.css'

const MyAssignments = () => {
	const { data: userCourseCountDetails, refetch } = useQuery(GET_USER_COURSE_COUNT_DETAILS)
	const courseDetails = userCourseCountDetails?.usersDashboardCountDetails?.data;

	useEffect(() => {
		if (userCourseCountDetails) {
			refetch()
		}
	}, [])

	return (
		<><UpdatedHeader headerTitle='Training Dashboard'/><div>
			<div className='mb-5 md:mb-7'>
				<div className="mb-5 md:mb-7">
					<h1>Welcome to Sustainability University!</h1>
				</div>

				<div className='flex gap-5 lg:gap-[30px] flex-wrap'>
					<div className='w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-20px)] 2xl:w-[calc(25%-23px)] flex flex-col md:min-h-[150px] rounded-xl p-5 border border-border-primary border-solid'>
						<h6 className='leading-7 mb-3 max-w-[200px]'>Total No. of Courses Completed</h6>
						<span className="mt-auto text-3xl font-bold leading-9 text-primary">{courseDetails?.no_of_courses_completed}</span>
					</div>

					<div className='w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-20px)] 2xl:w-[calc(25%-23px)] flex flex-col md:min-h-[150px] rounded-xl p-5 border border-border-primary border-solid'>
						<h6 className='leading-7 mb-3 max-w-[200px]'>Total No. of Courses in Progress</h6>
						<span className="mt-auto text-3xl font-bold leading-9 text-primary">{courseDetails?.no_of_courses_in_progress}</span>
					</div>

					<div className='w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-20px)] 2xl:w-[calc(25%-23px)] flex flex-col md:min-h-[150px] rounded-xl p-5 border border-border-primary border-solid'>
						<h6 className='leading-7 mb-3 max-w-[200px]'>Remaining Assigned Courses</h6>
						<span className="mt-auto text-3xl font-bold leading-9 text-primary">{courseDetails?.no_of_remaining_assigned_courses}</span>
					</div>

					<div className='w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-20px)] 2xl:w-[calc(25%-23px)] flex flex-col md:min-h-[150px] rounded-xl p-5 border border-border-primary border-solid'>
						<h6 className='leading-7 mb-3 max-w-[200px]'>Certificates Earned</h6>
						<span className="mt-auto text-3xl font-bold leading-9 text-primary">{courseDetails?.total_certificates_earned}</span>
					</div>
				</div>
			</div>
			<CoursesInProgress slider={true} />
			<AssignedCourses slider={true} />
			<ChooseFavoriteCourseFromTopCategory slider={true} />
			<AllCourses slider={true} />
			<Playlists slider={true} />
		</div></>
	);
};
export default MyAssignments;
