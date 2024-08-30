import * as Yup from 'yup';
import { ROUTES } from '@config/constant';
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

const Settings = () => {
	const userRole = localStorage.getItem('role') as string;
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const initialValues: CreateSettings = {
		onboardingLoadTime: 0,
		retryQuestionDuration: 0,
		whyItWorksLoadTime: 0,
	};

	/**
	 *
	 * @param  Method used for fetching contentList
	 */
	const getSettings = () => {
		setLoading(true);
		APIService.getData(`${URL_PATHS.setting}/list`)
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
			onboardingLoadTime: Yup.string().required('Please enter onboarding load time.'),
			retryQuestionDuration: Yup.string().required('Please enter no of retries.'),
			whyItWorksLoadTime: Yup.string().required('Please enter why it works load time.'),
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
					<form onSubmit={formik.handleSubmit} className='w-full mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
						<TextInput placeholder='Onboarding load time in seconds' name='onboardingLoadTime' onChange={formik.handleChange} label='Onboarding Duration' value={formik.values.onboardingLoadTime} error={formik.errors.onboardingLoadTime} type='number' required />
						<TextInput placeholder='Retry Question duration' name='retryQuestionDuration' onChange={formik.handleChange} label='Retry Question Duration' value={formik.values.retryQuestionDuration} error={formik.errors.retryQuestionDuration} note='No. of times can retake for a question.' type='number' required />
						<TextInput placeholder='Why it works load time in seconds' name='whyItWorksLoadTime' onChange={formik.handleChange} label='Why it works Duration' value={formik.values.whyItWorksLoadTime} error={formik.errors.whyItWorksLoadTime} type='number' required />
						<div className='md:col-span-2 lg:col-span-3 xl:col-span-4 flex items-center'>
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
