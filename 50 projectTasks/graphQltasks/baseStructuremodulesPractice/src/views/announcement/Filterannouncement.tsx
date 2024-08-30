import React, { useCallback, useEffect, useState } from 'react';
import TextInput from '@components/input/TextInput';
import Dropdown from '@components/dropdown/Dropdown';
import { useFormik } from 'formik';
import { AnnouncementProps, FilterAnnouncementProps } from 'src/types/announcement';
import { AnnouncementAddType, AnnouncementPlatform, DATE_FORMAT, Status_Announcement_Drp_select } from '@config/constant';
import { Refresh, Search } from '@components/icons';
import { t } from 'i18next';
import Button from '@components/button/button';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
import { getDateFromat } from '@utils/helpers';

const FilterAnnouncement = ({ onSearchAnnouncement }: AnnouncementProps) => {
	/*initial values for filtered data */
	const initialValues: FilterAnnouncementProps = {
		title: '',
		annoucemntType: '',
		platform: '',
		startDate: '',
		endDate: '',
		created_at: '',
		status: '',
	};

	const [dates, setDates] = useState<Date[]>([]);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			if (dates.length === 2) {
				onSearchAnnouncement({ ...values, startDate: getDateFromat(dates[0]?.toString(), DATE_FORMAT.simpleDateFormat), endDate: getDateFromat(dates[1]?.toString(), DATE_FORMAT.simpleDateFormat) });
			} else {
				onSearchAnnouncement(values);
			}
		},
	});

	const OnChangeAnnouncement = useCallback(
		(e: CalendarChangeEvent) => {
			setDates(e.value as Date[]);
		},
		[setDates]
	);

	//to reset form
	function onReset() {
		formik.resetForm();
		onSearchAnnouncement(initialValues);
	}
	useEffect(() => {
		formik.setFieldValue('startDate', getDateFromat(dates[0]?.toString(), DATE_FORMAT.simpleDateFormat));
		formik.setFieldValue('endDate', getDateFromat(dates[1]?.toString(), DATE_FORMAT.simpleDateFormat));
	}, [dates[0], dates[1]]);

	//session storage

	useEffect(() => {
		const savedFormValues = JSON.parse(sessionStorage.getItem('announcemntFilterData') || '{}');
		formik.setValues({ ...initialValues, ...savedFormValues });
	}, []);

	return (
		<React.Fragment>
			<form onSubmit={formik.handleSubmit} className=' bg-white shadow-md rounded-sm p-6 border border-[#c8ced3] '>
				<div className='grid grid-cols-1 md:grid-cols-3 l:grid-cols-4 gap-4'>
					<div className=' col-span-1'>
						<TextInput placeholder={t('Title') as string} name='title' type='text' onChange={formik.handleChange} value={formik.values.title} />
					</div>
					<div>
						<Calendar placeholder={`${formik.values.startDate || formik.values.endDate ? `${formik.values.startDate} To ${formik.values.endDate}` : `${t('Created_At')}`}`} value={dates} numberOfMonths={1} onChange={OnChangeAnnouncement} selectionMode='range' />
					</div>
					<div className='col-span-1'>
						<Dropdown placeholder={t('Select Type')} name='annoucemntType' onChange={formik.handleChange} value={formik.values.annoucemntType} options={AnnouncementAddType} id='annoucemntType' />
					</div>
					<div className='col-span-1'>
						<Dropdown placeholder={t('Select Platform')} name='platform' onChange={formik.handleChange} value={formik.values.platform} options={AnnouncementPlatform} id='platform' />
					</div>
					<div className=''>
						<Dropdown placeholder={'select status'} name='status' onChange={formik.handleChange} value={formik.values.status as string} options={Status_Announcement_Drp_select} id='status' />
					</div>
					<div className='flex  justify-end btn-group  '>
						<Button className='btn-primary btn-normal ' type='submit' label={t('Search')}>
							<Search className='mr-2' />
						</Button>
						<Button className='btn-warning btn-normal' onClick={onReset} label={t('Reset')}>
							<Refresh className='mr-2' />
						</Button>
					</div>
				</div>
			</form>
		</React.Fragment>
	);
};
export default FilterAnnouncement;