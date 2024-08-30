import React, { useEffect, useState } from 'react';
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
import { AddEditSubscriptionData, CreateSubscription } from 'src/types/subscription';
import Dropdown from '@components/dropdown/Dropdown';
import { CHARACTERS_LIMIT, DEFAULT_TRIAL_LIMIT, MAX_CHILDREN_ALLOWED, TRAIL_OPTIONS } from '@config/constant';
import { DropdownOptionType } from 'src/types/component';
import TextArea from '@components/textArea/TextArea';
import { stringNoSpecialChar, stringRequired, stringTrim } from '@config/validations';

enum FieldNames {
	subscriptionTypeId = 'subscriptionTypeId',
	name = 'name',
	description = 'description',
	price = 'price',
	allowedChildCount = 'allowedChildCount',
	isFreeTrialEnabled = 'isFreeTrialEnabled',
	freeTrialDuration = 'freeTrialDuration',
	specialPrice = 'specialPrice',
	specialNote = 'specialNote',
	priceDescription = 'priceDescription',
	playStoreId = 'playStoreId',
	appStoreId = 'appStoreId',
	buttonText = 'buttonText',
}

const AddEditSubscriptionModal = ({ onSubmit, onClose, editData, disableFields }: AddEditSubscriptionData) => {
	const [loaderSubscription, setLoaderSubscription] = useState<boolean>(false);
	const [subscriptionType, setSubscriptionType] = useState<DropdownOptionType[]>([]);

	const getSubscriptionTypeList = () => {
		setLoaderSubscription(true);
		APIService.getData(URL_PATHS.subscriptionTypeList)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					const data: DropdownOptionType[] = [];
					response?.data?.data.data.map((item: { period: string; uuid: string }) => {
						data.push({ name: item?.period, key: item?.uuid });
					});
					setSubscriptionType(data);
				} else {
					toast.error(response?.data.message);
				}
				setLoaderSubscription(false);
			})
			.catch((err) => {
				toast.error(err?.response?.data.message);
				setLoaderSubscription(false);
			});
	};

	useEffect(() => {
		getSubscriptionTypeList();
	}, []);

	/**
	 *@returns Method used for setValue from subscription data and get the details of subscription by uuid
	 */
	useEffect(() => {
		if (editData) {
			setLoaderSubscription(true);
			APIService.getData(`${URL_PATHS.subscription}/${editData.uuid}`)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						formik.setFieldValue(FieldNames.subscriptionTypeId, editData?.subscriptionTypeId);
						formik.setFieldValue(FieldNames.name, editData?.planName);
						formik.setFieldValue(FieldNames.description, editData?.planDescription);
						formik.setFieldValue(FieldNames.price, editData?.planPrice);
						formik.setFieldValue(FieldNames.allowedChildCount, editData?.allowedChildCount);
						formik.setFieldValue(FieldNames.isFreeTrialEnabled, editData?.isFreeTrialEnabled);
						formik.setFieldValue(FieldNames.freeTrialDuration, editData?.freeTrialDuration);
						formik.setFieldValue(FieldNames.appStoreId, editData?.appStoreId);
						formik.setFieldValue(FieldNames.playStoreId, editData?.playStoreId);
						formik.setFieldValue(FieldNames.buttonText, editData?.buttonText);
						if (editData.specialPrice !== 0) {
							formik.setFieldValue(FieldNames.specialPrice, editData?.specialPrice);
						}
						if (editData.specialNote !== '') {
							formik.setFieldValue(FieldNames.specialNote, editData?.specialNote);
						}
						formik.setFieldValue(FieldNames.priceDescription, editData?.priceDescription);
					}
				})
				.catch((err) => toast.error(err?.response?.data?.message))
				.finally(() => setLoaderSubscription(false));
		}
	}, []);

	const initialValues: CreateSubscription = {
		[FieldNames.subscriptionTypeId]: '',
		[FieldNames.name]: '',
		[FieldNames.description]: '',
		[FieldNames.price]: '',
		[FieldNames.allowedChildCount]: '',
		[FieldNames.isFreeTrialEnabled]: '',
		[FieldNames.freeTrialDuration]: '',
		[FieldNames.priceDescription]: '',
		[FieldNames.playStoreId]: '',
		[FieldNames.appStoreId]: '',
		[FieldNames.buttonText]: '',
	};

	/**
	 *
	 * @returns Method used for get validation for add/edit subscription
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			[FieldNames.subscriptionTypeId]: stringRequired(Errors.PLEASE_SELECT_SUBSCRIPTION_ID),
			[FieldNames.name]: stringNoSpecialChar(Errors.PLEASE_ENTER_PLAN_NAME),
			[FieldNames.description]: stringTrim(Errors.PLEASE_ENTER_PLAN_DESCRIPTION).max(CHARACTERS_LIMIT.description, Errors.MAXIMUM_LIMIT_UPTO_150_CHARACTERS),
			[FieldNames.price]: stringRequired(Errors.PLEASE_ENTER_PLAN_PRICE),
			[FieldNames.allowedChildCount]: stringRequired(Errors.PLEASE_ENTER_ALLOWED_CHILD),
			[FieldNames.isFreeTrialEnabled]: stringRequired(Errors.PLEASE_SELECT_FREE_TRAIL_OPTION),
			[FieldNames.freeTrialDuration]: stringRequired(Errors.PLEASE_ENTER_FREE_TRAIL_DURATION),
			[FieldNames.priceDescription]: stringTrim(Errors.PLEASE_ENTER_PRICE_DESCRIPTION).max(CHARACTERS_LIMIT.description, Errors.MAXIMUM_LIMIT_UPTO_150_CHARACTERS),
			[FieldNames.playStoreId]: stringTrim(Errors.PLEASE_ENTER_PLAY_STORE_ID),
			[FieldNames.appStoreId]: stringTrim(Errors.PLEASE_ENTER_APP_STORE_ID),
			[FieldNames.buttonText]: stringTrim(Errors.PLEASE_ENTER_BUTTON_TEXT),
		};
		return Yup.object<ObjectShape>(obj);
	};
	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (editData) {
				setLoaderSubscription(true);
				APIService.putData(`${URL_PATHS.subscription}/${editData.uuid}`, values)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
					})
					.catch((err) => toast.error(err?.response?.data?.message))
					.finally(() => setLoaderSubscription(false));
			} else {
				setLoaderSubscription(true);
				APIService.postData(URL_PATHS.subscription, values)
					.then((response) => {
						if (response.status === ResponseCode.success) {
							toast.success(response?.data?.message);
							formik.resetForm();
							onClose();
							onSubmit();
						}
					})
					.catch((err) => toast.error(err?.response?.data?.message))
					.finally(() => setLoaderSubscription(false));
			}
		},
	});

	const getError = (fieldName: keyof CreateSubscription) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	return (
		<div id='changeStatusModel' className={cn(ModelStyle['model-wrapper'])}>
			<div className={cn(ModelStyle['model'])}>
				{/* <!-- Modal Header --> */}
				<div className={cn(ModelStyle['model__header'])}>
					{!disableFields ? <h4>{editData !== null ? 'Edit' : 'Add'} Subscription</h4> : <h4>Subscription plan</h4>}
					<Button className={cn(ModelStyle['model__header_close'])} onClick={onClose}>
						<Cross />
					</Button>
				</div>
				{/* <!-- Modal Header End --> */}
				{loaderSubscription && <Loader />}
				<form className='w-[90vw] md:w-[75vw] lg:w-[60vw]' onSubmit={formik.handleSubmit}>
					<div className={cn(ModelStyle['model__body'])}>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<Dropdown label='Subscription type' placeholder='Subscription type' name={FieldNames.subscriptionTypeId} onChange={formik.handleChange} value={formik.values.subscriptionTypeId} disabled={disableFields} options={subscriptionType} id='subscriptionType' error={getError(FieldNames.subscriptionTypeId)} required />
							<TextInput placeholder='Plan name' name={FieldNames.name} disabled={disableFields} onChange={formik.handleChange} label='Plan name' value={formik.values.name} error={getError(FieldNames.name)} required />
							<div className='col-span-1 md:col-span-2'>
								<TextArea placeholder='Plan description' name={FieldNames.description} disabled={disableFields} onChange={formik.handleChange} label='Plan description' value={formik.values.description} error={getError(FieldNames.description)} required />
							</div>
							<TextInput type='number' placeholder='Plan price' step='any' name={FieldNames.price} disabled={disableFields} onChange={formik.handleChange} label='Plan price' value={formik.values.price} error={getError(FieldNames.price)} required />
							<TextInput type='number' placeholder='Number of child' name={FieldNames.allowedChildCount} disabled={disableFields} onChange={formik.handleChange} label='Allowed child count' value={formik.values.allowedChildCount} error={getError(FieldNames.allowedChildCount)} min={1} max={MAX_CHILDREN_ALLOWED} required />
							<div className='col-span-1 md:col-span-2'>
								<TextArea placeholder='Price description' name={FieldNames.priceDescription} disabled={disableFields} onChange={formik.handleChange} label='Price description' value={formik.values.priceDescription} error={getError(FieldNames.priceDescription)} required />
							</div>
							<Dropdown label='Is free trial enabled' placeholder='Is free trial enabled' name={FieldNames.isFreeTrialEnabled} disabled={disableFields} onChange={formik.handleChange} value={`${formik.values.isFreeTrialEnabled}`} options={TRAIL_OPTIONS} id='freeTrial' error={getError(FieldNames.isFreeTrialEnabled)} required />
							<TextInput type='number' placeholder='Free trial duration' name={FieldNames.freeTrialDuration} disabled={disableFields} onChange={formik.handleChange} label='Free trial duration' value={formik.values.freeTrialDuration} error={getError(FieldNames.freeTrialDuration)} note='How many days for Trial?' max={DEFAULT_TRIAL_LIMIT} required />
							<TextInput type='number' placeholder='Special price' step='any' name={FieldNames.specialPrice} disabled={disableFields} onChange={formik.handleChange} label='Special price' value={formik.values.specialPrice} error={getError(FieldNames.specialPrice)} />
							<TextInput placeholder='Special note' name={FieldNames.specialNote} disabled={disableFields} onChange={formik.handleChange} label='Special note' value={formik.values.specialNote} error={getError(FieldNames.specialNote)} />
							<TextInput placeholder='Play Store ID' name={FieldNames.playStoreId} disabled={disableFields} onChange={formik.handleChange} label='Play Store ID' value={formik.values.playStoreId} error={getError(FieldNames.playStoreId)} required />
							<TextInput placeholder='App Store ID' name={FieldNames.appStoreId} disabled={disableFields} onChange={formik.handleChange} label='App Store ID' value={formik.values.appStoreId} error={getError(FieldNames.appStoreId)} required />
							<TextInput placeholder='Button text' name={FieldNames.buttonText} disabled={disableFields} onChange={formik.handleChange} label='Button Text' value={formik.values.buttonText} error={getError(FieldNames.buttonText)} required />
						</div>
					</div>
					{!disableFields && (
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

export default AddEditSubscriptionModal;
