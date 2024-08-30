import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/button/Button';
import { AngleRight, ArrowSmallLeft, Document } from '@components/icons';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import Dropdown from '@components/dropdown/Dropdown';
import { DropdownOptionType } from 'src/types/component';
import { ActivityItems, ToggleId } from 'src/types/activities';
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
import { reloadPage } from '@utils/helpers';
import CheckBox from '@components/checkbox/CheckBox';
import { ResponseCode } from 'src/interfaces/enum';
import SeasonalRunningGameActivity from './ActivityForms/RunningGameSeasonalActivity';
import SeasonalActivitySlashNinja from './ActivityForms/SlashNinjaActivity';

const AddEditSeasonalActivityModal = () => {
	const [loadingSeasonalActivity, setLoadingSeasonalActivity] = useState<boolean>(false);
	const [activityOptionsSeasonalActivity, setActivityOptionsSeasonalActivity] = useState<DropdownOptionType[]>([]);
	const [allActivityListingSeasonalActivity, setAllActivityListingSeasonalActivity] = useState<ActivityItems[]>([]);
	const [activitySlugSeasonal, setActivitySlugSeasonal] = useState<string>('');
	const [activityUuidSeasonal, setActivityUuidSeasonal] = useState<string>('');
	const [toggleIdSeasonal, setToggleIdSeasonal] = useState<ToggleId>({ previousActivityUUID: '', previousActivityTypeUUID: '', nextActivityUUID: '', nextActivityTypeUUID: '' });

	const [assignSeasonalActivity, setAssignSeasonalActivity] = useState<boolean>(false);

	const [seasonalTopics, setSeasonalTopics] = useState<DropdownOptionType[]>([]);
	const [seasonalLessons, setSeasonalLessons] = useState<DropdownOptionType[]>([]);

	const [seasonalTopicId, setSeasonalTopicId] = useState<string>('');
	const [seasonalLessonId, setSeasonalLessonId] = useState<string>('');

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
	}, [params]);

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

	const navigateToLessons = () => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalLesson}/${ROUTES.list}/${params.topicId}/${params.topicName}`);
	};

	const navigateToTopics = () => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalTopic}`);
	};

	const toggleActionSeasonal = useCallback(
		(a: string, b: string, c: string, d: string) => {
			setToggleIdSeasonal({ previousActivityUUID: a, previousActivityTypeUUID: b, nextActivityUUID: c, nextActivityTypeUUID: d });
		},
		[toggleIdSeasonal]
	);

	const navigateToNextSeasonalActivity = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalActivities}/${ROUTES.list}/${params.topicId}/${params.lessonId}/${params.topicName}/${params.lessonName}/seasonalActivity/${toggleIdSeasonal.nextActivityTypeUUID}/${toggleIdSeasonal.nextActivityUUID}`);
		reloadPage();
	}, [toggleIdSeasonal]);

	const navigateToPrevSeasonalActivity = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.seasonalActivities}/${ROUTES.list}/${params.topicId}/${params.lessonId}/${params.topicName}/${params.lessonName}/seasonalActivity/${toggleIdSeasonal.previousActivityTypeUUID}/${toggleIdSeasonal.previousActivityUUID}`);
		reloadPage();
	}, [toggleIdSeasonal]);

	const getTopicsList = () => {
		APIService.getData(`${URL_PATHS.seasonalTopics}/list`)
			.then((response) => {
				if (response.status === ResponseCode.created) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.topicsList.map((item: { name: string; uuid: string }) => {
						data.push({ name: item?.name, key: item?.uuid });
					});
					setSeasonalTopics(data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	const getLessonsList = () => {
		APIService.getData(`${URL_PATHS.seasonalLessons}/list?topicId=${seasonalTopicId}`)
			.then((response) => {
				if (response.status === ResponseCode.created) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.lessons.map((item: { name: string; uuid: string }) => {
						data.push({ name: item?.name, key: item?.uuid });
					});
					setSeasonalLessons(data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	useEffect(() => {
		assignSeasonalActivity && getTopicsList();
	}, [assignSeasonalActivity]);

	useEffect(() => {
		seasonalTopicId && getLessonsList();
	}, [seasonalTopicId]);

	const handleChangeTopicId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setSeasonalTopicId(e.target.value);
			setSeasonalLessonId('');
		},
		[seasonalTopicId]
	);

	const handleChangeLessonId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setSeasonalLessonId(e.target.value);
		},
		[seasonalLessonId]
	);

	return (
		<div>
			{loadingSeasonalActivity && <Loader />}
			<div className='mb-3 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Button className='btn-default mr-3' onClick={redirectPagePath} title='Back to Activities'>
							<ArrowSmallLeft />
						</Button>
						<Document className='inline-block mr-2 text-primary' />
						<button onClick={navigateToTopics}>{params.topicName}</button>
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						<button onClick={navigateToLessons}>{params.lessonName}</button>
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
						{params.activityId ? 'Edit' : 'Add'} Activity
					</h6>
					{params.activityId && (
						<div>
							{toggleIdSeasonal.previousActivityUUID && toggleIdSeasonal.previousActivityTypeUUID && (
								<Button className='btn btn-primary mr-2' onClick={navigateToPrevSeasonalActivity}>
									Prev
								</Button>
							)}
							{toggleIdSeasonal.nextActivityUUID && toggleIdSeasonal.nextActivityTypeUUID && (
								<Button className='btn btn-primary' onClick={navigateToNextSeasonalActivity}>
									Next
								</Button>
							)}
						</div>
					)}
				</div>
				<div>
					<div className='p-3 w-full'>
						{params.activityId && (
							<div className='mb-4'>
								<CheckBox
									option={[
										{
											id: 'assignActivity',
											name: 'Assign this activity to another topic',
											value: 'Assign this activity to another topic',
											checked: assignSeasonalActivity,
											onChange: () => {
												setAssignSeasonalActivity((prev) => !prev);
											},
										},
									]}
								/>
							</div>
						)}
						{assignSeasonalActivity && (
							<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
								<Dropdown label={'Topic'} placeholder='Select' name={'topicId'} onChange={handleChangeTopicId} value={seasonalTopicId} options={seasonalTopics} id='topic' className='mb-5' required />

								<Dropdown label={'Lesson'} placeholder='Select' name={'lessonId'} onChange={handleChangeLessonId} value={seasonalLessonId} options={seasonalLessons} id='lesson' className='mb-5' disabled={!seasonalTopicId} disableOption={params.lessonId} required />
							</div>
						)}

						<Dropdown label={'Activity type'} placeholder='Activity type' name='seasonalActivity' onChange={handleChangeSeasonalActivity} value={activitySlugSeasonal} options={activityOptionsSeasonalActivity} id='seasonalActivity' className='mb-5' disabled={!!params.activityId} />

						{/* Matching Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.matching && <SeasonalActivityMatching onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}

						{/* Stroke order Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.strokeOrder && <SeasonalActivityStrokeOrder onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}

						{/* Video Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.video && <SeasonalActivityVideo onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}

						{/* Image Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.image && <SeasonalActivityImage onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}

						{/* Fill in the blanks Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.fillInTheBlank && <SeasonalActivityFillInTheBlanks onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}

						{/* Drag and drop Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.dragAndDrop && <SeasonalActivityDragAndDrop onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}

						{/* Multiple Choice Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.multipleChoice && <SeasonalActivityMultipleChoice onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}

						{/* FlashCard Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.flashCard && <SeasonalActivityFlashcard onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}

						{/* Reading comprehensive Activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.qna && <SeasonalActivityReadingComprehensive onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}
						{/* Running game activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.runningGame && <SeasonalRunningGameActivity onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}
						{/* Slash ninja activity */}
						{activitySlugSeasonal === ACTIVITY_TYPES.slashNinjaGame && <SeasonalActivitySlashNinja onSubmit={redirectPagePath} onClose={redirectPagePath} url={URL_PATHS.seasonalActivities} activityUuid={activityUuidSeasonal} toggleSeasonalActivity={toggleActionSeasonal} topicId={seasonalTopicId} lessonId={seasonalLessonId} isMoving={assignSeasonalActivity} />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddEditSeasonalActivityModal;
