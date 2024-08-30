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
import { FILE_TYPE, acceptAll, fileTypeEnum, fileTypes, imageType, videoType } from '@config/constant';
import { URL_PATHS } from '@config/variables';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import FileUpload from '@components/fileUpload/FileUpload';
import { generateUuid } from '@utils/helpers';
import { Uploader } from '@views/activities/utils/upload';
import LoadingPercentage from '@components/loadingPercentage/percentage';
import { stringMaxLimit, stringNotRequired, stringRequired } from '@config/validations';

export enum FieldNames {
	title = 'title',
	androidLandscapeImage = 'androidLandscapeImage',
	iphoneLandscapeImage = 'iphoneLandscapeImage',
	ipadLandscapeImage = 'ipadLandscapeImage',
	fileType = 'fileType',
	acceptNote = 'png, jpeg or mp4, mov files only',
	isForOnboarding = 'isForOnboarding',
}

const AddEditOnboardingModal = ({ onSubmit, onClose, editData, disableData }: AddEditOnboardingData) => {
	const [androidLandscapeImagePercentage, setAndroidLandscapeImagePercentage] = useState<number>(0);
	const [iphoneLandscapeImagePercentage, setIphoneLandscapeImagePercentage] = useState<number>(0);
	const [ipadLandscapeImagePercentage, setIpadLandscapeImagePercentage] = useState<number>(0);
	const [loaderOnboarding, setLoaderOnboarding] = useState(false);

	const updatePercentageOnboarding = (newPercentage: number, fileName: string) => {
		switch (fileName) {
			case FieldNames.androidLandscapeImage:
				setAndroidLandscapeImagePercentage(newPercentage);
				break;
			case FieldNames.ipadLandscapeImage:
				setIpadLandscapeImagePercentage(newPercentage);
				break;
			case FieldNames.iphoneLandscapeImage:
				setIphoneLandscapeImagePercentage(newPercentage);
				break;
			default:
				break;
		}
	};

	const isPercentageValidOnboarding = (percentage: number) => percentage === 0 || percentage === 100;

	const disableUpdateOnboarding = !(isPercentageValidOnboarding(androidLandscapeImagePercentage) && isPercentageValidOnboarding(ipadLandscapeImagePercentage) && isPercentageValidOnboarding(iphoneLandscapeImagePercentage));
	/**
	 *@returns Method used for setValue from onboarding data and get the details of onboarding by uuid
	 */
	useEffect(() => {
		if (editData) {
			setLoaderOnboarding(true);
			APIService.getData(`${URL_PATHS.onboarding}/${editData.uuid}?isForOnboarding=true`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						const imageList = Object.values(response?.data.data.image);
						formik.setFieldValue(FieldNames.title, response.data.data.title);
						formik.setFieldValue(FieldNames.androidLandscapeImage, imageList[0]);
						formik.setFieldValue(FieldNames.ipadLandscapeImage, imageList[0]);
						formik.setFieldValue(FieldNames.iphoneLandscapeImage, imageList[0]);
					}
					setLoaderOnboarding(false);
				})
				.catch((err) => {
					toast.error(err.response.data.message);
					setLoaderOnboarding(false);
				});
		}
	}, []);

	const initialValues: CreateOnboardingData = {
		[FieldNames.title]: '',
		[FieldNames.androidLandscapeImage]: '',
		[FieldNames.iphoneLandscapeImage]: '',
		[FieldNames.ipadLandscapeImage]: '',
		[FieldNames.isForOnboarding]: true,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit onboarding
	 */
	const getObjOnboarding = () => {
		const objOnboarding: ObjectShape = {
			[FieldNames.title]: stringMaxLimit(Errors.PLEASE_ENTER_TITLE),
			[FieldNames.androidLandscapeImage]: editData ? stringNotRequired() : stringRequired(Errors.PLEASE_SELECT_IMAGE_VIDEO_SIMPLIFIED),
			[FieldNames.iphoneLandscapeImage]: editData ? stringNotRequired() : stringRequired(Errors.PLEASE_SELECT_IMAGE_VIDEO_SIMPLIFIED),
			[FieldNames.ipadLandscapeImage]: editData ? stringNotRequired() : stringRequired(Errors.PLEASE_SELECT_IMAGE_VIDEO_SIMPLIFIED),
		};
		return Yup.object<ObjectShape>(objOnboarding);
	};
	const validationSchema = getObjOnboarding();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (checkImageOrVideoOnboarding) {
				const commonDataOnboarding = {
					title: values.title.trim(),
					fileType: allImageExtensions ? fileTypes.image : fileTypes.video,
					files: { '1920x1080': values.androidLandscapeImage.split('/').pop() as string, '2388x1668': values.androidLandscapeImage.split('/').pop() as string, '2436x1125': values.androidLandscapeImage.split('/').pop() as string },
					isForOnboarding: values.isForOnboarding,
				};
				if (editData) {
					setLoaderOnboarding(true);
					APIService.patchData(`${URL_PATHS.onboarding}/${editData.uuid}`, commonDataOnboarding)
						.then((response) => {
							if (response.status === ResponseCode.success) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoaderOnboarding(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoaderOnboarding(false);
						});
				} else {
					setLoaderOnboarding(true);
					APIService.postData(URL_PATHS.onboarding, commonDataOnboarding)
						.then((response) => {
							if (response.status === ResponseCode.created) {
								toast.success(response?.data?.message);
								formik.resetForm();
								onClose();
								onSubmit();
							}
							setLoaderOnboarding(false);
						})
						.catch((err) => {
							toast.error(err?.response?.data?.message);
							setLoaderOnboarding(false);
						});
				}
			} else {
				toast.error('All files must be either images or videos only.');
			}
		},
	});

	const fileExtensionsOnboarding = [formik.values.androidLandscapeImage.split('.').pop() as string, formik.values.iphoneLandscapeImage.split('.').pop() as string, formik.values.ipadLandscapeImage.split('.').pop() as string];

	const allImageExtensions = fileExtensionsOnboarding.every((extension) => imageType.includes(extension));
	const allVideoExtensions = fileExtensionsOnboarding.every((extension) => videoType.includes(extension));
	const checkImageOrVideoOnboarding = allImageExtensions || allVideoExtensions;

	const fileUploadDataOnboarding = (uploaderFileName: string, response: string) => {
		if (uploaderFileName === FieldNames.androidLandscapeImage) {
			formik.setFieldValue(FieldNames.iphoneLandscapeImage, response);
			formik.setFieldValue(FieldNames.ipadLandscapeImage, response);
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
	const fileUpdateOnboarding = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const fileOnboarding = event.target.files?.[0];
		if (fileOnboarding === undefined) {
			return;
		}
		const typeOnboarding = [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType].includes(fileOnboarding?.type) ? fileTypeEnum.image : fileTypeEnum.video;
		const fileTypesOnboarding = [FILE_TYPE.pngType, FILE_TYPE.jpgType, FILE_TYPE.jpegType, FILE_TYPE.videoType, FILE_TYPE.movVideoType];
		if (!fileTypesOnboarding.includes(fileOnboarding.type)) {
			toast.error('Allow only png, jpg, jpeg or mp4, mov files only.');
			return;
		}
		const lastIndex = fileOnboarding?.name?.lastIndexOf('.');
		const extension = fileOnboarding?.name.slice(lastIndex + 1);
		const name = `${Date.now()}_${generateUuid()}.${extension}`;
		if (typeOnboarding === fileTypeEnum.image) {
			const image = document.createElement('img');
			const blob = URL.createObjectURL(fileOnboarding);
			image.src = blob;
			image.addEventListener('load', () => {
				const imageUploaderOptions = {
					fileName: name,
					file: fileOnboarding,
					isForSeasonal: false,
					isForSop: false,
					isForOnboarding: true,
					fieldName: event.target.name,
				};
				const uploader = new Uploader(imageUploaderOptions, updatePercentageOnboarding);
				uploader.start();

				uploader.onComplete((response: string) => {
					fileUploadDataOnboarding(event.target.name, response);
				});
			});
		} else {
			const video = document.createElement('video');
			video.preload = 'metadata';
			const blob = URL.createObjectURL(fileOnboarding);
			video.src = blob;
			video.addEventListener('loadedmetadata', () => {
				const videoUploaderOptions = {
					fileName: name,
					file: fileOnboarding,
					isForSeasonal: false,
					isForSop: false,
					isForOnboarding: true,
					fieldName: event.target.name,
				};
				const uploader = new Uploader(videoUploaderOptions, updatePercentageOnboarding);
				uploader.start();
				uploader.onComplete((response: string) => {
					fileUploadDataOnboarding(event.target.name, response);
				});
			});
		}
	}, []);

	const getErrorOnboarding = (fieldName: keyof CreateOnboardingData) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const uploadChangeHandlerOnboarding = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		fileUpdateOnboarding(e);
	}, []);

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					{!disableData ? <h4>{editData !== null ? 'Edit' : 'Add'} Onboarding Data</h4> : <h4>Onboarding Data</h4>}
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{loaderOnboarding && <Loader />}
				<form className='w-[90vw] md:w-[60vw] lg:w-[40vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 gap-x-4 gap-y-2'>
							<div className='mb-4'>
								<TextInput placeholder='Title' name={FieldNames.title} disabled={disableData} onChange={formik.handleChange} label='Title' value={formik.values.title} error={getErrorOnboarding(FieldNames.title)} required />
							</div>
							<div className='mb-4'>
								<FileUpload labelName='Landscape 1920 X 1080 screen size' id={FieldNames.androidLandscapeImage} imageSource={formik.values.androidLandscapeImage} name={FieldNames.androidLandscapeImage} disabled={disableData} error={getErrorOnboarding(FieldNames.androidLandscapeImage) as string} acceptNote={FieldNames.acceptNote} accepts={acceptAll} onChange={uploadChangeHandlerOnboarding} uploadType={imageType.includes(formik.values.androidLandscapeImage.split('.').pop() as string) ? FILE_TYPE.jpgType || FILE_TYPE.jpegType : FILE_TYPE.videoType || FILE_TYPE.movVideoType} />
								{!isPercentageValidOnboarding(androidLandscapeImagePercentage) && <LoadingPercentage percentage={androidLandscapeImagePercentage} />}
							</div>
							<div className='mb-4 hidden'>
								<FileUpload labelName='iPhone landscape : 2436 X 1125 screen size' id={FieldNames.iphoneLandscapeImage} imageSource={formik.values.androidLandscapeImage} name={FieldNames.iphoneLandscapeImage} disabled={disableData} error={getErrorOnboarding(FieldNames.iphoneLandscapeImage) as string} acceptNote={FieldNames.acceptNote} accepts={acceptAll} onChange={uploadChangeHandlerOnboarding} uploadType={imageType.includes(formik.values.iphoneLandscapeImage.split('.').pop() as string) ? FILE_TYPE.jpgType || FILE_TYPE.jpegType : FILE_TYPE.videoType || FILE_TYPE.movVideoType} />
								{!isPercentageValidOnboarding(iphoneLandscapeImagePercentage) && <LoadingPercentage percentage={iphoneLandscapeImagePercentage} />}
							</div>
							<div className='mb-4 hidden'>
								<FileUpload labelName='iPad landscape : 2388 x 1668 screen size' id={FieldNames.ipadLandscapeImage} imageSource={formik.values.androidLandscapeImage} name={FieldNames.ipadLandscapeImage} disabled={disableData} error={getErrorOnboarding(FieldNames.ipadLandscapeImage) as string} acceptNote={FieldNames.acceptNote} accepts={acceptAll} onChange={uploadChangeHandlerOnboarding} uploadType={imageType.includes(formik.values.ipadLandscapeImage.split('.').pop() as string) ? FILE_TYPE.jpgType || FILE_TYPE.jpegType : FILE_TYPE.videoType || FILE_TYPE.movVideoType} />
								{!isPercentageValidOnboarding(ipadLandscapeImagePercentage) && <LoadingPercentage percentage={ipadLandscapeImagePercentage} />}
							</div>
						</div>
					</div>
					{!disableData && (
						<div className={cn(ModelStyle['model__footer'])}>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit' disabled={disableUpdateOnboarding}>
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

export default AddEditOnboardingModal;
