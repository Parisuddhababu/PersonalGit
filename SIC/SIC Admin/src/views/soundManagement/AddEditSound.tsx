import React, { useCallback, useEffect, useState } from 'react';
import Button from '@components/button/Button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import { Errors } from '@config/errors';
import { Cross } from '@components/icons';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { ObjectShape } from 'yup/lib/object';
import { APIService } from '@framework/services/api';
import { URL_PATHS } from '@config/variables';
import { ResponseCode } from 'src/interfaces/enum';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { AUDIO_SIZE_MB, CHARACTERS_LIMIT, FILE_TYPE } from '@config/constant';
import { ONLY_ALPHABETS } from '@config/regex';
import FileUpload from '@components/fileUpload/FileUpload';
import { AddEditSoundManagement, CreateSoundManagement } from 'src/types/soundManagement';
import CheckBox from '@components/checkbox/CheckBox';

enum FieldNames {
	name = 'eventName',
	audio = 'audioFile',
	isLoop = 'isLoop',
}
const AddEditSoundModal = ({ onSubmit, onClose, editData, disableData }: AddEditSoundManagement) => {
	const [loaderSound, setLoaderSound] = useState<boolean>(false);
	const [audio, setAudio] = useState<string>('');
	const [isLoop, setIsLoop] = useState<boolean>(false);

	const getSoundData = () => {
		if (editData) {
			setLoaderSound(true);
			APIService.getData(`${URL_PATHS.sound}/${editData.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.name, editData?.eventName);
						formik.setFieldValue(FieldNames.audio, editData?.eventSoundFile);
						setAudio(editData?.eventSoundFile);
						formik.setFieldValue(FieldNames.isLoop, editData?.isLoop);
						setIsLoop(editData?.isLoop);
					} else {
						toast.error(response?.data.message);
					}
					setLoaderSound(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data.message);
					setLoaderSound(false);
				});
		}
	};

	/**
	 * Method used for setValue from Sound name data by id
	 */
	useEffect(() => {
		getSoundData();
	}, []);

	const initialValues: CreateSoundManagement = {
		[FieldNames.name]: '',
		[FieldNames.audio]: null,
		[FieldNames.isLoop]: false,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit subAdmin
	 */
	const getObjSound = () => {
		const obj: ObjectShape = {
			[FieldNames.name]: Yup.string().trim().required(Errors.PLEASE_ENTER_EVENT_NAME).max(CHARACTERS_LIMIT.name, Errors.MAXIMUM_LIMIT_UPTO_60_CHARACTERS).matches(ONLY_ALPHABETS, Errors.NUMBER_AND_SPECIAL_CHARACTERS_NOT_ALLOWED),
			[FieldNames.audio]: editData
				? Yup.string().notRequired()
				: Yup.mixed()
						.required(Errors.AUDIO_IS_REQUIRED)
						.test('fileFormat', Errors.UNSUPPORTED_FILE_FORMAT, (value) => value && [FILE_TYPE.audioType, FILE_TYPE.wavType].includes(value.type))
						.test('fileSize', Errors.FILE_SIZE, (value) => value && value.size / 1000 / 1024 <= AUDIO_SIZE_MB),
		};
		return Yup.object<ObjectShape>(obj);
	};

	const validationSchema = getObjSound();
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const commonData = { eventName: values.eventName.trim(), audioFile: values.audioFile, isLoop: isLoop };
			if (editData) {
				setLoaderSound(true);
				APIService.putData(`${URL_PATHS.sound}/${editData?.uuid}`, commonData, {
					'Content-Type': 'multipart/form-data',
				})
					.then((response) => {
						if (response.status === ResponseCode.created || ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoaderSound(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderSound(false);
					});
			} else {
				setLoaderSound(true);
				APIService.postData(`${URL_PATHS.sound}/create`, commonData, {
					'Content-Type': 'multipart/form-data',
				})
					.then((response) => {
						if (response.status === ResponseCode.created || ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onSubmit();
							onClose();
						}
						setLoaderSound(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoaderSound(false);
					});
			}
		},
	});

	const getSoundError = (fieldName: keyof CreateSoundManagement) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const audioHandlerSound = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.size / 1000 / 1024 <= AUDIO_SIZE_MB && file.type === FILE_TYPE.audioType) {
			formik.setFieldValue(FieldNames.audio, file);
			setAudio(URL.createObjectURL(file));
		} else {
			toast.error('Allows mp3 file only.');
		}
	}, []);

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					{!disableData ? <h4>{editData !== null ? 'Edit' : 'Add'} Sound Event</h4> : <h4>Sound Event</h4>}
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{loaderSound && <Loader />}
				{/* <!-- Modal Header End --> */}
				<form className='w-[90vw] md:w-[60vw] lg:w-[30vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-2'>
							<div className='mb-4 col-span-2'>
								<TextInput placeholder='Event name' name={FieldNames.name} onChange={formik.handleChange} label='Event Name' value={formik.values.eventName} error={getSoundError(FieldNames.name)} required disabled={disableData || !!editData} note='* Only Alphabets and _ is allowed' />
							</div>
							<div className='mb-4 col-span-2'>
								<FileUpload labelName='Upload Audio' id={FieldNames.audio} imageSource={audio} accepts={`${FILE_TYPE.audioType},${FILE_TYPE.wavType}`} name={FieldNames.audio} acceptNote='mp3 files only' uploadType={FILE_TYPE.audioType || FILE_TYPE.wavType} onChange={audioHandlerSound} error={formik.errors.audioFile && formik.touched.audioFile ? formik.errors.audioFile : ''} disabled={disableData} />
							</div>
							<div>
								<CheckBox
									option={[
										{
											value: FieldNames.isLoop,
											checked: isLoop,
											name: 'Provide Loop for this sound',
											onChange() {
												setIsLoop((prev) => !prev);
											},
										},
									]}
								/>
							</div>
						</div>
					</div>
					{!disableData && (
						<div className={cn(ModelStyle['model__footer'])}>
							<Button className='btn-primary btn-large w-28 justify-center' type='submit'>
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

export default AddEditSoundModal;
