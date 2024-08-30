import React, { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import TextInput from '@components/textInput/TextInput';
import Button from '@components/button/button';
import { useNavigate, useParams } from 'react-router-dom';
import { STATUS_RADIO } from '@config/constant';
import RadioButtonNew from '@components/radiobutton/radioButtonNew';
import useValidation from '@framework/hooks/validations';
import CKEditorComponent from '@components/ckEditor/ckEditor';
import { whiteSpaceRemover } from '@utils/helpers';
import UpdatedHeader from '@components/header/updatedHeader';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_TEMPLATE, UPDATE_SYSTEM_TEMPLATE } from '@framework/graphql/mutations/emailTemplates';
import { GET_SYSTEM_TEMPLATES_WITH_ID } from '@framework/graphql/queries/emailTemplates';
import Loader from '@components/common/loader';

interface EmailDataById {
	title: string,
	description: string,
	metaTitle?: string,
	metaDescription?: string,
	status: number,
}

const SystemAddEditEmailTemplate = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { createUpdateEmailSchema: createUpdateSystemEmailSchema } = useValidation();
	const { id } = useParams();
	const [createSystemEmailTemplate, createLoading] = useMutation(CREATE_TEMPLATE);
	const [updateSystemEmailTemplate, updateLoading] = useMutation(UPDATE_SYSTEM_TEMPLATE);
	const { data, refetch, loading } = useQuery(GET_SYSTEM_TEMPLATES_WITH_ID, { variables: { systemEmailTemplateId: id }, skip: !id });

	const initialSystemValues: EmailDataById = {
		title: '',
		description: '',
		metaTitle: '',
		metaDescription: '',
		status: 1,
	}

	useEffect(() => {
		if (id) {
			refetch()
		}
	}, [id])

	const systemEmailTemplateFormik = useFormik({
		initialValues: initialSystemValues,
		validationSchema: createUpdateSystemEmailSchema,
		onSubmit: (values) => {
			if (id) {
				updateSystemEmailTemplate({
					variables: {
						systemEmailTemplateData: {
							description: values?.description,
							status: +values?.status,
							title: values?.title,
							template_id: id,
						}
					}
				}).then((res) => {
					const data = res.data.updateSystemEmailTemplate
					toast.success(data?.message);
					navigate(-1);
					systemEmailTemplateFormik.resetForm();
				})
					.catch((err) => {
						toast.error(err?.networkError?.result?.errors?.[0]?.message);
					});
			} else  {
				createSystemEmailTemplate({
					variables: {
						templateData: {
							description: values?.description,
							status: +values?.status,
							title: values?.title,
						}
					}
				}).then((res) => {
					const data = res.data.createTemplate
					toast.success(data?.message);
					navigate(-1);
					systemEmailTemplateFormik.resetForm();
				})
					.catch((err) => {
						toast.error(err?.networkError?.result?.errors?.[0]?.message);
					});
			}
		},
	})

	const OnSystemEmailBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		systemEmailTemplateFormik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	const handleSystemTemplateCkEditor = useCallback((e: string) => {
		systemEmailTemplateFormik.setFieldValue('description', e);
	}, []);

	const onSystemTemplateCancelCms = useCallback(() => {
		navigate(-1)
	}, [])

	useEffect(() => {
		if (data?.getSystemEmailTemplateById?.data?.title) {
			systemEmailTemplateFormik.resetForm({
				values: {
					title: data?.getSystemEmailTemplateById?.data?.title,
					description: data?.getSystemEmailTemplateById?.data?.description,
					status: (data?.getSystemEmailTemplateById?.data?.status)?.toString(),
				}
			});
		}
	}, [data?.getSystemEmailTemplateById?.data])

	return (
		<>
			<UpdatedHeader headerTitle='System Template Management' />
			{(loading || createLoading?.loading || updateLoading?.loading) && <Loader />}
			<div className='w-[calc(100%-40px)] md:w-[calc(100%-56px)]'>
				<form className='border border-solid border-border-primary rounded-xl '>
					<div className='p-3 rounded-xl md:p-5'>
						<h6 className='leading-[30px] mb-3 md:mb-5'>{t('System Edit Template')}</h6>
						<div className='flex flex-col gap-3'>
							<div className='md:max-w-[740px] w-full'>
								<TextInput onBlur={OnSystemEmailBlur} required={true} placeholder={t('Enter Content Page Title')} name='title' onChange={systemEmailTemplateFormik.handleChange} label={t('Content Page Title (English)')} value={systemEmailTemplateFormik.values.title} error={systemEmailTemplateFormik.errors.title && systemEmailTemplateFormik.touched.title ? systemEmailTemplateFormik.errors.title : ''} />
							</div>
							<div className='mb-2'>
								<div className='mb-2'>
									<label>
										{t('Description')} {t('English')} <span className='text-red-700'>*</span>
									</label>
								</div>
								<CKEditorComponent value={systemEmailTemplateFormik.values.description} onChange={handleSystemTemplateCkEditor} />
								<p className='error'>{systemEmailTemplateFormik.errors.description && systemEmailTemplateFormik.touched.description && systemEmailTemplateFormik.errors.description}</p>
							</div>

							<div className='md:max-w-[740px] w-full'>
								<TextInput onBlur={OnSystemEmailBlur} required={false} placeholder={t('Enter Meta Title')} name='metaTitle' onChange={systemEmailTemplateFormik.handleChange} label={t('Meta Title (English)')} value={systemEmailTemplateFormik.values.metaTitle} error={systemEmailTemplateFormik.errors.metaTitle && systemEmailTemplateFormik.touched.metaTitle ? systemEmailTemplateFormik.errors.metaTitle : ''} />
							</div>

							<div>
								<label htmlFor="textarea">Meta Description (English)</label>
								<textarea
									id="metaDescription"
									name="metaDescription"
									rows={4}
									cols={83}
									value={systemEmailTemplateFormik.values.metaDescription}
									onBlur={OnSystemEmailBlur}
									placeholder='Enter Meta Description'
									onChange={systemEmailTemplateFormik.handleChange}
									className='border border-border-primary rounded-xl p-3.5 w-full focus:bg-white'
									style={{ resize: 'none' }}

								></textarea>
								<p className='error'>{systemEmailTemplateFormik.errors.metaDescription && systemEmailTemplateFormik.touched.metaDescription && systemEmailTemplateFormik.errors.metaDescription}</p>
							</div>

							<div>
								<RadioButtonNew required={true} checked={systemEmailTemplateFormik.values.status} onChange={systemEmailTemplateFormik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
							</div>
						</div>
					</div>
				</form>
				<div className='flex items-start justify-start gap-[22px] col-span-3 btn-group py-[30px]'>
					{!id && <Button className='btn-primary btn-normal w-[166px]' type='button' label={t('Save')} onClick={systemEmailTemplateFormik.handleSubmit}
					 title={`${t('Save')}`}  />}
					{id && <Button className='btn-primary btn-normal w-[166px]' type='button' label={t('Update')} onClick={systemEmailTemplateFormik.handleSubmit}
					title='Update' />}
					<Button className='btn-secondary btn-normal w-[166px]' label={t('Cancel')} onClick={onSystemTemplateCancelCms}  title={`${t('Cancel')}`}  />
				</div>
			</div>
		</>
	);
};

export default SystemAddEditEmailTemplate;
