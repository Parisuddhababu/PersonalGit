/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import logo from '@assets/images/sidebar-logo.png'
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/button';
import { Camera, DropdownArrowDown } from '@components/icons/icons';
import { AUTHORIZE_PERSON_USER_TYPE, DATA_URL_TO_FILE, IMAGE_BASE_URL, MAX_FILE_SIZE, SettingsDrpData, USER_TYPE, uploadImage } from '@config/constant';
import { whiteSpaceRemover } from '@utils/helpers';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import Cropper, { ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { t } from 'i18next';
import DropDown from '@components/dropdown/dropDown';
import { GET_USER_DETAILS_BY_ID } from '@framework/graphql/queries/getCompanyBranches';
import { DropdownOptionType } from '@types';
import { GET_REPORTING_MANAGERS, GET_ACTIVE_ROLES_DATA } from '@framework/graphql/queries/role';
import { StateDataArr } from '@framework/graphql/graphql';
import { toast } from 'react-toastify';
import { UPDATE_SUBSCRIBER_EMPLOYEE_USER } from '@framework/graphql/mutations/updateSubscriberEmployeeUser';
import useValidation from '@framework/hooks/validations';
import { GET_COUNTRY } from '@framework/graphql/queries/subscriber';

interface UserDetailsInitialType {
	logo?: string,
	last_name: string,
	first_name: string,
	email: string,
	mobile_number: string,
	role: string,
	preferredLanguage: string,
	department: string,
	reportingManager: string,
	branchId: any,
	country_code: string,
	position: string,
	isReportingManager: boolean | undefined
}

function Index() {
	const queryParams = new URLSearchParams(location.search);
	const uuid = queryParams.get('uuid');
	const branchId = queryParams.get('branchId');
	const companyId = queryParams.get('company_id');
	const isSubAdminString = queryParams.get('Is_subAdmin');
	const isSubAdmin = isSubAdminString === 'true';
	const { updateUserValidationSchema } = useValidation();
	const userType = queryParams.get('userTypeId');
	const userTypeValue = queryParams.get('userTypeValue');
	const readUserData = queryParams.get('read_Data');
	const companyType = queryParams.get('userCompanyType');
	const { data: getUserDetailsData, refetch: getUserDetailsRefetch, loading: getUserDetailsLoading } = useQuery(GET_USER_DETAILS_BY_ID, { variables: { userId: uuid } });
	const { data: getRolesData } = useQuery(GET_ACTIVE_ROLES_DATA, { variables: { limit: 500, page: 1, search: '', sortOrder: '', sortField: 'name' } });
	const [updateSubscriberEmployeeUser, updateSubscriberEmployeeUserLoading] = useMutation(UPDATE_SUBSCRIBER_EMPLOYEE_USER);
	const [image, setImage] = useState('');
	const [cropper, setCropper] = useState(false);
	const navigate = useNavigate();
	const cropperRef = createRef<ReactCropperElement>();
	const [reportingManagerDrpData, setReportingManagerDrpData] = useState<DropdownOptionType[]>([]);
	const [roleDrpData, setRoleDrpData] = useState<DropdownOptionType[]>([]);
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const [loading, setLoading] = useState<boolean>(false)
	const [stateDrpData, setStateDrpData] = useState<DropdownOptionType[]>([]);
	const { data } = useQuery(GET_COUNTRY);
	const [countryDrpData, setCountryDrpData] = useState<DropdownOptionType[]>([]);
	const userContractorDataType = (companyType === '2') ? AUTHORIZE_PERSON_USER_TYPE.CONTRACTOR : AUTHORIZE_PERSON_USER_TYPE.USER;
	const userDataType = (companyType === '1') ? AUTHORIZE_PERSON_USER_TYPE.TENANT : userContractorDataType;
	const { data: getReportingManagersData, refetch } = useQuery(GET_REPORTING_MANAGERS, { variables: { userData: { search: '', companyId: companyId ?? '', branchId: branchId ?? '', user_type: userDataType, userId: uuid } } });
	/**
	 * set the initial values
	*/
	const initialValues: UserDetailsInitialType = {
		logo: '',
		first_name: '',
		last_name: '',
		email: '',
		mobile_number: '',
		role: '',
		preferredLanguage: '',
		department: '',
		reportingManager: '',
		branchId: '',
		country_code: '',
		position: '',
		isReportingManager: !isSubAdmin,
	};

	useEffect(() => {
		if (getReportingManagersData) {
			refetch();
		}
	}, [])

	useEffect(() => {
		getUserDetailsRefetch();
	}, [])

	useEffect(() => {
		const tempDataArr = [] as DropdownOptionType[];
		getRolesData?.getActiveRoles?.data?.role?.map((data: StateDataArr) => {
			tempDataArr.push({ name: data?.name, key: data?.uuid });
		});
		setRoleDrpData(tempDataArr);
	}, [getRolesData])

	useEffect(() => {
		const tempDataArr = [] as DropdownOptionType[];
		getReportingManagersData?.getReportingManagers?.data?.map((data: { first_name: string, last_name: string, uuid: string }) => {
			tempDataArr.push({ name: `${data?.first_name} ${data?.last_name}`, key: data?.uuid });
		});
		setReportingManagerDrpData(tempDataArr);
	}, [getReportingManagersData])

	useEffect(() => {
		if (getUserDetailsData) {
			const data = getUserDetailsData?.getUserById?.data;
			formik.resetForm({
				values: {
					first_name: data?.user?.first_name,
					last_name: data?.user?.last_name,
					email: data?.user?.email,
					mobile_number: data?.user?.phone_number,
					role: data?.role_id?.uuid,
					preferredLanguage: data?.user?.preferred_language,
					department: data?.user?.department,
					reportingManager: data?.user?.reporting_manager_id?.uuid,
					logo: data?.user?.profile_picture,
					branchId: branchId,
					country_code: data?.user?.country_code?.uuid,
					position: data?.user?.position,
					isReportingManager: !isSubAdmin,
				}
			})
		}
	}, [getUserDetailsData])

	/**
	 * cancel button click
	 */
	const onCancelClick = useCallback(() => {
		navigate(-1);
	}, []);

	const formik = useFormik({
		initialValues,
		validationSchema: updateUserValidationSchema,
		onSubmit: async (values) => {
			let user_Type = '' as string | number;
			if (companyType) {
				if (companyType === '2') {
					user_Type = USER_TYPE.SUBSCRIBER_CONTRACTOR;
					if (isSubAdmin) {
						user_Type = USER_TYPE.SUBSCRIBER_SUB_ADMIN_CONTRACTOR;
					}
				} else {
					user_Type = USER_TYPE.SUBSCRIBER_TENANT;
					if (isSubAdmin) {
						user_Type = USER_TYPE.SUBSCRIBER_TENANT_SUB_ADMIN;
					}
				}
			}
			if (userType && userTypeValue) {
				user_Type = +userTypeValue;
			}

			updateSubscriberEmployeeUser({
				variables: {
					subscriberUserData: {
						profile_picture: values?.logo ?? '',
						country_code: values?.country_code,
						department: values?.department,
						first_name: values?.first_name,
						last_name: values?.last_name,
						phone_number: values?.mobile_number,
						preferred_language: values?.preferredLanguage,
						// pronounce: getUserDetailsData?.getUserById?.data?.user?.pronounce,
						reporting_manager_id: isSubAdmin ? null : values.reportingManager,
						role_id: values?.role,
						user_type: user_Type ?? '',
						position: values?.position,
						// branchId:values?.branchId,
					},
					subscriberUserId: uuid,
				},
			})
				.then((res) => {
					toast.success(res?.data?.updateSubscriberEmployeeUser?.message)
					navigate(-1);
				})
				.catch((err) => {
					toast.error(err?.networkError?.result?.errors?.[0]?.message)
				})
		}

	});

	useEffect(() => {
		const userLocation = getUserDetailsData?.getUserById?.data?.location;
		if (userLocation) {
			const tempDataArr = [{ name: userLocation, key: userLocation }] as DropdownOptionType[];
			setStateDrpData(tempDataArr);
		}
	}, [getUserDetailsData]);

	const dialogActionConst = () => {
		return (
			<div className='flex justify-end gap-5'>
				<Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setCropper(false)} />
				<Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" onClick={() => getCropData()} disabled={loading} />
			</div>
		)
	}

	const handleLogo = useCallback((e: any) => {
		e.preventDefault();
		let files;
		if (e.dataTransfer) {
			files = e.dataTransfer.files;
		} else if (e.target) {
			files = e.target.files;
		}
		if (files && files.length > 0) {
			const file = files[0];
			if (file.type.startsWith('image/')) {
				if (file.size > MAX_FILE_SIZE) {
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
			fileInputRef.current.value = ''; // This clears the input field
		}
	}, []);

	const getCropData = async (): Promise<void> => {
		if (typeof cropperRef.current?.cropper !== 'undefined') {
			let fileName: string | null = null;
			const file = DATA_URL_TO_FILE(cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), 'employeeImage.png');
			const formData = new FormData();
			formData.append('image', file);
			setLoading(true);
			fileName = await uploadImage(formData,'profile');
			if (fileName) {
				formik.setFieldValue('logo', fileName);
				setCropper(false);
				setLoading(false);
			}
		}
	};

	/**
	 *  not add empty space logic
	 */
	const OnBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	useEffect(() => {
		const tempDataArr = [] as DropdownOptionType[];
		data?.getCountries?.data?.map((data: { phoneCode: number, uuid: string }) => {
			tempDataArr.push({ name: `+${data?.phoneCode}`, key: data?.uuid });
		});
		setCountryDrpData(tempDataArr);
	}, [data])

	return (
		<>
			<div>
				<h1 className='font-bold text-size-30'>User Details</h1>
			</div>
			<div>
				<form onSubmit={formik.handleSubmit}>
					<div className='flex flex-wrap items-start justify-center p-5 border border-solid sm:justify-start lg:flex-nowrap mb-7 border-border-primary rounded-xl'>
						<div className='flex items-center justify-center w-full max-w-[400px] lg:mr-5 h-full aspect-square lg:w-1/3 lg:max-w-[480px] lg:min-w-[320px] xl:min-w-[410px] border border-border-primary border-solid rounded-xl mb-8 lg:mb-0'>
							<div className={`box-border flex items-center justify-center ${readUserData ? 'pointer-events-none' : ''}`}>
								<label
									htmlFor='logo'
									className='relative flex flex-col items-center justify-center'>
									<p className='error'>{formik.errors.logo && formik.touched.logo ? t(formik.errors.logo) : ''}</p>
									<div className='flex items-center justify-center w-32 h-32 overflow-hidden border border-gray-300 border-solid rounded-full cursor-pointer sm:w-44 sm:h-44'>
										<img src={formik?.values?.logo ? IMAGE_BASE_URL + formik?.values?.logo : logo} alt='logo' className='object-contain w-full h-full bg-black' />
									</div>
									<input
										id='logo'
										type='file'
										name='logo'
										multiple
										className="hidden"
										accept=".png, .jpeg"
										ref={fileInputRef}
										onChange={(e) => handleLogo(e)}
									/>
									<div className='absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary'>{<Camera />}</div>
								</label>
							</div>
						</div>

						<div className='flex flex-wrap w-full gap-5 lg:w-2/3'>
							<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
								<TextInput placeholder={t('First Name')} type='text' id='first_name' name='first_name' label={t('First Name')} value={formik.values.first_name} onChange={formik.handleChange} required={true} error={formik.errors.first_name && formik.touched.first_name && formik.errors.first_name} onBlur={OnBlur} disabled={!!readUserData} />
							</div>

							<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
								<TextInput placeholder={t('Last Name')} type='text' id='last_name' name='last_name' label={t('Last Name')} value={formik.values.last_name} onChange={formik.handleChange} required={true} error={formik.errors.last_name && formik.touched.last_name && formik.errors.last_name} onBlur={OnBlur} disabled={!!readUserData} />
							</div>

							<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
								<TextInput placeholder={t('Email')} type='text' id='email' name='email' label={t('Email')} value={formik.values.email} onChange={formik.handleChange} required={true} error={formik.errors.email && formik.touched.email && formik.errors.email} onBlur={OnBlur} disabled={true} />
							</div>

							{/* <div className='inline-block w-full xl:w-[calc(50%-10px)]'>
								<TextInput placeholder={t('Mobile Number')} type='number' id='mobile_number' name='mobile_number' label={t('Mobile Number')} value={formik.values.mobile_number} onChange={formik.handleChange} required={true} error={formik.errors.mobile_number && formik.touched.mobile_number ? formik.errors.mobile_number : ''} onBlur={OnBlur} disabled={!!readUserData} />
							</div> */}

							<div className="w-full lg:w-[calc(50%-10px)]">
								<label >{t('Mobile Number')}
									
								</label>
								<div className='flex'>
									<DropDown placeholder={t('Code')} className='min-w-[96px]' onChange={formik.handleChange} value={formik.values.country_code} options={countryDrpData} name='country_code' id='country_code' error={formik.errors.country_code && formik.touched.country_code ? formik.errors.country_code : ''} disabled={!!readUserData} />
									<TextInput placeholder={t('Mobile Number')} type='tel' id='mobile_number' name='mobile_number' value={formik.values.mobile_number} onChange={formik.handleChange} error={formik.errors.mobile_number && formik.touched.mobile_number && formik.errors.mobile_number} onBlur={OnBlur} disabled={!!readUserData} />
								</div>
							</div>
							<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
								<DropDown placeholder={t('Role')} name='role' onChange={formik.handleChange} value={formik.values.role} options={roleDrpData} id='role' error={formik.errors.role && formik.touched.role ? formik.errors.role : ''} required={true} label={t('Role')} disabled={!!readUserData} />
							</div>

							<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
								<DropDown placeholder={t('Select Preferred Language')} name='preferredLanguage' onChange={formik.handleChange} value={formik.values.preferredLanguage} options={SettingsDrpData} id='category' error={formik.errors.preferredLanguage && formik.touched.preferredLanguage ? formik.errors.preferredLanguage : ''}  label={t('Preferred Language')} disabled={!!readUserData} />
							</div>

							<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
								<TextInput placeholder={t('Department')} type='text' id='department' name='department' label={t('Department')} value={formik.values.department} onChange={formik.handleChange}  error={formik.errors.department && formik.touched.department && formik.errors.department } onBlur={OnBlur} disabled={!!readUserData} />
							</div>

							<div className="w-full lg:w-[calc(50%-10px)]">
								<DropDown disabled placeholder={t('Select Location')} className='w-full' label={t('Location')} inputIcon={<span className='text-xs'><DropdownArrowDown className='fill-dark-grey' /></span>} onChange={formik.handleChange} value={formik.values.branchId} options={stateDrpData} name='branchId' id='branchId' required={true} />
							</div>

							{!isSubAdmin && <div className='inline-block w-full xl:w-[calc(50%-10px)]'>
								<DropDown placeholder={t('Reporting Manager')} name='reportingManager' onChange={formik.handleChange} value={formik.values.reportingManager} options={reportingManagerDrpData} id='reportingManager' error={formik.errors.reportingManager && formik.touched.reportingManager ? formik.errors.reportingManager : ''} required={true} label={t('Reporting Manager')} disabled={!!readUserData} />
							</div>}
							<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
								<TextInput placeholder={t('Position')} type='text' id='position' name='position' label={t('Position')} value={formik.values.position} onChange={formik.handleChange}  error={formik.errors.position && formik.touched.position && formik.errors.position} onBlur={OnBlur} disabled={!!readUserData} />
							</div>
						</div>
					</div>
					{!readUserData && <Button className='mr-5 btn-primary btn-normal mb-3 md:mb-0 w-full md:w-[166px]' type='submit' label={t('Update Changes')} disabled={getUserDetailsLoading || loading || updateSubscriberEmployeeUserLoading?.loading}
					 title={`${t('Update Changes')}`}  />}
					<Button className='btn-secondary btn-normal w-full md:w-[166px]' label={t('Cancel')} onClick={() => onCancelClick()} 
					 title={`${t('Cancel')}`}  />
				</form>
			</div>
			<Dialog className="custom-dialog" header="Crop Image" visible={cropper} style={{ width: '50vw' }} onHide={() => setCropper(false)} footer={() => dialogActionConst()}>
				{
					image &&
					<Cropper
						ref={cropperRef}
						style={{ height: 400, width: '100%' }}
						zoomTo={0.5}
						aspectRatio={1}
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
				}
			</Dialog>
		</>
	)
}

export default Index;