import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import UpdatedHeader from '@components/header/updatedHeader';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ANNOUNCEMENT_BY_ID } from '@framework/graphql/queries/announcement';
import { DateTime12Format, DateYearFormat } from '@config/constant';
import Loader from '@components/common/loader';
import { UPDATE_READ_ANNOUNCEMENTS_FOR_USER } from '@framework/graphql/mutations/announcement';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setReadAnnouncement } from 'src/redux/user-profile-slice';


const Index = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data, loading } = useQuery(GET_ANNOUNCEMENT_BY_ID, { variables: { announcementId: id }, skip: !id });
  const [readAnnouncementForUser, readAnnouncementLoading] = useMutation(UPDATE_READ_ANNOUNCEMENTS_FOR_USER);

  useEffect(() => {
    readAnnouncementForUser().then((res) => {
			const data = res?.data?.updateReadAnnouncementsForUser
			toast.success(data?.message);
      dispatch(setReadAnnouncement(true));
		})
			.catch((err) => {
				toast.error(err?.networkError?.result?.errors?.[0]?.message);
			});
  }, [])

  return (
    <>
      {(loading || readAnnouncementLoading?.loading) && <Loader />}
      <UpdatedHeader headerTitle='System Alerts' />
      <div className='overflow-hidden md:h-[calc(100%-141px)] border border-solid h-[calc(100%-118px)] rounded-xl border-border-primary'>
        <div className='flex flex-col h-full p-3 overflow-auto md:p-5'>
          <div className='flex flex-wrap items-center justify-between mb-5'>
            <h6>{t('System Alerts')}</h6>
            <div className='flex flex-wrap max-xmd:w-full max-xmd:mt-4'>
              <p>{t('Time')}: <span className='font-bold'>{DateTime12Format(data?.getAnnouncementById?.data?.createdAt)}</span></p>
              <p className='ml-7 xmd:ml-12'>{t('Date')}: <span className='font-bold'>{DateYearFormat(data?.getAnnouncementById?.data?.createdAt)}</span></p>
            </div>
          </div>
          <div>
            <p className='mb-2.5'>{data?.getAnnouncementById?.data?.title}</p>
            <p dangerouslySetInnerHTML={{ __html: data?.getAnnouncementById?.data?.description }}></p>
          </div>
        </div>
      </div>
    </>
  );
};
export default Index;
