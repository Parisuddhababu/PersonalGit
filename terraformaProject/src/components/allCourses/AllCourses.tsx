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
import { COURSE_TYPE_ADMIN_DRP, COURSE_TYPE_DRP, ROUTES, USER_TYPE, convertMinutesToHoursAndMinutes } from '@config/constant';
import { DropdownOptionType, PaginationParams } from '@types';
import { GET_ACTIVE_CATEGORY } from '@framework/graphql/queries/category';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';
import { useFormik } from 'formik';
import { StateDataArr } from '@framework/graphql/graphql';
import { toast } from 'react-toastify';
import { GET_COURSE } from '@framework/graphql/queries/getCourses';
import LoadingIndicator from '@components/loadingIndicator/loaderIndicator';
import DropDown from '@components/dropdown/dropDown';
import { setResetAllCoursesData } from 'src/redux/courses-management-slice';
import ButtonWithoutLoader from '@components/button/buttonWithoutLoader';
import { CourseData } from 'src/types/courseTemplate';
import TextInput from '@components/textInput/TextInput';

type AllCoursesProps = {
	slider: boolean
};

const AllCourses = ({ slider }: AllCoursesProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const queryParams = new URLSearchParams(location.search);
	const selectedCategoryId = queryParams.get('category_uuid');
	const { data: getCourseData, refetch, loading } = useQuery(GET_COURSE, {
		variables: {
			courseData: {
				limit: 8,
				page: 1,
				sortField: 'createdAt',
				sortOrder: 'descend',
				search: '',
				category_id: '',
				course_type: null,
			}
		}
	});
	const { data: categoryData } = useQuery(GET_ACTIVE_CATEGORY, { variables: { limit: 10, page: 1, sortField: 'name', sortOrder: '', search: '' } });
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: 8,
		page: 1,
		sortField: 'createdAt',
		sortOrder: 'descend',
		search: '',
		course_type: null,
		category_id: selectedCategoryId ? selectedCategoryId : '',
	});
	const [categoryDrpData, setCategoryDrpData] = useState<DropdownOptionType[]>([]);
	const [openFilter, setOpenFilter] = useState<boolean>(false);
	const [onViewMore, setOnViewMore] = useState<boolean>(false);
	const [isRefetching, setIsRefetching] = useState<boolean>(false);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const [isTemplateData, setIsTemplateData] = useState<any[]>([]);
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
	const userType = userProfileData?.getProfile?.data?.user_type ?? '';
	const isCreator = userProfileData?.getProfile?.data?.is_course_creator;
	const initialValues = {
		selectedCategory: '',
		title: '',
		course_type: '',
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
		const tempDataArr: DropdownOptionType[] = [];
		getCourseData?.getCourses?.data?.courses?.map((data: CourseData) => {
			tempDataArr.push(data);
		});
		if (onViewMore) {
			setIsTemplateData([...isTemplateData, ...tempDataArr]);
			setOnViewMore(onViewMore ?? !onViewMore);
		} else {
			setIsTemplateData(tempDataArr);
		}
	}, [getCourseData]);

	const onSearch = useCallback(() => {
		setOnViewMore(false);
		setFilterData({
			...filterData,
			page: 1,
			category_id: formik?.values?.selectedCategory ? formik?.values?.selectedCategory : '',
			course_type: formik?.values?.course_type === '' ? null : +formik?.values?.course_type,
			search: formik?.values?.title
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
			category_id: formik?.values?.selectedCategory,
		});
	}

	useEffect(() => {
		const fetchData = async () => {
			setIsRefetching(true);
			try {
				await refetch({
					courseData: { ...filterData },
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

	const onNavigateCreateCourse = useCallback(() => {
		dispatch(setResetAllCoursesData());
		navigate(`/${ROUTES.app}/${ROUTES.educationAndEngagement}`)
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
				breakpoint: 1400,
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
		if ([USER_TYPE?.SUPER_ADMIN, USER_TYPE?.SUBSCRIBER_ADMIN].includes(userType)) {
			return (
				<>
					<Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter(!openFilter)} title='Filter'>
						<Filter />
					</Button>
					<Button label='+ Create Course' className='btn-primary  btn-normal md:w-[150px] whitespace-nowrap' onClick={() => onNavigateCreateCourse()} title='Create Course'>
					</Button>

				</>
			)
		}
		if (isCreator) {
			return (
				<>
					<Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter(!openFilter)} title='Filter'>
						<Filter />
					</Button>
					<Button label='+ Create Course' className='btn-primary  btn-normal md:w-[150px] whitespace-nowrap' onClick={() => onNavigateCreateCourse()} title='Create Course'>
					</Button>
				</>
			)
		}
		return (
			<>
				<Button className={` ${openFilter ? 'btn-primary' : 'btn-secondary'} btn-normal md:w-[50px]`} label='' onClick={() => setOpenFilter(!openFilter)} title='Filter'>
					<Filter />
				</Button>
			</>
		)

	}

	const onViewAll = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.allCourses}`);
	}, [])



	const onResetAllCourses = useCallback(() => {
		formik?.resetForm();
		setFilterData({
			...filterData,
			page: 1,
			search: '',
			course_type: null,
			category_id: ''
		})
	}, [filterData])

	const viewIsEditable = (data: CourseData) => {
		return [USER_TYPE?.SUPER_ADMIN, USER_TYPE?.SUBSCRIBER_ADMIN].includes(+data?.created_by?.user_type) || userProfileData?.getProfile?.data?.is_course_admin || userProfileData?.getProfile?.data?.is_course_creator
	}

	return (
		<>
			{!slider && <UpdatedHeader headerActionConst={headerActionConst} />}
			<div className='mb-7'>
				<div className='p-5 border border-solid border-border-primary rounded-xl'>
					<div className="flex flex-wrap justify-between gap-3 mb-5 md:gap-5">
						<h6>{t('All Courses')}</h6>
						{slider && <Button className='btn btn-normal bg-primary text-white text-xs w-full sm:w-[80px] h-[36px] whitespace-nowrap' type='button' label={t('View All')} onClick={() => onViewAll()} title={`${t('View All')}`} />}
					</div>
					{!slider && <>
						{(loading || (isRefetching && !onViewMore)) ? <LoadingIndicator /> :
							<>
								{openFilter && <div className="flex justify-start flex-wrap 2xl:flex-nowrap p-5 mb-5 border border-border-primary rounded-xl bg-light-blue gap-1 md:gap-2 2xl:gap-[18px] xl:gap-y-2 xl:gap-3 lg:gap-0.5 lg:gap-x-2.5 items-end">
									<div className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]'>
										<TextInput value={formik.values.title} placeholder={'Search'} type='text' id='title' name='title' onChange={formik.handleChange} />
									</div>
									<DropDown placeholder={'Course Type'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]' label='' name='course_type' onChange={formik.handleChange} value={formik.values.course_type} options={userType === USER_TYPE?.SUPER_ADMIN ? COURSE_TYPE_ADMIN_DRP : COURSE_TYPE_DRP} id='courseType' />
									<DropDown placeholder={'Category'} className='w-full lg:w-[calc(50%-10px)] xl:w-[calc(33.3%-14px)]' label='' name='selectedCategory' onChange={formik.handleChange} value={formik.values.selectedCategory} options={categoryDrpData} id='selectedCategory' />
									<Button className='btn-primary btn-normal w-full md:min-w-[160px] md:w-auto mt-2 lg:mt-0' label={t('Search')} type='button' onClick={() => onSearch()} title={`${t('Search')}`} />
									<Button className='btn-secondary btn-normal w-full md:min-w-[160px] md:w-auto mt-2 lg:mt-0' label={t('Reset')} type='button' onClick={() => onResetAllCourses()} title={`${t('Reset')}`} />
								</div>}
								<div className="flex flex-wrap items-start justify-center gap-5 mb-7 sm:justify-start">
									{getCourseData?.getCourses?.data?.count > 0 ? <>
										{isTemplateData?.map((data: CourseData) => (
											<div className='2xl:w-[calc(25%-15px)] text-left xl:w-[calc(33.3%-15px)] lg:w-[calc(50%-15px)] w-full border-border-primary h-full rounded-t-xl' key={data?.uuid}>
												<picture className='w-full block relative border-b border-solid border-border-primary'>
													<img src={(!data?.course_image || data?.course_image === '') ? logo : `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.course_image}`} alt="Course Image" title="Course Image" className='object-cover w-full h-full rounded-t-xl' />
												</picture>

												<div className='flex flex-col w-full p-5 border-b border-solid border-x border-border-primary rounded-b-xl min-h-340px'>
													<div className={`${userType !== USER_TYPE.SUBSCRIBER_EMPLOYEE ? 'cursor-pointer' : 'pointer-events-auto'} flex flex-col flex-1`} onClick={() => onCourseView(data.uuid)}>
														<div className="flex-wrap flex items-center justify-between mb-2.5 gap-2">
															<div>
																{data?.category?.name && <span className='h-9 flex items-center justify-center bg-p-list-box-btn font-bold text-white md:mb-0 px-4 rounded-xl min-w-[100px] text-sm mr-4'>{data?.category?.name}</span>}
															</div>
															{viewIsEditable(data) && <div className='relative group'>
																<InfoIcon className='text-base md:text-lg cursor-pointer fill-primary' />
																<p className='absolute whitespace-nowrap left-auto shadow-infos p-1.5 md:p-2.5 bg-white border border-border-primary rounded-xl md:right-0 xd:left-1 -top-[68px] md:-top-14 hidden group-hover:inline-block z-10'>{data?.is_editable ? 'Editable Course' : 'Non-Editable Course'}</p>
															</div>
															}
														</div>
														<h4 className='text-base hover:text-primary mb-2.5 truncate'>{data?.title}</h4>
														<p className='leading-6 mb-3 md:mb-5 w-full text-ellipsis line-clamp-4 break-words' dangerouslySetInnerHTML={{ __html: data?.description }}></p>
														<div className="flex justify-between items-center gap-2 mt-auto flex-wrap">
															<div className='flex items-center gap-2'>
																<picture className='flex items-center justify-center w-[40px] h-[40px]  rounded-full overflow-hidden border border-solid border-border-primary' >
																	<img src={(!data?.instructor_profile || data?.instructor_profile === '') ? profile : `${process.env.REACT_APP_IMAGE_BASE_URL}/${data?.instructor_profile}`} alt="profile" title='profile' width={40} height={40} className='object-cover w-full h-full' />
																</picture>
																<p className='text-base text-ellipsis break-words font-semibold '>{data?.instructor_name}</p>
															</div>
															<div className="time max-xmd:my-2.5">
																<span className="flex text-xs"><span className='mr-1 text-base'><Clock className='fill-secondary' /></span><span>{`${convertMinutesToHoursAndMinutes(data?.estimate_time).hours} h ${convertMinutesToHoursAndMinutes(data?.estimate_time).minutes} m`}</span></span>
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
						<ButtonWithoutLoader className='btn-secondary btn-normal w-full md:w-[120px]' label={isRefetching && onViewMore ? t('Loading...!') : t('Load More')} onClick={() => viewMore()} disabled={loading || isRefetching || (getCourseData?.getCourses?.data?.count === isTemplateData.length)} title={`${t('Load More')}`} />
					</div>}

					{slider && <Slider {...settings}>
						{getCourseData?.getCourses?.data?.count > 0 && isTemplateData?.map((data: CourseData) => (
							<div className="px-2.5 cursor-pointer" key={data?.uuid} onClick={() => onCourseView(data?.uuid)}>
								<div className='h-full border-border-primary rounded-t-xl'>
									<picture className='w-full block relative border-b border-solid border-border-primary'>
										<img src={(!data?.course_image || data?.course_image === '') ? logo : `${process.env.REACT_APP_IMAGE_BASE_URL}/${data.course_image}`} alt="logo" title="logo" className='object-cover w-full h-full rounded-t-xl' />
									</picture>
									<div className="w-full p-5 border-b border-solid border-x border-border-primary rounded-b-xl min-h-340px flex flex-col">
										<div className={'flex flex-col flex-1'}>
											<div className="flex flex-wrap items-center justify-between mb-2.5 gap-2">
												<div>
													{data?.category?.name && <span className='h-9 flex items-center justify-center bg-p-list-box-btn font-bold text-white md:mb-0 px-4 rounded-xl min-w-[100px] text-sm mr-4'>{data?.category?.name}</span>}
												</div>
												{viewIsEditable(data) && <div className='relative group'>
													<InfoIcon className='text-base md:text-lg cursor-pointer fill-primary' />
													<p className='absolute whitespace-nowrap left-auto shadow-infos p-1.5 md:p-2.5 bg-white border border-border-primary rounded-xl md:right-0 xd:left-1 -top-[68px] md:-top-14 hidden group-hover:inline-block z-10'>{data?.is_editable ? 'Editable Course' : 'Non-Editable Course'}</p>
												</div>
												}
											</div>
											<h4 className='text-base hover:text-primary mb-2.5 truncate'>{data?.title}</h4>
											<p className='leading-6 mb-3 md:mb-5 w-full text-ellipsis line-clamp-3 break-words' dangerouslySetInnerHTML={{ __html: data?.description }}></p>
											<div className="flex flex-wrap items-center gap-2 mt-auto justify-between">
												<div className='flex items-center gap-2'>
													<picture className='w-[40px] h-[40px] flex items-center rounded-full overflow-hidden border border-solid border-border-primary justify-center' >
														<img src={(!data?.instructor_profile || data?.instructor_profile === '') ? profile : `${process.env.REACT_APP_IMAGE_BASE_URL}/${data?.instructor_profile}`} alt="profile" title='profile' width={40} height={40} className='object-cover w-full h-full' />
													</picture>
													<p className='break-words font-semibold text-base text-ellipsis'>{data?.instructor_name}</p>
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
export default AllCourses;
