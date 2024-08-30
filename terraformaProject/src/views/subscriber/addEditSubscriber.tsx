/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import logo from '@assets/images/sidebar-logo.png';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/button';
import RadioButtonNew from '@components/radiobutton/radioButtonNew';
import useValidation from '@framework/hooks/validations';
import { Camera, Edit, Trash } from '@components/icons/icons';
import { DATA_URL_TO_FILE, DELETE_WARNING_TEXT, PlanStatus, ROUTES, SubscribedPlan, USER_TYPE, uploadImage } from '@config/constant';
import { whiteSpaceRemover } from '@utils/helpers';
import { CREATE_SUBSCRIBER, DELETE_SUBSCRIBER, UPDATE_SUBSCRIBER } from '@framework/graphql/mutations/subscriber';
import { GET_SUBSCRIBER_BY_ID } from '@framework/graphql/queries/subscriber';
import { CreateSubscriber } from '@types';
import UpdatedHeader from '@components/header/updatedHeader';
import { useDispatch, useSelector } from 'react-redux';
import CountryDropdown from '@components/countryDropdown/countryDropdown';
import { setCountryData } from 'src/redux/country-slice';
import CommonModel from '@components/common/commonModel';
import { UserProfileType } from 'src/types/common';
import { v4 as uuidv4 } from 'uuid';

interface Countries {
	value: string;
	label: string;
}
interface Location {
	uuid: string;
	location: string;
	city: string;
}

