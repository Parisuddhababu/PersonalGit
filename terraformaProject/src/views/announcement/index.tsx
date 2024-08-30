import UpdatedHeader from '@components/header/updatedHeader';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DateTime12Format, DateYearFormat, ROUTES } from '@config/constant';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ANNOUNCEMENTS_FOR_USERS } from '@framework/graphql/queries/announcement';
import { UPDATE_READ_ANNOUNCEMENTS_FOR_USER } from '@framework/graphql/mutations/announcement';
import Loader from '@components/common/loader';

const Announcement = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [readAnnouncementForUser] = useMutation(UPDATE_READ_ANNOUNCEMENTS_FOR_USER);
	const { data, loading } = useQuery(GET_ANNOUNCEMENTS_FOR_USERS);

	const sysAlert = useCallback((id: string) => {
		navigate(`/${ROUTES.app}/${ROUTES.ticketsList}/system-alert/${id}`)
	}, [])

	useEffect(() => {
		readAnnouncementForUser();			
	}, [])

	return (
		<>
			{loading && <Loader />}
			<UpdatedHeader headerTitle='Announcements' />
			<div className='mb-5 overflow-auto border border-solid rounded-t-xl border-border-primary md:mb-7'>
				<table className='m-0 [&>tbody>tr:nth-child(even)]:bg-white [&>tbody>tr:nth-child(even):hover]:bg-gray-200 text-sm md:text-base leading-5 normal-table'>
					<thead className='text-lg md:text-xl'>
						<tr className='border-none bg-accents-2'>
							<th className='p-4 md:p-5 text-baseColor min-w-[115px] 2xl:min-w-[156px]'>{t('Time')}</th>
							<th className='p-4 md:p-5 text-baseColor min-w-[145px] 2xl:min-w-[164px]'>{t('Date')}</th>
							<th className='p-4 md:p-5 text-baseColor min-w-[566px]'>{t('Announcement')}</th>
						</tr>
					</thead>
					{data?.getAnnouncementsForUser?.data?.count > 0 && <tbody className='text-baseColor'>
						{data?.getAnnouncementsForUser?.data?.announcements?.map((announcementData: { uuid: string, createdAt: string, title: string, description: string }) => {
							return (
								<tr className='border-b border-solid border-border-primary last:border-none hover:cursor-pointer' onClick={() => sysAlert(announcementData?.uuid)} key={announcementData?.uuid}>
									<td className='px-4 py-3 text-left md:p-5'>
										<p>{DateTime12Format(announcementData?.createdAt)}</p>
									</td>
									<td className='px-4 py-3 text-left md:p-5'>
										<p>{DateYearFormat(announcementData?.createdAt)}</p>
									</td>
									<td className="px-4 py-3 md:p-5">
										<div className='text-left'>
											<strong className='block mb-1'>{t(announcementData?.title)}</strong>
											<p dangerouslySetInnerHTML={{ __html: announcementData?.description }}></p>
										</div>
									</td>
								</tr>
							)
						})}
					</tbody>}
				</table>
				{data?.getAnnouncementsForUser?.data?.count === 0 &&
					<p className='p-5 flex items-center justify-center w-full'>No data found...!</p>
				}
			</div>
		</>

	);
};
export default Announcement;
