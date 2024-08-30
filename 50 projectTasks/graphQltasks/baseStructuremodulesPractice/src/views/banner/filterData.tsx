import Button from '@components/button/button';
import Dropdown from '@components/dropdown/Dropdown';
import { Refresh, Search } from '@components/icons';
import TextInput from '@components/input/TextInput';
import { Status_DropDown_select } from '@config/constant';
import { useFormik } from 'formik';
import { t } from 'i18next';
import React, { useEffect } from 'react';
import { BannerProps, InitialValueProps } from 'src/types/banner';
const FilterBannerData = ({ filterBanner }: BannerProps) => {
	/*initial values for filter data*/
	const initialValues: InitialValueProps = {
		bannerTitle: '',
		createdBy: '',
		status: '',
	};
	/*onsubmit*/
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			if (values.status === null) {
				filterBanner({ ...values, status: '' });
			} else {
				filterBanner(values);
			}
		},
	});
	/*form submit handler*/
	const formResetHandler = () => {
		formik.resetForm();
		filterBanner(initialValues);
	};

	//session storage

	useEffect(() => {
		// Retrieve and parse session storage data
		const bannerFilterData = sessionStorage.getItem('bannerFilterData');
		const filteredBannerData = bannerFilterData ? JSON.parse(bannerFilterData) : {};

		// Set form values from session storage or initialValues
		formik.setValues({ ...initialValues, ...filteredBannerData });
	}, []);

	return (
		<React.Fragment>
			<form onSubmit={formik.handleSubmit} className='w-full  md:w-auto p-6  bg-white rounded-sm shadow-lg border border-[#c8ced3] '>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-3 '>
					<div>
						<TextInput placeholder={t('Banner Title') as string} id='bannerTitle' name='bannerTitle' onChange={formik.handleChange} value={formik.values.bannerTitle} />
					</div>
					<div>
						<TextInput placeholder={t('Created by') as string} id='createdBy' name='createdBy' onChange={formik.handleChange} value={formik.values.createdBy} />
					</div>
					<div className=''>
						<Dropdown placeholder={t('Select Status')} name='status' onChange={formik.handleChange} value={formik.values.status as string} options={Status_DropDown_select} id='status' />
					</div>
				</div>

				<div className=' md:col-span-3 mt-3'>
					<div className='flex  items-start justify-end col-span-3 btn-group '>
						<Button className='btn-primary btn-normal ' type='submit' label={t('Search')}>
							<Search className='mr-2' />
						</Button>
						<Button className='btn-warning btn-normal' onClick={formResetHandler} label={t('Reset')}>
							<Refresh className='mr-2' />
						</Button>
					</div>
				</div>
			</form>
		</React.Fragment>
	);
};
export default FilterBannerData;