const AddEditSubscriber = () => {
	const subscriptionDuration = 30;
	const { t } = useTranslation();
	const Navigate = useNavigate();
	const dispatch = useDispatch();
	const params = useParams();
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const { addSubscriberValidationSchema } = useValidation();
	const { data: SubscriberByIdData, refetch } = useQuery(GET_SUBSCRIBER_BY_ID, { variables: { subscribersId: params.id }, skip: !params.id });
	const [createSubscriber, createSubscriberLoading] = useMutation(CREATE_SUBSCRIBER);
	const [updateSubscriber, updateSubscriberLoading] = useMutation(UPDATE_SUBSCRIBER);
	const { countryData } = useSelector((state: { country: { countryData: Countries } }) => state.country);
	const cropperRef = createRef<ReactCropperElement>();
	const [cropper, setCropper] = useState(false);
	const [image, setImage] = useState('');
	const [thumbnail, setThumbnail] = useState(false);
	const [branchesData, setBranchesData] = useState<Location[]>([]);
	const [deleteLocation, setDeleteLocation] = useState<string[]>([]);
	const todaysDate = new Date();
	const [deleteSubscriberById] = useMutation(DELETE_SUBSCRIBER);
	const [isDeleteSubscriber, setIsDeleteSubscriber] = useState<boolean>(false);
	const { userProfileData } = useSelector(
		(state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile,
	);
	const [imageLoader,setImageLoader] = useState(false);
	const userType = userProfileData?.getProfile?.data?.user_type ?? '';
	/**
	 * set the initial values
	 */
	const initialValues: CreateSubscriber = {
		firstName: '',
		lastName: '',
		Email: '',
		SubscribedCompany: '',
		Address: '',
		countryCode: '',
		Logo: '',
		PhoneNumber: '',
		StartDate: moment(todaysDate).format('MM/DD/YYYY'),
		ExpireDate: '',
		PlanStatus: '0',
		SubscribedPlan: 1,
		status: '1',
		location: '',
		city: '',
		branch_data: '',
		editedIndex: null,
		uuid: '',
		branches: [],
		subscriber_id: '',
		thumbnail: ''
	};

	/**
	 * Method used for get state api with id
	 */
	useEffect(() => {
		if (params.id) {
			refetch({ subscribersId: params.id }).catch(e => toast.error(e));
		}
	}, [params.id]);

	useEffect(() => {
		if (countryData) {
			formik.setFieldValue('countryCode', countryData?.value);
		}
	}, [countryData]);

	const formik = useFormik({
		initialValues,
		validationSchema: addSubscriberValidationSchema,
		onSubmit: async values => {
			if (params.id) {
				const branches = branchesData.map(branch => {
					const branches = { location: branch?.location, city: branch?.city, uuid: branch?.uuid };
					return branches;
				});

				const subscriberData = {
					first_name: values.firstName,
					last_name: values.lastName,
					email: values.Email,
					company_name: values.SubscribedCompany,
					address: values.Address,
					phone_number: values.PhoneNumber,
					country_code: values.countryCode,
					logo: values.Logo,
					thumbnail: values.thumbnail,
					subscribe_start: moment(values.StartDate),
					subscribe_end: moment(values.ExpireDate),
					status: parseInt(values.status),
					branch_data: branches,
					delete_branch_data: deleteLocation,
					subscriber_id: values.subscriber_id,
				};

				updateSubscriber({
					variables: {
						subscriberData: subscriberData,
						subscriberId: String(params.id),
					},
				})
					.then(res => {
						const data = res.data;
						toast.success(data?.updateSubscriber?.message);
						formik.resetForm();
						onCancelSubscribe();
					})
					.catch(err => {
						toast.error(err.networkError.result.errors[0].message);
					});
			} else {
				const branches = branchesData.map(branch => {
					const branches = { location: branch?.location, city: branch?.city };
					return branches;
				});

				createSubscriber({
					variables: {
						subscriberData: {
							first_name: values.firstName,
							last_name: values.lastName,
							email: values.Email,
							company_name: values.SubscribedCompany,
							phone_number: values.PhoneNumber,
							subscribe_start: moment(values.StartDate),
							subscribe_end: moment(values.ExpireDate),
							address: values.Address,
							country_code: values.countryCode,
							logo: values.Logo,
							thumbnail: values.thumbnail,
							status: parseInt(values.status),
							branch_data: branches,
							subscriber_id: values?.subscriber_id,
						},
					},
				})
					.then(res => {
						const data = res.data;
						toast.success(data?.createSubscriber?.message);
						formik.resetForm();
						onCancelSubscribe();
					})
					.catch(err => {
						toast.error(err.networkError.result.errors[0].message);
					});
			}
		},
	});

	/**
	 * manage as end date as per plan status
	 */
	useEffect(() => {
		const today = moment();
		const nextMonth = today.clone().add(1, 'month');
		const formattedDate = nextMonth.format('MM/DD/YYYY');
		formik.setFieldValue('ExpireDate', formattedDate);
	}, [subscriptionDuration]);

	const onCancelSubscribe = useCallback(() => {
		Navigate(-1);
	}, []);

	/**
	 * cancel button click
	 */
	const onCancelClick = useCallback(() => {
		dispatch(setCountryData(''));
		Navigate(`/${ROUTES.app}/${ROUTES.subscriber}`);
	}, []);

	/**
	 *
	 * @param fieldName particular field name pass base on error show
	 * @returns
	 */
	const getErrorUserMng = (fieldName: keyof CreateSubscriber) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	/**
	 *  not add empty space logic
	 */
	const OnBlur = useCallback(
		(e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
			formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
		},
		[],
	);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleLogo = useCallback((e: any) => {
		e.preventDefault();
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				if (file.size > 5 * 1024 * 1024) {
					toast.error('Image size must be less than 5MB');
				} else {
					const reader = new FileReader();
					reader.onload = () => {
						setImage(reader.result as any);
						setCropper(true);
					};
					reader.readAsDataURL(file);
				}
			} else {
				toast.error('Please select a valid image file');
			}
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, []);

	const handleThumbnail = useCallback((e: any) => {
		e.preventDefault();
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				if (file.size > 5 * 1024 * 1024) {
					toast.error('Image size must be less than 5MB');
				} else {
					const reader = new FileReader();
					reader.onload = () => {
						setImage(reader.result as any)
						setThumbnail(true);
						setCropper(true);
					};
					reader.readAsDataURL(file);
				}
			} else {
				toast.error('Please select a valid image file');
			}
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	}, []);


	const handleSubscribedPlanChange = (e: { target: { value: string } }) => {
		formik.handleChange(e);
		const selectedPlan = SubscribedPlan.find(plan => plan.key === parseInt(e.target.value, 10));
		if (selectedPlan) {
			const today = moment();
			const nextMonth = today.clone().add(selectedPlan?.key, 'month');
			const formattedDate = nextMonth.format('MM/DD/YYYY');
			formik.setFieldValue('ExpireDate', formattedDate);
		}
	};

	/**
	 * Method used for close model
	 */
	const onCloseSubscriber = useCallback(() => {
		setIsDeleteSubscriber(false);
	}, []);

	const deleteSubscriber = useCallback(() => {
		deleteSubscriberById({
			variables: {
				subscribersId: params.id,
			},
		})
			.then(res => {
				const data = res.data;
				toast.success(data.deleteSubscriber.message);
				setIsDeleteSubscriber(false);
				Navigate(-1);
			})
			.catch(err => {
				toast.error(err.networkError.result.errors[0].message);
			});
	}, [params.id]);

	useEffect(() => {
		if (SubscriberByIdData && params.id) {
			const data = SubscriberByIdData?.getSubscriber?.data;
			const startDate = moment(data.subscribe_start);
			const expireDate = moment(data.subscribe_end);
			const selectedMonth = expireDate.diff(startDate, 'months');
			dispatch(setCountryData({ value: data?.country_code?.uuid, label: `${data?.country_code?.phoneCode} ${data?.country_code?.name}` }));
			formik.setValues({
				firstName: data?.first_name,
				lastName: data?.last_name,
				PhoneNumber: data?.phone_number,
				SubscribedCompany: data?.company_name,
				Logo: data.logo,
				thumbnail: data.thumbnail,
				countryCode: data?.country_code?.uuid,
				Email: data?.email,
				StartDate: moment(data?.subscribe_start).format('MM/DD/YYYY'),
				ExpireDate: moment(data?.subscribe_end).format('MM/DD/YYYY'),
				Address: data?.address,
				status: data?.status,
				SubscribedPlan: +selectedMonth,
				branch_data: data?.subscriber_branch,
				subscriber_id: data?.subscriber_id,
			});
			setBranchesData(data?.subscriber_branch);
		}
	}, [SubscriberByIdData]);

	const getCropData = async (): Promise<void> => {
		if (typeof cropperRef.current?.cropper !== 'undefined') {
			await setImageLoader(true);
			if (thumbnail) {
				let fileName: string | null = null;
				const file = DATA_URL_TO_FILE(cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), 'thumbnail.png');
				const formData = new FormData();
				formData.append('image', file);
				fileName = await uploadImage(formData, 'profile');
				if (fileName) {
					formik.setFieldValue('thumbnail', fileName);
					setCropper(false);
					setThumbnail(false);
				}
			} else {
				let fileName: string | null = null;
				const file = DATA_URL_TO_FILE(cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), 'image.png');
				const formData = new FormData();
				formData.append('image', file);
				fileName = await uploadImage(formData, 'profile');
				if (fileName) {
					formik.setFieldValue('Logo', fileName);
					setCropper(false);
				}
			}

			await setImageLoader(false);
		}
	};

	const dialogActionConst = () => {
		return (
			<div className="flex justify-end gap-3 md:gap-5">
				<Button
					className="btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap"
					type="button"
					label="Cancel"
					onClick={() => setCropper(false)}
				/>
				<Button className="btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap" type="button" disabled={imageLoader} label={'Save'} onClick={() => getCropData()} />				
			</div>
		);
	};

	const locationValidation = () => {
		if (!formik.values.location && !formik.values.city) {
			formik.setFieldError('location', 'Please enter location.');
			formik.setFieldError('city', 'Please enter city.');
			return false;
		} else if (formik?.values?.location && formik?.values?.location?.length < 3) {
			formik.setFieldError('location', 'Location should not be less than 3 characters');
			return false;
		} else if (formik?.values?.city && formik?.values?.city?.length < 3) {
			formik.setFieldError('city', 'City should not be less than 3 characters');
			return false;
		} else if (formik?.values?.location && formik?.values?.location?.length > 100) {
			formik.setFieldError('location', 'Location should not be more than 100 characters');
			return false;
		} else if (formik?.values?.city && formik?.values?.city?.length > 100) {
			formik.setFieldError('city', 'City should not be more than 100 characters');
			return false;
		} else {
			return true;
		}
	};

	const handleAddClick = () => {
		const { editedIndex } = formik.values;
		const updatedList = [...branchesData];
		if (locationValidation()) {
			if (editedIndex !== undefined && editedIndex !== null) {
				updatedList[editedIndex] = {
					city: formik.values.city as string,
					location: formik.values.location as string,
					uuid: formik.values.uuid ?? ('' as string),
				};
			} else {
				updatedList.push({
					city: formik.values.city as string,
					location: formik.values.location as string,
					uuid: '',
				});
			}
			setBranchesData(updatedList);
			formik.setFieldValue('city', '');
			formik.setFieldValue('location', '');
			formik.setFieldValue('uuid', '');
			formik.setFieldValue('editedIndex', null);
			formik.setFieldValue('branches', updatedList);
		}
	};

	const handleDeleteClick = (index: number) => {
		const updatedBranchesList = branchesData?.filter((_, i: number) => i !== index);
		const branchesList = branchesData?.[index];
		setBranchesData(updatedBranchesList);
		setDeleteLocation([...deleteLocation, branchesList?.uuid]);
		formik.setFieldValue('branches', updatedBranchesList);
	};

	const handleEditClick = (index: number) => {
		const editList = branchesData?.[index];
		formik.setFieldValue('city', editList?.city);
		formik.setFieldValue('location', editList?.location);
		formik.setFieldValue('uuid', editList?.uuid);
		formik.setFieldValue('editedIndex', index);
	};

	const onDeleteButton = useCallback(() => {
		setIsDeleteSubscriber(true);
	}, [])

	return (
		<>
			<UpdatedHeader headerTitle={params.id ? 'Subscriber Edit Page' : 'Add New Subscriber'} />
			<div>
				<form>
					<div className="flex flex-wrap items-start justify-start p-3 mb-5 border border-solid md:p-5 md:mb-7 border-border-primary rounded-xl">
						<div className='font-medium text-sm text-black'>
							<label>Subscriber Logo</label>
							<div className="flex items-center justify-center w-full md:max-w-[400px] lg:mr-5 max-h-[385px] aspect-square lg:w-1/3 lg:max-w-[487px] lg:min-w-[320px] xl:min-w-[410px] border border-border-primary border-solid rounded-xl mb-5 md:mb-8 lg:mb-0">
								<div className="box-border flex flex-col items-center justify-center">
									<label htmlFor="logo" className="relative flex flex-col items-center justify-center">
										<div className="flex items-center justify-center overflow-hidden border border-solid rounded-full cursor-pointer border-border-primary w-44 h-44">
											{formik?.values?.Logo ? (
												<img
													src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${formik.values.Logo}`}
													alt="Logo"
													className="object-contain w-full h-full bg-black"
												/>
											) : (
												<img src={logo} alt="Logo" className="object-contain w-full h-full bg-black" />
											)}
										</div>
										<input type="file" id="logo" name="Logo" accept="image/*" onChange={handleLogo} ref={fileInputRef} className="hidden" key={uuidv4()} />
										<div className="absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary cursor-pointer">{<Camera />}</div>
									</label>
									{formik.errors.Logo && formik.touched.Logo ? <span className="relative mt-2 md:text-xs-15 error">{formik.errors.Logo}</span> : ''}
								</div>
							</div>
						</div>
						<div className='font-medium text-sm text-black'>
							<label >Subscriber Thumbnail</label>
							<div className="flex items-center justify-center w-full md:max-w-[400px] lg:mr-5 max-h-[385px] aspect-square lg:w-1/3 lg:max-w-[487px] lg:min-w-[320px] xl:min-w-[410px] border border-border-primary border-solid rounded-xl mb-5 md:mb-8 lg:mb-0">
								<div className="box-border flex flex-col items-center justify-center">
									<label htmlFor="thumbnail" className="relative flex flex-col items-center justify-center">
										<div className="flex items-center justify-center overflow-hidden border border-solid rounded-full cursor-pointer border-border-primary w-44 h-44">
											{formik?.values?.thumbnail ? (
												<img
													src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${formik.values.thumbnail}`}
													alt="thumbnail"
													className="object-contain w-full h-full bg-black"
												/>
											) : (
												<img src={logo} alt="thumbnail" className="object-contain w-full h-full bg-black" />
											)}
										</div>
										<input type="file" id="thumbnail" name="thumbnail" accept="image/*" onChange={handleThumbnail} ref={fileInputRef} className="hidden" key={uuidv4()} />
										<div className="absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary cursor-pointer">{<Camera />}</div>
									</label>
									{formik.errors.thumbnail && formik.touched.thumbnail ? <span className="relative mt-2 md:text-xs-15 error">{formik.errors.thumbnail}</span> : ''}
								</div>
							</div>
						</div>

						<div className="flex flex-wrap w-full mt-3 gap-3 md:gap-5 lg:w-2/3">
							<div className="inline-block w-full 2xl:w-[calc(50%-10px)]">
								<TextInput
									onBlur={OnBlur}
									placeholder={t('Subscribed Company Name')}
									required={true}
									label={t('Subscribed Company Name')}
									name="SubscribedCompany"
									type="text"
									onChange={formik.handleChange}
									value={formik.values.SubscribedCompany}
									error={getErrorUserMng('SubscribedCompany')}
								/>
							</div>
							<div className="inline-block w-full 2xl:w-[calc(50%-10px)]">
								<TextInput
									onBlur={OnBlur}
									placeholder={t('Subscriber Id')}
									name="subscriber_id"
									required={true}
									label={t('Subscriber Id')}
									type="text"
									onChange={formik.handleChange}
									value={formik.values.subscriber_id}
									error={getErrorUserMng('subscriber_id')}
								/>
							</div>
							<div className="inline-block w-full 2xl:w-[calc(50%-10px)]">
								<TextInput
									onBlur={OnBlur}
									placeholder={t('First Name')}
									name="firstName"
									required={true}
									label={t('First Name')}
									type="text"
									onChange={formik.handleChange}
									value={formik.values.firstName}
									error={getErrorUserMng('firstName')}
								/>
							</div>
							<div className="inline-block w-full 2xl:w-[calc(50%-10px)]">
								<TextInput
									onBlur={OnBlur}
									placeholder={t('Last Name')}
									name="lastName"
									required={true}
									label={t('Last Name')}
									type="text"
									onChange={formik.handleChange}
									value={formik.values.lastName}
									error={getErrorUserMng('lastName')}
								/>
							</div>
							<div className="inline-block w-full 2xl:w-[calc(50%-10px)]">
								<label>
									Phone Number
								</label>
								<div className="flex gap-2.5">
									<div className="w-[120px]">
										<CountryDropdown error={formik?.errors?.countryCode} />
									</div>
									<div className="w-[calc(100%-120px)]">
										<TextInput
											onBlur={OnBlur}
											placeholder={t('Phone Number')}
											name="PhoneNumber"
											required={true}
											type="tel"
											onChange={formik.handleChange}
											value={formik.values.PhoneNumber}
											error={getErrorUserMng('PhoneNumber')}
										/>
									</div>
								</div>
							</div>
							<div className="inline-block w-full 2xl:w-[calc(50%-10px)]">
								<TextInput
									disabled={userType !== USER_TYPE.SUPER_ADMIN}
									onBlur={OnBlur}
									placeholder={t('Email')}
									name="Email"
									required={true}
									onChange={formik.handleChange}
									value={formik.values.Email}
									label={t('Email')}
									error={getErrorUserMng('Email')}
								/>
							</div>
							<div className="inline-block w-full 2xl:w-[calc(50%-10px)]">
								<TextInput
									onBlur={OnBlur}
									placeholder={t('Address')}
									name="Address"
									required={true}
									label={t('Address')}
									type="text"
									onChange={formik.handleChange}
									value={formik.values.Address}
									error={getErrorUserMng('Address')}
								/>
							</div>
							<div className="inline-block w-full">
								<RadioButtonNew
									required={true}
									checked={formik.values.SubscribedPlan}
									onChange={handleSubscribedPlanChange}
									name={'SubscribedPlan'}
									radioOptions={SubscribedPlan}
									label={t('Subscription Duration')}
									error={getErrorUserMng('SubscribedPlan')}
								/>
							</div>
							<div className="inline-block w-full 2xl:w-[calc(50%-10px)]">
								<TextInput
									disabled
									onBlur={OnBlur}
									required={true}
									type="text"
									placeholder={t('Start Date')}
									name="StartDate"
									onChange={formik.handleChange}
									label={t('Start Date')}
									value={formik.values.StartDate}
								/>
							</div>
							<div className="inline-block w-full 2xl:w-[calc(50%-10px)]">
								<TextInput
									disabled
									onBlur={OnBlur}
									required={true}
									type="text"
									placeholder={t('End Date')}
									name="ExpireDate"
									onChange={formik.handleChange}
									label={t('End Date')}
									value={formik.values.ExpireDate}
								/>
							</div>
							<div className="inline-block w-full 2xl:w-[calc(50%-10px)]">
								<RadioButtonNew
									required={true}
									checked={formik.values.status}
									onChange={formik.handleChange}
									name={'status'}
									radioOptions={PlanStatus}
									label={t('Plan Status')}
									error={getErrorUserMng('status')}
								/>
							</div>
							<div className="flex flex-wrap w-full">
								<div className="flex flex-wrap w-full">
									<label className="w-full">
										Location & City<span className="error">*</span>
									</label>
									<div className="flex w-[calc(100%-123px)] md:w-[calc(100%-140px)]">
										<div className="[&_input]:rounded-r-none w-1/2">
											<TextInput
												placeholder={t('Enter Location')}
												type="text"
												id="location"
												name="location"
												value={formik.values.location}
												onChange={formik.handleChange}
												required={true}
												error={getErrorUserMng('location')}
												onBlur={OnBlur}
											/>
										</div>
										<div className="[&_input]:rounded-none w-1/2">
											<TextInput
												placeholder={t('Enter City')}
												type="text"
												id="city"
												name="city"
												value={formik.values.city}
												onChange={formik.handleChange}
												required={true}
												error={getErrorUserMng('city')}
												onBlur={OnBlur}
											/>
										</div>
									</div>

									<div className="[&_button]:rounded-l-none">
										<Button
											className="btn-primary btn-normal md:mb-0 w-full md:w-[140px]"
											type="button"
											onClick={handleAddClick}
											label={t(formik.values.editedIndex === null ? 'Add Location' : 'Update Location')}
											title='Update Location'
										/>
									</div>
									{formik.errors.branches && formik.touched.branches && <p className="mt-1 md:text-xs-15 error">{formik.errors.branches}</p>}
								</div>
								{branchesData && (
									<div className="w-full px-2 mt-3">
										{branchesData?.length > 0 && (
											<div className="flex w-[calc(100%-48px)]">
												<p className="w-1/2 font-bold truncate">Location</p>
												<p className="w-1/2 font-bold truncate">City</p>
											</div>
										)}
										{branchesData?.map((location: { uuid?: string; location?: string; city?: string }, index: number) => (
											<div key={`${index + 1}`} className="flex items-center py-2 border-b">
												<p className="w-[calc(50%-24px)] truncate ">{location?.location}</p>
												<p className="w-[calc(50%-24px)] truncate ">{location?.city}</p>
												<div className="flex items-center">
													<Button className="mr-4 bg-transparent btn-default" onClick={() => handleEditClick(index)} label={''}>
														<Edit className="fill-primary" />
													</Button>
													<Button className="bg-transparent cursor-pointer btn-default" onClick={() => handleDeleteClick(index)} label={''}>
														<Trash className="fill-error" />
													</Button>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
					<div className={`${params?.id ? '' : 'flex gap-5'}`}>

						<Button className="btn-secondary btn-normal w-full md:w-[160px]" label={t('Cancel')} onClick={onCancelClick} title='Cancel' />
						<div className={`${params?.id ? 'float-right' : ''}`}>
							<Button
								className="mr-5 btn-primary btn-normal mb-3 md:mb-0 w-full md:w-[160px]"
								type="button"
								onClick={() => formik.handleSubmit()}
								label={t('Save')}
								disabled={createSubscriberLoading?.loading || updateSubscriberLoading.loading}
								title='Save'
							/>
							{params?.id && userType === USER_TYPE?.SUPER_ADMIN && <Button label="Delete" className="btn-error btn-normal mb-3 md:mb-0 w-full md:w-[160px]" type="button" onClick={onDeleteButton} title='Delete'/>}
						</div>
					</div>
				</form>
				{isDeleteSubscriber && userType === USER_TYPE?.SUPER_ADMIN && (
					<CommonModel warningText={DELETE_WARNING_TEXT} onClose={onCloseSubscriber} action={deleteSubscriber} show={isDeleteSubscriber} />
				)}
			</div>

			<Dialog
				className="custom-dialog"
				header="Crop Image"
				visible={cropper}
				style={{ width: '50vw' }}
				onHide={() => setCropper(false)}
				footer={() => dialogActionConst()}
			>
				{image && (
					<Cropper
						ref={cropperRef}
						style={{ height: 400, width: '100%' }}
						zoomTo={0.5}
						aspectRatio={thumbnail ? 7 / 8 : 3/1}
						preview=".img-preview"
						src={image}
						viewMode={1}
						minCropBoxHeight={10}
						minCropBoxWidth={10}
						background={false}
						responsive={true}
						autoCropArea={1}
						checkOrientation={false}
						guides={true}
						cropBoxResizable={false}
					/>
				)}
			</Dialog>
		</>
	);
};
export default AddEditSubscriber;
