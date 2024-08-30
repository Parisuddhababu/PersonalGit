import React, { useCallback, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import Button from '@components/button/button';
import { useNavigate } from 'react-router-dom';
import RadioButtonNew from '@components/radiobutton/radioButtonNew';
import UpdatedHeader from '@components/header/updatedHeader';
import { useMutation, useQuery } from '@apollo/client';
import { GET_TEMPLATES_WITH_FILTER, GET_TEMPLATES_WITH_ID, GET_USERS_FOR_ANNOUNCEMENT_PAGINATION } from '@framework/graphql/queries/emailTemplates';
import DropDown from '@components/dropdown/dropDown';
import { DropdownOptionType } from '@types';
import { STRIP_HTML_TAGS, TEMPLATE_TYPE_RADIO } from '@config/constant';
import { ListBox } from 'primereact/listbox';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css'; // core css
import { StateDataArr } from '@framework/graphql/graphql';
import { GET_ACTIVE_ROLES_DATA } from '@framework/graphql/queries/role';
import { SEND_ANNOUNCEMENT } from '@framework/graphql/mutations/emailTemplates';
import { toast } from 'react-toastify';
import { Loader } from '@components/icons';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
interface EmailDataById {
	description: string,
	template_id?: string,
	notification_type?: string,
	template_for?: string,
	selectedTemplatesFor?: [],
	title?: string,
}

const SendAnnouncement = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [templateDrpData, setTemplateDrpData] = useState<DropdownOptionType[]>([]);
	const { data, loading } = useQuery(GET_TEMPLATES_WITH_FILTER, { variables: { sortOrder: 'DESC', sortField: 'createdAt', limit: 1000, page: 1, search: '' } });
	const [templatesTypes, setTemplatesTypes] = useState<DropdownOptionType[]>([]);
	const [sendAnnouncement, sendAnnouncementLoading] = useMutation(SEND_ANNOUNCEMENT);

	const initialValues: EmailDataById = {
		description: '',
		template_id: '',
		notification_type: 'Email',
		template_for: '',
		selectedTemplatesFor: [],
		title: '',
	}

	const formik = useFormik({
		initialValues,
		// validationSchema: createUpdateEmailSchema,
		onSubmit: (values) => {
			const arrayOfSelectedTemplates = values?.selectedTemplatesFor?.map((obj: { code: string }) => obj.code);
			sendAnnouncement({
				variables: {
					announcementData: {
						title: values?.title,
						description: values?.description,
						template_id: values?.template_id,
						notification_type: values?.notification_type,
						user_type: values?.template_for,
						role_ids: formik?.values?.template_for === 'Role' ? arrayOfSelectedTemplates : [],
						user_ids: formik?.values?.template_for === 'User' ? arrayOfSelectedTemplates : []
					}
				}
			}).then((res) => {
				const data = res.data.sendAnnouncements
				toast.success(data?.message);
				formik.resetForm();
			})
				.catch((err) => {
					toast.error(err?.networkError?.result?.errors?.[0]?.message);
				});
		},
	})

	const { data: getTemplatesWithIdData, loading: getTemplatesWithIdDataLoading } = useQuery(GET_TEMPLATES_WITH_ID, { variables: { getTemplateByIdId: formik.values.template_id }, skip: !formik?.values?.template_id });
	const { data: getRolesData, loading: rolesLoading } = useQuery(GET_ACTIVE_ROLES_DATA, { variables: { limit: 1000, page: 1, search: '', sortOrder: 'descend', sortField: 'createdAt' }, skip: formik?.values?.template_for !== 'Role' });
	const { data: getUsersData, loading: usersLoading } = useQuery(GET_USERS_FOR_ANNOUNCEMENT_PAGINATION, { variables: { limit: 1000, page: 1, search: '', sortOrder: 'descend', sortField: 'createdAt', userType: [3, 4, 5, 6, 7] }, skip: formik?.values?.template_for !== 'User' });

	useEffect(() => {
		const tempDataArr = [] as DropdownOptionType[];
		data?.getTemplatesWithFilterAndPagination?.data?.templates?.map((data: { title: string, uuid: string }) => {
			tempDataArr.push({ name: data?.title, key: data?.uuid });
		});
		setTemplateDrpData(tempDataArr);
	}, [data]);

	const SelectTemplateFor = [
		{
			name: 'Users', key: 'User'
		},
		{
			name: 'Roles', key: 'Role'
		},
	]

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const handleQuillChangeAnnouncement = (e: any) => {
		const htmlValue = e || '';
		if (htmlValue === '') {
			formik.setFieldValue('description', '');
			formik.setFieldError('description', '');
		} else {
			formik.setFieldValue('description', htmlValue);
			formik.setFieldTouched('description', true);
			formik.setFieldError('description', '');
		}
	};

	const handleBlur = useCallback(() => {
		const currentDescription = formik?.values?.description;
		const onlyCharData = STRIP_HTML_TAGS(currentDescription);
		const containsOnlySpaces = /^ *$/.test(onlyCharData);
		if (containsOnlySpaces) {
			formik.setFieldValue('courseDescription', '');
		} else {
			formik.setFieldValue('courseDescription', currentDescription);
		}
	}, [formik.values.description]);

	const modules = {
		toolbar: [
			[{ 'header': [1, 2, false] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
			['link'],
			['clean']
		],
	}

	const formats = [
		'header',
		'bold', 'italic', 'underline', 'strike', 'blockquote',
		'list', 'bullet', 'indent',
		'link', 'image'
	]

	const onCancelCms = useCallback(() => {
		navigate(-1)
	}, []);

	useEffect(() => {
		const tempDataArr = [] as DropdownOptionType[];
		getRolesData?.getActiveRoles?.data?.role?.map((data: StateDataArr) => {
			tempDataArr.push({ name: data?.name, code: data?.uuid });
		});
		setTemplatesTypes(tempDataArr);
	}, [getRolesData])

	useEffect(() => {
		const tempDataArr = [] as DropdownOptionType[];
		getUsersData?.getUsersForAnnouncementPagination?.data?.users?.map((data: { first_name: string, uuid: string }) => {
			tempDataArr.push({ name: data?.first_name, code: data?.uuid });
		});
		setTemplatesTypes(tempDataArr);
	}, [getUsersData])

	useEffect(() => {
		if (getTemplatesWithIdData?.getTemplateById?.data?.description) {
			formik.setFieldValue(
				'description', getTemplatesWithIdData?.getTemplateById?.data?.description,
			);
			formik.setFieldValue(
				'title', getTemplatesWithIdData?.getTemplateById?.data?.title,
			);
		}
	}, [getTemplatesWithIdData?.getTemplateById?.data])

	const contractorLocation = (option: { name: string }) => {
		return (
			<div className="flex align-items-center">
				<div>{option.name}</div>
			</div>
		);
	};

	return (
		<>
			<UpdatedHeader headerTitle='Send Announcement' />
			{(loading || getTemplatesWithIdDataLoading || rolesLoading || usersLoading || sendAnnouncementLoading?.loading) && <Loader />}
			<div className='w-[calc(100%-40px)] md:w-[calc(100%-56px)]'>
				<form className='border border-solid border-border-primary rounded-xl '>
					<div className='p-3 rounded-xl md:p-5'>
						<h6 className='leading-[30px] mb-3 md:mb-5'>{t('Announcement')}</h6>
						<div className='flex flex-col gap-3'>
							<div className="w-full lg:w-[calc(50%-10px)]">
								<DropDown placeholder={'Select template'} className='w-full' label={t('Select template')} onChange={formik.handleChange} name='template_id' value={formik.values.template_id} error={formik.errors.template_id && formik.touched.template_id ? formik.errors.template_id : ''} options={templateDrpData} id='template_id' required={true} />
							</div>

							<div>
								<RadioButtonNew required={true} checked={formik.values.notification_type} onChange={formik.handleChange} name={'notification_type'} id='notification_type' radioOptions={TEMPLATE_TYPE_RADIO} label={t('Template Type')} />
							</div>

							<div className='mb-2'>
								<div className='mb-2'>
									<label>
										{t('Description')} {t('English')} <span className='text-red-700'>*</span>
									</label>
								</div>
								<ReactQuill
									value={formik.values.description}
									modules={modules}
									formats={formats}
									onBlur={() => handleBlur()}
									onChange={(e) => handleQuillChangeAnnouncement(e)} />
								<p className='error'>{formik.errors.description && formik.touched.description && formik.errors.description}</p>
							</div>

							<div className="w-full lg:w-[calc(50%-10px)]">
								<DropDown placeholder={'Select Template For'} className='w-full' label={t('Select Template For')} onChange={formik.handleChange} name='template_for' value={formik.values.template_for} error={formik.errors.template_for && formik.touched.template_for ? formik.errors.template_for : ''} options={SelectTemplateFor} id='template_for' required={true} />
							</div>

							{formik?.values?.template_for && <div className='mb-2'>
								<label>
									{t('Template For')}<span className='text-red-700'>*</span>
								</label>
								{formik?.values?.template_for !== 'Role' && <div className="w-full lg:w-[calc(50%-10px)]">
									<MultiSelect
										value={formik.values.selectedTemplatesFor}
										options={templatesTypes}
										onChange={(e: MultiSelectChangeEvent) => { formik.setFieldValue('selectedTemplatesFor', e.value) }}
										optionLabel="name"
										placeholder="Users List"
										itemTemplate={contractorLocation}
										className='w-full md:w-20rem sendAnnouncement'
										display="chip" />
								</div>}
								{formik?.values?.template_for === 'Role' && <div className='max-h-[93px] md:max-h-[130px] overflow-auto'>
									<ListBox multiple value={formik.values.selectedTemplatesFor} onChange={(e) => { formik.setFieldValue('selectedTemplatesFor', e.value) }} id="selectedTemplatesFor" name="selectedTemplatesFor" options={templatesTypes} optionLabel="name" className="w-full md:w-14rem" />
								</div>}
							</div>}

						</div>
					</div>
				</form>
				<div className='flex items-start justify-start gap-[22px] col-span-3 btn-group py-[30px]'>
					<Button className='btn-primary btn-normal w-[200px]' type='button' label={t('Send Announcement')} onClick={formik.handleSubmit}  title={`${t('Send Announcement')}`} />
					<Button className='btn-secondary btn-normal w-[166px]' label={t('Cancel')} onClick={onCancelCms}  title={`${t('Cancel')}`} />
				</div>
			</div>
		</>
	);
};

export default SendAnnouncement;
