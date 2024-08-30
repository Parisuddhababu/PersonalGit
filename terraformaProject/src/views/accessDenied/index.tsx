import React from 'react';
import { Link } from 'react-router-dom';

import { DropdownArrowDown } from '@components/icons/icons';
import Button from '@components/button/button';
import { useTranslation } from 'react-i18next';
import { ROUTES, USER_TYPE } from '@config/constant';
import { NavlinkReturnFunction } from '@utils/helpers';
import { UserProfileType } from 'src/types/common';
import { useSelector } from 'react-redux';

const AccessDenied = () => {
	const { t } = useTranslation();
	const { userProfileData } = useSelector(
		(state: { userProfile: { userProfileData: UserProfileType; } }) => state.userProfile,
	);
	const userType = userProfileData?.getProfile?.data?.user_type ?? '';

	return (
		<div className='flex items-center justify-center h-[calc(100%-50px)]'>
			<div className='flex flex-col text-center bg-white border border-solid shadow-xl p-11 xxs:p-16 border-border-primary rounded-xl'>
				<h1>{t('Permission Denied')}</h1>
				<Link to={NavlinkReturnFunction(userType,USER_TYPE.SUPER_ADMIN,`/${ROUTES.app}/${ROUTES.dashboard}`,`/${ROUTES.app}/${ROUTES.subscriber}`)}>
					<Button className='mt-5 uppercase btn-primary btn-normal btn-icon' label='' title='Back'>
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
export default AccessDenied;
