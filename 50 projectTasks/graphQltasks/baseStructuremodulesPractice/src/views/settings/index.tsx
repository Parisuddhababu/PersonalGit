import TextInput from '@components/input/TextInput';
import React, { useCallback, useEffect, useState } from 'react';
import { Settings } from 'src/types/settings';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { UPDATE_SETTINGS } from '@framework/graphql/mutations/settings';
import { useMutation, useQuery } from '@apollo/client';
import { GET_SETTINGS_DATA } from '@framework/graphql/queries/settings';
import { SettingsDataArr } from '@framework/graphql/graphql';
import { CheckCircle, Cross, CrossCircle } from '@components/icons';
import { useTranslation } from 'react-i18next';
import { GET_PROFILE_INFORMATION } from '@framework/graphql/queries/profile';
import useValidation from '@components/hooks/validation';
import Button from '@components/button/button';
import Dropdown from '@components/dropdown/Dropdown';
import { ROUTES, SettingsDrpData } from '@config/constant';
import { useNavigate } from 'react-router-dom';

const UpdateSettings = () => {
	const [updateSettingsData] = useMutation(UPDATE_SETTINGS);
	const { refetch } = useQuery(GET_SETTINGS_DATA);
	const [logoUrl, setLogoUrl] = useState<string | null>(null);
	const [iconUrl, setIconUrl] = useState<string | null>(null);
	const [isHoverLogo, setIsHoverLogo] = useState<boolean>(false);
	const [isHoverFavicon, setIsHoverFevicon] = useState<boolean>(false);
	const { t } = useTranslation();
	const { data } = useQuery(GET_PROFILE_INFORMATION);
	const navigate = useNavigate();
	const refetchSettings = async () => {
		const res = await refetch({
			getDetailId: data?.getProfileInformation?.data?.id,
		});
		if (res) {
			const data = res.data.getDetail.data as SettingsDataArr;

			formik.setValues({
				siteName: data?.site_name.trim(),
				tagLine: data?.tag_line.trim(),
				supportEmail: data?.support_email.trim(),
				contactEmail: data?.contact_email.trim(),
				contactNo: data?.contact_no,
				appLanguage: data?.app_language,
				address: data?.address.trim(),
				logo: data?.logo,
				favicon: data?.favicon,
			});
		}
	};
	useEffect(() => {
		if (data?.getProfileInformation) {
			refetchSettings().catch((e) => toast.error(`${e.message}`));
		}
	}, [data]);
	const initialValues: Settings = {
		siteName: '',
		tagLine: '',
		supportEmail: '',
		contactEmail: '',
		contactNo: '',
		appLanguage: '',
		address: '',
		logo: '',
		favicon: '',
	};

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

	/* Handler for image*/

	const imageHandler1 = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file && file.size <= 2000000 && (file.type === 'image/jpeg' || file.type === 'image/png')) {
				const data = await uploadFile(file);
				formik.setFieldValue('logo', file);
				setLogoUrl(data);
			} else {
				formik.setFieldError('logo', t('File must be (jpeg/png) and File size must be 2MB or below')!);
			}
		},
		[uploadFile]
	);

	const imageHandler2 = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file && file.size <= 2000000 && (file.type === 'image/jpeg' || file.type === 'image/png')) {
				const data = await uploadFile(file);
				formik.setFieldValue('favicon', file);
				setIconUrl(data);
			} else {
				formik.setFieldError('logo', t('File must be (jpeg/png) and File size must be 2MB or below')!);
			}
		},
		[uploadFile]
	);
	const { settingsValidation } = useValidation();
	/*formik submit handler */
	const formik = useFormik({
		initialValues,
		validationSchema: Yup.object(settingsValidation),
		onSubmit: async (values) => {
			let logoUrl = formik.values.logo;
			let faviconUrl = formik.values.favicon;
			if (typeof values.logo !== 'string') {
				if (values.logo) {
					logoUrl = await uploadFile(values.logo);
				}
			}
			if (typeof values.favicon !== 'string') {
				if (values.favicon) {
					faviconUrl = await uploadFile(values.favicon);
				}
			}
			updateSettingsData({
				variables: {
					updateSettingId: data?.getProfileInformation?.data?.id,
					siteName: values?.siteName.trim(),
					tagLine: values?.tagLine.trim(),
					supportEmail: values?.supportEmail.trim(),
					contactEmail: values?.contactEmail.trim(),
					contactNo: values?.contactNo,
					appLanguage: parseInt(values?.appLanguage),
					address: values?.address.trim(),
					logo: logoUrl,
					favicon: faviconUrl,
					updatedBy: 1,
				},
			})
				.then((res) => {
					const data = res.data;
					if (data.updateSetting.meta.statusCode === 200) {
						toast.success(data.updateSetting.meta.message);
					} else {
						toast.error(data.updateSetting.meta.message);
					}
				})
				.catch(() => {
					toast.error(t('Failed to update'));
				});
		},
	});
	const onReset = () => {
		navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
	};
	//image deselect handler
	const logoDeselectHandler = () => {
		formik.setFieldValue('logo', '');
		setLogoUrl(null);
	};
	const feviconDeselectHandler = () => {
		formik.setFieldValue('favicon', '');
		setIconUrl(null);
	};
	function formatPhoneNumber(input: string) {
		// Remove all non-digit characters from the input
		const digitsOnly = input.replace(/\D/g, '');

		// Use regex to format the digits into the desired pattern
		const formattedNumber = digitsOnly.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2 $3');

		formik.setFieldValue('contactNo', formattedNumber);
	}

	useEffect(() => {
		if (formik.errors.logo) {
			toast.error(formik.errors.logo);
		}
	}, [formik.errors.logo]);
	useEffect(() => {
		if (formik.errors.favicon) {
			toast.error(formik.errors.favicon);
		}
	}, [formik.errors.favicon]);

	return (
		<div className='w-full '>
			<form className='bg-white shadow-lg rounded-sm  border border-slate-300 mx-4 my-4' onSubmit={formik.handleSubmit}>
				{/* main div  */}
				<div className='bg-white shadow-md rounded-sm px-8 pt-6 '>
					<div className='flex justify-between mb-4 '>
						<h4 className='font-medium text-xl text-[#23282c]'>{t('General Settings')}</h4>
						<p>
							{t('Fields marked with')} <span className='text-red-500'>*</span> {t('are mandatory.')}
						</p>
					</div>
					{/* text inputs div  */}
					<div className='grid grid-cols-1 md:grid-cols-2  gap-6 border-t border-gray-200 pt-10'>
						<div>
							<TextInput placeholder={t('Site Name') as string} name='siteName' type='text' label={t('Site Name')} onChange={formik.handleChange} value={formik.values.siteName} error={formik.errors.siteName && formik.touched.siteName ? formik.errors.siteName : ''} required />
						</div>
						<div>
							<TextInput placeholder={t('Tag Line') as string} name='tagLine' type='text' label={t('Tag Line')} onChange={formik.handleChange} value={formik.values.tagLine} error={formik.errors.tagLine && formik.touched.tagLine ? formik.errors.tagLine : ''} required />
						</div>
						<div>
							<TextInput placeholder={t('Support Email') as string} name='supportEmail' type='text' label={t('Support Email')} onChange={formik.handleChange} value={formik.values.supportEmail} error={formik.errors.supportEmail && formik.touched.supportEmail ? formik.errors.supportEmail : ''} required />
						</div>
						<div>
							<TextInput placeholder={t('Contact Email') as string} name='contactEmail' type='text' label={t('Contact Email')} onChange={formik.handleChange} value={formik.values.contactEmail} error={formik.errors.contactEmail && formik.touched.contactEmail ? formik.errors.contactEmail : ''} required />
						</div>
						<div>
							<TextInput placeholder={t('Contact Number') as string} name='contactNo' type='text' label={t('Contact Number')} onChange={(e) => formatPhoneNumber(e.target.value)} value={formik.values.contactNo} error={formik.errors.contactNo && formik.touched.contactNo ? formik.errors.contactNo : ''} required maxLength={10} />
						</div>
						<div>
							<Dropdown required={true} placeholder={''} label={t('Default Language')} name='appLanguage' onChange={formik.handleChange} value={formik.values.appLanguage} error={formik.errors.appLanguage && formik.touched.appLanguage ? formik.errors.appLanguage : ''} options={SettingsDrpData} id='appLanguage' />
						</div>
						<div className='  flex flex-col space-y-2 '>
							<label className='font-normal text-gray-700'>{t('Address')}</label>
							<textarea className='border border-slate-300 p-3 text-gray-700 ' placeholder={t('Address') as string} name='address' onChange={formik.handleChange} value={formik.values.address} rows={4} cols={60}></textarea>
						</div>
						<div>
							<div className='md:mb-4 flex flex-col  md:flex-row'>
								{/* logo url  */}
								<div className='flex flex-col w-1/2'>
									<label className='font-normal text-gray-700'>Logo</label>
									<div className='relative border-2 border-[#92B0B3] border-dashed flex flex-col p-auto justify-center h-28 w-32 lg:mx-1 my-2 ' onMouseOver={() => setIsHoverLogo(true)} onMouseOut={() => setIsHoverLogo(false)}>
										<div className='absolute top-0 right-0 p-0'>
											{formik.values.logo && isHoverLogo && (
												<div className='cursor-pointer text-[#BB3F42]' onClick={logoDeselectHandler}>
													<CrossCircle className='text-xl font-extrabold' />
												</div>
											)}
										</div>
										<img src={logoUrl ?? formik.values.logo} alt='logoImage' className='h-20 w-30 m-auto' />
										{isHoverLogo && (
											<div className=' bg-[#BB3F42] h-8 w-full text-white text-center p-auto  '>
												<label htmlFor='logo' className='inline-block '>
													<div>
														<span className='p-3 '>{t('Change')}</span>
													</div>
												</label>
											</div>
										)}
										<div className='hidden'>
											<TextInput id='logo' placeholder={'logo'} name='logo' type='file' onChange={imageHandler1} />
										</div>
									</div>
								</div>
								{/* favicon url  */}
								<div className='flex flex-col w-1/2'>
									<label className='font-normal text-gray-700'>Favicon</label>
									<div className='relative border-2 border-[#92B0B3] border-dashed flex flex-col p-auto justify-center h-28 w-32 lg:mx-1 my-2' onMouseOver={() => setIsHoverFevicon(true)} onMouseOut={() => setIsHoverFevicon(false)}>
										<div className='absolute top-0 right-0 '>
											{formik.values.favicon && isHoverFavicon && (
												<div className='cursor-pointer text-[#BB3F42]' onClick={feviconDeselectHandler}>
													<CrossCircle className='text-xl' />
												</div>
											)}
										</div>
										<img className='h-20 w-30 m-auto' src={iconUrl ?? formik.values.favicon} alt='faviconImage' />
										{isHoverFavicon && (
											<div className=' bg-[#BB3F42] h-8 w-full text-white text-center'>
												<label htmlFor='fevicon' className='inline-block '>
													<div>
														<span className='text-center m-auto'>{t('Change')}</span>
													</div>
												</label>
											</div>
										)}
										<div className='hidden'>
											<TextInput id='fevicon' placeholder={'Fevicon'} name='favicon' type='file' onChange={imageHandler2} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* button  */}
				<div className='flex items-start justify-start col-span-3 btn-group px-5 py-3 bg-[#F0F3F5] border border-[#c8ced3] '>
					<Button className='btn-primary btn-normal' label={t('Update')} type='submit'>
						<div className='mr-1 text-white'>
							<CheckCircle className='text-white' fontSize='15px' />
						</div>
					</Button>
					<Button className='btn-warning btn-normal' onClick={onReset} label={t('Cancel')}>
						<Cross className='mr-1' />
					</Button>
				</div>
			</form>
		</div>
	);
};
export default UpdateSettings;
