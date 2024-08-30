import React, { ReactElement, useCallback, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ROUTES } from '@config/constant';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useValidation from '@src/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import { CreateSettings } from '@type/settings';
import { Loader } from '@components/index';
import TextInput from '@components/textinput/TextInput';
import Button from '@components/button/button';
import { CheckCircle, Cross } from '@components/icons/icons';
import { UPDATE_SETTINGS } from '@framework/graphql/mutations/settings';
import { GET_SETTINGS_BY_ID } from '@framework/graphql/queries/settings';
import RoleBaseGuard from '@components/roleGuard';
import { PERMISSION_LIST } from '@config/permission';


const Settings = (): ReactElement => {
	const [updateSetting, { loading: updateLoader }] = useMutation(UPDATE_SETTINGS);
	const navigate = useNavigate();
	const { addSettingValidationSchema } = useValidation();
	const { data: settingsData, loading } = useQuery(GET_SETTINGS_BY_ID, {
		fetchPolicy: 'network-only',
	});
	const initialValues: CreateSettings = {
		sessionTime: '',
		influencerCount: '',
		sessionCount: ''
	};

	/**
	 * Method that sets form data while edit
	 */
	useEffect(() => {
		if (settingsData) {
			const data = settingsData?.fetchSettingsDetails?.data;
			data.map((i: { key: string, value: string }) => {
				switch (i.key) {
					case 'session_time':
						formik.setFieldValue('sessionTime', i.value);
						break;
					case 'influencer_count':
						formik.setFieldValue('influencerCount', i.value);
						break;
					case 'session_count':
						formik.setFieldValue('sessionCount', i.value);
						break;
					default:
						break;
				}
			})
		}
	}, [settingsData]);

	const formik = useFormik({
		initialValues,
		validationSchema: addSettingValidationSchema,
		onSubmit: async (values) => {
			updateSetting({
				variables: {
					sessionTime: values.sessionTime,
					influencerCount: values.influencerCount,
					sessionCount: values.sessionCount
				},
			}).then((res) => {
				const data = res?.data?.updateSetting;
				if (data?.meta?.statusCode === 200) {
					toast.success(data?.meta?.message);
					onCancel();
				}
			});
		},
	});
	/**
	 * Method that redirects to dashboard
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
	}, []);


	/**
	 * Handle blur that removes white space's
	 */
	const OnBlurSetting = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	/**
	 * Error message handler
	 * @param fieldName
	 * @returns
	 */
	const getErrorSettingsPage = (fieldName: keyof CreateSettings) => {
		return formik.errors[fieldName] && formik.touched[fieldName] ? formik.errors[fieldName] : '';
	};

	return (
		<div className='card'>
			{(updateLoader || loading) && <Loader />}
			<form onSubmit={formik.handleSubmit}>
				<div className='card-body'>
					<div className='flex flex-col sm:flex-row mb-4 md:justify-between sm:items-center'>
						<h4 className='font-medium text-h3 text-dark-gary-1 mb-2 sm:mb-0'>{('General Settings')}</h4>
						<p className='text-gray-700 sm:pl-4'>
							{('Fields marked with')} <span className='text-red-500'>*</span> {('are mandatory.')}
						</p>
					</div>

					<div className=' card-grid-addedit-page md:grid-cols-2 border-t border-gray-200 pt-4'>
						<div>
							<TextInput id={'sessionTime'} required={true} placeholder={('Session Time')} name='sessionTime' onChange={formik.handleChange} label={('Session Time')} value={formik.values.sessionTime} error={getErrorSettingsPage('sessionTime')} onBlur={OnBlurSetting} />
						</div>
						<div>
							<TextInput id={'influencerCount'} required={true} placeholder={('Influencer Count')} name='influencerCount' onChange={formik.handleChange} label={('Influencer Count')} value={formik.values.influencerCount} error={getErrorSettingsPage('influencerCount')} onBlur={OnBlurSetting} />
						</div>
						<div>
							<TextInput id={'sessionCount'} required={true} placeholder={('Session Count')} name='sessionCount' onChange={formik.handleChange} label={('Session Count')} value={formik.values.sessionCount} error={getErrorSettingsPage('sessionCount')} onBlur={OnBlurSetting} />
						</div>
					</div>
				</div>
				<div className='card-footer btn-group '>
					<RoleBaseGuard permissions={[PERMISSION_LIST.Settings.EditAccess]}>
					<Button type='submit' className='btn-primary ' label={('Update')}>
						<span className='text-white mr-1 w-3.5 h-3.5 inline-block svg-icon'>
							<CheckCircle />
						</span>
					</Button>
					</RoleBaseGuard>
					<Button label={('Cancel')} className='btn-warning ' onClick={onCancel}>
						<span className='mr-1 w-2.5 h-2.5 text-white inline-block svg-icon'>
							<Cross />
						</span>
					</Button>
				</div>
			</form>
		</div>
	);
};
export default Settings;
