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
import { ACTIVITY_TYPES, ROUTES } from '@config/constant';
import { useNavigate, useParams } from 'react-router-dom';
import SeasonalActivityMatching from './ActivityForms/MatchingActivity';
import SeasonalActivityStrokeOrder from './ActivityForms/StrokeOrderActivity';
import SeasonalActivityVideo from './ActivityForms/VideoActivity';
import SeasonalActivityImage from './ActivityForms/ImageActivity';
import SeasonalActivityFillInTheBlanks from './ActivityForms/FillInTheBlanksActivity';
import SeasonalActivityDragAndDrop from './ActivityForms/ActivityDragAndDrop';
import SeasonalActivityMultipleChoice from './ActivityForms/ActivityMultipleChoice';
import SeasonalActivityFlashcard from './ActivityForms/ActivityFlashCard';
import SeasonalActivityReadingComprehensive from './ActivityForms/ReadingComprehensiveActivity';

const AddEditSeasonalActivityModal = () => {
	const [loadingSeasonalActivity, setLoadingSeasonalActivity] = useState<boolean>(false);
	const [activityOptionsSeasonalActivity, setActivityOptionsSeasonalActivity] = useState<DropdownOptionType[]>([]);
	const [allActivityListingSeasonalActivity, setAllActivityListingSeasonalActivity] = useState<ActivityItems[]>([]);
	const [activitySlugSeasonal, setActivitySlugSeasonal] = useState<string>('');
	const [activityUuidSeasonal, setActivityUuidSeasonal] = useState<string>('');
	const navigate = useNavigate();
	const params = useParams();

	/**
	 *@returns Dropdown items for Activity Types.
	 */
	const getSeasonalActivityTypeItems = () => {
		setLoadingSeasonalActivity(true);
		APIService.getData(URL_PATHS.activityTypeListing)
			.then((response) => {
				const activityList: DropdownOptionType[] = [];
				response?.data?.data?.data?.map((item: ActivityItems) => {
					activityList.push({ name: item?.name, key: item.slug });
				});
				setActivityOptionsSeasonalActivity(activityList);
				setAllActivityListingSeasonalActivity(response?.data.data.data);
				setLoadingSeasonalActivity(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoadingSeasonalActivity(false);
			});
	};

	/**
	 *@returns Method used for setValue from activities data and get the details of Activity by uuid
	 */
	useEffect(() => {
		getSeasonalActivityTypeItems();
	}, []);

	useEffect(() => {
		if (params.activityTypeId) {
			allActivityListingSeasonalActivity?.forEach((item) => {
				if (item.uuid === params?.activityTypeId) {
					setActivitySlugSeasonal(item?.slug);
					setActivityUuidSeasonal(item?.uuid);
				}
			});
		} else {
			setActivitySlugSeasonal(allActivityListingSeasonalActivity[0]?.slug);
			setActivityUuidSeasonal(allActivityListingSeasonalActivity[0]?.uuid);
		}
	}, [allActivityListingSeasonalActivity]);

	const handleChangeSeasonalActivity = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			const selectedItemUuid = allActivityListingSeasonalActivity.filter((activityItem) => {
				if (activityItem.slug === e.target.value) {
					return activityItem;
				}
			});
			setActivityUuidSeasonal(selectedItemUuid[0]?.uuid);
			setActivitySlugSeasonal(e.target.value);
		},
		[activitySlugSeasonal, activityUuidSeasonal]
	);

	const redirectPagePath = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalActivities}/${ROUTES.list}/${params.topicId}/${params.lessonId}/${params.topicName}/${params.lessonName}`);
	}, []);

	return (
		<div>
			{loadingSeasonalActivity && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={redirectPagePath} title='Back to Activities'>
							<ArrowSmallLeft />
						</Button>
						<Document className='inline-block mr-2 text-primary' /> {params.topicName}
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
						<Dropdown label={'Activity type'} placeholder='Activity type' name='seasonalActivity' onChange={handleChangeSeasonalActivity} value={activitySlugSeasonal} options={activityOptionsSeasonalActivity} id='seasonalActivity' className='mb-5' disabled={!!params.activityId} />

						{/* Matching Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.matching && <SeasonalActivityMatching onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} />}

						{/* Stroke order Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.strokeOrder && <SeasonalActivityStrokeOrder onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} />}

						{/* Video Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.video && <SeasonalActivityVideo onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} />}

						{/* Image Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.image && <SeasonalActivityImage onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} />}

						{/* Fill in the blanks Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.fillInTheBlank && <SeasonalActivityFillInTheBlanks onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} />}

						{/* Drag and drop Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.dragAndDrop && <SeasonalActivityDragAndDrop onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} />}

						{/* Multiple Choice Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.multipleChoice && <SeasonalActivityMultipleChoice onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} />}

						{/* FlashCard Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.flashCard && <SeasonalActivityFlashcard onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} />}

						{/* Reading comprehensive Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.qna && <SeasonalActivityReadingComprehensive onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddEditSeasonalActivityModal;
