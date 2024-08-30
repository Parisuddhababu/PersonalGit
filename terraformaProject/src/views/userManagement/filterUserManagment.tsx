import React, { useCallback } from 'react';
import { useFormik } from 'formik';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import Dropdown from '@components/dropdown/dropDown';
import { GENDER_DRP, STATUS_DRP } from '@config/constant';
import { FilterUserProps, UserProps } from 'src/types/user';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';

const FilterUserManagement = ({ onSearchUser,clearSelectionUserMng }: UserProps) => {
	const { t } = useTranslation();

	const initialValues: FilterUserProps = {
		firstName: '',
		lastName: '',
		email: '',
		phoneNo: '',
		status: '',
		gender: '',
	};

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionUserMng()
			onSearchUser(values);
		},
	});

	const onReset = useCallback(() => {
		formik.resetForm();
		onSearchUser(initialValues);
	}, []);

	return (
		<React.Fragment>
			<form className='w-full  md:w-auto p-6 mb-5 bg-white rounded-sm shadow-lg border border-[#c8ced3]' onSubmit={formik.handleSubmit}>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3 '>
					<div>
						<TextInput placeholder={t('Full Name')} name='firstName' type='text' onChange={formik.handleChange} value={formik.values.firstName} />
					</div>

					<div>
						<TextInput placeholder={t('Email')} name='email' onChange={formik.handleChange} value={formik.values.email} />
					</div>

					<div>
						<Dropdown placeholder={t('Select Status')} name='status' onChange={formik.handleChange} value={formik.values.status} options={STATUS_DRP} id='status' />
					</div>
					<div>
						<Dropdown placeholder={t('Select Gender')} name='gender' onChange={formik.handleChange} value={formik.values.gender} options={GENDER_DRP} id='gender' />
					</div>
					<div>
						<TextInput placeholder={t('Phone Number')} name='phoneNo' onChange={formik.handleChange} value={formik.values.phoneNo} />
					</div>
					<div>
						<div className='flex items-start justify-end col-span-3 btn-group '>
							<Button className='btn-primary btn-normal  ' type='submit' label={t('Search')} title={`${t('Search')}`} >
								<Search className='mr-2' />
							</Button>
							<Button className='btn-warning btn-normal ' onClick={onReset} label={t('Reset')} title={`${t('Reset')}`} >
								<Refresh className='mr-2' />
							</Button>
						</div>
					</div>
				</div>
			</form>
		</React.Fragment>
	);
};
export default FilterUserManagement;
