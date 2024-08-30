import Button from '@components/button/button';
import TextInput from '@components/textInput/TextInput';
import { useFormik } from 'formik';
import React, { useCallback, useEffect, useState } from 'react';
import { EventProps, FilterDataArr, FilterEventProps } from 'src/types/event';
import { useTranslation } from 'react-i18next';
import { DropdownOptionType } from 'src/types/component';
import { useQuery } from '@apollo/client';
import { GET_DROPDOWNFILTER_DATA } from '@framework/graphql/queries/event';
import { Refresh, Search } from '@components/icons/icons';
import Dropdown from '@components/dropdown/dropDown';
import { getDateFormat } from '@utils/helpers';
import { DATE_FORMAT } from '@config/constant';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.css';
const FilterEvents = ({ onSearchEvent,clearSelectionEvents }: EventProps) => {
	const { t } = useTranslation();
	const { data } = useQuery(GET_DROPDOWNFILTER_DATA);
	const [createdByData, setCreatedBy] = useState<DropdownOptionType[]>([]);
	const initialValues: FilterEventProps = {
		eventName: '',
		startDate: '',
		endDate: '',
		createdBy: 1,
	};
	const [datesEvent, setDatesEvent] = useState<Date[]>([]);
	/**
	 * Method used for set rol dropdown array
	 */
	useEffect(() => {
		if (data?.fetchEvents) {
			const tempDataArr = [] as DropdownOptionType[];
			data?.fetchEvents?.data?.FetchEventData?.map((data: FilterDataArr) => {
				tempDataArr.push({ name: data.User.user_name, key: data.created_By });
			});
			setCreatedBy(tempDataArr);
		}
	}, [data]);

	const formik = useFormik({
		initialValues,
		onSubmit: (values) => {
			clearSelectionEvents()
			if (datesEvent.length === 2) {
				onSearchEvent({ ...values, startDate: getDateFormat(datesEvent[0]?.toString(), DATE_FORMAT.simpleDateFormat), endDate: getDateFormat(datesEvent[1]?.toString(), DATE_FORMAT.simpleDateFormat) });
			} else {
				onSearchEvent(values);
			}
		},
	});
	/**
	 *  reset the input fileds of filter
	 */
	const onReset = useCallback(() => {
		formik.resetForm();
		setDatesEvent([]);
		onSearchEvent(initialValues);
	}, []);
	const OnChangeEvent = useCallback(
		(e: CalendarChangeEvent) => {
			setDatesEvent(e.value as Date[]);
		},
		[setDatesEvent]
	);

	return (
		<React.Fragment>
			<form className='w-full  lg:h-[10vh] bg-white shadow-lg rounded-sm p-6 mb-5 border border-[#c8ced3]' onSubmit={formik.handleSubmit}>
				<div className=' grid grid-cols-1 lg:grid-cols-4  gap-4'>
					<div>
						<TextInput placeholder={t('Event Name')} name='eventName' type='text' onChange={formik.handleChange} value={formik.values.eventName} />
					</div>
					<div>
						<Calendar placeholder={`${t('Event Start')}  ${t('To')} ${t('End Date')}`} value={datesEvent} numberOfMonths={2} onChange={OnChangeEvent} selectionMode='range' />
					</div>

					<div>
						<Dropdown placeholder={t('Created By')} name='role' onChange={formik.handleChange} value={formik.values.createdBy} options={createdByData} id='role' />
					</div>
					<div>
						<div className=' btn-group col-span-3  flex items-start justify-end  '>
							<Button className='btn-primary btn-normal' type='submit' label={t('Search')} title={`${t('Search')}`} >
								<Search />
							</Button>
							<Button className='btn-warning btn-normal' onClick={onReset} label={t('Reset')}  title={`${t('Reset')}`}>
								<Refresh />
							</Button>
						</div>
					</div>
				</div>
			</form>
		</React.Fragment>
	);
};
export default FilterEvents;
