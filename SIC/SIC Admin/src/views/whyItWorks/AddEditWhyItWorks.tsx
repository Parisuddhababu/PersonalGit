import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import { toast } from 'react-toastify';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { Cross } from '@components/icons';
import { AddEditOnboardingData, CreateOnboardingData } from 'src/types/onboarding';
import { FILE_TYPE, fileTypeEnum } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import FileUpload from '@components/fileUpload/FileUpload';
import { generateUuid } from '@utils/helpers';
import { Uploader } from '@views/activities/utils/upload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { EXCLUDE_SPECIAL_CHARACTERS } from '@config/regex';
import { FieldNames, imageType, videoType, acceptAll, fileTypes } from '@views/onBoarding/AddEditOnboarding';

const AddEditWhyItWorksModal = ({ onSubmit, onClose, editData, disableData }: AddEditOnboardingData) => {
	const [androidLandscapeImagePercentageWhyItWorks, setAndroidLandscapeImagePercentageWhyItWorks] = useState<number>(0);
	const [iphoneLandscapeImagePercentageWhyItWorks, setIphoneLandscapeImagePercentageWhyItWorks] = useState<number>(0);
	const [ipadLandscapeImagePercentageWhyItWorks, setIpadLandscapeImagePercentageWhyItWorks] = useState<number>(0);
	const [loaderWhyItWorks, setLoaderWhyItWorks] = useState(false);

	const updatePercentageWhyItWorks = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.androidLandscapeImage:
				setAndroidLandscapeImagePercentageWhyItWorks(newPercentage);
				break;
			case FieldNames.ipadLandscapeImage:
				setIpadLandscapeImagePercentageWhyItWorks(newPercentage);
				break;
			case FieldNames.iphoneLandscapeImage:
				setIphoneLandscapeImagePercentageWhyItWorks(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidWhyItWorks = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdateWhyItWorks = !(isPercentageValidWhyItWorks(androidLandscapeImagePercentageWhyItWorks) && isPercentageValidWhyItWorks(ipadLandscapeImagePercentageWhyItWorks) && isPercentageValidWhyItWorks(iphoneLandscapeImagePercentageWhyItWorks));
	/**
	 *@returns Method used for setValue from whyItWorks data and get the details of whyItWorks by uuid
	 */
	useEffect(() => {
		if (editData) {
			setLoaderWhyItWorks(true);
			APIService.getData(`${URL_PATHS.whyItWorks}/${editData?.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const imageList = Object.values(response?.data.data.image);
						formik.setFieldValue(FieldNames.title, response.data.data.title);
						formik.setFieldValue(FieldNames.androidLandscapeImage, imageList[0]);
						formik.setFieldValue(FieldNames.iphoneLandscapeImage, imageList[1]);
						formik.setFieldValue(FieldNames.ipadLandscapeImage, imageList[2]);
					}
					setLoaderWhyItWorks(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoaderWhyItWorks(false);
				});
		}
	}, []);

	const initialValues: CreateOnboardingData = {
		[FieldNames.title]: '',
		[FieldNames.androidLandscapeImage]: '',
		[FieldNames.iphoneLandscapeImage]: '',
		[FieldNames.ipadLandscapeImage]: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit whyItWorks
	 */
	const getObjWhyItWorks = () => {
		const objWhyItWorks: ObjectShape = {
			[FieldNames.title]: Yup.string().trim().required(Errors.PLEASE_ENTER_TITLE).matches(EXCLUDE_SPECIAL_CHARACTERS, Errors.SPECIAL_CHARACTERS_NOT_ALLOWED).max(60, Errors.TITLE_SHOULD_NOT_EXCEED),
			[FieldNames.androidLandscapeImage]: editData ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE_VIDEO_SIMPLIFIED),
			[FieldNames.iphoneLandscapeImage]: editData ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE_VIDEO_SIMPLIFIED),
			[FieldNames.ipadLandscapeImage]: editData ? Yup.mixed().notRequired() : Yup.mixed().required(Errors.PLEASE_SELECT_IMAGE_VIDEO_SIMPLIFIED),
		};
		return Yup.object<ObjectShape>(objWhyItWorks);
	};
	const validationSchema = getObjWhyItWorks();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (checkImageOrVideoWhyItWorks) {
				const commonData = {
					title: values.title.trim(),
					fileType: allImageExtensions ? fileTypes.image : fileTypes.video,
					files: { '1920x1080': values.androidLandscapeImage.split('/').pop() as string, '2388x1668': values.ipadLandscapeImage.split('/').pop() as string, '2436x1125': values.iphoneLandscapeImage.split('/').pop() as string },
				};
				if (editData) {
					setLoaderWhyItWorks(true);
					APIService.patchData(`${URL_PATHS.whyItWorks}/${editData?.uuid}`, commonData)
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoaderWhyItWorks(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoaderWhyItWorks(false);
						});
				} else {
					setLoaderWhyItWorks(true);
					APIService.postData(URL_PATHS.whyItWorks, commonData)
						.then((response) => {
							if (response.status === ResponseCode.created) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoaderWhyItWorks(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoaderWhyItWorks(false);
						});
				}
			} else {
				toast.error('All files must be either images or videos only.');
			}
		},
	});

	const fileExtensionsWhyItWorks = [formik.values.androidLandscapeImage.split('.').pop() as string, formik.values.iphoneLandscapeImage.split('.').pop() as string, formik.values.ipadLandscapeImage.split('.').pop() as string];

	const allImageExtensions = fileExtensionsWhyItWorks.every((extension) => imageType.includes(extension));
	const allVideoExtensions = fileExtensionsWhyItWorks.every((extension) => videoType.includes(extension));
	const checkImageOrVideoWhyItWorks = allImageExtensions || allVideoExtensions;

	const fileUploadDataWhyItWorks = (uploaderFileName: string, response: string) => {
		if (uploaderFileName === FieldNames.androidLandscapeImage) {
			formik.setFieldValue(FieldNames.androidLandscapeImage, response);
		}
		if (uploaderFileName === FieldNames.iphoneLandscapeImage) {
			formik.setFieldValue(FieldNames.iphoneLandscapeImage, response);
		}
		if (uploaderFileName === FieldNames.ipadLandscapeImage) {
			formik.setFieldValue(FieldNames.ipadLandscapeImage, response);
		}
	};

	/**
	 *
	 * @returns Method used to Update file object to formik
	 */
	const fileUpdateWhyItWorks = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fileWhyItWorks = event.target.files?.[0];
		if (fileWhyItWorks === undefined) {
			return;
		}
		const typeWhyItWorks = [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType].includes(fileWhyItWorks?.type) ? fileTypeEnum.image : fileTypeEnum.video;
		const fileTypesWhyItWorks = [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType, FILE_TYPE.videoType, FILE_TYPE.movVideoType];
		if (!fileTypesWhyItWorks.includes(fileWhyItWorks.type)) {
			toast.error('Allow only png, jpg, jpeg or mp4, mov files only.');
			return;
		}
		const lastIndex = fileWhyItWorks?.name?.lastIndexOf('.');
		const extension = fileWhyItWorks?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (typeWhyItWorks === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileWhyItWorks);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileWhyItWorks,
					isForSeasonal: false,
					isForSop: false,
					fieldName: event.target.name,
					isForWhyItWorks: true,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageWhyItWorks);
				uploader.start();

				uploader.onComplete((response: string) => {
					fileUploadDataWhyItWorks(event.target.name, response);
				});
			});
		} else {
			const video = document.createElement('video');
			video.preload = 'metadata';
			const blob = URL.createObjectURL(fileWhyItWorks);
			video.src = blob;
			video.addEventListener('loadedmetadata', () => {
				const videoUploaderOptions = {
					fileName: name,
					file: fileWhyItWorks,
					isForSeasonal: false,
					isForSop: false,
					fieldName: event.target.name,
					isForWhyItWorks: true,
				};
				const uploader = new Uploader(videoUploaderOptions, updatePercentageWhyItWorks);
				uploader.start();
				uploader.onComplete((response: string) => {
					fileUploadDataWhyItWorks(event.target.name, response);
				});
			});
		}
	}, []);

	const getErrorWhyItWorks = (fieldName: keyof CreateOnboardingData) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const uploadChangeHandlerWhyItWorks = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateWhyItWorks(e);
	}, []);

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					{!disableData ? <h4>{editData !== null ? 'Edit' : 'Add'} Data</h4> : <h4>Data</h4>}
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{loaderWhyItWorks && <Loader />}
				<form className='w-[90vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<TextInput placeholder='Title' name={FieldNames.title} disabled={disableData} onChange={formik.handleChange} label='Title' value={formik.values.title} error={getErrorWhyItWorks(FieldNames.title)} required />
							</div>
							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-2'>
								<div className='mb-4'>
									<FileUpload labelName='Android landscape 1920 X 1080 screen size' id={FieldNames.androidLandscapeImage} imageSource={formik.values.androidLandscapeImage} name={FieldNames.androidLandscapeImage} disabled={disableData} error={getErrorWhyItWorks(FieldNames.androidLandscapeImage) as string} acceptNote={FieldNames.acceptNote} accepts={acceptAll} onChange={uploadChangeHandlerWhyItWorks} uploadType={imageType.includes(formik.values.androidLandscapeImage.split('.').pop() as string) ? FILE_TYPE.jpgType || FILE_TYPE.jpegType : FILE_TYPE.videoType || FILE_TYPE.movVideoType} />
									{!isPercentageValidWhyItWorks(androidLandscapeImagePercentageWhyItWorks) && <LoadingPercentage percentage={androidLandscapeImagePercentageWhyItWorks} />}
								</div>
								<div className='mb-4'>
									<FileUpload labelName='iPhone landscape : 2436 X 1125 screen size' id={FieldNames.iphoneLandscapeImage} imageSource={formik.values.iphoneLandscapeImage} name={FieldNames.iphoneLandscapeImage} disabled={disableData} error={getErrorWhyItWorks(FieldNames.iphoneLandscapeImage) as string} acceptNote={FieldNames.acceptNote} accepts={acceptAll} onChange={uploadChangeHandlerWhyItWorks} uploadType={imageType.includes(formik.values.iphoneLandscapeImage.split('.').pop() as string) ? FILE_TYPE.jpgType || FILE_TYPE.jpegType : FILE_TYPE.videoType || FILE_TYPE.movVideoType} />
									{!isPercentageValidWhyItWorks(iphoneLandscapeImagePercentageWhyItWorks) && <LoadingPercentage percentage={iphoneLandscapeImagePercentageWhyItWorks} />}
								</div>
								<div className='mb-4'>
									<FileUpload labelName='iPad landscape : 2388 x 1668 screen size' id={FieldNames.ipadLandscapeImage} imageSource={formik.values.ipadLandscapeImage} name={FieldNames.ipadLandscapeImage} disabled={disableData} error={getErrorWhyItWorks(FieldNames.ipadLandscapeImage) as string} acceptNote={FieldNames.acceptNote} accepts={acceptAll} onChange={uploadChangeHandlerWhyItWorks} uploadType={imageType.includes(formik.values.ipadLandscapeImage.split('.').pop() as string) ? FILE_TYPE.jpgType || FILE_TYPE.jpegType : FILE_TYPE.videoType || FILE_TYPE.movVideoType} />
									{!isPercentageValidWhyItWorks(ipadLandscapeImagePercentageWhyItWorks) && <LoadingPercentage percentage={ipadLandscapeImagePercentageWhyItWorks} />}
								</div>
							</div>
						</div>
					</div>
					{!disableData && (
						<div className={cn(ModelStyle['model__footer'])}>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateWhyItWorks}>
								{editData !== null ? 'Update' : 'Save'}
							</Button>
							<Button className='btn-default btn-large w-28 justify-center' onClick={onClose}>
								Cancel
							</Button>
						</div>
					)}
				</form>
			</div>
		</div>
	);
};

export default AddEditWhyItWorksModal;
