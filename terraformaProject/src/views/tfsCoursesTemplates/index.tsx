import React, { ReactElement, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import ButtonWithoutLoader from '@components/button/buttonWithoutLoader';
import { Clock, Filter, InfoIcon } from '@components/icons/icons';
import DropDown from '@components/dropdown/dropDown';
import { ConvertMinutesToHours, ROUTES, USER_TYPE } from '@config/constant';
import { GET_COURSES_TEMPLATES } from '@framework/graphql/queries/getCourses';
import { useQuery } from '@apollo/client';
import { DropdownOptionType, } from '@types';
import { useFormik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';
import { toast } from 'react-toastify';
import UpdatedHeader from '@components/header/updatedHeader';
import { GET_ACTIVE_CATEGORY } from '@framework/graphql/queries/category';
import { StateDataArr } from '@framework/graphql/graphql';
import { useDispatch, useSelector } from 'react-redux';
import { setResetAllCoursesData, setTemplateData } from 'src/redux/courses-management-slice';
import TextInput from '@components/textInput/TextInput';
import { CourseData, PagenationParamsCousreTemplate } from 'src/types/courseTemplate';
import logo from '@assets/images/login-img.jpg';
import { UserProfileType } from 'src/types/common';

const TFSCoursesTemplates: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [queryParams] = useSearchParams();
	const isSelectCourseTemplate = queryParams.get('IsSelectCourseTemplate');
	const { data: getCoursesTemplatesData, refetch, loading } = useQuery(GET_COURSES_TEMPLATES, {
		variables: {
			filterData: {
				limit: 8,
				page: 1,
				sortField: 'createdAt',
				sortOrder: 'descend',
				search: '',
				category: [],
			}
		}
	});
	const { data: categoryData } = useQuery(GET_ACTIVE_CATEGORY, { variables: { limit: 10, page: 1, sortField: 'name', sortOrder: '', search: '' } });
	const [filterData, setFilterData] = useState<PagenationParamsCousreTemplate>({
		limit: 8,
		page: 1,
		sortField: 'createdAt',
		sortOrder: 'descend',
		search: '',
		category: [],
	});
	const [categoryDrpData, setCategoryDrpData] = useState<DropdownOptionType[]>([]);
	const [openFilter, setOpenFilter] = useState<boolean>(false);
	const [onViewMore, setOnViewMore] = useState<boolean>(false);
	const [isRefetching, setIsRefetching] = useState<boolean>(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [isTemplateData, setIsTemplateData] = useState<any[]>([]);
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
	const userType = userProfileData?.getProfile?.data?.user_type;
	const isCreator = userProfileData?.getProfile?.data?.is_course_creator;

	const initialValues = {
		selectedCategory: '',
		title: ''
	};

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			// Handle form submission
			setOnViewMore(false);
			setFilterData({
				...filterData,
				page: 1,
				category: values?.selectedCategory ? [values?.selectedCategory] : [],
				search: values?.title
			});
		}
	});

	useEffect(() => {
		const tempDataArr = [] as DropdownOptionType[];
		categoryData?.getActiveCategories?.data?.categories?.map((data: StateDataArr) => {
			tempDataArr.push({ name: data?.name, key: data?.uuid });
		});
		setCategoryDrpData(tempDataArr);
	}, [categoryData]);

	useEffect(() => {
		const tempDataArr: DropdownOptionType[] = [];
		getCoursesTemplatesData?.getCourseTemplates?.data?.courses?.map((data: CourseData) => {
			tempDataArr.push(data);
		});
		if (onViewMore) {
			setIsTemplateData([...isTemplateData, ...tempDataArr]);
			setOnViewMore(onViewMore ?? !onViewMore);
		} else {
			setIsTemplateData(tempDataArr);
		}
	}, [getCoursesTemplatesData]);

	const onCourseView = (uuid: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/?uuid=${uuid}`)
	}

	const viewMore = () => {
		setOnViewMore(true);
		setFilterData({
			...filterData,
			page: filterData.page + 1,
			category: formik?.values?.selectedCategory ? [formik?.values?.selectedCategory] : [],
		});
	}

	useEffect(() => {
		const fetchData = async () => {
			setIsRefetching(true);
			try {
				await refetch({
					filterData: { ...filterData },
				});
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				toast.error(error.networkError.result.errors[0].message)
			} finally {
				// Reset loading state after refetch is complete (whether successful or not)
				setIsRefetching(false);
				setOnViewMore(onViewMore ?? !onViewMore);
			}
		};
		if (filterData) {
			// Call the async function to fetch data
			fetchData();
		}
	}, [filterData]);

	const onNavigateCreateCourse = useCallback(() => {
		dispatch(setResetAllCoursesData());
		navigate(`/${ROUTES.app}/${ROUTES.educationAndEngagement}`)
	}, []);

	const onSelectView = (data: { title: string; uuid: string; }) => {
		dispatch(setTemplateData([{ name: data?.title, key: data?.uuid }]));
		navigate(`/${ROUTES.app}/${ROUTES.educationAndEngagement}/?uuid=${data?.uuid}`);
	}

	const headerActionConst = () => {
		if ([USER_TYPE?.SUPER_ADMIN, USER_TYPE?.SUBSCRIBER_ADMIN].includes(userType)) {
			return (
				<>
					<Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter(!openFilter)}>
						<Filter />
					</Button>
					{!isSelectCourseTemplate && <Button label='+ Create Course' className='btn-primary  btn-normal md:w-[150px] whitespace-nowrap' onClick={() => onNavigateCreateCourse()}>
					</Button>}

				</>
			)
		}
		if (isCreator) {
			return (
				<>
					<Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter(!openFilter)}>
						<Filter />
					</Button>

					{!isSelectCourseTemplate && <Button label='+ Create Course' className='btn-primary  btn-normal md:w-[150px] whitespace-nowrap' onClick={() => onNavigateCreateCourse()}>
					</Button>}
				</>
			)
		}
		return (
			<>
				<Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter(!openFilter)}>
					<Filter />
				</Button>
			</>
		)

	}

	const resetTemplateFilter = useCallback(() => {
		formik?.resetForm();
		setFilterData({
			limit: 8,
			page: 1,
			sortField: 'createdAt',
			sortOrder: 'descend',
			search: '',
			category: [],
		})
	}, [])

	const viewIsEditableTemplate = (data: CourseData) => {
		return [USER_TYPE?.SUPER_ADMIN, USER_TYPE?.SUBSCRIBER_ADMIN].includes(+data?.created_by?.user_type) || userProfileData?.getProfile?.data?.is_course_admin || userProfileData?.getProfile?.data?.is_course_creator
	}

	const conditionChecker = (condition: boolean, value1: ReactElement | string | number | null | boolean, value2: ReactElement | string | number | null | boolean) => {
		return condition ? value1 : value2;
	}


	return (
		<>
			<UpdatedHeader headerActionConst={headerActionConst} headerTitle='All Courses' />
			<div>
				{loading ? <LoadingIndicator /> :
					<div>

						{openFilter && <form onSubmit={formik.handleSubmit}> <div className="flex justify-start flex-wrap 2xl:flex-nowrap p-5 mb-5 border border-border-primary rounded-xl bg-light-blue gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 items-end">
							<div className='w-full lg:w-[calc(33.3%-14px)]'>
								<TextInput placeholder='Search' name='title' value={formik?.values?.title} onChange={formik?.handleChange} />
							</div>
							<DropDown placeholder={'Category'} className='w-full lg:w-[calc(33.3%-14px)]' label='' name='selectedCategory' onChange={formik.handleChange} value={formik.values.selectedCategory} options={categoryDrpData} id='selectedCategory' />
							<Button type='submit' className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Search')} />
							<Button type='button' onClick={resetTemplateFilter} className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto lg:mt-0' label={t('Reset')} />
						</div>
						</form>}

						{(isRefetching && !onViewMore) ? <LoadingIndicator /> :
							<div>
								<div className='p-3 border border-solid md:p-5 border-border-primary rounded-xl'>
									<h5 className='mb-5'>{t('All Courses')}</h5>
									{getCoursesTemplatesData?.getCourseTemplates?.data?.count > 0 ?
										<div className="flex flex-wrap items-start justify-center gap-5 mb-5 course-wrapper md:mb-7 sm:justify-start">
											{isTemplateData?.map((data: CourseData) => {
												return <div key={data?.uuid} className='2xl:w-[calc(25%-15px)] xl:w-[calc(33.3%-15px)] xmd:w-[calc(50%-10px)] w-full border border-solid border-border-primary rounded-xl overflow-hidden hover:shadow-outline cursor-pointer' >
													<picture className='w-full block relative border-b border-solid border-border-primary'>
														<img src={conditionChecker((!data?.course_image || data?.course_image === ''), logo, `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.course_image}`) as string} alt="Course" title="Course" width={360} height={200} className='object-cover w-full h-full' />
													</picture>
													<div className="w-full p-3 md:p-5 flex flex-col min-h-340px">
														<div className='flex flex-col flex-1'>
															<div className="flex-wrap flex items-center justify-between mb-2.5 gap-2">
																<div>
																	{data?.category?.name && <span className='min-h-9 flex items-center justify-center bg-yellow font-bold text-dark-grey md:mb-0 px-4 rounded-xl min-w-[100px] text-sm mr-4'>{data?.category?.name}</span>}
																</div>
																{viewIsEditableTemplate(data) &&
																	<div className='relative group'>
																		<InfoIcon className='text-base md:text-lg cursor-pointer fill-primary' />
																		<p className='absolute whitespace-nowrap left-auto shadow-infos p-1.5 md:p-2.5 bg-white border border-border-primary rounded-xl md:right-0 xd:left-1 -top-[68px] md:-top-14 hidden group-hover:inline-block z-10'>{conditionChecker(data?.is_editable, 'Editable Course', 'Non-Editable Course')}</p>
																	</div>
																}
															</div>
															<h4 className='text-base hover:text-primary mb-2.5 line-clamp-2'>{data?.title}</h4>
															<p className='leading-6 mb-3 md:mb-5 w-full text-ellipsis line-clamp-3 break-words' dangerouslySetInnerHTML={{ __html: data?.description }}></p>
															<div className="group max-xmd:flex-wrap flex items-center justify-between mb-5 mt-auto">
																<div className='mr-4 flex items-center'>
																	<picture className='w-10 h-10 block rounded-[40px] mr-2.5'>
																		<img src={conditionChecker((!data?.course_image || data?.course_image === ''), logo, `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.instructor_profile}`) as string} alt="User" title="User" width={40} height={40} className='object-cover w-full h-full rounded-[40px]' />
																	</picture>
																	<h5 className='text-base font-semibold'>{data?.instructor_name}</h5>
																</div>
																<div className="time max-xmd:my-2.5">
																	<span className="flex text-xs"><span className='mr-1 text-base'><Clock className='fill-secondary' /></span><span>{ConvertMinutesToHours(data?.estimate_time)}</span></span>
																</div>
															</div>
															<div className={`flex flex-wrap items-center ${conditionChecker(isSelectCourseTemplate === 'true', 'justify-between', 'w-full')} gap-3 md:gap-5`}>
																<Button className={`btn-secondary btn-normal w-full ${conditionChecker(isSelectCourseTemplate === 'true', 'md:w-[calc(50%-10px)]', 'w-full')} `} label={t('View')} onClick={() => onCourseView(data.uuid)}
																	title={`${t('View')}`} />
																{(isSelectCourseTemplate === 'true') &&
																	<Button className='btn-primary btn-normal w-full md:w-[calc(50%-10px)]' label={t('Select')} onClick={() => onSelectView(data)} title={`${t('Select')}`} />}
															</div>
														</div>

													</div>
												</div>;
											})}
										</div> : <div>No Records Found!!!</div>}
									<div className="flex items-center justify-center">
										<ButtonWithoutLoader className='btn-secondary btn-normal w-full md:w-[120px]' label={conditionChecker((isRefetching && onViewMore), t('Loading...!'), t('Load More')) as string} onClick={() => viewMore()} disabled={loading || isRefetching || (getCoursesTemplatesData?.getCourseTemplates?.data?.count === isTemplateData.length)}
											title={`${isRefetching && onViewMore ? t('Loading...!') : t('Load More')}`} />
									</div>
								</div>
							</div>}
					</div>
				}
			</div>
		</>
	);
};
export default TFSCoursesTemplates;
