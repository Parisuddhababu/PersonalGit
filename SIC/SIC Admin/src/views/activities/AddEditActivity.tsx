import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/button/Button';
import { AngleRight, ArrowSmallLeft, Document } from '@components/icons';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import Dropdown from '@components/dropdown/Dropdown';
import { DropdownOptionType } from 'src/types/component';
import { ActivityItems } from 'src/types/activities';
import ActivityVideo from './ActivityVideo';
import ActivityDragAndDrop from './ActivityDragAndDrop';
import ActivityFillInTheBlanks from './ActivityFillInTheBlanks';
import ActivityStrokeOrder from './ActivityStrokeOrder';
import ActivityReadingComprehensive from './ActivityReadingComprehensive';
import ActivityKaraoke from './ActivityKaraoke';
import { ACTIVITY_TYPES, ROUTES } from '@config/constant';
import ActivityFlashCard from './ActivityFlashCard';
import ActivityMatching from './ActivityMatching';
import { useNavigate, useParams } from 'react-router-dom';
import ActivityMultipleChoice from './ActivityMultipleChoice';
import ActivityImage from './ActivityImage';

const AddEditActivityForm = () => {
	const navigate = useNavigate();
	const params = useParams();
	const [loadingActivity, setLoadingActivity] = useState<boolean>(false);
	const [activityOptionsActivity, setActivityOptionsActivity] = useState<DropdownOptionType[]>([]);
	const [allActivityListingActivity, setAllActivityListingActivity] = useState<ActivityItems[]>([]);
	const [activitySlug, setActivitySlug] = useState<string>('');
	const [activityUuid, setActivityUuid] = useState<string>('');

	/**
	 *@returns Dropdown items for Activity Types.
	 */
	const getActivityTypeItems = () => {
		setLoadingActivity(true);
		APIService.getData(URL_PATHS.activityTypeListing)
			.then((response) => {
				const activityList: DropdownOptionType[] = [];
				response?.data?.data?.data?.map((item: ActivityItems) => {
					activityList.push({ name: item?.name, key: item.slug });
				});
				setActivityOptionsActivity(activityList);
				setAllActivityListingActivity(response?.data?.data?.data);
				setLoadingActivity(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data?.message);
				setLoadingActivity(false);
			});
	};

	useEffect(() => {
		getActivityTypeItems();
	}, []);

	useEffect(() => {
		if (params.activityTypeId) {
			allActivityListingActivity?.forEach((item) => {
				if (item.uuid === params?.activityTypeId) {
					setActivitySlug(item?.slug);
					setActivityUuid(item?.uuid);
				}
			});
		} else {
			setActivitySlug(allActivityListingActivity[0]?.slug);
			setActivityUuid(allActivityListingActivity[0]?.uuid);
		}
	}, [allActivityListingActivity]);

	const handleChangeActivity = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const selectedItemUuid = allActivityListingActivity.filter((activityItem) => {
				if (activityItem.slug === e.target.value) {
					return activityItem;
				}
			});
			setActivityUuid(selectedItemUuid[0]?.uuid);
			setActivitySlug(e.target.value);
		},
		[activitySlug, activityUuid]
	);

	const navigatePath = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.activities}/${ROUTES.list}/${params.levelId}/${params.topicId}/${params.lessonId}/${params.levelName}/${params.topicName}/${params.lessonName}`);
	}, []);

	return (
		<div>
			{loadingActivity && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={navigatePath} title='Back to Activities'>
							<ArrowSmallLeft />
						</Button>
						<Document className='inline-block mr-2 text-primary' />
						{params.levelName}
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						{params.topicName}
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						{params.lessonName}
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						{params.activityId ? 'Edit' : 'Add'} Activity
					</h6>
				</div>
				<div>
					<div className='p-3 w-full'>
						<Dropdown label={'Activity type'} placeholder='Activity type' name={'activityTypes'} onChange={handleChangeActivity} value={activitySlug} options={activityOptionsActivity} id='activityType' className='mb-5' disabled={!!params.activityId} />

						{/* Video Activity */}
						{activitySlug === ACTIVITY_TYPES.video && <ActivityVideo onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} />}

						{/* Image Activity */}
						{activitySlug === ACTIVITY_TYPES.image && <ActivityImage onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} />}

						{/* Drag&Drop Activity */}
						{activitySlug === ACTIVITY_TYPES.dragAndDrop && <ActivityDragAndDrop onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} />}

						{/* Fill In The Blank Activity */}
						{activitySlug === ACTIVITY_TYPES.fillInTheBlank && <ActivityFillInTheBlanks onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} />}

						{/* Fill In The Blank Activity */}
						{activitySlug === ACTIVITY_TYPES.multipleChoice && <ActivityMultipleChoice onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} />}

						{/* Flash Card Activity */}
						{activitySlug === ACTIVITY_TYPES.flashCard && <ActivityFlashCard onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} />}

						{/* Matching Activity */}
						{activitySlug === ACTIVITY_TYPES.matching && <ActivityMatching onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} />}

						{/* Stoke Order Activity */}
						{activitySlug === ACTIVITY_TYPES.strokeOrder && <ActivityStrokeOrder onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} />}

						{/* Reading Comprehensive Activity */}
						{activitySlug === ACTIVITY_TYPES.qna && <ActivityReadingComprehensive onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} />}

						{/* Karaoke Activity */}
						{activitySlug === ACTIVITY_TYPES.karaoke && <ActivityKaraoke onSubmit={navigatePath} onClose={navigatePath} disabled={false} />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddEditActivityForm;
