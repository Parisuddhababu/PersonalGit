/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { Cross, UploadImage } from '@components/icons/icons';
import Button from '@components/button/button';
import axios from 'axios';
import { API_MEDIA_END_POINT } from '@config/constant';
import { toast } from 'react-toastify';
import TextInput from '@components/textInput/TextInput';
import { whiteSpaceRemover } from '@utils/helpers';
import RadioButton from '@components/radiobutton/radioButtonNew';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import UpdatedHeader from '@components/header/updatedHeader';

interface DeleteImageData {
	courseImage: boolean;
}
interface City {
	name: string;
	code: string;
}

const Settings = () => {
	const { t } = useTranslation();

	const [selectedCities, setSelectedCities] = useState<City | null>(null);
	const cities: City[] = [
		{ name: 'Lime Ridge', code: 'NY' },
		{ name: 'Masonville', code: 'RM' },
		{ name: 'Willowbrook', code: 'LDN' },
		{ name: 'Fairview', code: 'IND' },
	];


	const initialValues: any = {
		selectCourse: '',
		currency: '',
		weights: '',
		tenantType: '',
		industryTenant: '',
		status: 1,
	};

	const formik = useFormik({
		initialValues,
		onSubmit: () => {
			//
		},
	});

	const onDeleteImage = useCallback(async (data: DeleteImageData): Promise<void> => {
		const { courseImage } = data;
		if (courseImage) {
			const data = { fileName: formik.values.courseImageUploadFileName };
			// Attempt to Delete the Image
			axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
				.then(() => {
					formik.setFieldValue('courseImageUploadFileName', '')
				})
				.catch((error) => {
					toast.error(error?.response?.data?.message)
				});
		} else {
			const data = { fileName: formik.values.instructorImageUploadFileName };
			// Attempt to Delete the Image
			axios.delete(`${API_MEDIA_END_POINT}/remove`, { data })
				.then(() => {
					formik.setFieldValue('instructorImageUploadFileName', '')
				})
				.catch((error) => {
					toast.error(error?.response?.data?.message)
				});
		}
	}, [formik]);

	const handleCourseImage = useCallback((e: any) => {
		//
	}, []);

	const OnBlurBanner = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	const radioOptions = [
		{ name: '32 G', key: 1 },
		{ name: '64 G', key: 2 },
	];

	const headerActionConst = () => {
		return(
			<>
				<Button className='btn btn-primary md:w-[166px] ml-5 md:ml-0' type='submit' label={'Change Theme'} />
			</>
		)
	};

	return (
		<>
			<UpdatedHeader headerActionConst={headerActionConst} />
			<div>
				<div className='border border-border-primary rounded-xl p-3 md:p-5 mb-3 md:mb-5 lg:mb-[30px]'>
					<div className='mb-2 md:mb-3'>
						<span className='font-semibold mb-2.5 inline-block'>Locations Access</span>
						<div className='max-h-[206px] overflow-auto pb-3'>
							<ListBox multiple value={selectedCities} onChange={(e: ListBoxChangeEvent) => setSelectedCities(e.value)} options={cities} optionLabel="name" className="w-full md:w-14rem" />
						</div>
					</div>

					<div className='flex items-center gap-5 mb-1 md:mb-3'>
						<span className='font-semibold'>Size of Totes</span>
						<div>
							<RadioButton label='' radioOptions={radioOptions} name='status' checked={formik.values.status} onChange={formik.handleChange} />
						</div>
					</div>

					<div className='mb-3 md:mb-5'>
						<span className='font-semibold mb-2.5 inline-block'>Logo</span>
						<div className='flex flex-wrap gap-3 md:gap-5'>
							<div className='flex flex-col gap-2.5  w-full xs:w-[calc(50%-10px)] lg:w-[calc(40%-10px)] xl:w-[324px]'>
								<div className="min-h-[176px]">
									<label
										htmlFor='Settings Image'
										className='relative flex items-center justify-center h-full bg-white border border-solid cursor-pointer rounded-xl border-border-primary hover:bg-gray-100'
									>
										<div className='flex flex-col items-center justify-center'>
											{!formik.values.courseImageUploadFileName && <span className='text-xl-50'><UploadImage className='mb-2 fill-secondary' /></span>}
											{formik.values.courseImageUploadFileName && <img src={formik.values.courseImageUploadFileName} alt='Logo Image' title='logo image' className='object-fill w-full' />}
											{!formik.values.courseImageUploadFileName && <p className='font-normal text-light-grey'>{t('Attach Logo')}</p>}
										</div>
										{formik.values.courseImageUploadFileName && <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-5 md:right-5 bg-error' type='button' label='' onClick={() => onDeleteImage({ courseImage: true })}  title={`${t('Close')}`} >
											<Cross className='fill-white' fontSize='12' />
										</Button>}
										<input
											id='Settings Image'
											type="file"
											onChange={handleCourseImage}
											className="hidden"
										/>
									</label>
								</div>
								<span className='text-xs'>Note: Supported formats are pdf, png and jpeg</span>
							</div>

							<div className='flex flex-col gap-2.5 w-full xs:w-[calc(50%-10px)] lg:w-[calc(40%-10px)] xl:w-[324px]'>
								<div className="min-h-[176px]">
									<label
										htmlFor='Logo Image'
										className='relative flex items-center justify-center h-full bg-white border border-solid cursor-pointer rounded-xl border-border-primary hover:bg-gray-100'
									>
										<div className='flex flex-col items-center justify-center'>
											{!formik.values.courseImageUploadFileName && <span className='text-xl-50'><UploadImage className='mb-2 fill-secondary' /></span>}
											{formik.values.courseImageUploadFileName && <img src={formik.values.courseImageUploadFileName} alt='Instructor Profile Image' className='object-fill w-full' />}
											{!formik.values.courseImageUploadFileName && <p className='font-normal text-light-grey'>{t('Attach Logo')}</p>}
										</div>
										{formik.values.courseImageUploadFileName && <Button className='absolute p-[6px] rounded-full cursor-pointer top-4 right-4 md:top-5 md:right-5 bg-error' type='button' label='' onClick={() => onDeleteImage({ courseImage: true })} title={`${t('Close')}`}  >
											<Cross className='fill-white' fontSize='12' />
										</Button>}
										<input
											id='Logo Image'
											type="file"
											onChange={handleCourseImage}
											className="hidden"
										/>
									</label>
								</div>
								<span className='text-xs'>Note: Supported formats are pdf, png and jpeg</span>
							</div>
						</div>
					</div>

					<div className='flex flex-wrap gap-3 mb-3 md:gap-5 md:mb-5'>
						<div className='w-full lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-14px)] '>
							<TextInput placeholder={t('CAD')} type='text' id='currency' name='currency' label={t('Currency')} value={formik.values.currency} onChange={formik.handleChange} required={false} error={formik.errors.currency && formik.touched.currency ? formik.errors.currency : ''} onBlur={OnBlurBanner} disabled={true} />
						</div>

						<div className='w-full lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-14px)]'>
							<TextInput placeholder={t('Metric Tones')} type='text' id='weights' name='weights' label={t('Weights')} value={formik.values.weights} onChange={formik.handleChange} required={false} error={formik.errors.weights && formik.touched.weights ? formik.errors.weights : ''} onBlur={OnBlurBanner} disabled={true} />
						</div>
					</div>

					<div className='flex flex-wrap gap-3 md:gap-5'>
						<div className='w-full lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-14px)]'>
							<TextInput placeholder={t('Tenant/Contractor')} type='text' id='tenantType' name='tenantType' label={t('Types of Tenant/Contractor')} value={formik.values.tenantType} onChange={formik.handleChange} required={false} error={formik.errors.tenantType && formik.touched.tenantType ? formik.errors.tenantType : ''} onBlur={OnBlurBanner} />
						</div>

						<div className='w-full lg:w-[calc(50%-10px)] 2xl:w-[calc(33.3%-14px)]'>
							<TextInput placeholder={t('Tenant/Contractor')} type='text' id='industryTenant' name='industryTenant' label={t('Industry Tenant/Contractor')} value={formik.values.industryTenant} onChange={formik.handleChange} required={false} error={formik.errors.industryTenant && formik.touched.industryTenant ? formik.errors.industryTenant : ''} onBlur={OnBlurBanner} />
						</div>
					</div>
				</div>

				<div className="flex gap-3 md:gap-5 lg:gap-[30px]">
					<Button
						className='btn-primary btn-normal w-[116px]'
						type='button'
						label={t('Update')}
						title={`${t('Update')}`} 
					/>
					<Button
						className='btn-secondary btn-normal w-[116px]'
						type='button'
						label={t('Cancel')}
						title={`${t('Cancel')}`} 
					/>
				</div>
			</div>
		</>
	);
};

export default Settings;