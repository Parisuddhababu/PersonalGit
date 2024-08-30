import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import cn from 'classnames';
import { AnnouncementRole, DATE_FORMAT, ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { GetDefaultIcon, GetAscIcon, GetDescIcon, CheckCircle, Refresh, Search, Cross } from '@components/icons/icons';
import uploadFile from '@components/common/uploadFile';
import Button from '@components/button/button';
import TextInput from '@components/textInput/TextInput';
import CkEditor from '@components/ckEditor/ckEditor';
import RadioButtonNew from '@components/radiobutton/radioButtonNew';
import Pagination from '@components/Pagination/Pagination';
import filterServiceProps from '@components/filter/filter';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';
import { createAnnouncementRes, UserDataAnnounce, UserDataType } from '@framework/graphql/graphql';
import { CREATE_ANNOUNCEMENT } from '@framework/graphql/mutations/announcement';
import { GET_USER } from '@framework/graphql/queries/announcement';
import useValidation from '@framework/hooks/validations';
import FormClasses from '@pageStyles/Form.module.scss';
import { CreateAnnouncement, PaginationParams } from 'src/types/announcement';
import { ColArrType } from 'src/types/common';
import { getDateFormat, translationFun, whiteSpaceRemover } from '@utils/helpers';

import { useFormik } from 'formik';
import { useMutation, useQuery } from '@apollo/client';

const AddAnnouncement = () => {
	const { t } = useTranslation();
	const { data: datalist, refetch: getUserData } = useQuery(GET_USER);
	const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT);
	const [platFormStatus, setPlatformStatus] = useState<string>('all');
	const [userType, setUserType] = useState<string>('all');
	const [advanceFilter, setAdvanceFilter] = useState<string>('all');
	const [searchTerm, setSearchTerm] = useState('');
	const [userData, setUserData] = useState({} as UserDataType);
	const [userToExcludeState, setUserToExcludeState] = useState<number[]>([]);
	const [onlySend, setOnlySend] = useState<number[]>([]);
	const [selectAll, setSelectAll] = useState(true);
	const { addAnnouncementValidationSchema } = useValidation();
	const navigate = useNavigate();
	const params = useParams();
	const [imagePreview, setImagePreview] = useState<string>('');

	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: 10,
		page: 1,
		sortBy: '',
		sortOrder: '',
	});

	const COL_ARR = [
		{ name: 'Sr.No', sortable: false },
		{ name: t('First Name'), sortable: true, fieldName: 'first_name' },
		{ name: t('Email'), sortable: true, fieldName: 'email' },
		{ name: t('Device Type'), sortable: true, fieldName: 'device_type' },
		{ name: t('Role'), sortable: true, fieldName: 'role' },
		{ name: t('Registration At'), sortable: true, fieldName: 'created_at' },
	] as ColArrType[];
	const [recordsPerPage, setRecordsPerPage] = useState<number>(filterData.limit);
	const totalRuleSets = userData?.count || 0;
	const totalPages = Math.ceil(totalRuleSets / recordsPerPage);
	const handlePageChangeAddAnnouncement = useCallback((newPage: number): void => {
		const updatedFilterData = {
			...filterData,
			page: newPage,
		};

		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterAddAnnouncement', JSON.stringify(updatedFilterData));
	}, []);
	useEffect(() => {
		const savedFilterDataJSON = filterServiceProps.getState('filterAddAnnouncement', JSON.stringify(filterData));
		if (savedFilterDataJSON) {
			const savedFilterData = JSON.parse(savedFilterDataJSON);
			setFilterData(savedFilterData);
		}
	}, []);

	/**
	 * Used for set user data from res in local variable
	 */
	useEffect(() => {
		if (datalist?.getUsersWithPagination) {
			setUserData(datalist?.getUsersWithPagination?.data);
		}
	}, [datalist?.getUsersWithPagination]);

	const initialValues: CreateAnnouncement = {
		title: '',
		announcementType: '0',
		status: '',
		description: '',
		pushImage: '',
		platform: '',
		userType: '',
		userFilter: '',
		startDate: '',
		endDate: '',
		userToExclude: [],
		onlySendTo: [],
	};

	const handleSelectAllAnnounce = () => {
		setSelectAll((prevState) => !prevState);
		datalist?.getUsersWithPagination?.data?.userList.map((data: UserDataAnnounce) => {
			setUserToExcludeState((prev) => [...prev, data?.id]);
		});

		if (!selectAll) {
			setUserToExcludeState([]);
		}
	};
	const handleSelectAllList = () => {
		setSelectAll((prevState) => !prevState);
		datalist?.getUsersWithPagination?.data?.userList.map((data: UserDataAnnounce) => {
			setOnlySend((prev) => [...prev, data?.id]);
		});

		if (!selectAll) {
			setOnlySend([]);
		}
	};

	const formik = useFormik({
		initialValues,
		validationSchema: addAnnouncementValidationSchema,
		onSubmit: async (values) => {
			let imageUrl = formik.values.pushImage;

			if (typeof values.pushImage !== 'string') {
				if (values.pushImage) {
					imageUrl = await uploadFile(values?.pushImage);
				}
			}
			let AnnouncementType = '';
			if (formik.values.announcementType === '1') {
				AnnouncementType = 'push';
			} else if (formik.values.announcementType === '2') {
				AnnouncementType = 'sms';
			} else {
				AnnouncementType = 'email';
			}

			createAnnouncement({
				variables: {
					title: values?.title,
					announcementType: AnnouncementType,
					description: values?.description,
					pushImage: imageUrl,
					platform: platFormStatus,
					userType: userType,
					userFilter: advanceFilter,
					startDate: values?.startDate,
					endDate: values?.endDate,
					userToExclude: userToExcludeState,
					onlySendTo: onlySend,
				},
			})
				.then((res) => {
					const data = res.data as createAnnouncementRes;
					if (data.createAnnouncement.meta.statusCode === 201) {
						toast.success(data.createAnnouncement.meta.message);
						formik.resetForm();
						onCancel();
					} else {
						toast.error(data.createAnnouncement.meta.message);
					}
				})
				.catch(() => {
					toast.error(t('Failed to create'));
				});
		},
	});

	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.announcement}/list`);
	}, []);

	const platFormRadioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		if (target.value === '0') {
			setPlatformStatus('all');
		}
		if (target.value === '1') {
			setPlatformStatus('android');
		}
		if (target.value === '2') {
			setPlatformStatus('ios');
		}
		if (target.value === '3') {
			setPlatformStatus('web');
		}
	};
	const userTypeRadioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;

		if (target.value === '0') {
			setUserType('all');
		}
		if (target.value === '1') {
			setUserType('customer');
		}
		if (target.value === '2') {
			setUserType('admin');
		}
		if (target.value === '3') {
			setUserType('subAdmin');
		}
	};
	const advanceFilterRadioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;

		if (target.value === '0') {
			setAdvanceFilter('all');
		}
		if (target.value === '1') {
			setAdvanceFilter('userToExclude');
		}
		if (target.value === '2') {
			setAdvanceFilter('onlySendTo');
		}
	};

	/**
	 * Used for refetch listing of user data after filter
	 */
	useEffect(() => {
		if (filterData) {
			getUserData(filterData).catch((err) => {
				toast.error(err);
			});
		}
	}, [filterData]);
	/**
	 *
	 * @param sortFieldName Method used for storing sort data
	 */
	const onHandleSortAnnouncement = (sortFieldName: string) => {
		setFilterData({
			...filterData,
			sortBy: sortFieldName,
			sortOrder: filterData.sortOrder === 'asc' ? 'desc' : 'asc',
		});
	};

	/**
	 *
	 * @param e Method used for change dropdown for page limit
	 */
	const onPageDrpSelectAnnouncement = (e: string) => {
		setRecordsPerPage(Number(e));
		const updatedFilterData = {
			...filterData,
			limit: parseInt(e),
			page: 1,
		};
		setFilterData(updatedFilterData);
		filterServiceProps.saveState('filterAddAnnouncement', JSON.stringify(updatedFilterData));
	};

	/**
	 *
	 * @param role Method used for getting role name
	 * @returns
	 */
	const getAnnouncementRoleName = (role: number) => {
		const result = AnnouncementRole.filter((a) => parseInt(a.key) === role);
		return result[0]?.name;
	};

	const handleUserTo = (data: { id: number }) => {
		setSelectAll(true);
		if (userToExcludeState.includes(data.id)) {
			const userData = userToExcludeState.filter((i) => i !== data.id);
			setUserToExcludeState(userData);
		} else {
			setUserToExcludeState((prev) => [...prev, data.id]);
		}
	};
	const handleOnlySendTo = (data: { id: number }) => {
		setSelectAll(true);
		if (onlySend.includes(data.id)) {
			const userData = onlySend.filter((i) => i !== data.id);
			setOnlySend(userData);
		} else {
			setOnlySend((prev) => [...prev, data.id]);
		}
	};
	const handleChangeBannerImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			formik.setFieldValue('pushImage', file);
			setImagePreview(URL.createObjectURL(file));
		}
	}, []);
	const [selectedImage, setSelectedImage] = useState<string>('');

	const handleResetImage = useCallback(() => {
		setImagePreview('');
		setSelectedImage('');
		formik.setFieldValue('pushImage.name', ''); // Reset pushImage.name to an empty string
		const fileInput = document.getElementById('image') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	}, [setImagePreview, setSelectedImage]);
	const [searchResults, setSearchResults] = useState([]);

	const searchedCommentsList = datalist?.getUsersWithPagination?.data?.userList?.filter((c: { first_name: string }) => c.first_name?.toLowerCase().includes(searchTerm?.toLowerCase()));

	const onSearch = useCallback(() => {
		// Perform the search logic on the data
		const searchedCommentsList = datalist?.getUsersWithPagination?.data?.userList?.filter((c: { first_name: string }) => c.first_name?.toLowerCase().includes(searchTerm?.toLowerCase()));

		// Update the searchResults state with the filtered data
		setSearchResults(searchedCommentsList);
	}, [setSearchResults]);

	const onReset = useCallback(() => {
		// Clear the search term and reset the search results
		setSearchTerm('');
		setSearchResults([]);
	}, [setSearchTerm, setSearchResults]);

	useEffect(() => {
		if (userToExcludeState.length === searchedCommentsList?.length) {
			setSelectAll(false);
		}
	}, [userToExcludeState]);

	useEffect(() => {
		if (onlySend.length === searchedCommentsList?.length) {
			setSelectAll(false);
		}
	}, [onlySend]);

	const OnBlurAnn = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	//CkEditor onChange Function
	const onChange = useCallback((e: string) => {
		formik.setFieldValue('description', e);
	}, []);
	useEffect(() => {
		setRecordsPerPage(filterData.limit);
	}, [filterData.limit]);
	const onSearchTerm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(e.target.value);
	}, []);
	return (
		<div className='w-full mb-4'>
			<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
				<form className='bg-white shadow-md rounded  pt-6  border border-[#c8ced3]' onSubmit={formik.handleSubmit}>
					<div className='flex justify-end pr-8 pb-2'>
						<p>
							{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
						</p>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 l:grid-cols-4 gap-6 px-8'>
						<div className='mb-4'>
							<TextInput placeholder={t('Title')} name='title' onChange={formik.handleChange} onBlur={OnBlurAnn} label={t('Title')} value={formik.values.title} error={formik.errors.title && formik.touched.title && formik.errors.title} required={true} />
						</div>
						<div>
							<RadioButtonNew
								id='announcementType'
								required={true}
								checked={formik.values.announcementType}
								onChange={formik.handleChange}
								name={'announcementType'}
								radioOptions={[
									{ name: t('Email'), key: 0 },
									{ name: t('Push'), key: 1 },
									{ name: t('SMS'), key: 2 },
								]}
								label={t('Type')}
								// error={formik.errors.announcementType && formik.touched.announcementType ? formik.errors.announcementType : ''}
								error={formik.touched.announcementType && formik.errors.announcementType || ''}
							/>
						</div>
					</div>
					<div className='mb-4 px-8'>
						{formik.values.announcementType === '0' ? (
							<div>
								<p className='font-normal text-sm text-gray-700 mb-3'>
									{t('Description')} <span className='text-red-500'>*</span>
								</p>
								<CkEditor value={formik.values.description} onChange={onChange} />
								{formik.errors.description && formik.touched.description && <p className='error'>{t(formik.errors.description)}</p>}
							</div>
						) : (
							<TextInput placeholder={t('Description')} name='description' onChange={formik.handleChange} onBlur={OnBlurAnn} label={t('Description')} value={formik.values.description} error={formik.errors.description && formik.touched.description && formik.errors.description} required={true} />
						)}
					</div>
					{formik.values.announcementType === '0' && <p className='font-normal text-sm px-8 mb-3'>{t('Email Attachment')}</p>}
					{formik.values.announcementType === '1' && <p className='font-normal text-sm px-8 mb-3'>{t('Push Image')}</p>}
					{formik.values.announcementType !== '2' && (
						<div className='flex'>
							<div className='flex justify-start px-8 mb-4'>
								<div>
									<label htmlFor='image' className="after:content-['Browse'] after:text-black-500  after:bg-slate-200 block text-sm font-normal md:p-2 border border-solid h-9 w-full relative after:top-[3px] after:right-0 rounded-sm after:bottom-0 mr-28 after:absolute after:ml-2  after:border after:h-9 after:-translate-y-1 after:inline-flex after:items-center after:md:p-2 ">
										{t('Choose file')}
									</label>

									<TextInput type='file' id='image' name='image' value={translationFun(selectedImage)} placeholder={''} onChange={handleChangeBannerImage} hidden />
								</div>
								<div className=' px-8 '>
									<Button className='btn-pink btn-normal' onClick={handleResetImage} label={t('Reset')}  title={`${t('Reset')}`}></Button>
								</div>

								{!formik.touched.pushImage && <div className={`flex items-center text-center ${formik.touched.pushImage ? 'px-8' : ''}`}> {!selectedImage && formik.values.announcementType === '0' && formik.values.pushImage.name} </div>}
							</div>
							{formik.values.announcementType === '1' && imagePreview && (
								<>
									{formik.errors.pushImage ? null : (
										<div className='flex items-center justify-center h-[150px] w-[200px] mb-2 '>
											<img src={imagePreview} alt='Image Preview' className='object-fill  w-full aspect-auto rounded-md' />
										</div>
									)}
								</>
							)}
						</div>
					)}

					<div className='mx-8 w-full md:w-auto bg-white  rounded-sm mb-5 border border-[#c8ced3]'>
						<div className='bg-[#f0f3f5] py-3 px-5 flex items-center justify-between border-b border-[#c8ced3]'>
							<div className='flex items-center'>
								<span className='text-sm font-normal'>{t('Filter')}</span>
							</div>
						</div>

						<div className='w-full grid grid-cols-1 lg:grid-cols-2  gap-6 p-5 '>
							<div>
								<label className='font-normal'>
									{t('Platform')} <span className='text-red-500'>*</span>
								</label>
								<div className='radio-btn-group flex mr-6 mt-4 '>
									<div className='radio-btn'>
										<div className={cn(FormClasses['form-group'])}>
											<div className={cn(FormClasses['radio-btn-group'])}>
												<label className={cn(FormClasses['radio-btn'])}>
													<input type='radio' id='all' value={'0'} defaultChecked name='platFormStatus' onChange={platFormRadioHandler} />
													<span className='ml-2'>{t('All')}</span>
												</label>
											</div>
										</div>
									</div>
									<div className='radio-btn'>
										<div className={cn(FormClasses['form-group'])}>
											<div className={cn(FormClasses['radio-btn-group'])}>
												<label className={cn(FormClasses['radio-btn'])}>
													<input type='radio' id='android' value={'1'} name='platFormStatus' onChange={platFormRadioHandler} />
													<span className='ml-2'>{t('Android')}</span>
												</label>
											</div>
										</div>
									</div>
									<div className='radio-btn'>
										<div className={cn(FormClasses['form-group'])}>
											<div className={cn(FormClasses['radio-btn-group'])}>
												<label className={cn(FormClasses['radio-btn'])}>
													<input type='radio' id='ios' value={'2'} name='platFormStatus' onChange={platFormRadioHandler} />
													<span className='ml-2'>{t('IOS')}</span>
												</label>
											</div>
										</div>
									</div>
									<div className='radio-btn'>
										<div className={cn(FormClasses['form-group'])}>
											<div className={cn(FormClasses['radio-btn-group'])}>
												<label className={cn(FormClasses['radio-btn'])}>
													<input type='radio' id='web' value={'3'} name='platFormStatus' onChange={platFormRadioHandler} />
													<span className='ml-2'>{t('WEB')}</span>
												</label>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div>
								<div className='mb-4'>
									<label className='font-normal'>
										{t('User Type')} <span className='text-red-500'>*</span>
									</label>
									<div className='flex items-center mr-6 mt-4 '>
										<div className='radio-btn'>
											<div className={cn(FormClasses['form-group'])}>
												<div className={cn(FormClasses['radio-btn-group'])}>
													<label className={cn(FormClasses['radio-btn'])}>
														<input type='radio' id='all' value={'0'} defaultChecked name='userType' onChange={userTypeRadioHandler} />
														<span className='ml-2'>{t('All')}</span>
													</label>
												</div>
											</div>
										</div>
										<div className='radio-btn'>
											<div className={cn(FormClasses['form-group'])}>
												<div className={cn(FormClasses['radio-btn-group'])}>
													<label className={cn(FormClasses['radio-btn'])}>
														<input type='radio' id='customer' value={'1'} name='userType' onChange={userTypeRadioHandler} />
														<span className='ml-2'>{t('Customer')}</span>
													</label>
												</div>
											</div>
										</div>
										<div className='radio-btn'>
											<div className={cn(FormClasses['form-group'])}>
												<div className={cn(FormClasses['radio-btn-group'])}>
													<label className={cn(FormClasses['radio-btn'])}>
														<input type='radio' id='admin' value={'2'} name='userType' onChange={userTypeRadioHandler} />
														<span className='ml-2'>{t('Admin')}</span>
													</label>
												</div>
											</div>
										</div>
										<div className='radio-btn'>
											<div className={cn(FormClasses['form-group'])}>
												<div className={cn(FormClasses['radio-btn-group'])}>
													<label className={cn(FormClasses['radio-btn'])}>
														<input type='radio' id='subAdmin' value={'3'} name='userType' onChange={userTypeRadioHandler} />
														<span className='ml-2'>{t('SubAdmin')}</span>
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div>
								<label className='font-normal'>
									{t('Advanced Filters')} <span className='text-red-500'>*</span>
								</label>
								<div className='flex flex-wrap '>
									<div className='flex items-center mr-6 mt-4 '>
										<div className='radio-btn'>
											<div className={cn(FormClasses['form-group'])}>
												<div className={cn(FormClasses['radio-btn-group'])}>
													<label className={cn(FormClasses['radio-btn'])}>
														<input type='radio' id='userToExclude' value={'1'} name='advanceFilter' onChange={advanceFilterRadioHandler} />
														<span className='ml-2'>{t('User To Exclude')}</span>
													</label>
												</div>
											</div>
										</div>
									</div>
									<div className='flex items-center mr-4 mt-4'>
										<div className='radio-btn'>
											<div className={cn(FormClasses['form-group'])}>
												<div className={cn(FormClasses['radio-btn-group'])}>
													<label className={cn(FormClasses['radio-btn'])}>
														<input type='radio' id='onlySendTo' value={'2'} name='advanceFilter' onChange={advanceFilterRadioHandler} />
														<span className='ml-2'>{t('Only Send To')}</span>
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div>
								<label className='font-normal'>{t('Registered Between')}</label>
								<div className='mb-4 mt-3'>
									<TextInput
										placeholder={t('Start Date')}
										type='date'
										name='startDate'
										onChange={formik.handleChange}
										label={t('Start Date')}
										value={formik.values.startDate}
									/>
								</div>
								<div className='mb-4'>
									<TextInput
										placeholder={t('End Date')}
										type='date'
										name='endDate'
										onChange={formik.handleChange}
										label={t('End Date')}
										value={formik.values.endDate}
									/>
								</div>
							</div>
						</div>

						{advanceFilter === 'userToExclude' || advanceFilter === 'onlySendTo' ? (
							<>
								<div className='grid grid-cols-1 md:grid-cols-2 l:grid-cols-4 gap-6 p-5 '>
									<TextInput type='text' id='table-search' value={searchTerm} placeholder={t('Search...')} onChange={onSearchTerm} />
									<div className='btn-group  '>
										<Button className='btn-primary' type='button' label={t('Search')} onClick={onSearch}  title={`${t('Search')}`}>
											<Search className='mr-1' />
										</Button>
										<Button className='btn-warning btn-normal' label={t('Reset')} onClick={onReset}  title={`${t('Refresh')}`}>
											<Refresh className='mr-1' />
										</Button>
									</div>
								</div>

								{advanceFilter === 'userToExclude' ? (
									<p className='mb-8 mt-4 px-5'>
										<span className='text-red-500'> *</span> {t('notification will be sent to users excepted selected')}
									</p>
								) : (
									<p className='mb-8 mt-4 px-5'>
										<span className='text-red-500'> *</span> {t('notification will be sent to selected users only')}
									</p>
								)}
								<div className='flex items-center justify-between pb-2'>
									<div className='p-3 flex items-center justify-start mb-3'>
										<span className=' text-sm text-gray-900 font-normal '>{t('Show')}</span>

										<select className='border border-[#e4e7ea] rounded px-3 text-sm py-1.5 text-gray-500 mx-1 w-[75px] bg-white' onChange={(e) => onPageDrpSelectAnnouncement(e.target.value)} value={filterData.limit}>
											{SHOW_PAGE_COUNT_ARR?.map((item: number, index: number) => {
												return <option key={`${index + 1}`}>{item}</option>;
											})}
										</select>
										<span className=' text-sm text-gray-900 font-normal'>{t('entries')}</span>
									</div>
								</div>
								<div className='p-3 overflow-auto custom-dataTable '>
									<table>
										<thead>
											<tr>
												<th scope='col' className='text-center'>
													{advanceFilter === 'userToExclude' && <input type='checkbox' checked={!selectAll} onChange={handleSelectAllAnnounce} />}
													{advanceFilter === 'onlySendTo' && <input type='checkbox' checked={!selectAll} onChange={handleSelectAllList} />}
												</th>
												{COL_ARR?.map((ColValAnnouncement: ColArrType) => {
													return (
														<th scope='col' key={ColValAnnouncement.fieldName}>
															<div className='flex items-center'>
																{ColValAnnouncement.name}
																{ColValAnnouncement.sortable && (
																	<a onClick={() => onHandleSortAnnouncement(ColValAnnouncement.fieldName)}>
																		{(filterData.sortOrder === '' || filterData.sortBy !== ColValAnnouncement.fieldName) && <GetDefaultIcon />}
																		{filterData.sortOrder === 'asc' && filterData.sortBy === ColValAnnouncement.fieldName && <GetAscIcon />}
																		{filterData.sortOrder === 'desc' && filterData.sortBy === ColValAnnouncement.fieldName && <GetDescIcon />}
																	</a>
																)}
															</div>
														</th>
													);
												})}
											</tr>
										</thead>

										<tbody>
											{searchResults?.length > 0
												? searchResults.map((announceData: UserDataAnnounce, index: number) => {
														return (
															<tr key={announceData.id}>
																{advanceFilter === 'userToExclude' ? (
																	<td className='text-center'>
																		<input type='checkbox' checked={!!userToExcludeState.includes(announceData.id)} onClick={() => handleUserTo(announceData)} />{' '}
																	</td>
																) : (
																	''
																)}

																{advanceFilter === 'onlySendTo' ? (
																	<td className='text-center'>
																		<input type='checkbox' checked={!!onlySend.includes(announceData.id)} onClick={() => handleOnlySendTo(announceData)} />{' '}
																	</td>
																) : (
																	''
																)}
																<td className='text-center'>{index + 1}</td>

																<td>{announceData.first_name + ' ' + announceData.last_name}</td>

																<td>{announceData.email}</td>
																{announceData.device_type !== null ? <td>{announceData.device_type}</td> : <td> none</td>}

																<td>{getAnnouncementRoleName(announceData.role)}</td>
																<td>{`${getDateFormat(announceData.created_at, DATE_FORMAT.momentDateTime24Format)} `}</td>
															</tr>
														);
												  })
												: datalist?.getUsersWithPagination?.data?.userList?.map((announcementData: UserDataAnnounce, index: number) => {
														return (
															<tr key={announcementData.id}>
																{advanceFilter === 'userToExclude' ? (
																	<td className='text-center'>
																		<input type='checkbox' checked={!!userToExcludeState.includes(announcementData.id)} onClick={() => handleUserTo(announcementData)} />{' '}
																	</td>
																) : (
																	''
																)}

																{advanceFilter === 'onlySendTo' ? (
																	<td className='text-center'>
																		<input type='checkbox' checked={!!onlySend.includes(announcementData.id)} onClick={() => handleOnlySendTo(announcementData)} />{' '}
																	</td>
																) : (
																	''
																)}

																<td className=' text-center'>{index + 1}</td>
																<td>{announcementData.first_name + ' ' + announcementData.last_name}</td>

																<td>{announcementData.email}</td>
																{announcementData.device_type !== null ? <td>{announcementData.device_type}</td> : <td> none</td>}

																<td>{getAnnouncementRoleName(announcementData.role)}</td>
																<td>{`${getDateFormat(announcementData.created_at, DATE_FORMAT.momentDateTime24Format)} `}</td>
															</tr>
														);
												  })}
										</tbody>
									</table>
								</div>

								<div className='p-3 flex items-center justify-between mt-8'>
									<span className='text-slate-400 text-xs'>
										{datalist?.getUsersWithPagination?.data ? `${userData?.count}` : 0}
										<span className='ml-1'>{t('Total Records')}</span>
									</span>
									<Pagination currentPage={filterData.page} totalPages={totalPages} onPageChange={handlePageChangeAddAnnouncement} recordsPerPage={recordsPerPage} />
								</div>
							</>
						) : (
							''
						)}
					</div>
					<div className='flex  bg-[#f0f3f5] py-2 px-7 border border-[#c8ced3]'>
						<div className='btn-group'>
							<Button type='submit' className='btn-primary btn-normal' label={params.id ? t('Update') : t('Save')} 
							title={`${params.id ? t('Update') : t('Save')}`}>
								<div className='mr-1'>
									<CheckCircle />
								</div>
							</Button>
							<Button className='btn-warning btn-normal' label={t('Cancel')} onClick={onCancel} title={`${t('Cancel')}`}>
								<div className='mr-1'>
									<Cross className='mr-1 fill-white' />
								</div>
							</Button>
						</div>
					</div>
				</form>
			</WithTranslateFormErrors>
		</div>
	);
};

export default AddAnnouncement;
