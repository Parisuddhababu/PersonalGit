import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/button/Button';
import { ActivityItems } from 'src/types/activities';
import ActivityDragAndDropSop from './ActivityDragAndDrop';
import ActivityFillInTheBlanksSop from './ActivityFillInTheBlanks';
import { ACTIVITY_TYPES, ROUTES } from '@config/constant';
import { useNavigate, useParams } from 'react-router-dom';
import ActivityMultipleChoiceSop from './ActivityMultipleChoice';
import ActivityReadingComprehensiveSop from './ActivityReadingComprehensive';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { AngleRight, ArrowSmallLeft, Document } from '@components/icons';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import Dropdown from '@components/dropdown/Dropdown';
import { DropdownOptionType } from 'src/types/component';

const AddEditSopActivity = () => {
	const navigate = useNavigate();
	const params = useParams();
	const [loadingSopActivity, setLoadingSopActivity] = useState<boolean>(false);
	const [activityOptionsSopActivity, setActivityOptionsSopActivity] = useState<DropdownOptionType[]>([]);
	const [allActivityListingSopActivity, setAllActivityListingSopActivity] = useState<ActivityItems[]>([]);
	const [activitySlugSop, setActivitySlugSop] = useState<string>('');
	const [activityUuidSop, setActivityUuidSop] = useState<string>('');

	/**
	 *@returns Dropdown items for Activity Types.
	 */
	const getSopActivityTypeItems = () => {
		setLoadingSopActivity(true);
		APIService.getData(`${URL_PATHS.activityTypeListing}?isForSop=true`)
			.then((response) => {
				const activityList: DropdownOptionType[] = [];
				response?.data?.data?.data?.map((item: ActivityItems) => {
					activityList.push({ name: item?.name, key: item.slug });
				});
				setActivityOptionsSopActivity(activityList);
				setAllActivityListingSopActivity(response?.data?.data?.data);
				setLoadingSopActivity(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoadingSopActivity(false);
			});
	};

	/**
	 *@returns Method used for setValue from signOnPlacement data and get the details of sop activities by uuid
	 */
	useEffect(() => {
		getSopActivityTypeItems();
	}, []);

	useEffect(() => {
		if (params.activityTypeId) {
			allActivityListingSopActivity?.forEach((item) => {
				if (item.uuid === params?.activityTypeId) {
					setActivitySlugSop(item?.slug);
					setActivityUuidSop(item?.uuid);
				}
			});
		} else {
			setActivitySlugSop(allActivityListingSopActivity[0]?.slug);
			setActivityUuidSop(allActivityListingSopActivity[0]?.uuid);
		}
	}, [allActivityListingSopActivity]);

	/**
	 *
	 * @param e  handle Drop down Change Event
	 */
	const handleChangeSopActivity = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const selectedItemUuid = allActivityListingSopActivity.filter((activityItem) => {
				if (activityItem.slug === e.target.value) {
					return activityItem;
				}
			});
			setActivityUuidSop(selectedItemUuid[0]?.uuid);
			setActivitySlugSop(e.target.value);
		},
		[activitySlugSop, activityUuidSop]
	);

	const navigateActivity = useCallback(() => {
		return navigate(`/${ROUTES.app}/${ROUTES.sopActivities}/${ROUTES.list}/${params.levelId}/${params.levelName}`);
	}, []);
	return (
		<div>
			{loadingSopActivity && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={navigateActivity} title='Back to Activities'>
							<ArrowSmallLeft />
						</Button>
						<Document className='inline-block mr-2 text-primary' />
						{params.levelName}
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						{params.activityId ? 'Edit ' : 'Add '}
						Activity
					</h6>
				</div>
				<div>
					<div className='p-3 w-full'>
						<Dropdown label={'Activity type'} placeholder='Activity type' name={'activityTypes'} onChange={handleChangeSopActivity} value={activitySlugSop} options={activityOptionsSopActivity} id='activityType' className='mb-5' disabled={!!params.activityId} />

						{/* Drag&Drop Activity */}
						{activitySlugSop === ACTIVITY_TYPES.dragAndDrop && <ActivityDragAndDropSop onSubmit={navigateActivity} onClose={navigateActivity} url={URL_PATHS.signOnPlacementAddActivity} activityUuid={activityUuidSop} />}

						{/* Fill In The Blank Activity */}
						{activitySlugSop === ACTIVITY_TYPES.fillInTheBlank && <ActivityFillInTheBlanksSop onSubmit={navigateActivity} onClose={navigateActivity} url={URL_PATHS.signOnPlacementAddActivity} activityUuid={activityUuidSop} />}

						{/* Multi choice Activity */}
						{activitySlugSop === ACTIVITY_TYPES.multipleChoice && <ActivityMultipleChoiceSop onSubmit={navigateActivity} onClose={navigateActivity} url={URL_PATHS.signOnPlacementAddActivity} activityUuid={activityUuidSop} />}

						{/* Reading Comprehensive Activity */}
						{activitySlugSop === ACTIVITY_TYPES.qna && <ActivityReadingComprehensiveSop onSubmit={navigateActivity} onClose={navigateActivity} url={URL_PATHS.signOnPlacementAddActivity} activityUuid={activityUuidSop} />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddEditSopActivity;
