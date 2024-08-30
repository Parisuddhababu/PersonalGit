import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import { Edit, Trash } from '@components/icons/icons';
import Button from '@components/button/button';
import { useDispatch, useSelector } from 'react-redux';
import { setAddYourFAQDetails, setActiveStep, setBackActiveStep } from 'src/redux/courses-management-slice';
import { useFormik } from 'formik';
import useValidation from '@framework/hooks/validations';
import CommonModel from '@components/common/commonModel';
import { DELETE_WARNING_TEXT, ROUTES } from '@config/constant';
import { whiteSpaceRemover } from '@utils/helpers';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_FAQ_STEP_3 } from '@framework/graphql/mutations/course';
import { toast } from 'react-toastify';
import { GET_FAQS_COURSE_DETAILS } from '@framework/graphql/queries/getCourses';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';
import { FAQItem, FormValues } from 'src/types/common';
import Textarea from '@components/textarea/textarea';


const AddYourFaq = () => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [deletedIds, setDeletedIds] = useState<string[]>([]);
	const { addFAQValidationSchema } = useValidation();
	const [faqList, setFaqList] = useState<FAQItem[]>([]);
	const [isDeleteFAQ, setIsDeleteFAQ] = useState<boolean>(false);
	const [isFaqDeleteData, setIsFaqDeleteData] = useState<number | string | undefined>();
	const [createFaqStepThree, { loading: step3Loader }] = useMutation(CREATE_FAQ_STEP_3);
	const [queryParams] = useSearchParams();
	const uuid = queryParams.get('uuid');
	const isViewAsLearner = queryParams.get('isViewAsLearner');
	const { data: faqData, loading: faqLoaderState, refetch: stepThreeRefetch } = useQuery(GET_FAQS_COURSE_DETAILS, {
		variables: {
			courseId: uuid
		},
		skip: !uuid,
		fetchPolicy: 'network-only'
	});
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { addYourFAQDetails, course_id, is_published, is_draft } = useSelector(((state: { coursesManagement: any }) => state.coursesManagement));
	const initialValues: FormValues = {
		uuid: '',
		question: '',
		answer: '',
		editedIndex: null,
	}

	useEffect(() => {
		if (!addYourFAQDetails.length&&faqData?.getFaqsByCourseDetails?.data?.faqData?.length) {
			setFaqList(faqData?.getFaqsByCourseDetails?.data?.faqData?.map((data: FAQItem) => {
				return {
					uuid: ((location.pathname.includes(`/${ROUTES.app}/${ROUTES.updateEducationAndEngagement}`)&&faqData?.getFaqsByCourseDetails?.data?.course_uuid===uuid) || (isViewAsLearner === 'true')) ? data?.uuid : '',
					question: data?.question,
					answer: data?.answer,
					order: data?.order
				}
			}))
		}else{
			setFaqList(addYourFAQDetails);
		}
		if (!faqData?.getFaqsByCourseDetails?.data?.faqData && faqData?.getFaqsByCourseDetails?.data?.template_uuid) {
			stepThreeRefetch({
				courseId: faqData?.getFaqsByCourseDetails?.data?.template_uuid
			})
		}
	}, [faqData?.getFaqsByCourseDetails,isViewAsLearner,addYourFAQDetails])

	const formik = useFormik({
		initialValues,
		validationSchema: addFAQValidationSchema,
		onSubmit: (values) => {
			const { editedIndex } = formik.values;
			const updatedFaqList = [...faqList];
			if (editedIndex !== undefined && editedIndex !== null) {
				// Replace the existing FAQ item with the edited data
				updatedFaqList[editedIndex] = {
					uuid: values?.uuid,
					question: values.question,
					answer: values.answer,
				};
			} else {
				// If there's no edited index, it's a new FAQ item, so add it to the list
				updatedFaqList.push({
					uuid: values?.uuid,
					question: values.question,
					answer: values.answer,
					order: updatedFaqList?.length + 1
				});
			}
			dispatch(setAddYourFAQDetails(updatedFaqList));
			setFaqList(updatedFaqList);
			formik.resetForm();
		},
	});

	const onBack = useCallback(() => {
		dispatch(setBackActiveStep());
	}, []);

	const onNextPage = useCallback(() => {
		createFaqStepThree({
			variables: {
				courseData: {
					delete_faqs_ids: deletedIds,
					course_id: isViewAsLearner === 'true' ? uuid : course_id,
					faqs: faqList
				}
			}
		}).then((res) => {
			const simplifiedFaqData = res?.data?.courseCreateStepThree?.data?.map((faq: FAQItem) => {
				const { uuid, question, answer, order } = faq;
				return { uuid, question, answer, order };
			});
			dispatch(setAddYourFAQDetails(simplifiedFaqData));
			dispatch(setActiveStep());
			setDeletedIds([]);
		}).catch((err) => {
			toast.error(err?.networkError?.result?.errors?.[0]?.message);
		})

	}, [faqList])

	const deleteData = () => {
		// Create a new FAQ list without the item at the specified index
		const deleteList = faqList.filter((_, i: number) => i === isFaqDeleteData);
		const updatedFaqList = faqList.filter((_, i: number) => i !== isFaqDeleteData);
		if(deleteList?.[0]?.uuid!==''){
			setDeletedIds(prev => [...prev, deleteList?.[0]?.uuid]);
		}
		setFaqList(updatedFaqList);
		setIsDeleteFAQ(false);
	};

	const editData = (index: number) => {
		const editFaqList = faqList?.[index];
		formik.setFieldValue('uuid', editFaqList.uuid);
		formik.setFieldValue('question', editFaqList.question);
		formik.setFieldValue('answer', editFaqList.answer);
		formik.setFieldValue('editedIndex', index);
	}

	const onClose = useCallback(() => {
		setIsDeleteFAQ(false);
	}, []);

	const onDeleteFAQ = useCallback((index: number) => {
		setIsFaqDeleteData(index);
		setIsDeleteFAQ(true)
	}, [faqList]);

	const OnBlurBanner = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	const draft = (faqList: FAQItem[], learner: boolean) => {

		createFaqStepThree({
			variables: {
				courseData: {
					delete_faqs_ids: deletedIds,
					course_id: isViewAsLearner === 'true' ? uuid : course_id,
					faqs: faqList
				}
			}
		}).then((res) => {
			const simplifiedFaqData = res?.data?.courseCreateStepThree?.data?.map((faq: FAQItem) => {
				const { uuid, question, answer, order } = faq;
				return { uuid, question, answer, order };
			});
			setFaqList(simplifiedFaqData);
			dispatch(setAddYourFAQDetails(simplifiedFaqData));
			if (learner) {
				navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/?uuid=${isViewAsLearner === 'true' ? uuid : course_id}&isViewAsLearner=true&step=2`);
			} else {
				toast.success('Draft has been saved succefully.');
			}
			setDeletedIds([]);
		}).catch((err) => {
			toast.error(err?.networkError?.result?.errors?.[0]?.message);

		})
	}

	const onSaveAsDraft = useCallback(() => {
		draft(faqList, false);
	}, [faqList])

	const onViewAsLearner = () => {
		draft(faqList, true)
	}
	return (
		<div>
			{faqLoaderState ? (
				<LoadingIndicator />
			) : (
				<form onSubmit={formik?.handleSubmit}>
					<div className='overflow-hidden border border-solid border-border-primary rounded-xl'>
						<div className='p-3 pb-5 border-b border-solid md:p-5 md:pb-7 border-border-primary'>
							<h6 className='mb-3 font-bold md:mb-5 '>{t('Add Your FAQ`s')}</h6>
							<div className='w-full max-w-[1004px] mb-3 md:mb-5'>
								<TextInput
									placeholder={t('Add Question here')}
									type='text'
									id='question'
									name='question'
									label='Question'
									value={formik.values.question}
									onChange={formik.handleChange}
									error={formik.errors.question && formik.touched.question ? formik.errors.question : ''}
									onBlur={OnBlurBanner}
								/>
							</div>
							<div className="w-full max-w-[1004px] mb-5 md:mb-7">
								<Textarea
									label={t('Answer')}
									rows={7}
									value={formik.values.answer}
									name='answer'
									onChange={formik.handleChange}
									onBlur={OnBlurBanner}
									placeholder='Enter answer'
									error={formik.errors.answer && formik.touched.answer ? formik.errors.answer : ''} />
							</div>
							<Button
								className='btn-secondary btn-normal w-full md:w-[160px]'
								label={formik.values.editedIndex !== null ? t('Edit') : t('Add')}
								type='button'
								onClick={() => formik.handleSubmit()}
								title={`${formik.values.editedIndex !== null ? t('Edit') : t('Add')}`}
							/>
						</div>

						<div className='px-3 md:px-5 py-5 md:py-7 overflow-auto max-h-[310px] md:max-h-[236px]'>
							{faqList.map((faq: FAQItem, index: number) => (
								<div className='pb-3 last:pb-0' key={`faq-list-${index + 1}`}>
									<div className='flex flex-wrap items-center justify-between gap-2 mb-2'>
										<p className='font-bold leading-6'>{faq.question}</p>
										<div className='flex items-center gap-3 md:gap-5'>
											<Button className='bg-transparent cursor-pointer btn-default' onClick={() => editData(index)} label={''} title='Edit'>
												<Edit className='fill-primary' />
											</Button>
											<Button className='bg-transparent cursor-pointer btn-default' onClick={() => onDeleteFAQ(index)} label={''} title='Delete'>
												<Trash className='fill-error' />
											</Button>
										</div>
									</div>
									<p className="break-all" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
								</div>
							))}
						</div>
					</div>
					<div className='flex flex-wrap justify-between gap-3 mt-5 md:mt-7.5 md:flex-nowrap md:gap-5'>
						<div className="flex flex-col sm:flex-row w-full gap-3 md:gap-5">
							<Button className='btn-secondary btn-normal w-full md:w-[180px] whitespace-nowrap' type='button' label={t('View as a Learner')} title='View as a Learner' onClick={onViewAsLearner} />
							{(!is_published || is_draft) && <Button className='btn-primary btn-normal w-full md:w-40 whitespace-nowrap' type='button' label={t('Save as Draft')} title='Save as Draft' onClick={onSaveAsDraft} disabled={step3Loader} />}
						</div>
						<div className='flex flex-col sm:flex-row justify-end w-full gap-3 md:gap-5'>
							<Button className='btn bg-default btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap ' type='button' label={t('Back')} title='Back' onClick={onBack} />
							<Button className='btn bg-default btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap ' type='submit' label={t('Save & Next')} title='Save & Next' onClick={onNextPage} disabled={step3Loader} />
						</div>
					</div>
				</form>)}
			{isDeleteFAQ && (
				<CommonModel
					warningText={DELETE_WARNING_TEXT}
					onClose={onClose}
					action={() => deleteData()}
					show={isDeleteFAQ}
				/>
			)}
		</div>
	);
};

export default AddYourFaq;
