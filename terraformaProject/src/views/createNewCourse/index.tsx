import AddYourFaq from '@components/createNewCourse/AddYourFaq';
import CreateYourContent from '@components/createNewCourse/CreateYourContent';
import PlanYourCourse from '@components/createNewCourse/PlanYourCourse';
import PublishYourCourse from '@components/createNewCourse/PublishYourCourse';
import Stepper from '@components/stepper/Stepper';
import React, { useEffect } from 'react';
import { AddContent, Faq, Planning, PublishCourse } from '@components/icons/icons';
import { useTranslation } from 'react-i18next';
import { Step } from 'src/types/common';
import UpdatedHeader from '@components/header/updatedHeader';
import { useDispatch } from 'react-redux';
import { setResetAllCoursesData } from 'src/redux/courses-management-slice';

const CreateNewCourse = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	const steps: Step[] = [
		{ title: `${t('Plan Your Course')}`, icon: <Planning />, content: <div>{<PlanYourCourse />}</div> },
		{ title: `${t('Create Your Content')}`, icon: <AddContent />, content: <div>{<CreateYourContent />}</div> },
		{ title: `${t('FAQ')}`, icon: <Faq />, content: <div>{<AddYourFaq />}</div> },
		{ title: `${t('Review Your Course')}`, icon: <PublishCourse />, content: <div>{<PublishYourCourse />}</div> },
	];

	useEffect(() => {
		return () => {
			dispatch(setResetAllCoursesData());
		}
	}, [])

	return (
		<>
			<UpdatedHeader headerTitle='Education & Engagement' />
			<div>
				<div>
					<Stepper steps={steps} createYourContent={true} />
				</div>
			</div>
		</>
	);
};
export default CreateNewCourse;
