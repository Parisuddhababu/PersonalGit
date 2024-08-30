import React from 'react';
import { Link } from 'react-router-dom';

import { DropdownArrowDown } from '@components/icons/icons';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { ROUTES, USER_TYPE } from '@config/constant';
import { NavlinkReturnFunction } from '@utils/helpers';
import { useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';

const NotFound = () => {
	const { t } = useTranslation();
	const { userProfileData } = useSelector(
		(state: { userProfile: { userProfileData: UserProfileType; } }) => state.userProfile,
	);
	const userType = userProfileData?.getProfile?.data?.user_type ?? '';

	return (
		<div className='flex items-center justify-center h-[calc(100%-50px)]'>
			<div className='flex flex-col text-center bg-white border border-solid shadow-xl p-11 xxs:p-16 border-border-primary rounded-xl'>
				<p className='mb-2 font-bold text-7xl md:text-8xl'>{t('404')}</p>
				<h4 className='mb-3 text-base font-medium md:text-lg'>Page Not Found</h4>
				<p className='text-lg text-gray-400 mb-7 md:mb-10 md:text-xl'>We can not find the page you are looking for.</p>
				<Link to={NavlinkReturnFunction(userType,USER_TYPE.SUPER_ADMIN,`/${ROUTES.app}/${ROUTES.dashboard}`,`/${ROUTES.app}/${ROUTES.subscriber}`)}>
					<Button className='uppercase btn-primary btn-normal btn-icon' label='' title='Back'>
						<span className='mr-2 rotate-90'>
							<DropdownArrowDown className='text-lg md:text-xl fill-white' />
						</span>
						Back To Home
					</Button>
				</Link>
			</div>
		</div>
	);
};
export default NotFound;
