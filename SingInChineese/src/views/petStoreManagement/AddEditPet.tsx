import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/Button';
import { ObjectShape } from 'yup/lib/object';
import { Errors } from '@config/errors';
import cn from 'classnames';
import ModelStyle from '@pageStyles/Model.module.scss';
import { Cross } from '@components/icons';
import { URL_PATHS } from '@config/variables';
import { toast } from 'react-toastify';
import { Loader } from '@components/index';
import { APIService } from '@framework/services/api';
import { ResponseCode } from 'src/interfaces/enum';
import { IMAGE_NOTE, FILE_TYPE, IMAGE_SIZE, PET_POSITION, endPoint } from '@config/constant';
import FileUpload from '@components/fileUpload/FileUpload';
import { AddEditPetProductsData, CreatePetProductData } from 'src/types/petStoreProducts';
import CheckBox from '@components/checkbox/CheckBox';
import { DropdownOptionType } from 'src/types/component';
import Dropdown from '@components/dropdown/Dropdown';
import { mixedRequired, numberRequired, stringNoSpecialChar, stringNotRequired, stringRequired } from '@config/validations';

enum FieldNames {
	image = 'image',
	stars = 'stars',
	productName = 'productName',
	level = 'level',
	isForSeasonal = 'isForSeasonal',
	impactOnPet = 'impactOnPet',
	topic = 'topicId',
	position = 'position',
}

