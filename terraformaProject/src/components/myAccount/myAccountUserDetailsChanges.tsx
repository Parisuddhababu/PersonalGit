import React, { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { toast } from 'react-toastify';
import { Dialog } from 'primereact/dialog';
import { useDispatch, useSelector } from 'react-redux';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import logo from '@assets/images/sidebar-logo.png'
import { Camera, Cross } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { NavlinkReturnFunction, whiteSpaceRemover } from '@utils/helpers';
import { DATA_URL_TO_FILE, IMAGE_BASE_URL, MAX_FILE_SIZE, ROUTES, USER_TYPE, UserProfileEducation, UserProfileLanguage, uploadImage } from '@config/constant';
import Button from '@components/button/button';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import MyAccountClasses from '@views/myAccount/myAccount.module.scss';
import cn from 'classnames';
import 'cropperjs/dist/cropper.css';
import { UPDATE_USER_PROFILE } from '@framework/graphql/mutations/userProfile';
import Dropdown from '@components/dropdown/dropDown';
import { GET_COUNTRY } from '@framework/graphql/queries/subscriber';
import { DropdownOptionType } from '@types';
import MyAccountChangePassword from './myAccountChangePassword';
import useValidation from '@framework/hooks/validations';
import { UserProfileType } from 'src/types/common';
import { setUserProfileSaved } from 'src/redux/user-profile-slice';

type MyAccountUserDetailsData = {
	first_name: string,
	last_name: string,
	email: string,
	country_code: string,
	phone_number: string,
	preferred_language: null | [],
	educational_interests: null | [],
	profile_picture: string,
}

function MyAccountUserDetailsChanges() {
	const dispatch = useDispatch();
	const cropperRef = createRef<ReactCropperElement>();
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [myAccountCropper, setMyAccountCropper] = useState(false);
	const [myAccountImage, setMyAccountImage] = useState(logo);
	const [stateMyAccountDrpData, setStateMyAccountDrpData] = useState<DropdownOptionType[]>([]);
	const { data: countryData } = useQuery(GET_COUNTRY);
	const [myAccountImageLoader,setMyAccountImageLoader] = useState(false);
	const [updateUserProfile, loading] = useMutation(UPDATE_USER_PROFILE)
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));
	const { changeProfileDetailsValidationSchema } = useValidation();
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const userType = userProfileData?.getProfile?.data?.user_type ?? ''
	
	const initialMyAccountValues: MyAccountUserDetailsData = {
		first_name: '',
		last_name: '',
		email: '',
		country_code: '',
		phone_number: '',
		preferred_language: null,
		educational_interests: [],
		profile_picture: '',
	};
	useEffect(() => {
		if (countryData?.getCountries) {
			const tempDataArr = [] as DropdownOptionType[];
			countryData?.getCountries?.data.map((data: { name: string, phoneCode: number, uuid: string }) => {
				tempDataArr.push({ name: `${data.phoneCode} ${data.name}`, key: data.uuid });
			});
			setStateMyAccountDrpData(tempDataArr);
		}
	}, [countryData]);

	const formik = useFormik({
		initialValues: initialMyAccountValues,
		validationSchema: changeProfileDetailsValidationSchema,
		onSubmit: async (values) => {
			const preferredLanguage = values?.preferred_language ? values?.preferred_language?.map((country: { name: string }) => country.name).join(', '):'';
			const educationalInterests = values?.educational_interests ?  values?.educational_interests?.map((interest: { name: string }) => interest.name).join(', ') :'';
			const updateUserProfileList = {
				first_name: values?.first_name,
				last_name: values?.last_name,
				country_code: values?.country_code,
				phone_number: values?.phone_number,
				profile_picture: values?.profile_picture,
				preferred_language: userType !== USER_TYPE.SUPER_ADMIN ?  preferredLanguage:'',
				educational_interests: userType !== USER_TYPE.SUPER_ADMIN ? educationalInterests :'',
			};

			updateUserProfile({
				variables: {
					userData: updateUserProfileList,
					userId: userProfileData?.getProfile?.data?.uuid,
				},
			})
				.then((res) => {
					const data = res.data
					dispatch(setUserProfileSaved(true));
					toast.success(data?.updateUser?.message)
					const updatedUserData = { ...userProfileData.getProfile.data, ...updateUserProfileList };
					userProfileData.getProfile.data = updatedUserData;
					formik.resetForm()

				})
				.catch((err) => {
					dispatch(setUserProfileSaved(false));
					toast.error(err?.networkError?.result?.errors?.[0]?.message);
				});
		},
	});
	useEffect(() => {

		if (userProfileData?.getProfile?.data) {
			const userData = userProfileData?.getProfile?.data;
			formik.resetForm({
				values: {
					first_name: userData?.first_name,
					last_name: userData?.last_name,
					email: userData?.email,
					country_code: userData?.country_code?.uuid,
					phone_number: userData?.phone_number ?? '',
					preferred_language: userData?.preferred_language ? userData?.preferred_language?.split(',')?.map((interest: string) => {
						return { name: interest?.trim(), code: interest?.trim() }
					}):'',
					educational_interests:userData?.educational_interests ? userData?.educational_interests?.split(',')?.map((interest: string) => {
						return { name: interest?.trim(), code: interest?.trim() }
					}):[],
					profile_picture: userData?.profile_picture ? userData?.profile_picture : '',
				}
			});
		}
	}, [userProfileData]);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleMyAccountLogo = useCallback((e: any) => {
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
						// eslint-disable-next-line @typescript-eslint/no-explicit-any
						setMyAccountImage(reader.result as any);
						setMyAccountCropper(true);
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
	/**
	*  not add empty space logic
	*/
	const OnMyAccountBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	/**
	* cancel button click
	*/
	const onCancelMyAccountClick = useCallback(() => {
		navigate( NavlinkReturnFunction(userType,USER_TYPE.SUPER_ADMIN,`/${ROUTES.app}/${ROUTES.dashboard}`,`/${ROUTES.app}/${ROUTES.subscriber}`));
	}, []);



	const countryTemplate = (option: { name: string }) => {
		return (
			<div className="flex align-items-center">
				<div>{option.name}</div>
			</div>
		);
	};

	const dialogActionMyAccountConst = () => {
		return (
			<div className='flex justify-end gap-3 md:gap-5'>
				<Button className='btn-secondary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Cancel" onClick={() => setMyAccountCropper(false)}  title={`${t('Cancel')}`} />
				<Button className='btn-primary btn-normal w-full md:w-[160px] whitespace-nowrap' type='button' label="Save" disabled={myAccountImageLoader} onClick={() => getCropMyAccountData()}  title={`${t('Save')}`} />
			</div>
		)
	}

	const getCropMyAccountData = async (): Promise<void> => {
		if (typeof cropperRef.current?.cropper !== 'undefined') {
			await setMyAccountImageLoader(true);
			let fileName: string | null = null;
			const file = DATA_URL_TO_FILE(cropperRef.current?.cropper.getCroppedCanvas().toDataURL(), 'image.png');
			const formData = new FormData();
			formData.append('image', file);
			fileName = await uploadImage(formData, 'profile');
			if (fileName) {
				formik.setFieldValue('profile_picture', fileName);
				setMyAccountCropper(false);
			}
			await setMyAccountImageLoader(false);
		}
	};

	const onDeleteMyAccountImage = useCallback(async (): Promise<void> => {
		formik.setFieldValue('profile_picture', '');
	}, [formik]);

	return (
		<div>
			<form onSubmit={formik.handleSubmit}>
				<div className='flex flex-wrap items-start justify-start p-3 mb-5 border border-solid md:p-5 lg:flex-nowrap md:mb-7 border-border-primary rounded-xl'>
					<div className='flex items-center justify-center w-full md:max-w-[400px] lg:mr-5 max-h-[385px] aspect-square lg:w-1/3 lg:max-w-[487px] lg:min-w-[320px] xl:min-w-[410px] border border-border-primary border-solid rounded-xl mb-5 md:mb-8 lg:mb-0'>
						<div className='box-border relative flex flex-col items-center justify-center'>
							<label
								htmlFor='logo'
								className='relative flex flex-col items-center justify-center'>
								<div className='flex items-center justify-center overflow-hidden border border-solid rounded-full cursor-pointer border-border-primary w-44 h-44'>
									<img src={formik?.values?.profile_picture ? IMAGE_BASE_URL + formik.values.profile_picture : logo} alt='profile_picture' className='object-contain w-full h-full bg-black' />
								</div>
								<input
									type="file"
									id="logo"
									name="profile_picture"
									accept="image/*"
									ref={fileInputRef}
									onChange={handleMyAccountLogo}
									className="hidden"
								/>
								<div className='absolute bottom-0 p-2 text-2xl font-bold text-white rounded-full right-1 sm:right-2 bg-primary'>{<Camera />}</div>
							</label>
							{formik?.values?.profile_picture &&
								<Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-3 md:right-4 bg-error text-lg md:text-xl' type='button' label='' onClick={() => onDeleteMyAccountImage()} title={`${t('Close')}`} >
									<Cross className='fill-white' />
								</Button>
							}
							{formik.errors.profile_picture && formik.touched.profile_picture ? <span className='relative mt-2 md:text-xs-15 error'>{formik.errors.profile_picture}</span> : ''}
						</div>
					</div>

					<div className='flex flex-wrap w-full gap-3 md:gap-5 lg:w-2/3'>
						<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
							<TextInput onBlur={OnMyAccountBlur} placeholder={t('First Name')} name='first_name' required={true} label={t('First Name')} type='text' onChange={formik.handleChange} value={formik.values.first_name} error={formik.errors.first_name && formik.touched.first_name ? formik.errors.first_name : ''} />

						</div>
						<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
							<TextInput onBlur={OnMyAccountBlur} placeholder={t('Last Name')} name='last_name' required={true} label={t('Last Name')} type='text' onChange={formik.handleChange} value={formik.values.last_name} error={formik.errors.last_name && formik.touched.last_name ? formik.errors.last_name : ''} />
						</div>
						<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
							<Dropdown placeholder={t('Select Country Code')} name='country_code' onChange={formik.handleChange} value={formik.values.country_code} options={stateMyAccountDrpData} id='country_code' label={t('Country Code')} required={false} />
							<p className='error'>{formik?.errors?.country_code}</p>
						</div>
						<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
							<TextInput onBlur={OnMyAccountBlur} placeholder={t('Phone Number')} name='phone_number' label={t('Phone Number')} required={false} type='tel' onChange={formik.handleChange} value={formik?.values?.phone_number} error={formik.errors.phone_number && formik.touched.phone_number ? formik.errors.phone_number : ''} />
						</div>
						<div className='inline-block w-full xl:w-[calc(50%-10px)]'>
							<TextInput disabled onBlur={OnMyAccountBlur} placeholder={t('Email')} name='email' required={true} onChange={formik.handleChange} value={formik.values.email} label={t('Email')} />
						</div>
						{userType !== USER_TYPE.SUPER_ADMIN && <div className='inline-block w-full xl:w-[calc(50%-10px)]'>
							<label>{t('Preferred Language')}</label>
							<div className={`${cn(MyAccountClasses['multiselect-options'])}`}>
								<MultiSelect value={formik.values.preferred_language} options={UserProfileLanguage} onChange={(e: MultiSelectChangeEvent) => {
									formik.setFieldValue('preferred_language', e.value);
								}} optionLabel="name" placeholder="Preferred Language" itemTemplate={countryTemplate} className='w-full md:w-20rem' display="chip" />
							</div>
							<p className='error'>
								{formik?.errors?.preferred_language as string}
							</p>
						</div>}
						{userType !== USER_TYPE.SUPER_ADMIN && <div className='inline-block w-full xl:w-[calc(50%-10px)]'>
							<label>{t('Educational Interests')}</label>
							<div className={`${cn(MyAccountClasses['multiselect-options'])}`}>
								<MultiSelect value={formik.values.educational_interests} options={UserProfileEducation} onChange={(e: MultiSelectChangeEvent) => {

									formik.setFieldValue('educational_interests', e.value);
								}} optionLabel="name" placeholder="Educational Interests" itemTemplate={countryTemplate} className='w-full md:w-20rem' display="chip" />
							</div>
							<p className='error'>
								{formik?.errors?.educational_interests as string}
							</p>
						</div>}
					</div>
				</div>
				<MyAccountChangePassword />
				<Button className='mr-5 btn-primary btn-normal mb-3 md:mb-0 w-full md:w-[166px]' type='submit' label={t('Save Changes')} disabled={loading?.loading} title={`${t('Save Changes')}`} />
				<Button className='btn-secondary btn-normal w-full md:w-[166px]' label={t('Cancel')} onClick={onCancelMyAccountClick} />
			</form>
			<Dialog className="custom-dialog" header="Crop Image" visible={myAccountCropper} style={{ width: '50vw', borderRadius: '12px' }} onHide={() => setMyAccountCropper(false)} footer={() => dialogActionMyAccountConst()}>
				{
					myAccountImage &&
					<Cropper
						ref={cropperRef}
						style={{ height: 400, width: '100%' }}
						zoomTo={0.5}
						aspectRatio={1}
						preview=".img-preview"
						src={myAccountImage}
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
		</div>
	);
}

export default MyAccountUserDetailsChanges