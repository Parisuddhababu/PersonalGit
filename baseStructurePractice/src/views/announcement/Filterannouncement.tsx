import React, { useCallback, useEffect, useState } from 'react';
import TextInput from '@components/input/TextInput';
import Dropdown from '@components/dropdown/Dropdown';
import { useFormik } from 'formik';
import { AnnouncementProps, FilterAnnouncementProps } from 'src/types/announcement';
import { AnnouncementAddType, AnnouncementPlatform, Status_Announcement_Drp_select, Status_DropDown_select } from '@config/constant';
import { DateRange, RangeKeyDict } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Calendar, Refresh, Search } from '@components/icons';
import { t } from 'i18next';
import Button from '@components/button/button';

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
	//for range picker start date & end date
	const [dateRange, setDateRange] = useState<{
		startDate: Date;
		endDate: Date;
		key: string;
	}>({
		startDate: new Date(),
		endDate: new Date(),
		key: 'selection',
	});
	//convert date into string form
	const convert = (date1: Date) => {
		const date = new Date(`${date1}`),
			mnth = ('0' + (date.getMonth() + 1)).slice(-2),
			day = ('0' + date.getDate()).slice(-2);
		return [date.getFullYear(), mnth, day].join('-');
	};

	const [showDateRangePicker, setShowDateRangePicker] = useState(false);
	const handleSelect = (ranges: {
		selection: React.SetStateAction<{
			startDate: Date;
			endDate: Date;
			key: string;
		}>;
	}) => {
		setDateRange(ranges.selection);
	};
	const toggleDateRangePicker = useCallback(() => {
		setShowDateRangePicker((showDateRangePicker) => !showDateRangePicker);
	}, []);

	/*submit handler*/

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			onSearchAnnouncement(values);
		},
	});
	//to reset form
	function onReset() {
		formik.resetForm();
		onSearchAnnouncement(initialValues);
	}
	//set start & end date values
	useEffect(() => {
		formik.setFieldValue('startDate', convert(dateRange.startDate));
		formik.setFieldValue('endDate', convert(dateRange.endDate));
	}, [dateRange.startDate, dateRange.endDate]);

	//session storage

	useEffect(() => {
		const savedFormValues = JSON.parse(sessionStorage.getItem('announcemntFilterData') || '{}');
		formik.setValues({ ...initialValues, ...savedFormValues });
	}, []);
	return (
		<React.Fragment>
			<form onSubmit={formik.handleSubmit} className=' w-full bg-white shadow-md rounded-sm p-6 mb-5 border border-[#c8ced3]'>
				<div className='grid grid-cols-1 md:grid-cols-3 l:grid-cols-4 gap-4'>
					<div className=' col-span-1'>
						<TextInput placeholder={t('Title') as string} name='title' type='text' onChange={formik.handleChange} value={formik.values.title} />
					</div>
					<div>
						<div onClick={toggleDateRangePicker} className='flex border border-1 border-gray-300  p-2 justify-between rounded-sm cursor-pointer '>
							<p className='mr-1 md:mr-0 md:text-xs text-[#9ca3af]' onClick={toggleDateRangePicker}>
								{t('Created At')}
							</p>
							<Calendar />
						</div>
						{showDateRangePicker && (
							<div className='relative flex-1 flex-col '>
								<DateRange ranges={[dateRange]} onChange={handleSelect as ((ranges: RangeKeyDict) => void) | undefined} months={2} showDateDisplay={false} showPreview={true} direction='horizontal' moveRangeOnFirstSelection={false} rangeColors={['#d41c0f']} color='#FF0000' />
							</div>
						)}
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
