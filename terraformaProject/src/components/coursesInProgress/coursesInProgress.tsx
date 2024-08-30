import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '@assets/images/login-img.jpg';
import profile from '@assets/images/default-user-image.png';
import Button from '@components/button/button';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import UpdatedHeader from '@components/header/updatedHeader';
import { Filter } from '@components/icons/icons';
import DropDown from '@components/dropdown/dropDown';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';
import { useQuery } from '@apollo/client';
import { COURSE_PROGRESS_VARIABLES, NumberFixedDigit, ROUTES } from '@config/constant';
import { GET_USER_COURSES_IN_PROGRESS_AND_ASSIGNED } from '@framework/graphql/queries/courseDashboard';
import { useFormik } from 'formik';
import { DropdownOptionType, PaginationParamsCourseInProgress } from '@types';
import { GET_ACTIVE_CATEGORY } from '@framework/graphql/queries/category';
import { StateDataArr } from '@framework/graphql/graphql';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ButtonWithoutLoader from '@components/button/buttonWithoutLoader';
import TextInput from '@components/textInput/TextInput';
import { CourseData, CoursesInProgressProps } from 'src/types/courseAssignedAndNotAssigned';

const CoursesInProgress = ({ slider }: CoursesInProgressProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [openFilter, setOpenFilter] = useState<boolean>(false);
	const [onViewMore, setOnViewMore] = useState<boolean>(false);
	const [isRefetching, setIsRefetching] = useState<boolean>(false);
	const [isTemplateData, setIsTemplateData] = useState<CourseData[]>([]);
	const { data: categoryData } = useQuery(GET_ACTIVE_CATEGORY, { variables: { limit: 10, page: 1, sortField: 'name', sortOrder: '', search: '' } });
	const [filterData, setFilterData] = useState<PaginationParamsCourseInProgress>({
		sortOrder: 'ascend',
		sortField: 'created_at',
		type: COURSE_PROGRESS_VARIABLES.progress,
		search: '',
		page: 1,
		limit: 8,
		category_id: '',
	});
	const [categoryDrpData, setCategoryDrpData] = useState<DropdownOptionType[]>([]);

	const { data: getCourseData, refetch, loading } = useQuery(GET_USER_COURSES_IN_PROGRESS_AND_ASSIGNED, {
		variables: {
			inputData: {
				sortOrder: 'ascend',
				sortField: 'created_at',
				search: '',
				page: 1,
				limit: 8,
				category_id: '',
				type: COURSE_PROGRESS_VARIABLES.progress
			}
		}
	});

	const initialValues = {
		title: '',
		selectedCategory: '',
	};

	const formik = useFormik({
		initialValues,
		onSubmit: () => {
			// Handle form submission
		},
	});


	useEffect(() => {
		const tempDataArr = [] as DropdownOptionType[];
		categoryData?.getActiveCategories?.data?.categories?.map((data: StateDataArr) => {
			tempDataArr.push({ name: data?.name, key: data?.uuid });
		});
		setCategoryDrpData(tempDataArr);
	}, [categoryData]);

	useEffect(() => {
		const tempDataArr: CourseData[] = [];
		getCourseData?.getUserCoursesInProgressOrAssigned?.data?.courses?.map((data: CourseData) => {
			tempDataArr.push(data);
		});
		if (onViewMore) {
			setIsTemplateData([...isTemplateData, ...tempDataArr]);
			setOnViewMore(onViewMore ?? !onViewMore);
		} else {
			setIsTemplateData(tempDataArr);
		}
	}, [getCourseData]);

	const viewMore = () => {
		setOnViewMore(true);
		setFilterData({
			...filterData,
			page: filterData.page + 1,
			category_id: formik?.values?.selectedCategory ? formik?.values?.selectedCategory : '',
		});
	}

	const onSearch = useCallback(() => {
		setOnViewMore(false);
		setFilterData({
			...filterData,
			page: 1,
			search: formik?.values?.title,
			category_id: formik?.values?.selectedCategory ? formik?.values?.selectedCategory : '',
		});
	}, [filterData, formik]);

	const onCourseView = (uuid: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.tfsCoursesTemplates}/${ROUTES.courseDetails}/?uuid=${uuid}`)
	}

	useEffect(() => {
		const fetchData = async () => {
			setIsRefetching(true);
			try {
				await refetch({
					inputData: { ...filterData },
				});
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				toast.error(error?.networkError?.result?.errors?.[0]?.message)
			} finally {
				setIsRefetching(false);
				setOnViewMore(onViewMore ?? !onViewMore);
			}
		};
		if (filterData) {
			fetchData();
		}
	}, [filterData]);

	const onViewAll = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.courseInProgressList}`)
	}, [])

	const settings = {
		dots: false,
		infinite: false,
		arrows: true,
		speed: 500,
		slidesToShow: 4,
		slidesToScroll: 1,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 1600,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
					infinite: true
				},
			},
			{
				breakpoint: 1199,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2,
				},
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};

	const headerActionConst = () => {
		return (
			<Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter(!openFilter)} title='Filter'>
				<Filter />
			</Button>
		)
	}

	const onResetFilterInProgress = useCallback(() => {
		formik.setValues({
			title: '',
			selectedCategory: ''
		});
		setFilterData({
			...filterData,
			page: 1,
			search: '',
			category_id: '',
		})
	}, [filterData])

	return (
		<>
			{!slider && <UpdatedHeader headerActionConst={headerActionConst} />}
			<div className="mb-7">
				<div className="p-5 border border-solid border-border-primary rounded-xl">
					<div className="flex flex-wrap justify-between gap-3 mb-5 md:gap-5">
						<h6>{t('Courses in Progress')}</h6>
						{slider && <Button className="btn btn-normal bg-primary text-white text-xs w-full sm:w-[80px] h-[36px] whitespace-nowrap" type='button' onClick={() => onViewAll()} label={t('View All')} title={`${t('View All')}`} />}
					</div>

					{!slider && <>
						{(loading || (isRefetching && !onViewMore)) ? <LoadingIndicator /> :
							<>
								{openFilter && <div className="flex justify-start flex-wrap 2xl:flex-nowrap p-5 mb-5 border border-border-primary rounded-xl bg-light-blue gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 items-end">
									<div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
										<TextInput value={formik.values.title} placeholder={'Search'} type='text' id='title' name='title' onChange={formik.handleChange} />
									</div>
									<DropDown placeholder={'Category'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]' label='' name='selectedCategory' onChange={formik.handleChange} value={formik.values.selectedCategory} options={categoryDrpData} id='selectedCategory' />
									<Button className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto mt-2 lg:mt-0' label={t('Search')} type='button' onClick={() => onSearch()} title={`${t('Search')}`} />
									<Button className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto mt-2 lg:mt-0' label={t('Reset')} type='button' onClick={() => onResetFilterInProgress()} title={`${t('Reset')}`} />

								</div>}
								<div className="flex flex-wrap items-start justify-center gap-5 mb-7 sm:justify-start">
									{getCourseData?.getUserCoursesInProgressOrAssigned?.data?.count > 0 ? <>
										{isTemplateData?.map((data: CourseData) => {
											return (
												<div className="w-full 2xl:w-[calc(25%-15px)] xl:w-[calc(33.3%-15px)] lg:w-[calc(50%-15px)] border-border-primary rounded-t-xl h-full cursor-pointer" key={data?.uuid} onClick={() => onCourseView(data.uuid)}>
													<picture className="w-full h-[200px] block relative">
														<img src={(!data?.course_image || data?.course_image !== '') ? `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.course_image}` : logo} alt="image" title="" className="object-cover w-full h-full rounded-t-xl object-center" />
													</picture>
													<div className="w-full p-5 border-b border-solid border-x border-border-primary rounded-b-xl flex flex-col min-h-340px">
														<div className='flex flex-col flex-1'>
															<h4 className='text-base hover:text-primary mb-2.5 line-clamp-2'>{data?.title}</h4>
															<p className='leading-6 mb-3 md:mb-5 w-full text-ellipsis line-clamp-3 break-words' dangerouslySetInnerHTML={{ __html: data?.description }}></p>
															<div className="flex justify-start items-center gap-[10px] mb-5 mt-auto">
																<picture className='h-[60px] flex items-center justify-center rounded-full overflow-hidden border border-solid border-border-primary' >
																	{
																		data?.instructor_profile
																			?
																			<img src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${data?.instructor_profile}`} alt="" title="" className="object-cover w-full h-full" />
																			:
																			<img src={profile} alt="" title="" className="object-cover w-full h-full" />
																	}

																</picture>
																<p className="font-semibold">{data?.instructor_name}</p>
															</div>
															<div >
																<div className='min-h-[6px] h-1.5 bg-border-primary mb-2 rounded-xl'>
																	<div className="block h-full bg-blue-600 rounded-xl" style={{ width: `${data?.percentage}%` }} />
																</div>
																<div className="mb-5 flex justify-between">
																	<span className="text-sm leading-5">Chapter {data?.chaptersCompleted} of {data?.totalChapters}</span>
																	<span className="text-sm font-bold leading-5">{NumberFixedDigit(data?.percentage)}%</span>
																</div>
															</div>
														</div>
													</div>
												</div>
											)
										})}
									</> : <div>No Records Found!!!</div>}
								</div>
							</>
						}
					</>
					}


					{!slider && <div className="flex items-center justify-center">
						<ButtonWithoutLoader className='btn-secondary btn-normal w-full md:w-[120px]' label={isRefetching && onViewMore ? t('Loading...!') : t('Load More')} onClick={() => viewMore()} disabled={loading || isRefetching || (getCourseData?.getUserCoursesInProgressOrAssigned?.data?.count === isTemplateData.length)} title={`${isRefetching && onViewMore ? t('Loading...!') : t('Load More')}`} />
					</div>}

					{slider && <Slider {...settings}>
						{isTemplateData?.map((data: CourseData) => {
							return (
								<div className="w-full 2xl:w-[calc(25%-15px)] xl:w-[calc(33.3%-15px)] lg:w-[calc(50%-15px)] border-border-primary rounded-t-xl h-full px-2.5 cursor-pointer" key={data?.uuid} onClick={() => onCourseView(data.uuid)}>
									<picture className="w-full h-[200px] block relative">
										<img src={(!data?.course_image || data?.course_image !== '') ? `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.course_image}` : logo} alt="image" title="" className="object-cover w-full h-full rounded-t-xl object-center " />
									</picture>
									<div className="w-full p-5 border-b border-solid border-x border-border-primary rounded-b-xl flex flex-col min-h-340px">
										<div className='flex flex-col flex-1'>
											<h4 className='text-base hover:text-primary mb-2.5 line-clamp-2'>{data?.title}</h4>
											<p className='leading-6 mb-3 md:mb-5 w-full text-ellipsis line-clamp-3 break-words' dangerouslySetInnerHTML={{ __html: data?.description }}></p>
											<div className="flex justify-start items-center gap-[10px] mb-5 mt-auto">
												<picture>
													<img src={(!data?.instructor_profile || data?.instructor_profile !== '') ? `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.instructor_profile}` : profile} alt="" title="" className="rounded-full min-w-[40px] h-10" />
												</picture>
												<p className="font-semibold">{data?.instructor_name}</p>
											</div>
											<div >
												<div className='min-h-[6px] h-1.5 rounded-xl bg-border-primary mb-2'>
													<div className="block h-full bg-blue-600 rounded-xl" style={{ width: `${data?.percentage}%` }} />
												</div>
												<div className="flex justify-between mb-5">
													<span className="text-sm leading-5">Chapter {data?.chaptersCompleted} of {data?.totalChapters}</span>
													<span className="text-sm font-bold leading-5">{NumberFixedDigit(data?.percentage)}%</span>
												</div>
											</div>
										</div>

									</div>
								</div>
							)
						})}
					</Slider>}
				</div>
			</div>
		</>
	);
};
export default CoursesInProgress;
