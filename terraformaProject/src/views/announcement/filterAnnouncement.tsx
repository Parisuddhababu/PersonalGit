import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AnnouncementAddType, AnnouncementPlatform, DATE_FORMAT } from '@config/constant';
import Button from '@components/button/button';
import { Reset, Search } from '@components/icons/icons';
import TextInput from '@components/textInput/TextInput';
import DropDown from '@components/dropdown/dropDown';
import { useFormik } from 'formik';
import { AnnouncementProps, FilterAnnouncementProps } from 'src/types/announcement';
import { getDateFormat } from '@utils/helpers';

import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';

const FilterAnnouncement = ({ onSearchAnnouncement }: AnnouncementProps) => {
	const { t } = useTranslation();
	const initialValues: FilterAnnouncementProps = {
		title: '',
		startDate: '',
		endDate: '',
		announcementType: '',
		platform: '',
	};
	const [dates, setDates] = useState<Date[]>([]);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			if (dates.length === 2) {
				onSearchAnnouncement({ ...values, startDate: getDateFormat(dates[0]?.toString(), DATE_FORMAT.simpleDateFormat), endDate: getDateFormat(dates[1]?.toString(), DATE_FORMAT.simpleDateFormat) });
			} else {
				onSearchAnnouncement(values);
			}
		},
	});

	const onResetAnnouncement = useCallback(() => {
		formik.resetForm();
		setDates([]);
		onSearchAnnouncement(initialValues);
	}, []);
	const OnChangeAnnouncement = useCallback(
		(e: CalendarChangeEvent) => {
			setDates(e.value as Date[]);
		},
		[setDates]
	);

	return (
		<React.Fragment>
			<form className=' w-full bg-white shadow-md rounded-sm p-6 mb-5 border border-[#c8ced3]' onSubmit={formik.handleSubmit}>
				<div className='grid grid-cols-1 md:grid-cols-3 l:grid-cols-4 gap-4'>
					<div className=' col-span-1'>
						<TextInput placeholder={t('Title')} name='title' type='text' onChange={formik.handleChange} value={formik.values.title} />
					</div>
					<div>
						<Calendar placeholder={`${t('Created At')} `} value={dates} numberOfMonths={2} onChange={OnChangeAnnouncement} selectionMode='range' />
					</div>

					<div className='col-span-1'>
						<DropDown placeholder={t('Select Type')} name='announcementType' onChange={formik.handleChange} value={formik.values.announcementType} options={AnnouncementAddType} id='announcementType' />
					</div>

					<div className='col-span-1'>
						<DropDown placeholder={t('Select Platform')} name='platform' onChange={formik.handleChange} value={formik.values.platform} options={AnnouncementPlatform} id='platform' />
					</div>
					<div className='col-span-1 md:col-span-2'>
						<div className='btn-group flex items-baseline  justify-end '>
							<Button type='submit' label={''} className='btn-primary btn-normal  hover:bg-red-800 flex space-x-8 mr-5' 
							title={`${t('Search')}`}>
								<Search /> {t('Search')}
							</Button>
							<Button onClick={onResetAnnouncement} label={''} className='btn-warning btn-normal  hover:bg-yellow-800' 
							title={`${t('Reset')}`}>
								<Reset />
								{t('Reset')}
							</Button>
						</div>
					</div>
				</div>
			</form>
		</React.Fragment>
	);
};
export default FilterAnnouncement;
