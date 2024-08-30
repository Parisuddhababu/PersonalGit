import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { ArrowSmallLeft, Calendar } from '@components/icons/icons';
import { ROUTES } from '@config/constant';
import { VIEW_EVENT } from '@framework/graphql/queries/event';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ViewEvent = () => {
	const { t } = useTranslation();
	const { data, refetch } = useQuery(VIEW_EVENT);
	const EventId = useParams();
	const navigate = useNavigate();
	/**
	 * IF WE GET ID BASED ON THAT WE WILL GET EVENT DATA
	 */
	useEffect(() => {
		if (EventId.id) {
			refetch({ fetchEventId: parseInt(EventId.id) }).catch((err) => toast.error(err));
		}
	}, [EventId.id]);
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.event}/list`);
	}, []);
	return (
		<div className='w-full items-center justify-center border-spacing-1 border border-[#c8ced3] bg-white rounded-sm '>
			<div className='flex justify-between border-b border-[#c8ced3] bg-[#f0f3f5] py-3 px-5'>
				<div className='flex items-center '>
					<Calendar className='mr-2' fontSize='12px' />
					{t('Event List')}
				</div>
				<Button className='btn-primary btn-normal' label={t('Back')} onClick={onCancel}  title={`${t('Back')}`} >
					<ArrowSmallLeft className='mr-1' />
				</Button>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 m-4'>
				<div className='flex pb-2'>
					<p className='mr-3 font-bold'>{t('Event Name')} :</p>
					<p className='px-3'>xcdfdfdf{data?.fetchEvent?.data?.event_name}</p>
				</div>
				<div className='flex  pb-2 '>
					<p className='mr-3 font-bold'>{t('Description')} : </p>
					<p className='px-3'>{data?.fetchEvent?.data?.description}</p>
				</div>
				<div className='flex  pb-2 '>
					<p className='mr-3 font-bold'>{t('Email')} :</p>
					<p className='px-3'> {data?.fetchEvent?.data?.email}</p>
				</div>
				<div className='flex  pb-2 '>
					<p className='mr-3 font-bold'>{t('Reccurance')} : </p>
					<p className='px-3'>{data?.fetchEvent?.data?.is_reccuring}</p>
				</div>
				<div className='flex  pb-2 '>
					<p className='mr-3 font-bold'>{t('Start Date')} :</p>
					<p className='px-3'> {data?.fetchEvent?.data?.start_date}</p>
				</div>
				<div className='flex  pb-2  '>
					<p className='mr-3 font-bold'>{t('End Date')} :</p>
					<p className='px-3'> {data?.fetchEvent?.data?.end_date}</p>
				</div>
			</div>
		</div>
	);
};
export default ViewEvent;
