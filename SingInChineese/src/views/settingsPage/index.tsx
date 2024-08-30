import * as Yup from 'yup';
import { ROUTES, endPoint } from '@config/constant';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ObjectShape } from 'yup/lib/object';
import Button from '@components/button/Button';
import TextInput from '@components/textInput/TextInput';
import { CreateSettings } from 'src/types/settings';
import { URL_PATHS } from '@config/variables';
import { Setting } from '@components/icons';
import { ResponseCode } from 'src/interfaces/enum';
import { APIService } from '@framework/services/api';
import { Loader } from '@components/index';
import AdAndStarManagement from '@views/adsAndStarManagement';
import { decimalValueRequired, stringRequired } from '@config/validations';

const Settings = () => {
	const userRole = localStorage.getItem('role') as string;
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const initialValues: CreateSettings = {
		onboardingLoadTime: 0,
		retryQuestionDuration: 0,
		whyItWorksLoadTime: 0,
		ios: '',
		android: '',
		iosB2B: '',
		androidB2B: '',
	};

	/**
	 *
	 * @param  Method used for fetching contentList
	 */
	const getSettings = () => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.setting}/${endPoint.list}`)
			.then((response) => {
				if (response.status === ResponseCode.success) {
					response?.data?.data?.data?.map((i: { paramName: string; paramValue: number }) => {
						switch (i.paramName) {
							case 'onboardingLoadTime':
								formik.setFieldValue('onboardingLoadTime', i.paramValue);
								break;
							case 'retryQuestionDuration':
								formik.setFieldValue('retryQuestionDuration', i.paramValue);
								break;
							case 'whyItWorksLoadTime':
								formik.setFieldValue('whyItWorksLoadTime', i.paramValue);
								break;
							case 'ios':
								formik.setFieldValue('ios', i.paramValue);
								break;
							case 'android':
								formik.setFieldValue('android', i.paramValue);
								break;
							case 'iosB2B':
								formik.setFieldValue('iosB2B', i.paramValue);
								break;
							case 'androidB2B':
								formik.setFieldValue('androidB2B', i.paramValue);
								break;
							default:
								break;
						}
					});
				}
			})
			.catch((err) => toast.error(err?.response?.data.message))
			.finally(() => setLoading(false));
	};

	useEffect(() => {
		getSettings();
	}, []);

	/**
	 *
	 * @returns Method used for get validation for edit settings
	 */
	const getObj = () => {
		const obj: ObjectShape = {
			onboardingLoadTime: stringRequired('Please enter onboarding load time.'),
			retryQuestionDuration: stringRequired('Please enter no of retries.'),
			whyItWorksLoadTime: stringRequired('Please enter why it works load time.'),
			ios: decimalValueRequired('Please enter ios version.'),
			android: decimalValueRequired('Please enter android version.'),
			iosB2B: decimalValueRequired('Please enter ios b2b version.'),
			androidB2B: decimalValueRequired('Please enter android b2b version.'),
		};

		return Yup.object<ObjectShape>(obj);
	};

	const validationSchema = getObj();

	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			setLoading(true);
			APIService.postData(URL_PATHS.setting, values)
				.then((response) => {
					if (response.status === ResponseCode.success) {
						toast.success(response.data.message);
					}
					setLoading(false);
				})
				.catch((err) => {
					toast.error(err.response.data.message);
					setLoading(false);
				});
		},
	});

	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
	}, []);

	const getErrorSettings = (fieldName: keyof CreateSettings) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	return (
		<div>
			<div className='mb-7 bg-white shadow-lg rounded-lg overflow-auto'>
				<div className='border-b p-3 flex items-center justify-between'>
					<h6 className='font-medium flex items-center'>
						<Setting className='inline-block mr-2 text-primary' /> General Settings
					</h6>
				</div>
				{loading && <Loader />}
				<div className='w-full p-4'>
					<form onSubmit={formik.handleSubmit}>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2'>
							<TextInput placeholder='Onboarding load time in seconds' name='onboardingLoadTime' onChange={formik.handleChange} label='Onboarding Duration' value={formik.values.onboardingLoadTime} error={getErrorSettings('onboardingLoadTime')} type='number' required />
							<TextInput placeholder='Retry Question duration' name='retryQuestionDuration' onChange={formik.handleChange} label='Retry Question Duration' value={formik.values.retryQuestionDuration} error={getErrorSettings('retryQuestionDuration')} note='No. of times can retake for a question.' type='number' required />
							<TextInput placeholder='Why it works load time in seconds' name='whyItWorksLoadTime' onChange={formik.handleChange} label='Why it works Duration' value={formik.values.whyItWorksLoadTime} error={getErrorSettings('whyItWorksLoadTime')} type='number' required />
							<TextInput placeholder='ios version' name='ios' onChange={formik.handleChange} label='iOS Version' value={formik.values.ios} error={getErrorSettings('ios')} type='text' required />
							<TextInput placeholder='android version' name='android' onChange={formik.handleChange} label='Android Version' value={formik.values.android} error={getErrorSettings('android')} type='text' required />
							<TextInput placeholder='ios b2b version' name='iosB2B' onChange={formik.handleChange} label='iOS B2B Version' value={formik.values.iosB2B} error={getErrorSettings('iosB2B')} type='text' required />
							<TextInput placeholder='android b2b version' name='androidB2B' onChange={formik.handleChange} label='Android B2B Version' value={formik.values.androidB2B} error={getErrorSettings('androidB2B')} type='text' required />
						</div>
						<div className='flex items-center my-4'>
							<Button className='btn btn-primary btn-large' disabled={!!loading} type='submit'>
								Save
							</Button>
							<Button className='btn-default btn-large justify-center ml-3' onClick={onCancel}>
								Cancel
							</Button>
						</div>
					</form>
				</div>
			</div>
			{+userRole === 1 && (
				<div className='w-full h-auto '>
					<AdAndStarManagement />
				</div>
			)}
		</div>
	);
};

export default Settings;
