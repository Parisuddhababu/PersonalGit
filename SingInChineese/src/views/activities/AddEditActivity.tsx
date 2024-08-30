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
import { reloadPage } from '@utils/helpers';
import { ResponseCode } from 'src/interfaces/enum';
import CheckBox from '@components/checkbox/CheckBox';
import ActivityRunningGame from './ActivityRunningGame';
import ActivitySlashNinja from './ActivitySlashNinja';

const AddEditActivityForm = () => {
	const navigate = useNavigate();
	const params = useParams();
	const [loadingActivity, setLoadingActivity] = useState<boolean>(false);
	const [activityOptionsActivity, setActivityOptionsActivity] = useState<DropdownOptionType[]>([]);
	const [allActivityListingActivity, setAllActivityListingActivity] = useState<ActivityItems[]>([]);
	const [activitySlug, setActivitySlug] = useState<string>('');
	const [activityUuid, setActivityUuid] = useState<string>('');
	const [toggleId, setToggleId] = useState<ToggleId>({ previousActivityUUID: '', previousActivityTypeUUID: '', nextActivityUUID: '', nextActivityTypeUUID: '' });

	const [assignActivity, setAssignActivity] = useState<boolean>(false);

	const [levels, setLevels] = useState<DropdownOptionType[]>([]);
	const [topics, setTopics] = useState<DropdownOptionType[]>([]);
	const [lessons, setLessons] = useState<DropdownOptionType[]>([]);

	const [levelId, setLevelId] = useState<string>('');
	const [topicId, setTopicId] = useState<string>('');
	const [lessonId, setLessonId] = useState<string>('');

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
	}, [params]);

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

	const navigateToLessons = () => {
		navigate(`/${ROUTES.app}/${ROUTES.lessons}/${ROUTES.list}/${params.levelId}/${params.topicId}/${params.levelName}/${params.topicName}`);
	};

	const navigateToTopics = () => {
		navigate(`/${ROUTES.app}/${ROUTES.topic}/${ROUTES.list}/${params.levelId}/${params.levelName}`);
	};

	const navigateToLevels = () => {
		navigate(`/${ROUTES.app}/${ROUTES.level}/${ROUTES.list}`);
	};

	const toggleAction = useCallback(
		(a: string, b: string, c: string, d: string) => {
			setToggleId({ previousActivityUUID: a, previousActivityTypeUUID: b, nextActivityUUID: c, nextActivityTypeUUID: d });
		},
		[toggleId]
	);

	const navigateToNextActivity = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.activities}/${ROUTES.list}/${params.levelId}/${params.topicId}/${params.lessonId}/${params.levelName}/${params.topicName}/${params.lessonName}/activity/${toggleId.nextActivityTypeUUID}/${toggleId.nextActivityUUID}`);
		reloadPage();
	}, [toggleId]);

	const navigateToPrevActivity = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.activities}/${ROUTES.list}/${params.levelId}/${params.topicId}/${params.lessonId}/${params.levelName}/${params.topicName}/${params.lessonName}/activity/${toggleId.previousActivityTypeUUID}/${toggleId.previousActivityUUID}`);
		reloadPage();
	}, [toggleId]);

	const getLevelsList = () => {
		APIService.getData(URL_PATHS.level)
			.then((response) => {
				if (response.status === ResponseCode.created) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.levels.map((item: { levelName: string; uuid: string }) => {
						data.push({ name: item?.levelName, key: item?.uuid });
					});
					setLevels(data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	const getTopicsList = () => {
		APIService.getData(`${URL_PATHS.topic}?levelId=${levelId}`)
			.then((response) => {
				if (response.status === ResponseCode.created) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.topics.map((item: { name: string; uuid: string }) => {
						data.push({ name: item?.name, key: item?.uuid });
					});
					setTopics(data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	const getLessonsList = () => {
		APIService.getData(`${URL_PATHS.lesson}?levelId=${levelId}&topicId=${topicId}`)
			.then((response) => {
				if (response.status === ResponseCode.created) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.lessons.map((item: { name: string; uuid: string }) => {
						data.push({ name: item?.name, key: item?.uuid });
					});
					setLessons(data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	useEffect(() => {
		assignActivity && getLevelsList();
	}, [assignActivity]);

	useEffect(() => {
		levelId && getTopicsList();
	}, [levelId]);

	useEffect(() => {
		topicId && getLessonsList();
	}, [topicId]);

	const handleChangeLevelId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setLevelId(e.target.value);
			setTopicId('');
			setLessonId('');
		},
		[levelId]
	);

	const handleChangeTopicId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setTopicId(e.target.value);
			setLessonId('');
		},
		[topicId]
	);

	const handleChangeLessonId = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			setLessonId(e.target.value);
		},
		[lessonId]
	);

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
						<button onClick={navigateToLevels}>{params.levelName}</button>
						<span className='px-3 text-xs opacity-50'>
							<AngleRight />
						</span>
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
							{toggleId.previousActivityUUID && toggleId.previousActivityTypeUUID && (
								<Button className='btn btn-primary mr-2' onClick={navigateToPrevActivity}>
									Prev
								</Button>
							)}
							{toggleId.nextActivityUUID && toggleId.nextActivityTypeUUID && (
								<Button className='btn btn-primary' onClick={navigateToNextActivity}>
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
											name: 'Assign this activity to another level',
											value: 'Assign this activity to another level',
											checked: assignActivity,
											onChange: () => {
												setAssignActivity((prev) => !prev);
											},
										},
									]}
								/>
							</div>
						)}
						{assignActivity && (
							<div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
								<Dropdown label={'Level'} placeholder='Select' name={'levelId'} onChange={handleChangeLevelId} value={levelId} options={levels} id='level' className='mb-5' required />

								<Dropdown label={'Topic'} placeholder='Select' name={'topicId'} onChange={handleChangeTopicId} value={topicId} options={topics} id='topic' className='mb-5' disabled={!levelId} required />

								<Dropdown label={'Lesson'} placeholder='Select' name={'lessonId'} onChange={handleChangeLessonId} value={lessonId} options={lessons} id='lesson' className='mb-5' disabled={!topicId} disableOption={params.lessonId} required />
							</div>
						)}

						<Dropdown label={'Activity type'} placeholder='Activity type' name={'activityTypes'} onChange={handleChangeActivity} value={activitySlug} options={activityOptionsActivity} id='activityType' className='mb-5' disabled={!!params.activityId} />

						{/* Video Activity */}
						{activitySlug === ACTIVITY_TYPES.video && <ActivityVideo onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}

						{/* Image Activity */}
						{activitySlug === ACTIVITY_TYPES.image && <ActivityImage onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}

						{/* Drag&Drop Activity */}
						{activitySlug === ACTIVITY_TYPES.dragAndDrop && <ActivityDragAndDrop onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}

						{/* Fill In The Blank Activity */}
						{activitySlug === ACTIVITY_TYPES.fillInTheBlank && <ActivityFillInTheBlanks onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}

						{/* Fill In The Blank Activity */}
						{activitySlug === ACTIVITY_TYPES.multipleChoice && <ActivityMultipleChoice onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}

						{/* Flash Card Activity */}
						{activitySlug === ACTIVITY_TYPES.flashCard && <ActivityFlashCard onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}

						{/* Matching Activity */}
						{activitySlug === ACTIVITY_TYPES.matching && <ActivityMatching onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}

						{/* Stoke Order Activity */}
						{activitySlug === ACTIVITY_TYPES.strokeOrder && <ActivityStrokeOrder onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}

						{/* Reading Comprehensive Activity */}
						{activitySlug === ACTIVITY_TYPES.qna && <ActivityReadingComprehensive onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}

						{/* Karaoke Activity */}
						{activitySlug === ACTIVITY_TYPES.karaoke && <ActivityKaraoke onSubmit={navigatePath} onClose={navigatePath} disabled={false} />}
						{/* Running game Activity */}
						{activitySlug === ACTIVITY_TYPES.runningGame && <ActivityRunningGame onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}
						{/* Slash ninja game activity */}
						{activitySlug === ACTIVITY_TYPES.slashNinjaGame && <ActivitySlashNinja onSubmit={navigatePath} onClose={navigatePath} url={URL_PATHS.addActivity} activityUuid={activityUuid} toggleActivity={toggleAction} levelId={levelId} topicId={topicId} lessonId={lessonId} isMoving={assignActivity} />}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddEditActivityForm;
