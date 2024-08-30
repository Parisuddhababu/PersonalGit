import { useMutation, useQuery } from '@apollo/client';
import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { CheckCircle, Cross } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { ROUTES } from '@config/constant';
import { CreateRulesSetRes, UpdateRuleSetRes } from '@framework/graphql/graphql';
import { CREATE_RULES_SET, UPDATE_MANAGE_RULES_SET } from '@framework/graphql/mutations/manageRulesSets';
import { FETCH_RULES_SET_BY_ID } from '@framework/graphql/queries/manageRulesSets';
import { useFormik } from 'formik';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CreateRulesSet } from 'src/types/manageRulesSets';
import useValidation from '@framework/hooks/validations';
import { whiteSpaceRemover } from '@utils/helpers';
import WithTranslateFormErrors from '@components/customHooks/useTranslationFormErrors';

const AddEditRulesSets = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const updateRuleSetId = useParams();
	const { data: ruleData, refetch } = useQuery(FETCH_RULES_SET_BY_ID);
	const [createRulesSet] = useMutation(CREATE_RULES_SET);
	const [updateRulesSet] = useMutation(UPDATE_MANAGE_RULES_SET);
	const { manageRuleSetValidationsSchema } = useValidation();
	const initialValues: CreateRulesSet = {
		ruleName: '',
		description: '',
		priority: '1',
		onAction: '',
	};
	const PriorityDrp = [
		{ name: t('Low'), key: 'low' },
		{ name: t('High'), key: 'high' },
		{ name: t('Medium'), key: 'medium' },
	];
	const onActionDrp = [
		{ name: t('Both'), key: 'both' },
		{ name: t('Signup'), key: 'signup' },
		{ name: t('Signin'), key: 'signin' },
	];
	/**
	 *fetchs the data based on rules sets id
	 */
	useEffect(() => {
		if (updateRuleSetId?.id) {
			refetch({
				fetchSingleSetRuleId: parseInt(updateRuleSetId?.id),
			}).catch((err) => toast.error(err));
		}
	}, [updateRuleSetId?.id]);
	/**
	 * Method used for setvalue from rules sets data by id
	 */

	useEffect(() => {
		if (ruleData?.fetchSingleSetRule && updateRuleSetId?.id) {
			const data = ruleData?.fetchSingleSetRule?.data;

			formik
				.setValues({
					ruleName: data?.rule_name,
					description: data?.description,
					priority: data?.priority,
					onAction: data?.on_action,
				})
				.catch((err) => {
					toast.error(err);
				});
		}
	}, [ruleData?.fetchSingleSetRule]);

	const validationSchema = manageRuleSetValidationsSchema;
	const formik = useFormik({
		initialValues,
		validationSchema,
		onSubmit: (values) => {
			if (updateRuleSetId.id) {
				updateRulesSet({
					variables: {
						updateSetRuleId: parseInt(updateRuleSetId.id),
						ruleName: values.ruleName,
						description: values.description,
						priority: values.priority,
						onAction: values.onAction,
					},
				})
					.then((res) => {
						const data = res.data as UpdateRuleSetRes;

						if (data?.updateSetRule.meta.statusCode === 200) {
							toast.success(data?.updateSetRule.meta.message);
							formik.resetForm();
							onCancel();
						} else {
							toast.error(data.updateSetRule.meta.message);
						}
					})
					.catch(() => {
						toast.error(t('Failed to update'));
					});
			} else {
				createRulesSet({
					variables: {
						ruleName: values.ruleName,
						description: values.description,
						priority: values.priority,
						onAction: values.onAction,
						createdBy: 2,
					},
				})
					.then((res) => {
						const data = res.data as CreateRulesSetRes;

						if (data.createSetRule.meta.statusCode === 200) {
							toast.success(data.createSetRule.meta.message);
							navigate(`/${ROUTES.app}/${ROUTES.manageRulesSets}/list`);
							formik.resetForm();
						} else {
							toast.error(data.createSetRule.meta.message);
						}
					})
					.catch(() => {
						toast.error(t('Failed to create'));
					});
			}
		},
	});
	/**
	 * on clicking cancel it will redirect to main rules page
	 */

	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.manageRulesSets}/list`);
	}, []);
	const OnBlurRules = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		formik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);
	return (
		<div>
			<div className='w-full'>
				<WithTranslateFormErrors errors={formik.errors} touched={formik.touched} setFieldTouched={formik.setFieldTouched}>
					<form className='bg-white shadow-md rounded  pt-6  mb-4 border border-[#c8ced3]' onSubmit={formik.handleSubmit}>
						<div className='flex justify-end pr-8 pb-2'>
							<p>
								Fields marked with <span className='text-red-500'>*</span> are mandatory.
							</p>
						</div>
						<div className='px-8 grid grid-cols-1 md:grid-cols-2  gap-6'>
							<div>
								<TextInput required={true} type='text' id='ruleName' placeholder={t('Rule Name')} name='ruleName' onChange={formik.handleChange} onBlur={OnBlurRules} label={t('Rule Name')} value={formik.values.ruleName} error={formik.errors.ruleName && formik.touched.ruleName ? formik.errors.ruleName : ''} />
							</div>
							<div>
								<label className='block text-gray-700 text-sm font-normal mb-2' htmlFor='description'>
									{t('Description')}
									<span className='text-red-500 ml-1'>*</span>
								</label>

								<div className={'  shadow appearance-none   border rounded w-full text-gray-700 flex items-center'}>
									<textarea id='description' placeholder={`${t('Description')}`} className='w-full py-2 px-3' name='description' onChange={formik.handleChange} onBlur={OnBlurRules} value={formik.values.description} rows={2} cols={50}></textarea>
								</div>

								{formik.errors.description != undefined && formik.touched.description ? <p className='error'>{t(formik.errors.description)}</p> : ''}
							</div>
							<div>
								<Dropdown required={true} name='priority' onChange={formik.handleChange} value={formik.values.priority} options={PriorityDrp} id='priority' label={t('Priority')} error={formik.errors.priority && formik.touched.priority ? formik.errors.priority : ''} />
							</div>
							<div className='mb-5'>
								<Dropdown required={true} placeholder={t('Select Action')} name='onAction' onChange={formik.handleChange} value={formik.values.onAction} options={onActionDrp} id='onAction' label={t('On Action')} error={formik.errors.onAction && formik.touched.onAction ? formik.errors.onAction : ''} />
							</div>
						</div>

						<div className='btn-group col-span-3 flex items-center py-3 px-5  justify-start bg-slate-100   border border-[#c8ced3]'>
							<Button className='btn-primary btn-normal' type='submit' label={updateRuleSetId.id ? t('Update') : t('Save')} 
							 title={`${updateRuleSetId.id ? t('Update') : t('Save')}`}>
								<CheckCircle className='mr-2 text-white ' />
							</Button>
							<Button className='btn-warning btn-normal ' label={t('Cancel')} onClick={onCancel}  title={`${t('Close')}`} >
								<Cross className='mr-1 fill-white' />
							</Button>
						</div>
					</form>
				</WithTranslateFormErrors>
			</div>
		</div>
	);
};
export default AddEditRulesSets;
