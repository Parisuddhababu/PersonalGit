import React from 'react';
import { useTranslation } from 'react-i18next';

import { Lock, User } from '@components/icons/icons';
import { ProfileModelProps } from 'src/types/common';

const ProfileModel = ({ profileHandler, logoutHandler }: ProfileModelProps) => {
	const { t } = useTranslation();
	return (
		<div className='absolute flex flex-col   border border-[#c8ced3] top-[48px] right-0 bg-white min-w-[160px] rounded  font-normal text-[#181b1e]  '>
			<a onClick={() => profileHandler()} className=' border-b border-[#c8ced3] hover:cursor-pointer hover:bg-slate-100 min-w-[180px] px-[9px] py-[10px] focus:bg-primary text-[0.875rem]'>
				<User className='fill-[#c8ced3] ml-[8px] mr-[16px] inline-block' fontSize='13px' />
				{t('Profile')}
			</a>
			<a onClick={() => logoutHandler()} className='hover:cursor-pointer hover:bg-slate-100 min-w-[180px] px-[9px] py-[10px] text-[0.875rem]   '>
				<Lock className='fill-[#c8ced3] ml-[8px] mr-[16px] inline-block' fontSize='13px' />
				{t('Logout')}
			</a>
		</div>
	);
};
export default ProfileModel;
