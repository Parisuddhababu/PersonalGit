import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import logo from '@assets/images/login-img.jpg';
import profile from '@assets/images/default-user-image.png';
import { Clock, Filter, InfoIcon } from '@components/icons/icons';
import Button from '@components/button/button';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import UpdatedHeader from '@components/header/updatedHeader';
import { useNavigate } from 'react-router-dom';
import { COURSE_PROGRESS_VARIABLES, ROUTES, USER_TYPE, convertMinutesToHoursAndMinutes } from '@config/constant';
import { DropdownOptionType, PaginationParamsCourseInProgress } from '@types';
import { GET_ACTIVE_CATEGORY } from '@framework/graphql/queries/category';
import { useQuery } from '@apollo/client';
import { useFormik } from 'formik';
import { StateDataArr } from '@framework/graphql/graphql';
import { toast } from 'react-toastify';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';
import DropDown from '@components/dropdown/dropDown';
import ButtonWithoutLoader from '@components/button/buttonWithoutLoader';
import { GET_USER_COURSES_IN_PROGRESS_AND_ASSIGNED } from '@framework/graphql/queries/courseDashboard';
import TextInput from '@components/textInput/TextInput';
import { AssignedCoursesProps, CourseData } from 'src/types/courseAssignedAndNotAssigned';
import { useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';

const AssignedCourses = ({ slider }: AssignedCoursesProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { data: getCourseData, refetch, loading } = useQuery(GET_USER_COURSES_IN_PROGRESS_AND_ASSIGNED, {
		variables: {
			inputData: {
				sortOrder: 'descend',
				sortField: 'created_at',
				search: '',
				page: 1,
				limit: 8,
				category_id: '',
				type: COURSE_PROGRESS_VARIABLES.assigned
			}
		}
	});
	const { data: categoryData } = useQuery(GET_ACTIVE_CATEGORY, { variables: { limit: 10, page: 1, sortField: 'name', sortOrder: '', search: '' } });
	const [filterData, setFilterData] = useState<PaginationParamsCourseInProgress>({
		sortOrder: 'descend',
		sortField: 'created_at',
		search: '',
		page: 1,
		limit: 8,
		category_id: '',
		type: COURSE_PROGRESS_VARIABLES.assigned
	});
	const [categoryDrpData, setCategoryDrpData] = useState<DropdownOptionType[]>([]);
	const [openFilter, setOpenFilter] = useState<boolean>(false);
	const [onViewMore, setOnViewMore] = useState<boolean>(false);
	const [isAssignedRefetching, setIsAssignedRefetching] = useState<boolean>(false);
	const [isTemplateData, setIsTemplateData] = useState<CourseData[]>([]);
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
	const AssignedInitialValues = {
		selectedCategory: '',
		title: ''
	};

	const formik = useFormik({
		initialValues: AssignedInitialValues,
		onSubmit: () => {
			// Handle form submission
		},
	});

	useEffect(() => {
		const tempAssignedDataArr = [] as DropdownOptionType[];
		categoryData?.getActiveCategories?.data?.categories?.map((data: StateDataArr) => {
			tempAssignedDataArr.push({ name: data?.name, key: data?.uuid });
		});
		setCategoryDrpData(tempAssignedDataArr);
	}, [categoryData]);

	useEffect(() => {
		const tempAssignedDataArr: CourseData[] = [];
		getCourseData?.getUserCoursesInProgressOrAssigned?.data?.courses?.map((data: CourseData) => {
			tempAssignedDataArr.push(data);
		});
		if (onViewMore) {
			setOnViewMore(onViewMore ?? !onViewMore);
			setIsTemplateData([...isTemplateData, ...tempAssignedDataArr]);
		} else {
			setIsTemplateData(tempAssignedDataArr);
		}
	}, [getCourseData]);

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

	const viewMore = () => {
		setOnViewMore(true);
		setFilterData({
			...filterData,
			page: filterData.page + 1,
			category_id: formik?.values?.selectedCategory ? formik?.values?.selectedCategory : '',
		});
	}

	useEffect(() => {
		const fetchData = async () => {
			setIsAssignedRefetching(true);
			try {
				await refetch({
					inputData: { ...filterData },
				});
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				toast.error(error?.networkError?.result?.errors?.[0]?.message)
			} finally {
				setIsAssignedRefetching(false);
				setOnViewMore(onViewMore ?? !onViewMore);
			}
		};
		if (filterData) {
			fetchData();
		}
	}, [filterData]);

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
				}
			},
			{
				breakpoint: 1199,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2,
					initialSlide: 2
				}
			},
			{
				breakpoint: 991,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	};

	const headerActionConst = () => {
		return (
			<Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter(!openFilter)} title='Filter'>
				<Filter />
			</Button>
		)
	}

	const onViewAll = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.assignedCourseList}`);
	}, [])

	const onResetFilter = useCallback(() => {
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

	const viewIsEditableAssign = (data: CourseData) => {
		return [USER_TYPE?.SUPER_ADMIN, USER_TYPE?.SUBSCRIBER_ADMIN].includes(+data?.created_by?.user_type) || userProfileData?.getProfile?.data?.is_course_admin || userProfileData?.getProfile?.data?.is_course_creator
	}

	return (
		<>
			{!slider && <UpdatedHeader headerActionConst={headerActionConst} />}
			<div className='mb-7'>
				<div className='p-5 border border-solid rounded-xl border-border-primary'>
					<div className="flex flex-wrap justify-between md:gap-5 gap-3 mb-5">
						<h6>{t('Assigned Courses')}</h6>
						{slider && <Button className='whitespace-nowrap btn btn-normal bg-primary text-white text-xs w-full sm:w-[80px] h-[36px] ' type='button' label={t('View All')} onClick={() => onViewAll()} title={`${t('View All')}`} />}
					</div>
					{!slider && <>
						{(loading || (isAssignedRefetching && !onViewMore)) ? <LoadingIndicator /> :
							<>
								{openFilter && <div className="flex justify-start 2xl:flex-nowrap flex-wrap p-5 mb-5 border border-border-primary rounded-xl bg-light-blue gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 items-end">
									<div className='w-full xl:w-[calc(33.3%-14px)] lg:w-[calc(50%-10px)]'>
										<TextInput value={formik.values.title} placeholder={'Search'} type='text' id='title' name='title' onChange={formik.handleChange} />
									</div>
									<DropDown placeholder={'Category'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]' label='' name='selectedCategory' onChange={formik.handleChange} value={formik.values.selectedCategory} options={categoryDrpData} id='selectedCategory' />
									<Button className='btn-primary btn-normal md:min-w-[160px] w-full md:w-auto mt-2 lg:mt-0' label={t('Search')} type='button' onClick={() => onSearch()} title={`${t('Search')}`} />
									<Button className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto mt-2 lg:mt-0' label={t('Reset')} type='button' onClick={() => onResetFilter()} title={`${t('Reset')}`} />
								</div>}
								<div className="flex flex-wrap items-start justify-center gap-5 mb-7 sm:justify-start">
									{getCourseData?.getUserCoursesInProgressOrAssigned?.data?.count > 0 ? <>
										{isTemplateData?.map((data: CourseData) => (
											<div className='w-full 2xl:w-[calc(25%-15px)] text-left xl:w-[calc(33.3%-15px)] border-border-primary lg:w-[calc(50%-15px)] rounded-t-xl h-full cursor-pointer' key={data?.uuid} onClick={() => onCourseView(data.uuid)}>
												<picture className='w-full block relative border-b border-solid border-border-primary'>
													<img src={(!data?.course_image || data?.course_image !== '') ? `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.course_image}` : logo} alt="Course Image" title="Course Image" className='object-cover w-full h-full rounded-t-xl object-center' />
												</picture>
												<div className="w-full p-5 border-b border-x border-solid border-border-primary rounded-b-xl flex flex-col min-h-340px">
													<div className='flex flex-col flex-1'>
														<div className="flex items-center flex-wrap justify-between mb-2.5 gap-2">
															<div>
																<span className='min-h-9 flex justify-center bg-p-list-box-btn items-center font-bold text-white md:mb-0 px-4 rounded-xl min-w-[100px] text-sm mr-4'>{data?.category.name}</span>
															</div>
															{viewIsEditableAssign(data) &&
																<div className='relative group'>
																	<InfoIcon className='text-base md:text-lg cursor-pointer fill-primary' />
																	<p className='absolute whitespace-nowrap left-auto shadow-infos p-1.5 md:p-2.5 bg-white border border-border-primary rounded-xl md:right-0 xd:left-1 -top-[68px] md:-top-14 hidden group-hover:inline-block z-10'>{data?.is_editable ? 'Editable Course' : 'Non-Editable Course'}</p>
																</div>}
														</div>
														<h4 className='text-base hover:text-primary mb-2.5 truncate'>{data?.title}</h4>
														<p className='leading-6 w-full  mb-3 md:mb-5 text-ellipsis line-clamp-3 break-words' dangerouslySetInnerHTML={{ __html: data?.description }}></p>
														<div className="group max-xmd:flex-wrap flex items-center justify-between mb-5 mt-auto">
															<div className='flex items-center gap-2'>
																<picture className='w-[40px] h-[40px] flex items-center justify-center rounded-full overflow-hidden border border-solid border-border-primary'>
																	<img src={(!data?.instructor_profile || data?.instructor_name !== '') ? `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.instructor_profile}` : profile} alt="User" title="User" width={40} height={40} className='object-cover w-full h-full' />
																</picture>
																<p className='text-base font-semibold break-words text-ellipsis'>{data?.instructor_name}</p>
															</div>
															<div className="time max-xmd:my-2.5">
																<span className="flex text-xs"><span className=' text-base mr-1'><Clock className='fill-secondary' /></span><span>{`${convertMinutesToHoursAndMinutes(data?.estimate_time).hours} h ${convertMinutesToHoursAndMinutes(data?.estimate_time).minutes} m`}</span></span>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}
									</> : <div>No Records Found!!!</div>}
								</div>
							</>
						}
					</>}

					{!slider && <div className="flex items-center justify-center">
						<ButtonWithoutLoader className='btn-secondary btn-normal w-full md:w-[120px]' label={isAssignedRefetching && onViewMore ? t('Loading...!') : t('Load More')} onClick={() => viewMore()} disabled={loading || isAssignedRefetching || (getCourseData?.getUserCoursesInProgressOrAssigned?.data?.count === isTemplateData?.length)} title={`${isAssignedRefetching && onViewMore ? t('Loading...!') : t('Load More')}`} />
					</div>}

					{slider && <Slider {...settings}>
						{getCourseData?.getUserCoursesInProgressOrAssigned?.data?.count > 0 && isTemplateData?.map((data: CourseData) => (
							<div className='px-2.5 cursor-pointer' key={data?.uuid} onClick={() => onCourseView(data.uuid)}>
								<div className='h-full border-border-primary rounded-t-xl'>
									<picture className='w-full h-[200px] block relative'>
										<img src={(!data?.course_image || data?.course_image !== '') ? `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.course_image}` : logo} alt="image" title="" className='object-cover w-full h-full rounded-t-xl object-center' />
									</picture>
									<div className="w-full p-5 border-b border-solid border-x border-border-primary rounded-b-xl flex flex-col min-h-340px">
										<div className='flex flex-col flex-1'>
											<div className="flex justify-between flex-wrap items-center mb-2.5 gap-2">
												<div>
													<span className='min-h-9 flex  justify-center bg-p-list-box-btn items-center font-bold text-white md:mb-0 px-4 rounded-xl min-w-[100px] text-sm mr-4'>{data?.category.name}</span>
												</div>
												{viewIsEditableAssign(data) && <div className='relative group'>
													<InfoIcon className='text-base md:text-lg cursor-pointer fill-primary' />
													<p className='absolute whitespace-nowrap left-auto shadow-infos p-1.5 md:p-2.5 bg-white border border-border-primary rounded-xl md:right-0 xd:left-1 -top-[68px] md:-top-14 hidden group-hover:inline-block z-10'>{data?.is_editable ? 'Editable Course' : 'Non-Editable Course'}</p>
												</div>}
											</div>
											<h4 className='text-base hover:text-primary mb-2.5 truncate'>{data?.title}</h4>
											<p className='leading-6 mb-3 md:mb-5 w-full text-ellipsis line-clamp-3 break-words' dangerouslySetInnerHTML={{ __html: data?.description }}></p>
											<div className="group  flex flex-wrap gap-2 items-center justify-between mb-5 mt-auto max-xmd:flex-wrap">
												<div className='flex gap-2 items-center'>
													<picture className='w-[40px] h-[40px] flex items-center justify-center rounded-full overflow-hidden border border-solid border-border-primary'>
														<img src={(!data?.instructor_profile || data?.instructor_name !== '') ? `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.instructor_profile}` : profile} alt="User" title="User" width={40} height={40} className='object-cover w-full h-full' />
													</picture>
													<p className='text-base font-semibold text-ellipsis break-words'>{data?.instructor_name}</p>
												</div>
												<div className="time max-xmd:my-2.5">
													<span className="flex text-xs"><span className='mr-1 text-base'><Clock className='fill-secondary' /></span><span>{`${convertMinutesToHoursAndMinutes(data?.estimate_time).hours} h ${convertMinutesToHoursAndMinutes(data?.estimate_time).minutes} m`}</span></span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</Slider>}
				</div>
			</div>
		</>
	);
};
export default AssignedCourses;