const AddEditPetProductModal = ({ onSubmit, onClose, editData, disabled }: AddEditPetProductsData) => {
	const [loadingPetProducts, setLoadingPetProducts] = useState<boolean>(false);
	const [petProductFile, setPetProductFile] = useState<string>('');
	const [error, setError] = useState<boolean>(false);
	const [seasonal, setSeasonal] = useState<boolean>(false);
	const [levels, setLevels] = useState<DropdownOptionType[]>([]);
	const [topics, setTopics] = useState<DropdownOptionType[]>([]);
	const [positionValue, setPositionValue] = useState<string | number>('');
	const [positionDisable, setPositionDisable] = useState<string | number>('');
	const healthValue = 3;

	const getLevelsList = () => {
		APIService.getData(URL_PATHS.level)
			.then((response) => {
				if (response.status === ResponseCode.created) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.levels.map((item: { levelName: string; uuid: string }) => {
						data.push({ name: item?.levelName, key: item?.uuid });
					});
					setLevels(data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	const getTopicsList = () => {
		APIService.getData(`${URL_PATHS.seasonalTopics}/${endPoint.list}`)
			.then((response) => {
				if (response.status === ResponseCode.created) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.topicsList.map((item: { name: string; uuid: string }) => {
						data.push({ name: item?.name, key: item?.uuid });
					});
					setTopics(data);
				}
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
			});
	};

	useEffect(() => {
		getLevelsList();
		getTopicsList();
	}, []);

	/**
	 *@returns Method used for setValue from exam data and get the details of petData by uuid
	 */
	useEffect(() => {
		if (editData) {
			setLoadingPetProducts(true);
			APIService.getData(`${URL_PATHS.petStore}/${editData.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.image, editData?.image);
						setPetProductFile(editData?.image);
						editData.level && formik.setFieldValue(FieldNames.level, response?.data.data.level);
						editData.topicId && formik.setFieldValue(FieldNames.topic, response?.data.data.topicId);
						formik.setFieldValue(FieldNames.stars, editData.stars);
						formik.setFieldValue(FieldNames.productName, editData.productName);
						setSeasonal(editData.isForSeasonal);
						formik.setFieldValue(FieldNames.position, response?.data.data.position);
						setPositionDisable(response?.data.data.position);
					}
					setLoadingPetProducts(false);
				})
				.catch((err) => {
					toast.error(err?.response?.data?.message);
					setLoadingPetProducts(false);
				});
		}
	}, []);

	const initialValues: CreatePetProductData = {
		[FieldNames.image]: null,
		[FieldNames.impactOnPet]: 1,
		[FieldNames.isForSeasonal]: seasonal,
		[FieldNames.level]: '',
		[FieldNames.productName]: '',
		[FieldNames.stars]: '',
		[FieldNames.topic]: '',
		[FieldNames.position]: 1,
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit pet
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.image]: editData
				? stringNotRequired()
				: mixedRequired(Errors.IMAGE_IS_REQUIRED)
						.test('fileFormat', Errors.UNSUPPORTED_FILE_FORMAT, (value) => value && [FILE_TYPE.jpegType, FILE_TYPE.pngType, FILE_TYPE.jpgType].includes(value.type))
						.test('fileSize', Errors.FILE_SIZE, (value) => value && value.size <= IMAGE_SIZE),
			[FieldNames.productName]: stringNoSpecialChar(Errors.PLEASE_ENTER_PRODUCT_NAME),
			[FieldNames.stars]: numberRequired(Errors.PLEASE_ENTER_NUMBER_OF_STARS),
			[FieldNames.level]: !seasonal && +positionValue !== 3 ? stringRequired(Errors.PLEASE_SELECT_LEVEL) : stringNotRequired(),
			[FieldNames.topic]: seasonal && +positionValue !== 3 ? stringRequired(Errors.PLEASE_SELECT_TOPIC) : stringNotRequired(),
			[FieldNames.position]: stringRequired(Errors.PLEASE_SELECT_POSITION),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			const seasonalData = {
				[FieldNames.image]: values.image,
				[FieldNames.impactOnPet]: values.impactOnPet,
				[FieldNames.isForSeasonal]: seasonal,
				[FieldNames.productName]: values.productName.trim(),
				[FieldNames.stars]: values.stars,
				[FieldNames.topic]: +positionValue !== healthValue ? values.topicId : '',
				[FieldNames.position]: values.position,
			};
			const normalData = {
				[FieldNames.image]: values.image,
				[FieldNames.impactOnPet]: values.impactOnPet,
				[FieldNames.isForSeasonal]: seasonal,
				[FieldNames.level]: +positionValue !== healthValue ? values.level : '',
				[FieldNames.productName]: values.productName.trim(),
				[FieldNames.stars]: values.stars,
				[FieldNames.position]: values.position,
			};
			if (editData) {
				setLoadingPetProducts(true);
				APIService.patchData(`${URL_PATHS.petStore}/${editData?.uuid}`, seasonal ? seasonalData : normalData, {
					'Content-Type': 'multipart/form-data',
				})
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingPetProducts(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingPetProducts(false);
					});
			} else {
				setLoadingPetProducts(true);
				APIService.postData(URL_PATHS.petStore, seasonal ? seasonalData : normalData, {
					'Content-Type': 'multipart/form-data',
				})
					.then((response) => {
						if (response.status === ResponseCode.created || ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
						setLoadingPetProducts(false);
					})
					.catch((err) => {
						toast.error(err?.response?.data?.message);
						setLoadingPetProducts(false);
					});
			}
		},
	});

	const getError = (fieldName: keyof CreatePetProductData) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	const productImageHandler = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (editData) {
			if (file && file.size <= IMAGE_SIZE && (file.type === FILE_TYPE.jpegType || file.type === FILE_TYPE.pngType || file.type === FILE_TYPE.jpgType)) {
				formik.setFieldValue(FieldNames.image, file);
				setPetProductFile(URL.createObjectURL(file));
				setError(false);
			} else {
				setError(true);
			}
		} else if (file) {
			formik.setFieldValue(FieldNames.image, file);
			setPetProductFile(URL.createObjectURL(file));
		}
	}, []);

	useEffect(() => {
		setPositionValue(formik.values.position);
	}, [formik]);

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					{!disabled ? <h4>{editData !== null ? 'Edit' : 'Add'} Product Details</h4> : <h4>Product Details</h4>}
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{loadingPetProducts && <Loader />}
				<form className='w-[90vw] md:w-[40vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='mb-4'>
							<FileUpload labelName='Product image' id='productFile' uploadType={FILE_TYPE.jpegType || FILE_TYPE.pngType || FILE_TYPE.jpegType} imageSource={petProductFile} name={FieldNames.image} disabled={disabled} error={getError(FieldNames.image) as string} acceptNote={IMAGE_NOTE} accepts={`${FILE_TYPE.jpegType}, ${FILE_TYPE.pngType}, ${FILE_TYPE.jpegType}`} onChange={productImageHandler} />
							{error && <p className='text-error mt-2 text-sm'>{Errors.FILE_FORMAT_AND_SIZE}</p>}
						</div>
						<div className='mb-4 hidden'>
							<Dropdown label='Position' placeholder='Position' name={FieldNames.position} onChange={formik.handleChange} value={formik.values.position} disabled={positionDisable === healthValue || disabled} options={PET_POSITION} id={FieldNames.position} error={getError(FieldNames.position)} disableOption={healthValue} required />
						</div>
						{+positionValue !== healthValue && (
							<div className='mb-4'>
								<CheckBox
									option={[
										{
											id: 'Is For Seasonal',
											name: 'Is For Seasonal',
											value: 'Is for seasonal',
											checked: seasonal,
											onChange: () => {
												setSeasonal(!seasonal);
											},
										},
									]}
									disabled={!!editData || disabled}
								/>
							</div>
						)}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							{!seasonal && +positionValue !== healthValue && (
								<div className='mb-4'>
									<Dropdown label='Level' placeholder='Select level' value={formik.values.level} name={FieldNames.level} onChange={formik.handleChange} options={levels} id='levels' error={formik.errors.level && formik.touched.level ? formik.errors.level : ''} required disabled={disabled} />
								</div>
							)}
							{seasonal && +positionValue !== healthValue && (
								<div className='mb-4'>
									<Dropdown label='Topic' placeholder='Select topic' value={formik.values.topicId} name={FieldNames.topic} onChange={formik.handleChange} options={topics} id='topics' error={formik.errors.topicId && formik.touched.topicId ? formik.errors.topicId : ''} required disabled={disabled} />
								</div>
							)}
							<div className='mb-4'>
								<TextInput placeholder='Product name' name={FieldNames.productName} disabled={disabled} onChange={formik.handleChange} label='Product Name' value={formik.values.productName} error={getError(FieldNames.productName)} required />
							</div>
							<div className='mb-4'>
								<TextInput type='number' placeholder='No of stars' name={FieldNames.stars} disabled={disabled} onChange={formik.handleChange} label='No Of Stars' value={formik.values.stars} error={getError(FieldNames.stars)} required />
							</div>
						</div>
					</div>
					{!disabled && (
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

export default AddEditPetProductModal;
