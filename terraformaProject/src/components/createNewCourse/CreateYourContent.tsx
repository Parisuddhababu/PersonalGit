import React, { useCallback, useEffect, useState } from 'react';
import { DropResult, DraggableProvided, DroppableProvided } from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';
import { DraggableIcon, DropdownArrowDown, Edit, Trash } from '@components/icons/icons';
import Button from '@components/button/button';
import { useFormik } from 'formik';
import { setActiveStep, setBackActiveStep, setCreateYourContentDetails } from 'src/redux/courses-management-slice';
import { useDispatch, useSelector } from 'react-redux';
import useValidation from '@framework/hooks/validations';
import { CHAPTER_EEROR_MESSAGE, CHAPTER_TYPES, CHAPTER_TYPES_BELONG, CHAPTER_TYPE_DRP, DELETE_WARNING_TEXT, ROUTES, chapterTypeConst } from '@config/constant';
import DropDown from '@components/dropdown/dropDown';
import AppDraggableList from './dragcomponent';
import YoutubeComponent from './chaptersTypes/youtube';
import PdfDocumentComponent from './chaptersTypes/pdfDocument';
import TextBasedComponent from './chaptersTypes/textBase';
import QuizCompoent from './chaptersTypes/quizComponent';
import CommonModel from '@components/common/commonModel';
import { CREATE_CONTENT_STEP_2 } from '@framework/graphql/mutations/course';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import { GET_COURSE_CHAPTER_DETAILS } from '@framework/graphql/queries/getCourses';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';
import { ChaptersType, TranformationArrayType, Item, YoutubeValues, TextBasedValues, PdfValues, Questiontype } from 'src/types/common';


