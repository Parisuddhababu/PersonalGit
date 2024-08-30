import Button from '@components/button/button';
import Dropdown from '@components/dropdown/dropDown';
import { Refresh, Search } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import { DATE_FORMAT } from '@config/constant';
import { useFormik } from 'formik';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CouponsManagementProps, FilterCouponsProps } from 'src/types/couponManagement';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { getDateFormat } from '@utils/helpers';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
const FilterCoupon = ({ onSearchCoupon,clearSelectionCoupons }: CouponsManagementProps) => {
	const { t } = useTranslation();
	const initialValues: FilterCouponsProps = {
		couponName: '',
		startTime: '',
		expireTime: '',
		status: '',
	};
	const [datesCpn, setDatesCpn] = useState<Date[]>([]);
	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionCoupons()
			if (datesCpn.length === 2) {
				onSearchCoupon({ ...values, startTime: getDateFormat(datesCpn[0]?.toString(), DATE_FORMAT.simpleDateFormat), expireTime: getDateFormat(datesCpn[1]?.toString(), DATE_FORMAT.simpleDateFormat) });
			} else {
				onSearchCoupon(values);
			}
		},
	});

	const onReset = useCallback(() => {
		formik.resetForm();
		setDatesCpn([]);
		onSearchCoupon(initialValues);
	}, []);
	const OnChange = useCallback(
		(e: CalendarChangeEvent) => {
			setDatesCpn(e.value as Date[]);
		},
		[setDatesCpn]
	);
	return (
		<React.Fragment>
			<form className='w-full md:w-auto md:h-[15vh] bg-white shadow-lg rounded-sm p-6 mb-5   border border-[#c8ced3]' onSubmit={formik.handleSubmit}>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4 '>
					<div>
						<TextInput placeholder={t('Offer Name')} name='couponName' type='text' onChange={formik.handleChange} value={formik.values.couponName} />
					</div>
					<div>
						<Calendar placeholder={`${t('Offer Start')}  ${t('To')} ${t('End Date')}`} value={datesCpn} numberOfMonths={2} onChange={OnChange} selectionMode='range' />
					</div>

					<div>
						<Dropdown
							placeholder={t('Select Status')}
							name='status'
							onChange={formik.handleChange}
							value={formik.values.status}
							options={[
								{ name: 'Active', key: '1' },
								{ name: 'Inactive', key: '0' },
							]}
							id='status'
						/>
					</div>
					<div className=' md:col-span-3 '>
						<div className='btn-group col-span-3 flex items-start justify-end '>
							<Button className='btn-primary btn-normal ' type='submit' label={t('Search')} title={`${t('Search')}`} >
								<Search />
							</Button>
							<Button className='btn-warning btn-normal' onClick={onReset} label={t('Reset')} title={`${t('Reset')}`} >
								<Refresh />
							</Button>
						</div>
					</div>
				</div>
			</form>
		</React.Fragment>
	);
};
export default FilterCoupon;
