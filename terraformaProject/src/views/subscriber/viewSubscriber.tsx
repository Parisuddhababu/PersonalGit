import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Button from '@components/button/button';
import profile from '@assets/images/default-user-image.png'
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_WARNING_TEXT, ImageUrl, ROUTES, USER_TYPE } from '@config/constant';
import { GET_SUBSCRIBER_BY_ID } from '@framework/graphql/queries/subscriber';
import UpdatedHeader from '@components/header/updatedHeader';
import { DELETE_SUBSCRIBER } from '@framework/graphql/mutations/subscriber';
import CommonModel from '@components/common/commonModel';
import { useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';

const ViewSubscriber = () => {
	const { t } = useTranslation();
	const UserId = useParams();
	const { data, refetch } = useQuery(GET_SUBSCRIBER_BY_ID, {
		variables: { subscribersId: UserId.id },
	});
	const [deleteSubscriberById] = useMutation(DELETE_SUBSCRIBER);
	const [isDeleteSubscriber, setIsDeleteSubscriber] = useState<boolean>(false);	
	const navigate = useNavigate();
	const { userProfileData} = useSelector(
		(state: { userProfile: { userProfileData: UserProfileType} }) => state.userProfile,
	  );
  	const userType = userProfileData?.getProfile?.data?.user_type ?? '';
	/**
	 * IF WE GET ID BASED ON THAT WE WILL GET EVENT DATA
	 */
	useEffect(() => {
		if (UserId?.id) {
			refetch({ subscribersId: UserId.id }).catch((err) => toast.error(err));
		}
	}, [UserId?.id]);


	/**
	 * on clicking cancel it will redirect to main events page
	 */
	const onCancel = useCallback(() => {
		navigate(`/${ROUTES.app}/${ROUTES.subscriber}`);
	}, []);

	const imageUrl = data?.getSubscriber?.data?.logo.startsWith(ImageUrl)
		? data?.getSubscriber?.data?.logo
		: `${ImageUrl}/${data?.getSubscriber?.data?.logo}`;

	const headerActionConst = () => {
		return (
			<Button className='btn-secondary btn-normal text-bold md:min-w-[120px]' label={t('Back')} onClick={onCancel} title='Back' />
		)
	}

	const locations = data?.getSubscriber?.data?.subscriber_branch?.map((location: { location: string, city: string }) => location?.location);
	const cityData = data?.getSubscriber?.data?.subscriber_branch?.map((location: { location: string, city: string }) => location?.city);

	/**
	 * Method used for close model
	 */
	const onCloseSubscriber = useCallback(() => {
			setIsDeleteSubscriber(false);
	}, []);
	
	const deleteSubscriber = useCallback(() => {
		deleteSubscriberById({
			variables: {
				subscribersId: UserId.id,
			},
		})
			.then(res => {
				const data = res.data;
				toast.success(data.deleteSubscriber.message);
				setIsDeleteSubscriber(false);
				navigate(-1);
			})
			.catch(err => {
				toast.error(err.networkError.result.errors[0].message);
			});
	}, [UserId.id]);

	const onDeleteButton = useCallback(() => {
		setIsDeleteSubscriber(true);
	}, [])
	
	return (
		<>
			<UpdatedHeader headerActionConst={headerActionConst} headerTitle='Subscriber Details' />
			<div className='w-calc(100%-56px) items-center justify-center rounded-xl border border-solid border-border-primary'>
				<div className='flex p-5'>
					<div>

					<h6 className='mb-4'>{t('Profile Photo')}</h6>
					{imageUrl 
						? 
							<img src={imageUrl} alt='profile' className='rounded-md' />
						:
							<img src={profile} alt='profile' className='w-48 h-48 rounded-md' />
					}
					</div>
					<div className='w-full flex justify-end'>
					{userType === USER_TYPE?.SUPER_ADMIN && <Button label="Delete" className="btn-error btn-normal mb-3 md:mb-0 w-full md:w-[160px]" type="button"  onClick={onDeleteButton} title='Delete'  />}
					</div>
				</div>
				<div className='grid grid-cols-1 px-5 pb-5 md:gap-x-2 2lg:grid-cols-2 '>
					<div className='flex pb-2'>
						<p className='flex-1 font-bold'>{t('Subscribed Company Name')}</p>
						<p className='flex-1 px-3'>
							{data?.getSubscriber?.data?.company_name}
						</p>
					</div>

					<div className='flex pb-2'>
						<p className='flex-1 font-bold'>{t('Subscriber Name')}</p>
						<p className='flex-1 px-3'>
							{data?.getSubscriber?.data?.first_name + ' ' + data?.getSubscriber?.data?.last_name}
						</p>
					</div>

					<div className='flex pb-2'>
						<p className='flex-1 font-bold'>{t('CountryCode')}</p>
						<p className='flex-1 px-3'>{`${data?.getSubscriber?.data?.country_code?.phoneCode} ${data?.getSubscriber?.data?.country_code?.name}`}</p>
					</div>

					<div className='flex pb-2'>
						<p className='flex-1 font-bold'>{t('Phone Number')}</p>
						<p className='flex-1 px-3'>{data?.getSubscriber?.data?.phone_number}</p>
					</div>

					<div className='flex pb-2'>
						<p className='flex-1 font-bold'>{t('Email')}</p>
						<p className='flex-1 px-3 break-all'>{data?.getSubscriber?.data?.email}</p>
					</div>

					<div className='flex pb-2'>
						<p className='flex-1 font-bold'>{t('Address')}</p>
						<p className='flex-1 px-3 break-all'>{data?.getSubscriber?.data?.address}</p>
					</div>

					<div className='flex pb-2'>
						<p className='flex-1 font-bold'>{t('Start Date')}</p>
						<p className='flex-1 px-3'>{data?.getSubscriber?.data?.subscribe_start}</p>
					</div>

					<div className='flex pb-2'>
						<p className='flex-1 font-bold'>{t('End Date')}</p>
						<p className='flex-1 px-3'>{data?.getSubscriber?.data?.subscribe_end}</p>
					</div>
					<div className='flex pb-2'>
						<p className='flex-1 font-bold'>Location</p>
						<p className='flex-1'>{locations ? locations.join(', ') : ''}</p>
					</div>
					<div className='flex pb-2'>
						<p className='flex-1 font-bold'>City</p>
						<p className='flex-1'>{cityData ? cityData.join(', ') :  ''}</p>
					</div>
				</div>
				{isDeleteSubscriber &&userType === USER_TYPE?.SUPER_ADMIN  && (
					<CommonModel warningText={DELETE_WARNING_TEXT} onClose={onCloseSubscriber} action={deleteSubscriber} show={isDeleteSubscriber} />
				)}
			</div>
		</>
	);
};

export default ViewSubscriber;
