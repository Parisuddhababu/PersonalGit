import React, { useCallback, useEffect, useState } from 'react';
import TextInput from '@components/input/TextInput';
import CKEditorComponent from '@components/ckEditor/CKEditor';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQuery } from '@apollo/client';
import { createAnnouncementRes, UserDataannounce, UserDataType } from '@framework/graphql/graphql';
import { useNavigate, useParams } from 'react-router-dom';
import { AnnouncementRole, DATE_FORMAT, ROUTES, SHOW_PAGE_COUNT_ARR } from '@config/constant';
import { CREATE_ANNOUNCEMENT } from '@framework/graphql/mutations/announcement';
import { CreateAnnouncement, PaginationParams } from 'src/types/announcement';
import { GET_USER } from '@framework/graphql/queries/announcement';
import { CheckCircle, Cross, Refresh } from '@components/icons';
import { t } from 'i18next';
import useValidation from '@components/hooks/validation';
import Pagination from '@components/pagination/pagination';
import CustomSelect from '@components/select/select';
import Button from '@components/button/button';
import { ColArrType } from 'src/types/common';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import { getDateFromat } from '@utils/helpers';

const AddAnnouncement = () => {
	const [createAnnouncement] = useMutation(CREATE_ANNOUNCEMENT);
	const { data: datalist, refetch: getUserData, loading } = useQuery(GET_USER);
	const [userData, setUserData] = useState({} as UserDataType);
	const [type, setType] = useState<string>('sms');
	const [searchTerm, setSearchTerm] = useState('');
	const [platformstatus, setPlatformStatus] = useState<string>('all');
	const [usertype, setUserType] = useState<string>('all');
	const [advanceFilter, setAdvanceFilter] = useState<string>('all');
	const [selectAll, setSelectAll] = useState(true);
	const [onlysend, setOnlysend] = useState<number[]>([]);
	const [usertoexcludestate, setUsertoexcludestate] = useState<number[]>([]);
	const navigate = useNavigate();
	const params = useParams();
	const [imagePreview, setImagePreview] = useState<string>('');
	const [dates, setDates] = useState<Date[]>([]);

	//filter data
	const [filterData, setFilterData] = useState<PaginationParams>({
		limit: 10,
		page: 1,
		sortBy: '',
		sortOrder: '',
		startDate: '',
		endDate: '',
	});
	const COL_ARR = [
		{ name: t('Name'), sortable: false },
		{ name: t('Email'), sortable: false },
		{ name: t('Device Type'), sortable: false },
		{ name: t('Role'), sortable: false },
		{ name: t('Created At'), sortable: false },
	] as ColArrType[];

	/*initial values to create announcement*/
	const initialValues: CreateAnnouncement = {
		title: '',
		annoucemntType: '',
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

	/* storing data in local variable*/
	useEffect(() => {
		if (datalist?.getUsersWithPagination) {
			setUserData(datalist?.getUsersWithPagination?.data);
		}
	}, [datalist?.getUsersWithPagination]);

	const { AnnouncementValidation } = useValidation();
	/*submit form*/
	const formik = useFormik({
		initialValues,
		validationSchema: Yup.object(AnnouncementValidation),
		onSubmit: async (values) => {
			let imageUrl = formik.values.pushImage;
			if (typeof values.pushImage !== 'string') {
				if (values.pushImage) {
					imageUrl = await uploadFile(values?.pushImage);
				}
			}
			/*creating announcement*/
			createAnnouncement({
				variables: {
					title: values?.title,
					annoucemntType: type,
					description: values?.description,
					pushImage: imageUrl,
					platform: platformstatus,
					userType: usertype,
					userFilter: advanceFilter,
					startDate: values?.startDate,
					endDate: values?.endDate,
					userToExclude: usertoexcludestate,
					onlySendTo: onlysend,
				},
			})
				.then((res) => {
					const data = res.data as createAnnouncementRes;
					if (data.createAnnouncement.meta.statusCode === 201) {
						toast.success(data.createAnnouncement.meta.message);
						formik.resetForm();
						cancelHandler();
					} else {
						toast.error(data.createAnnouncement.meta.message);
					}
				})
				.catch(() => {
					toast.error(t('Failed to create announcement'));
				});
		},
	});

	/*creating image or file*/
	const uploadFile = async (file: File) => {
		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch('https://basenodeapi.demo.brainvire.dev/media/uploadImages', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();

				return data.data.url;
			} else {
				toast.error(t('Failed to upload file'));
				return '';
			}
		} catch (error) {
			toast.error(t('Failed to upload file'));
			return '';
		}
	};

	/*cancel handler to unsave data*/
	const cancelHandler = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.announcements}/List`);
	}, [navigate]);

	/*radio handler for type*/
	const typeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;

		if (target.value === '0') {
			setType('email');
		}
		if (target.value === '1') {
			setType('push');
		}
		if (target.value === '2') {
			setType('sms');
		}
	};
	/*platform radio handler*/
	const platformHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
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
	/* radio handler for userType*/

	const userTypeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
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
	/* radio handler for advancefilter*/

	const advanceFilterHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		if (target.value === '1') {
			setAdvanceFilter('userToExclude');
		}
		if (target.value === '2') {
			setAdvanceFilter('onlySendTo');
		}
	};

	/*refetch user data*/
	useEffect(() => {
		if (filterData) {
			getUserData(filterData).catch((err) => {
				console.log(err);
			});
		}
	}, [filterData, getUserData]);

	/* dropdown for page limit*/
	const onPageDropSelectAnnouncement = (e: string) => {
		setFilterData({ ...filterData, limit: parseInt(e), page: 1 });
	};
	//page click handler
	const handlePageClickAnnouncement = useCallback(
		(event: number) => {
			setFilterData({ ...filterData, page: event + 1 });
		},
		[filterData]
	);

	//to select checkboxes
	const handleSelectAll = () => {
		setSelectAll((prevState) => !prevState);
		datalist?.getUsersWithPagination?.data?.userList.map((data: UserDataannounce) => {
			return setUsertoexcludestate((prev) => [...prev, data?.id]);
		});

		if (!selectAll) {
			setUsertoexcludestate([]);
		}
	};
	const handleSelectAlllist = () => {
		setSelectAll((prevState) => !prevState);
		datalist?.getUsersWithPagination?.data?.userList.map((data: UserDataannounce) => {
			return setOnlysend((prev) => [...prev, data?.id]);
		});

		if (!selectAll) {
			setOnlysend([]);
		}
	};

	useEffect(() => {
		if (usertoexcludestate.length === datalist?.getUsersWithPagination?.data?.userList?.filter((user: { first_name: string }) => user.first_name?.toLowerCase().includes(searchTerm?.toLowerCase()))?.length) {
			setSelectAll(false);
		}
		if (onlysend.length === datalist?.getUsersWithPagination?.data?.userList?.filter((user: { first_name: string }) => user.first_name?.toLowerCase().includes(searchTerm?.toLowerCase()))?.length) {
			setSelectAll(false);
		}
	}, [usertoexcludestate, onlysend, datalist?.getUsersWithPagination?.data?.userList, searchTerm]);

	const getAnnouncementRoleName = (role: number) => {
		const result = AnnouncementRole.filter((i) => parseInt(i.key) === role);
		return result[0]?.name;
	};
	//for handle to user exclude
	const handleUserTo = (data: { id: number }) => {
		setSelectAll(true);

		if (usertoexcludestate.includes(data.id)) {
			const userData = usertoexcludestate.filter((i) => i !== data.id);

			setUsertoexcludestate(userData);
		} else {
			setUsertoexcludestate((prev) => [...prev, data.id]);
		}
	};

	//for handle only send to
	const handleOnlySendTo = (data: { id: number }) => {
		setSelectAll(true);

		if (onlysend.includes(data.id)) {
			const userData = onlysend.filter((i) => i !== data.id);
			setOnlysend(userData);
		} else {
			setOnlysend((prev) => [...prev, data.id]);
		}
	};
	//search reset handler
	const resetHandler = () => {
		setSearchTerm('');
	};
	//CkEditor onChange Function
	const onChange = (e: string) => {
		formik.setFieldValue('description', e);
	};
	//preview image
	const handleChangeBannerImage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			formik.setFieldValue('pushImage', file);
			setImagePreview(URL.createObjectURL(file));
		}
	}, []);
	const [selectedImage, setSelectedImage] = useState<null | string>(null);

	const handleResetImage = () => {
		setImagePreview('');
		setSelectedImage(null);
		formik.setFieldValue('pushImage.name', ''); // Reset pushImage.name to an empty string
		const fileInput = document.getElementById('image') as HTMLInputElement;
		if (fileInput) {
			fileInput.value = '';
		}
	};

	const hasPreviousPage = filterData.page > 1;
	const hasNextPage = filterData.page < Math.ceil(userData?.count / filterData.limit);

	const OnChangeAnnouncement = useCallback(
		(e: CalendarChangeEvent) => {
			setDates(e.value as Date[]);
		},
		[setDates]
	);

	useEffect(() => {
		formik.setFieldValue('startDate', getDateFromat(dates[0]?.toString(), DATE_FORMAT.simpleDateFormat));
		formik.setFieldValue('endDate', getDateFromat(dates[1]?.toString(), DATE_FORMAT.simpleDateFormat));
	}, [dates[0], dates[1]]);
	return (
			<div>
				<form onSubmit={formik.handleSubmit} className='bg-white shadow-md rounded pt-6 mx-4 my-4 lg:mx-6 border border-[#c8ced3] '>
					<div className='flex justify-end pr-8 pb-2'>
						<p>
							{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
						</p>
					</div>
					{/* title type  */}
					<div className='grid grid-cols-1 md:grid-cols-2 l:grid-cols-4 gap-6 px-8'>
						<div className='mb-4'>
							<TextInput placeholder={t('Title')!} name='title' onChange={formik.handleChange} label={t('Title')} value={formik.values.title} error={formik.errors.title && formik.touched.title ? formik.errors.title : ''} required />
						</div>
						<div className='mb-4'>
							<label className=' text-gray-700 px-1 py-4  mb-1'>
								Type <span className='text-red-500'>*</span>
							</label>
							<div className='flex flex-row mt-2'>
								<div>
									<input type='radio' id='email' value={'0'} name='type' onChange={typeHandler} className='accent-red-600' />
									<label htmlFor='email' className='px-1 mx-1 '>
										Email
									</label>
								</div>
								<div>
									<input type='radio' id='push' value={'1'} name='type' onChange={typeHandler} className='accent-red-600' />

									<label htmlFor='push' className='  px-1 mx-1 '>
										Push
									</label>
								</div>
								<div>
									<input type='radio' id='sms' value={'2'} name='type' onChange={typeHandler} className='accent-red-600' />

									<label htmlFor='sms' className=' px-1 mx-1 '>
										SMS
									</label>
								</div>
							</div>
						</div>
					</div>
					<div className='mb-4 px-8'>
						{type === 'email' ? (
							<div>
								<p className='font-normal text-sm text-gray-700 mb-3'>
									{t('Description')} <span className='text-red-500'>*</span>
								</p>
								<CKEditorComponent value={formik.values.description} onChange={onChange} />
								{formik.errors.description && formik.touched.description && <p className='error'>{t(formik.errors.description)}</p>}
							</div>
						) : (
							<TextInput placeholder={t('Description')!} name='description' onChange={formik.handleChange} label={t('Description')} value={formik.values.description} error={formik.errors.description && formik.touched.description ? formik.errors.description : ''} required={true} />
						)}
					</div>
					<div className='mb-4 px-8'>
						{type === 'email' ? <p className='font-normal text-sm  mb-2'>{t('Email Attachment')}</p> : ''}
						{type === 'push' ? <p className='font-normal text-sm mb-2'>{t('Push Image')}</p> : ''}

						{type !== 'sms' ? (
							<div className='flex'>
								<div className='flex justify-start  mb-4'>
									<div>
										<label htmlFor='image' className="after:content-['Browse'] after:text-black-500  after:bg-slate-200 block text-sm font-normal md:p-2 border border-solid h-9 w-full relative after:top-[3px] after:right-0 rounded-sm after:bottom-0 mr-28 after:absolute after:ml-2  after:border after:h-9 after:-translate-y-1 after:inline-flex after:items-center after:md:p-2 ">
											{t('Choose file')}
										</label>

										<TextInput type='file' id='image' name='image' value={selectedImage!} onChange={handleChangeBannerImage} hidden />
									</div>
									<div className='mx-2'>
										<button type='submit' className='btn btn-primary m-1' onClick={handleResetImage}>
											{t('Reset')}
										</button>
									</div>
								</div>

								{type === 'push' && imagePreview && (
									<>
										{!formik.errors.pushImage ? (
											<div className='flex items-center justify-center mx-8 w-1/4 md:ml-64'>
												<img src={imagePreview} alt=' Preview' className='object-fill w-full h-48 rounded-md' />
											</div>
										) : (
											''
										)}
									</>
								)}
							</div>
						) : (
							''
						)}
					</div>

					{/* from filter data */}
					<div className='mx-8  md:w-auto bg-white  rounded-sm mb-5 border border-[#c8ced3]'>
						<div className='bg-[#f0f3f5] py-3 px-5 flex items-center justify-between border-b border-[#c8ced3]'>
							<div className='flex items-center'>
								<span className='text-sm font-normal'>{t('Filter Data')}</span>
							</div>
						</div>
						<div>
							<div className='w-full grid grid-cols-1 lg:grid-cols-2  gap-6 p-5 '>
								{/* platform type  */}
								<div>
									<label className=' font-normal'>
										{t('Platform Type')} <span className='text-red-500'>*</span>
									</label>
									<div className='radio-btn-group lg:flex mr-6 mt-4 '>
										<div className=' px-4  '>
											<input type='radio' id='all' value={'0'} defaultChecked name='platformstatus' onChange={platformHandler} className='accent-red-600' />
											<label htmlFor='all' className=' font-normal px-4  mx-1 '>
												All
											</label>
										</div>
										<div className='  px-4  '>
											<input type='radio' id='android' value={'1'} name='platformstatus' onChange={platformHandler} className='accent-red-600' />

											<label htmlFor='android' className=' font-normal px-4  mx-1 '>
												Android
											</label>
										</div>
										<div className=' px-4 '>
											<input type='radio' id='ios' value={'2'} name='platformstatus' onChange={platformHandler} className='accent-red-600' />

											<label htmlFor='ios' className='  font-normal px-4  mx-1 '>
												IOS
											</label>
										</div>
										<div className=' px-4  '>
											<input type='radio' id='web' value={'3'} name='platformstatus' onChange={platformHandler} className='accent-red-600' />

											<label htmlFor='web' className=' font-normal px-4  mx-1'>
												Web
											</label>
										</div>
									</div>
								</div>
								<div className='w-full grid grid-cols-1 lg:grid-cols-2  gap-6 p-1 '>
									{/* user type  */}
									<div>
										<label className=' font-normal'>
											{t('User Type')}
											<span className='text-red-500'>*</span>
										</label>
										<div className='radio-btn-group lg:flex mr-6 mt-4 '>
											<div className='flex px-4 '>
												<input type='radio' id='all' value={'0'} defaultChecked name='usertype' onChange={userTypeHandler} className='accent-red-600' />
												<label htmlFor='all' className='font-normal  px-4  mx-1 '>
													All
												</label>
											</div>
											<div className='flex px-4 '>
												<input type='radio' id='customer' value={'1'} name='usertype' onChange={userTypeHandler} className='accent-red-600' />

												<label htmlFor='customer' className='font-normal  px-4  mx-1 '>
													Customer
												</label>
											</div>
											<div className='flex px-4 '>
												<input type='radio' id='admin' value={'2'} name='usertype' onChange={userTypeHandler} className='accent-red-600' />

												<label htmlFor='admin' className='font-normal px-4  mx-1 '>
													Admin
												</label>
											</div>
											<div className='flex  px-4  '>
												<input type='radio' id='subAdmin' value={'3'} name='usertype' onChange={userTypeHandler} className='accent-red-600' />

												<label htmlFor='subAdmin' className='font-normal  px-4  mx-1 '>
													SubAdmin
												</label>
											</div>
										</div>
									</div>
								</div>
								{/* advanced filters  */}
								<div className='mb-4'>
									<label className=' font-normal'>
										{t('Advanced Filters')} <span className='text-red-500'>*</span>
									</label>
									<div className='radio-btn-group lg:flex mr-6 mt-4 '>
										<div className='  px-4'>
											<input type='radio' id='userToExclude' value={'1'} name='advanceFilter' onChange={advanceFilterHandler} className='accent-red-600' />

											<label htmlFor='userToExclude' className='  px-4  '>
												User To Exclude
											</label>
										</div>
										<div className='px-4  '>
											<input type='radio' id='onlySendTo' value={'2'} name='advanceFilter' onChange={advanceFilterHandler} className='accent-red-600' />

											<label htmlFor='onlySendTo' className=' px-4 '>
												Only SendTo
											</label>
										</div>
									</div>
								</div>

								{/* date picker */}
								<div>
									<label className='font-normal mb-2'>{t('Startdate/EndDate')}</label>
									<div className='mt-2 '>
										<Calendar placeholder={` ${t('Created_At')}`} value={dates} numberOfMonths={1} onChange={OnChangeAnnouncement} selectionMode='range' />
									</div>
								</div>
							</div>
							{(advanceFilter === 'userToExclude' || advanceFilter === 'onlySendTo') && (
								<div className='grid grid-cols-1 md:grid-cols-2 l:grid-cols-4 gap-6 p-5 '>
									<TextInput type='text' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder='Search Users' />

									<div className=' px-8 '>
										<Button className='btn-warning btn-normal mx-1' onClick={resetHandler} label={t('Reset')}>
											<div className='mr-1'>
												<Refresh className='mr-1' />
											</div>
										</Button>
									</div>
								</div>
							)}
							<div>
								{/* filters */}
								<>
									{advanceFilter === 'userToExclude' && (
										<p className='mb-8 mt-4 px-5'>
											<span className='text-red-500'> *</span> {t('notification will be sent to users excepted selected')}
										</p>
									)}
									{advanceFilter === 'onlySendTo' && (
										<p className='mb-8 mt-4 px-5'>
											<span className='text-red-500'> *</span> {t('notification will be sent to selected users only')}
										</p>
									)}
									{advanceFilter === 'userToExclude' || advanceFilter === 'onlySendTo' ? (
										<div>
											<div className=' flex items-center justify-between m-4  pt-4 pb-2 '>
												<div className=' px-5  flex  justify-between w-full'>
													<div className='p-3 flex items-center justify-start mb-3'>
														<span className=' text-sm text-gray-900 font-normal '>{t('Show')}</span>
														<CustomSelect options={SHOW_PAGE_COUNT_ARR} value={filterData.limit} onChange={(e) => onPageDropSelectAnnouncement(e)} />
														<span className=' text-sm text-gray-900 font-normal'>{t('Entries')}</span>
													</div>
												</div>
											</div>
											<div className='p-3 overflow-auto custom-datatable '>
												{loading && <p className='text-center text-lg'>Processing....</p>}
												<table>
													<thead>
														<tr>
															<th scope='col' className='text-center'>
																{advanceFilter === 'userToExclude' ? <input type='checkbox' checked={!selectAll} onChange={handleSelectAll} /> : ''}
																{advanceFilter === 'onlySendTo' ? <input type='checkbox' checked={!selectAll} onChange={handleSelectAlllist} /> : ''}
															</th>
															{COL_ARR?.map((viewAnnouceData: ColArrType, index: number) => {
																return (
																	<th scope='col' className='px-6 py-3' key={`${index + 1}`}>
																		<div className='flex items-center'>{viewAnnouceData.name}</div>
																	</th>
																);
															})}
														</tr>
													</thead>
													{!loading && (
														<tbody className='mt-2'>
															{datalist?.getUsersWithPagination?.data?.userList
																?.filter((user: { first_name: string }) => user.first_name?.toLowerCase().includes(searchTerm?.toLowerCase()))
																?.map((data: UserDataannounce) => {
																	return (
																		<tr key={data.id}>
																			<th className='text-center'>
																				{advanceFilter === 'userToExclude' ? <input type='checkbox' checked={!!usertoexcludestate.includes(data.id)} onClick={() => handleUserTo(data)} /> : ''}

																				{advanceFilter === 'onlySendTo' ? <input type='checkbox' checked={!!onlysend.includes(data.id)} onClick={() => handleOnlySendTo(data)} /> : ''}
																			</th>

																			<td>{data.first_name + ' ' + data.last_name}</td>

																			<td>{data.email}</td>
																			{data.device_type !== null ? <td>{data.device_type}</td> : <td>none</td>}
																			<td>{getAnnouncementRoleName(data.role)}</td>
																			<td>
																				<p>{`${data?.created_at?.slice(0, 10)} ${data?.created_at?.slice(11, 19)}`}</p>
																			</td>
																		</tr>
																	);
																})}
														</tbody>
													)}
												</table>
												{loading && <p className='text-center text-lg'>Processing....</p>}
												<hr />
												<div className='p-3 flex items-center justify-between mt-8'>
													<span className='text-slate-400'>
														{' '}
														{userData?.count} {t('Total Records')}
													</span>
													<Pagination pageCount={Math.ceil(userData?.count / filterData.limit)} currentPage={filterData?.page} onPageChange={(e: { selected: number }) => handlePageClickAnnouncement(e.selected)} hasPreviousPage={hasPreviousPage} hasNextPage={hasNextPage} />
												</div>
											</div>
										</div>
									) : (
										''
									)}
								</>
							</div>
						</div>
					</div>
					<div className='flex  bg-[#f0f3f5] py-2 px-7 border border-[#c8ced3]'>
						<div className='btn-group'>
							<Button type='submit' className='btn-primary btn-normal' label={params.id ? t('Update') : t('Save')}>
								<div className='mr-1'>
									<CheckCircle />
								</div>
							</Button>
							<Button className='btn-warning btn-normal' label={t('Cancel')} onClick={cancelHandler}>
								<div className='mr-1'>
									<Cross className='mr-1 fill-white' />
								</div>
							</Button>
						</div>
					</div>
				</form>
			</div>
	);
};

export default AddAnnouncement;