export const generateTraformedArray = (array: TranformationArrayType[], condition: boolean) => {
	const conditionReturnValue = (condition: boolean, value: string) => {
		return condition ? value : ''
	}

	return array?.map((item: TranformationArrayType) => {
		switch (item.type) {
			case 1:
				// For type 1 (YouTube videos)
				return {
					chapter_id: conditionReturnValue(condition, item.uuid),
					title: item.title,
					type: item.type,
					order: item.order,
					youtube: item?.chapter_content?.map((data: {
						uuid: string,
						image: string,
						youtube_url: string
					}) => {
						return {
							uuid: conditionReturnValue(condition, data.uuid),
							image: data?.image,
							youtube_url: data?.youtube_url
						}
					})?.[0]
				};
			case 2:
				// For type 2 (Quizzes)
				return {
					chapter_id: conditionReturnValue(condition, item.uuid),
					title: item.title,
					type: item.type,
					order: item.order,
					quiz: {
						delete_question_ids: [],
						questions: item.chapter_quiz.map((question: {
							uuid: string;
							question: string;
							order: number;
							type: number;
							quiz_question: {
								uuid: string;
								option: string;
								is_correct: boolean;
								order: number;
							}[]
						}) => ({
							uuid: conditionReturnValue(condition, question.uuid),
							question: question.question,
							order: question.order,
							type: question.type,
							delete_options_ids: [],
							options: question.quiz_question.map(option => ({
								uuid: conditionReturnValue(condition, option.uuid),
								option: option.option,
								is_correct: option.is_correct,
								order: option.order
							}))
						}))
					}
				};
			case 3:
				// For type 3 (Text-based chapters)
				return {
					chapter_id: conditionReturnValue(condition, item.uuid),
					title: item.title,
					type: item.type,
					order: item.order,
					text: item?.chapter_content?.map((data: {
						uuid: string,
						description: string,
					}) => {
						return {
							uuid: conditionReturnValue(condition, data?.uuid),
							description: data?.description,
						}
					})?.[0]
				};
			case 4:
				// For type 4 (PDFs)
				return {
					chapter_id: conditionReturnValue(condition, item.uuid),
					title: item.title,
					type: item.type,
					order: item.order,
					pdf: item?.chapter_content?.map((data: {
						uuid: string;
						pdf_url: string;
					}) => {
						return {
							uuid: conditionReturnValue(condition, data?.uuid),
							url: data?.pdf_url,
						}
					})?.[0]
				};
			default:
				return item;
		}
	});
}
const CreateYourContent = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [queryParams] = useSearchParams();
	const uuid = queryParams.get('uuid');
	const isViewAsLearner = queryParams.get('isViewAsLearner');
	const { createYourContentValidationSchema } = useValidation();
	const { createYourContentDetails, course_id, is_published ,is_draft} = useSelector(((state: {
		coursesManagement: {
			createYourContentDetails: {
				chapterType: number,
				delete_chapter_ids: string[],
				chapters: ChaptersType[]
			}, course_id: string,
			 is_published: boolean, 
			 is_draft:boolean
		}
	}) => state.coursesManagement));
	const [editIndex, setEditIndex] = useState<number | null>(null);
	const [isDeleteChapter, setIsDeleteChapter] = useState<boolean>(false);
	const [deleteIndex, setDeleteIndex] = useState<null | number>(null);
	const [list, setList] = useState<Item[]>([]);
	const [createStepTwo, { loading: step2Loader }] = useMutation(CREATE_CONTENT_STEP_2);
	const { data, loading: contentLoadingState, refetch:stepTwoRefetch } = useQuery(GET_COURSE_CHAPTER_DETAILS, { variables: { courseId: uuid }, skip: !uuid, fetchPolicy: 'network-only' });
	const initialValues: { chapters: ChaptersType[], chapterType: number | string, delete_chapter_ids: string[], chapter_names: string[] } = {
		chapter_names: [],
		delete_chapter_ids: [],
		chapterType: 1,
		chapters: [],
	};
	useEffect(() => {
		if(!data?.findCourseChaptersDetails?.data?.courseChapters?.length&&data?.findCourseChaptersDetails?.data?.template_uuid && !createYourContentDetails?.chapters?.length){
			stepTwoRefetch({
				courseId:data?.findCourseChaptersDetails?.data?.template_uuid
			})
		}
		if (data?.findCourseChaptersDetails?.data?.courseChapters?.length && !createYourContentDetails?.chapters?.length) {
			const transformedArray = generateTraformedArray(data?.findCourseChaptersDetails?.data?.courseChapters, ((location.pathname.includes(`/${ROUTES.app}/${ROUTES.updateEducationAndEngagement}`)&&data?.findCourseChaptersDetails?.data?.course_uuid===uuid)|| (isViewAsLearner==='true')));
			formik.setFieldValue('chapters', transformedArray)
			const reqList = transformedArray?.map((data: { title: string, type: number, order: number }) => {
				return {
					name: data?.title,
					id: data?.order.toString(),
					type: CHAPTER_TYPES_BELONG?.[`${data?.type}`]
				}

			}) as Item[];
			setList(reqList)
			dispatch(setCreateYourContentDetails({
				chapter_names: [],
				delete_chapter_ids: [],
				chapterType: 1,
				chapters: transformedArray
			}))
		}
	}, [data?.findCourseChaptersDetails,isViewAsLearner])

	useEffect(() => {
		if (createYourContentDetails?.chapters?.length) {
			setList(createYourContentDetails?.chapters?.map((data: { title: string, type: number | string, order: number }) => {
				return {
					name: data?.title,
					id: data?.order.toString(),
					type: CHAPTER_TYPES_BELONG?.[`${data?.type}`]
				}

			}))
			formik.resetForm({ values: { ...createYourContentDetails, chapter_names: [] } });
		}
	}, [createYourContentDetails?.chapters?.length])

	const formik = useFormik({
		initialValues,
		validationSchema: createYourContentValidationSchema,
		onSubmit: (values) => {
			if (values?.chapters?.length) {
				dispatch(setActiveStep());
				createStepTwo({
					variables: {
						courseData: {
							course_id:isViewAsLearner==='true'? uuid:course_id,
							is_draft: false,
							delete_chapter_ids: values?.delete_chapter_ids,
							chapterData: values?.chapters
						}
					}
				}).then((res) => {
					const transformedArray = generateTraformedArray(res?.data?.courseCreateStepTwo?.data?.course_chapters, true)
					dispatch(setCreateYourContentDetails({
						course_id: course_id,
						delete_chapter_ids: [],
						chapterType: values?.chapterType,
						chapters: transformedArray
					}));
					formik.setFieldValue('chapters', transformedArray)
					formik.setFieldValue('delete_chapter_ids', [])

				}).catch((err) => {
					toast.error(err?.networkError?.result?.errors?.[0]?.message);
				})
			} else {
				toast.error(CHAPTER_EEROR_MESSAGE)
			}
		},
	});

	const reorder = (list: Item[], startIndex: number, endIndex: number) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	const renderWrapper = (
		children: JSX.Element,
		providedMain: DroppableProvided
	) => (
		<div
			className="p-3 md:p-5 overflow-hidden border border-solid mb-3 md:mb-5 border-border-primary rounded-xl space-y-3 md:space-y-5"
			ref={providedMain.innerRef}
			{...providedMain.droppableProps}
		>
			{children}
		</div>
	);

	const renderDragItem = (
		item: Item,
		provided: DraggableProvided,
		index: number
	) => {

		return (
			<div className='flex flex-col xmd:flex-row justify-between gap-3 xmd:gap-20 p-3 md:p-5 border border-solid border-border-primary rounded-xl bg-accents-2'
				ref={provided.innerRef}
				{...provided.draggableProps}
				{...provided.dragHandleProps}
			>
				<div className="flex items-center gap-5 xmd:gap-10">
					<h5 className='text-base xmd:text-lg font-semibold min-w-[90px] xmd:min-w-[150px] pr-[18px] border-r'>{item.type}</h5>
					<h5 className='text-base xmd:text-lg line-clamp-2'>Chapter {index + 1}: {item.name}</h5>
				</div>

				<div className='flex  justify-end items-center gap-3 md:gap-5'>
					<div className='flex gap-5 xmd:gap-7.5 pr-[18px] border-r'>
						<button className='w-3.5 h-3.5 md:w-[18px] md:h-[18px] cursor-pointer disabled:cursor-not-allowed' onClick={() => onEditChapter(index.toString(), item.type)} disabled={is_published} ><Edit className='text-base md:text-lg text-primary' /></button>
						<button className='w-3.5 h-3.5 md:w-[18px] md:h-[18px] cursor-pointer disabled:cursor-not-allowed' onClick={() => onDeleteChapter(index)} disabled={is_published} ><Trash className='text-base md:text-lg fill-error' /></button>
					</div>
					<span><DraggableIcon className='w-2 h-4 md:w-3 md:h-5' /></span>
				</div>
			</div>
		)
	};

	const onEditChapter = useCallback((index: string, type: string) => {
		const chapterType = chapterTypeConst?.[type];
		formik.setFieldValue('chapterType', CHAPTER_TYPES?.[`${chapterType}`])
		setEditIndex(+index);
	}, [])

	const onDeleteChapter = useCallback((index: number) => {
		setIsDeleteChapter(true)
		setDeleteIndex(index);
	}, [])


	const onBackCreateYourContent = useCallback(() => {
		dispatch(setBackActiveStep());
	}, [])


	const onAddYouTubeChapter = (values: YoutubeValues) => {
		if (editIndex !== null) {
			formik.setFieldValue(`chapters.[${editIndex}]`, {
				chapter_id: formik?.values?.chapters?.[editIndex]?.chapter_id,
				title: values?.chapterName,
				type: formik?.values?.chapters?.[editIndex]?.type,
				order: formik?.values?.chapters?.[editIndex]?.order,
				youtube: {
					uuid: formik?.values?.chapters?.[editIndex]?.youtube?.uuid,
					image: values?.chapterImage,
					youtube_url: values?.youtubeUrl
				}
			})
			setList((prev) => {
				return prev.map((data, index: number) => {
					if (index === editIndex) {
						return {
							...data,
							name: values?.chapterName
						}
					} else {
						return data;
					}
				})
			})
			setEditIndex(null);
		} else {
			list.push({
				name: values.chapterName,
				id: `${list.length + 1}`,
				type: 'YouTube'

			})
			formik.setFieldValue('chapters', [...formik?.values?.chapters, {
				chapter_id: '',
				title: values?.chapterName,
				type: CHAPTER_TYPES.YOUTUBE_VIDEO,
				order: formik?.values?.chapters?.length + 1,
				youtube: {
					uuid: values?.uuid,
					image: values?.chapterImage,
					youtube_url: values?.youtubeUrl
				}
			}])
		}
	};

	const onAddDocument = useCallback((values: PdfValues) => {
		if (editIndex !== null) {
			formik.setFieldValue(`chapters.[${editIndex}]`, {
				chapter_id: formik?.values?.chapters?.[editIndex]?.chapter_id,
				title: values?.chapterName,
				type: formik?.values?.chapters?.[editIndex]?.type,
				order: formik?.values?.chapters?.[editIndex]?.order,
				pdf: {
					uuid: formik?.values?.chapters?.[editIndex]?.pdf?.uuid,
					url: values?.attachments
				}
			})
			setList((prev) => {
				return prev.map((data, index: number) => {
					if (index === editIndex) {
						return {
							...data,
							name: values?.chapterName
						}
					} else {
						return data;
					}
				})
			})
			setEditIndex(null);
		} else {
			list.push({
				name: values.chapterName,
				id: `${list.length + 1}`,
				type: 'PDF Document'

			});
			formik.setFieldValue('chapters', [...formik?.values?.chapters, {
				chapter_id: '',
				title: values?.chapterName,
				type: CHAPTER_TYPES.PDF,
				order: formik?.values?.chapters?.length + 1,
				pdf: {
					uuid: '',
					url: values?.attachments
				}
			}])
		}
	}, [formik, editIndex]);
	const onAddTextBasedChapter = useCallback((values: TextBasedValues) => {
		if (editIndex !== null) {
			formik.setFieldValue(`chapters.[${editIndex}]`, {
				chapter_id: formik?.values?.chapters?.[editIndex]?.chapter_id,
				title: values?.chapterName,
				type: formik?.values?.chapters?.[editIndex]?.type,
				order: formik?.values?.chapters?.[editIndex]?.order,
				text: {
					uuid: formik?.values?.chapters?.[editIndex]?.text?.uuid,
					description: values?.text
				}
			})
			setList((prev) => {
				return prev.map((data, index: number) => {
					if (index === editIndex) {
						return {
							...data,
							name: values?.chapterName
						}
					} else {
						return data;
					}
				})
			})
			setEditIndex(null);

		} else {
			list.push({
				name: values.chapterName,
				id: `${list.length + 1}`,
				type: 'Text'

			})
			formik.setFieldValue('chapters', [...formik?.values?.chapters, {
				chapter_id: '',
				title: values?.chapterName,
				type: CHAPTER_TYPES.TEXT,
				order: formik?.values?.chapters?.length + 1,
				text: {
					uuid: '',
					description: values?.text
				}
			}])
		}
	}, [formik, editIndex]);

	const onAddQuizChapter = useCallback((values: { questions: Questiontype[], chapterName: string, delete_question_ids: string[] }) => {
		
		if (editIndex !== null) {
			formik.setFieldValue(`chapters.[${editIndex}]`, {
				chapter_id: formik?.values?.chapters?.[editIndex]?.chapter_id,
				title: values?.chapterName,
				type: formik?.values?.chapters?.[editIndex]?.type,
				order: formik?.values?.chapters?.[editIndex]?.order,
				quiz: {
					delete_question_ids: values?.delete_question_ids,
					questions: values?.questions
				}
			});
			setList((prev) => {
				return prev.map((data, index: number) => {
					if (index === editIndex) {
						return {
							...data,
							name: values?.chapterName
						}
					} else {
						return data;
					}
				})
			})
			setEditIndex(null);

		} else {
			list.push({
				name: values?.chapterName,
				id: `${list.length + 1}`,
				type: 'Quiz',
			});
			formik.setFieldValue('chapters', [...formik?.values?.chapters, {
				chapter_id: '',
				title: values?.chapterName,
				type: CHAPTER_TYPES.QUIZ,
				order: formik?.values?.chapters?.length + 1,
				quiz: {
					delete_question_ids: values?.delete_question_ids,
					questions: values?.questions
				}
			}])
		}

	}, [formik, editIndex])

	const handleDeleteChapter = useCallback(() => {
		if (deleteIndex !== null) {
			const chapters = formik?.values?.chapters?.filter((_, index: number) => {
				if (index !== deleteIndex) {
					return data
				}
			});
			const reqList = list?.filter((_, index: number) => (index !== deleteIndex))
			setList(reqList)
			formik.setFieldValue('chapters', chapters);
			if (formik?.values?.chapters?.[deleteIndex]?.chapter_id !== '' && formik?.values?.chapters?.[deleteIndex]?.chapter_id) {
				formik.setFieldValue('delete_chapter_ids', [...formik?.values?.delete_chapter_ids, formik?.values?.chapters?.[deleteIndex]?.chapter_id])
			}
			setIsDeleteChapter(false)
			setDeleteIndex(null);
		}
	}, [formik, deleteIndex]);

	const onCloseChapter = useCallback(() => {
		setIsDeleteChapter(false);
		setDeleteIndex(null);
	}, []);

	const handleDragEnd = useCallback((result: DropResult) => {
		// Handle drag end logic
		const items = reorder(
			list,
			result.source.index,
			result?.destination?.index || 0
		);
		setList(items);
		const chapters = reorderChapters(formik?.values?.chapters, result.source.index,
			result?.destination?.index || 0);
		formik.setFieldValue('chapters', chapters);
	}, [formik]);

	const reorderChapters = (list: ChaptersType[], startIndex: number, endIndex: number) => {
		const results = Array.from(list);
		const [removed] = results.splice(startIndex, 1);
		results.splice(endIndex, 0, removed);
		return results.map((data,index:number)=>{
			return {
				...data,
				order:index+1
			}
		})
	}

	const onSaveAsDraft = useCallback((learner?: boolean) => {
		console.log(formik.values.chapters)
		createStepTwo({
			variables: {
				courseData: {
					course_id: isViewAsLearner === 'true'? uuid:course_id,
					is_draft: true,
					delete_chapter_ids: formik?.values?.delete_chapter_ids,
					chapterData: formik?.values?.chapters
				}
			}
		}).then((res) => {
			const transformedArray = generateTraformedArray(res?.data?.courseCreateStepTwo?.data?.course_chapters, true)
			formik?.setFieldValue('chapters', transformedArray)
			formik?.setFieldValue('delete_chapter_ids', []);
			dispatch(setCreateYourContentDetails({
				course_id: course_id,
				chapterType: formik?.values?.chapterType,
				delete_chapter_ids: [],
				chapters: transformedArray
			}));
			if (learner===true) {
				navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/?uuid=${isViewAsLearner === 'true' ? uuid : course_id}&isViewAsLearner=true&step=1`)
				}
			else{
				toast.success('Draft has been saved succefully.');
			}
		}).catch((err) => {
			toast.error(err?.networkError?.result?.errors?.[0]?.message);
		})
	}, [formik])

	const onViewAsLearner = useCallback(() => {
		onSaveAsDraft(true)
	}, [formik]);

	const conditionCheckerStepTwo=(condition:boolean)=>{
		if(condition&&editIndex!==null){
			return  formik?.values?.chapters?.[editIndex] 
		}
		return null;
	}
	return (
		<>
			{contentLoadingState ? (
				<LoadingIndicator />
			) : (
				<>
					<div className="flex justify-end flex-wrap w-full gap-3 xmd:gap-4 lg:w-auto lg:flex-nowrap pt-0.5 mb-3 md:mb-5">
						<div className='flex flex-wrap items-center w-full gap-4 md:w-auto'>
							<div className='w-full md:w-[220px]'>
								<DropDown className='w-full -mt-2' label='Select Chapter Type' inputIcon={<DropdownArrowDown fontSize='12' />} name='chapterType' id='chapterType' value={formik?.values?.chapterType} onChange={formik.handleChange} options={CHAPTER_TYPE_DRP} required={true} disabled={is_published} />
							</div>
						</div>
					</div>
					{+formik?.values?.chapterType === CHAPTER_TYPES.YOUTUBE_VIDEO && <YoutubeComponent onAddChapter={onAddYouTubeChapter} disabled={is_published} editData={conditionCheckerStepTwo(formik?.values?.chapterType === CHAPTER_TYPES.YOUTUBE_VIDEO)} />}
					{+formik?.values?.chapterType === CHAPTER_TYPES.PDF && <PdfDocumentComponent onAddChapter={onAddDocument} disabled={is_published} editData={conditionCheckerStepTwo(formik?.values?.chapterType === CHAPTER_TYPES.PDF)} />}
					{+formik?.values?.chapterType === CHAPTER_TYPES.TEXT && <TextBasedComponent onAddChapter={onAddTextBasedChapter} disabled={is_published} editData={conditionCheckerStepTwo(formik?.values?.chapterType === CHAPTER_TYPES.TEXT)} />}
					{+formik?.values?.chapterType === CHAPTER_TYPES?.QUIZ && <QuizCompoent onAddChapter={onAddQuizChapter} disabled={is_published} editData={conditionCheckerStepTwo(formik?.values?.chapterType === CHAPTER_TYPES.QUIZ)} />}
					{list.length ? <div>
						<AppDraggableList
							droppableId="unique-id" // specific for this drag n drop continaer
							data={list}
							onDragEnd={handleDragEnd}
							renderItem={renderDragItem}
							renderWrapper={renderWrapper}
							direction="vertical"
							disabled={is_published}
						/>
					</div> : null}
					<div className='flex flex-wrap justify-between gap-3 mt-5 md:mt-7.5 md:flex-nowrap md:gap-5'>
						<div className="flex flex-col sm:flex-row w-full gap-3 md:gap-5">
							<Button className='btn-secondary btn-normal w-full md:w-[180px] whitespace-nowrap' type='button' label={t('View as a Learner')} title='View as a Learner' onClick={onViewAsLearner} />
							{(!is_published||is_draft) && <Button className='btn-primary btn-normal w-full md:w-40 whitespace-nowrap' type='button' label={t('Save as Draft')} title='Save as Draft' onClick={onSaveAsDraft} disabled={step2Loader} />}
						</div>
						<div className='flex flex-col sm:flex-row justify-end w-full gap-3 md:gap-5'>
							<Button className='btn bg-default btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap ' type='button' label={t('Back')} title='Back' onClick={onBackCreateYourContent} />
							<Button className='btn bg-default btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap ' type='button' label={t('Save & Next')} title='Save & Next' onClick={formik.handleSubmit} disabled={step2Loader} />
						</div>
					</div>

					{isDeleteChapter && <CommonModel warningText={DELETE_WARNING_TEXT} onClose={() => onCloseChapter()} action={handleDeleteChapter} show={isDeleteChapter} />}
				</>)}
		</>
	);
};

export default CreateYourContent;
