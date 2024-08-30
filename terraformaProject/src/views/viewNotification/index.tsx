import { useQuery } from '@apollo/client';
import Button from '@components/button/button';
import { ArrowSmallLeft, Bell } from '@components/icons/icons';
import { ROUTES } from '@config/constant';
import { GET_NOTIFICATION_BY_ID } from '@framework/graphql/queries/notifications';
import { getDateTimeFromTimestamp } from '@utils/helpers';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const NotificationDetails = () => {
	const { t } = useTranslation();
	const notificationId = useParams();
	const navigate = useNavigate();
	const { data, refetch } = useQuery(GET_NOTIFICATION_BY_ID);
	/**
	 * IF WE GET ID BASED ON THAT WE WILL GET EVENT DATA
	 */
	useEffect(() => {
		if (notificationId.id) {
			refetch({ getNotificationTemplateId: parseInt(notificationId.id) }).catch((err) => toast.error(err));
		}
	}, [notificationId.id]);
	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.notifications}/list`);
	}, []);
	return (
		<div className='w-full items-center justify-center border-spacing-1 border border-[#c8ced3] bg-white rounded-sm '>
			<div className='flex justify-between border-b border-[#c8ced3] bg-[#f0f3f5] px-5 py-3'>
				<div className='flex items-center'>
					<Bell className='mr-1' fontSize='12px' /> {t('Notification')}
				</div>
				<Button className='btn-primary btn-normal' label={t('Back')} onClick={onCancel} title={`${t('Back')}`} >
					<ArrowSmallLeft />
				</Button>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 m-4'>
				<div className='flex pb-2'>
					<p className='mr-3 font-bold'>{t('Template')} : </p>
					<p>{data?.getNotificationTemplate?.data?.template}</p>
				</div>
				<div className='flex pb-2'>
					<p className='mr-3 font-bold'>{t('Status')} :</p>
					<p> {data?.getNotificationTemplate?.data?.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>InActive</span>}</p>
				</div>
				<div className='flex pb-2'>
					<p className='mr-3 font-bold'>{t('Created At')} : </p>
					<p>{getDateTimeFromTimestamp(data?.getNotificationTemplate?.data?.created_at)}</p>
				</div>
				<div className='flex  pb-2'>
					<p className='mr-3 font-bold'>{t('Updated At')} :</p>
					<p>{getDateTimeFromTimestamp(data?.getNotificationTemplate?.data?.updated_at)}</p>
				</div>
			</div>
		</div>
	);
};
export default NotificationDetails;
