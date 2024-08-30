import React, { useCallback, useEffect, useState } from 'react';
import TextInput from '@components/input/TextInput';
import { useFormik } from 'formik';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_BANNER, UPDATE_BANNER } from '@framework/graphql/mutations/banner';
import { toast } from 'react-toastify';
import { GET_BANNER_DETAILS_BY_ID } from '@framework/graphql/queries/banner';
import { CheckCircle, Cross, CrossCircle } from '@components/icons';
import { ROUTES } from '@config/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { t } from 'i18next';
import useValidation from '@components/hooks/validation';
import Button from '@components/button/button';

const AddEditBanner = () => {
	const [createBanner] = useMutation(CREATE_BANNER);
	const [updateBanner] = useMutation(UPDATE_BANNER);
	const { data: bannerById, refetch } = useQuery(GET_BANNER_DETAILS_BY_ID);
	const [status, setStatus] = useState(1);
	const navigate = useNavigate();
	const params = useParams();
	const [bannerImageUrl, setBannerImageUrl] = useState('');

	/*get single banner details by id*/
	useEffect(() => {
		if (params.id) {
			refetch({ getBannerDetailId: parseInt(params.id) }).catch((e) => toast.error(e));
		}
	}, [params.id, refetch]);
	//initial values
	const initialValues = {
		bannerTitle: '',
		bannerImage: '',
		status: '',
	};

	//status handler
	const statusChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (+event.target.value === 1) {
			setStatus(1);
		}
		if (+event.target.value === 0) {
			setStatus(0);
		}
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
				toast.error('Failed to upload file');
				return '';
			}
		} catch (error) {
			toast.error('Failed to upload file');
			return '';
		}
	};
	const { manageBannerValidation } = useValidation();
	/*submit form*/
	const formik = useFormik({
		initialValues,
		validationSchema: params.id ? manageBannerValidation({ params: params.id }) : manageBannerValidation({ params: undefined }),
		onSubmit: async (values) => {
			let bannerImageUrl = formik.values.bannerImage;

			if (typeof values.bannerImage !== 'string') {
				bannerImageUrl = await uploadFile(values.bannerImage);
			}
			if (params.id) {
				updateBanner({
					variables: {
						updateBannerId: params.id,
						bannerTitle: values.bannerTitle,
						bannerImage: bannerImageUrl,
						status: +status,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data?.updateBanner?.meta?.statusCode === 200) {
							toast.success(data?.updateBanner?.meta?.message);
						} else {
							toast.error(data?.updateBanner?.meta?.message);
						}
						onSubmitBanner();
					})
					.catch(() => {
						toast.error(t('Failed to update banner'));
					});
			} else {
				createBanner({
					variables: {
						bannerTitle: values.bannerTitle,
						bannerImage: bannerImageUrl,
						createdBy: 1,
						status: +status,
					},
				})
					.then((res) => {
						const data = res.data;
						if (data?.createBanner?.meta?.statusCode === 201) {
							toast.success(data?.createBanner?.meta.message);
						} else {
							toast.error(data?.createBanner?.meta.message);
						}
						onSubmitBanner();
					})
					.catch(() => {
						toast.error(t('Failed to create banner'));
					});
			}
		},
	});
	/*setting updated values*/
	useEffect(() => {
		if (bannerById && params.id) {
			const data = bannerById?.getBannerDetail.data;
			formik.setValues({
				bannerTitle: data?.banner_title.trim(),
				bannerImage: data?.banner_image,
				status: data?.status,
			});
		}
	}, [bannerById, params.id]);

	const handleImageChange: (file: File) => void = (file: File) => {
		if (file && file.size <= 2000000 && (file.type === 'image/jpeg' || file.type === 'image/png')) {
			formik.setFieldValue('bannerImage', file);
			setBannerImageUrl(URL.createObjectURL(file));
		} else {
			toast.error(t('File must be (jpeg/png) and File size must be 2MB or below'));
		}
	};
	/*bannerImage*/
	const imageHandler = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			file && handleImageChange(file);
		},
		[handleImageChange]
	);
	/*bannner submit handler*/
	const onSubmitBanner = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.banner}/List`);
	}, [navigate]);
	//image deselect handler
	const imageDeselectHandler = () => {
		formik.setFieldValue('bannerImage', '');
		setBannerImageUrl('');
		formik.setFieldError('bannerImage', 'Please upload banner image');
	};

	return (
		<div>
			<form onSubmit={formik.handleSubmit} className='border border-[#c8ced3]  bg-white mx-4 my-4 lg:mx-6'>
				<p className='text-end p-4'>
					{t('Fields marked with')} <span className='text-red-500'> *</span> {t('are mandatory.')}
				</p>
				<div className='mb-4 px-4 py-3 '>
					<label className='mb-2 pb-2 text-gray-700'>
						{t('Banner Image')} <span className='text-red-500 py-2 my-2'>*</span>
					</label>
					<div className='w-full  border-2 border-[#92B0B3] border-dashed h-80 mt-3 lg:w-1/2'>
						<div className='flex justify-end'>
							{formik.values.bannerImage && (
								<div className='cursor-pointer text-yellow-500' onClick={imageDeselectHandler}>
									<CrossCircle className='text-xl' />
								</div>
							)}
						</div>
						<label htmlFor='imageFile' className='flex flex-col items-center justify-center '>
							<div className='flex flex-col items-center justify-center pt-5 pb-6'>
								<div className='mb-2 text-sm text-gray-500 dark:text-gray-400 w-60 h-60'>
									<img src={bannerImageUrl || formik.values.bannerImage} alt='' />
									{!bannerImageUrl && !formik.values.bannerImage && (
										<div className='flex flex-col items-center justify-center mt-24'>
											<h3 className='text-yellow-500 font-bold'>Browse</h3>
											<span className='font-semibold text-center'>for a banner image to upload</span>
										</div>
									)}
								</div>
							</div>
							<div className='hidden'>
								<TextInput type='file' id='imageFile' placeholder={t('Banner image') as string} name='bannerImage' onChange={imageHandler} error={formik.errors.bannerImage as string} accept='image/*' />
							</div>
						</label>
					</div>
					<p className='error'>{formik.errors.bannerImage && formik.touched.bannerImage ? t(formik.errors.bannerImage) : ''}</p>

					<div className='mt-3 w-1/2'>
						<TextInput type='text' label={t('Banner Title')} placeholder={t('Banner Title') as string} name='bannerTitle' onChange={formik.handleChange} value={formik.values.bannerTitle} error={formik.errors.bannerTitle && formik.touched.bannerTitle ? formik.errors.bannerTitle : ''} required />
					</div>
				</div>

				<div className='px-4 py-3'>
					<label className='text-gray-700 px-1 py-4 '>
						Status<span className='text-red-500 p-2'>*</span>
					</label>
					<div className='radio-btn-group flex mr-6 mt-4 '>
						<div>
							<input type='radio' id='active' value={1} defaultChecked name='Status' onChange={statusChangeHandler} className='accent-red-600' />
							<label htmlFor='active' className='px-1 mx-1 '>
								Active
							</label>
						</div>
						<div>
							<input type='radio' id='InActive' value={0} name='Status' onChange={statusChangeHandler} className='checked:bg:red-500 accent-red-600' />

							<label htmlFor='InActive' className='px-1  mx-1 '>
								InActive
							</label>
						</div>
					</div>
				</div>

				<div className='border-t border-gray-300 bg-[#f0f3f5] px-5 py-3 '>
					<div className='flex btn-group'>
						<Button className='btn-primary btn-normal' label={t('Save')} type='submit'>
							<div className='mr-2 text-white'>
								<CheckCircle className='text-white' fontSize='15px' />
							</div>
						</Button>
						<Button className='btn-warning btn-normal' onClick={onSubmitBanner} label={t('Cancel')}>
							<Cross className='mr-1' />
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default AddEditBanner;
