import React, { useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '@framework/graphql/queries/user';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ROUTES } from '@config/constant';
import Button from '@components/button/button';
import { ArrowSmallLeft, ProfileIcon } from '@components/icons/icons';
import profile from '@assets/images/default-user-image.png'
const ViewUser = () => {
	const { t } = useTranslation();
	const { data, refetch } = useQuery(GET_USER_BY_ID);
	const UserId = useParams();
	const navigate = useNavigate();

	/**
	 * IF WE GET ID BASED ON THAT WE WILL GET EVENT DATA
	 */
	useEffect(() => {
		if (UserId.id) {
			refetch({ getUserId: parseInt(UserId.id) }).catch((err) => toast.error(err));
		}
	}, [UserId.id]);

	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.user}/list`);
	}, []);


	return (
		<div className='w-full items-center justify-center border-spacing-1 border border-[#c8ced3] bg-white '>
			<div className='flex justify-between border-b border-[#c8ced3] bg-[#f0f3f5] p-2'>
				<div className='flex items-center'>

					<ProfileIcon className='inline-block mr-3 ml-3' /> {t('User Details')}
				</div>
				<Button className='btn-primary btn-normal text-bold' label={t('Back')} onClick={onCancel} title={`${t('Back')}`} >
					<ArrowSmallLeft />
				</Button>
			</div>
			<div className='flex flex-col p-5'>
				<p className='mb-2 font-semibold'>{t('Profile Photo')}</p>
				<img src={data?.getUser?.data?.profile_img} alt={'profile image'} className='w-48 h-48 mr-4 ' onError={({ currentTarget }) => {
					const image = profile
					currentTarget.onerror = null;
					currentTarget.src = image;
				}} />
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 px-5 pb-5 '>
				<div className='flex pb-2'>
					<p className='mr-3 font-semibold flex-1'>{t('Full Name')}</p>
					<p className='px-3 flex-1'>
						{data?.getUser?.data?.first_name} {data?.getUser?.data?.last_name}
					</p>
				</div>

				<div className='flex pb-2'>
					<p className='mr-3 font-semibold flex-1'>{t('Email')}</p>
					<a href={`mailto:${data?.getUser?.data?.email}`} className='px-3 flex-1 font-medium text-primary dark:text-primary hover:underline cursor-pointer'>
						{data?.getUser?.data?.email}
					</a>
				</div>

				<div className='flex pb-2'>
					<p className='mr-3 font-semibold flex-1'>{t('Username')}</p>
					<p className='px-3 flex-1'>{data?.getUser?.data?.user_name}</p>
				</div>

				<div className='flex pb-2'>
					<p className='mr-3 mb-2 font-semibold flex-1'>{t('Phone Number')}</p>
					<p className='px-3 flex-1'>{data?.getUser?.data?.phone_no}</p>
				</div>

				<div className='flex pb-2'>
					<p className='mr-3 mb-2 font-semibold flex-1'>{t('Date of Birth')}</p>
					<p className='px-3 flex-1'>{data?.getUser?.data?.date_of_birth.split('T')[0]}</p>
				</div>

				<div className='flex pb-2'>
					<p className='mr-3 font-semibold flex-1'>{t('Gender')}</p>
					<p className='px-3 flex-1'>
						{data?.getUser?.data?.gender === 1 && t('male')} {data?.getUser?.data?.gender === 2 && t('female')}
						{data?.getUser?.data?.gender === 3 && t('others')}
					</p>
				</div>

				<div className='flex pb-2'>
					<p className='mr-3 font-semibold flex-1'>{t('Status')}</p>
					<p className='px-3 flex-1'>{data?.getUser?.data?.status === 1 ? <span className='badge badge-success rounded'>Active</span> : <span className='badge badge-danger rounded'>Inactive</span>}</p>
				</div>
			</div>
		</div>
	);
};

export default ViewUser;
