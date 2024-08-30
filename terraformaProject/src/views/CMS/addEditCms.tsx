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
import { CREATE_TEMPLATE, UPDATE_TEMPLATE } from '@framework/graphql/mutations/emailTemplates';
import { GET_TEMPLATES_WITH_ID } from '@framework/graphql/queries/emailTemplates';
import Loader from '@components/common/loader';

interface EmailDataById {
	title: string,
	description: string,
	metaTitle?: string,
	metaDescription?: string,
	status: number,
}

const AddEditEmailTemplate = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { createUpdateEmailSchema } = useValidation();
	const { id } = useParams();
	const [createEmailTemplate, createLoading] = useMutation(CREATE_TEMPLATE);
	const [updateEmailTemplate, updateLoading] = useMutation(UPDATE_TEMPLATE);
	const { data, refetch, loading } = useQuery(GET_TEMPLATES_WITH_ID, { variables: { getTemplateByIdId: id }, skip: !id });

	const initialValues: EmailDataById = {
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

	const emailTemplateFormik = useFormik({
		initialValues,
		validationSchema: createUpdateEmailSchema,
		onSubmit: (values) => {
			if (id) {
				updateEmailTemplate({
					variables: {
						templateData: {
							description: values?.description,
							status: +values?.status,
							title: values?.title,
							template_id: id,
						}
					}
				}).then((res) => {
					const data = res.data.updateTemplate
					toast.success(data?.message);
					navigate(-1);
					emailTemplateFormik.resetForm();
				})
					.catch((err) => {
						toast.error(err?.networkError?.result?.errors?.[0]?.message);
					});
			} else  {
				createEmailTemplate({
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
					emailTemplateFormik.resetForm();
				})
					.catch((err) => {
						toast.error(err?.networkError?.result?.errors?.[0]?.message);
					});
			}
		},
	})

	const OnEmailTemplateBlur = useCallback((e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLInputElement>) => {
		emailTemplateFormik.setFieldValue(e.target.name, whiteSpaceRemover(e));
	}, []);

	const handleEmailTemplateCkEditor = useCallback((e: string) => {
		emailTemplateFormik.setFieldValue('description', e);
	}, []);

	const onCancelEmailTemplate = useCallback(() => {
		navigate(-1)
	}, [])

	useEffect(() => {
		if (data?.getTemplateById?.data?.title) {
			emailTemplateFormik.resetForm({
				values: {
					title: data?.getTemplateById?.data?.title,
					description: data?.getTemplateById?.data?.description,
					status: (data?.getTemplateById?.data?.status)?.toString(),
				}
			});
		}
	}, [data?.getTemplateById?.data])

	return (
		<>
			<UpdatedHeader headerTitle='Email Template Management' />
			{(loading || createLoading?.loading || updateLoading?.loading) && <Loader />}
			<div className='w-[calc(100%-40px)] md:w-[calc(100%-56px)]'>
				<form className='border border-solid border-border-primary rounded-xl '>
					<div className='p-3 rounded-xl md:p-5'>
						<h6 className='leading-[30px] mb-3 md:mb-5'>{t('Edit Template')}</h6>
						<div className='flex flex-col gap-3'>
							<div className='md:max-w-[740px] w-full'>
								<TextInput onBlur={OnEmailTemplateBlur} required={true} placeholder={t('Enter Content Page Title')} name='title' onChange={emailTemplateFormik.handleChange} label={t('Content Page Title (English)')} value={emailTemplateFormik.values.title} error={emailTemplateFormik.errors.title && emailTemplateFormik.touched.title ? emailTemplateFormik.errors.title : ''} />
							</div>

							<div className='mb-2'>
								<div className='mb-2'>
									<label>
										{t('Description')} {t('English')} <span className='text-red-700'>*</span>
									</label>
								</div>
								<CKEditorComponent value={emailTemplateFormik.values.description} onChange={handleEmailTemplateCkEditor}/>
								<p className='error'>{emailTemplateFormik.errors.description && emailTemplateFormik.touched.description && emailTemplateFormik.errors.description}</p>
							</div>

							<div className='md:max-w-[740px] w-full'>
								<TextInput onBlur={OnEmailTemplateBlur} required={false} placeholder={t('Enter Meta Title')} name='metaTitle' onChange={emailTemplateFormik.handleChange} label={t('Meta Title (English)')} value={emailTemplateFormik.values.metaTitle} error={emailTemplateFormik.errors.metaTitle && emailTemplateFormik.touched.metaTitle ? emailTemplateFormik.errors.metaTitle : ''} />
							</div>

							<div>
								<label htmlFor="textarea">Meta Description (English)</label>
								<textarea
									id="metaDescription"
									name="metaDescription"
									rows={4}
									cols={83}
									value={emailTemplateFormik.values.metaDescription}
									onBlur={OnEmailTemplateBlur}
									placeholder='Enter Meta Description'
									onChange={emailTemplateFormik.handleChange}
									className='border border-border-primary rounded-xl p-3.5 w-full focus:bg-white'
									style={{ resize: 'none' }}

								></textarea>
								<p className='error'>{emailTemplateFormik.errors.metaDescription && emailTemplateFormik.touched.metaDescription && emailTemplateFormik.errors.metaDescription}</p>
							</div>

							<div>
								<RadioButtonNew required={true} checked={emailTemplateFormik.values.status} onChange={emailTemplateFormik.handleChange} name={'status'} radioOptions={STATUS_RADIO} label={t('Status')} />
							</div>
						</div>
					</div>
				</form>
				<div className='flex items-start justify-start gap-[22px] col-span-3 btn-group py-[30px]'>
					{!id && <Button className='btn-primary btn-normal w-[166px]' type='button' label={t('Save')} onClick={emailTemplateFormik.handleSubmit} title={`${t('Save')}`} />}
					{id && <Button className='btn-primary btn-normal w-[166px]' type='button' label={t('Update')} onClick={emailTemplateFormik.handleSubmit}
					title={`${t('Update')}`} />}
					<Button className='btn-secondary btn-normal w-[166px]' label={t('Cancel')} onClick={onCancelEmailTemplate} title={`${t('Cancel')}`} />
				</div>
			</div>
		</>
	);
};

export default AddEditEmailTemplate;
