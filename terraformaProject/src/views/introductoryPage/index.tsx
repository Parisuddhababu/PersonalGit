import React, { useEffect } from 'react';
import IntroductoryBg from '@assets/images/introductory/introductory-bg.png';
import IntroductorySlider from '@components/introductorySlider/introductorySlider';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@config/constant';
import { useSelector } from 'react-redux';
import { UserProfileType } from 'src/types/common';

const Index = () => {
	const navigate = useNavigate();
	const { userProfileData } = useSelector(((state: { userProfile: { userProfileData: UserProfileType } }) => state.userProfile));

	useEffect(() => {
		if (userProfileData?.getProfile?.data?.introductory_page) {
			navigate(`/${ROUTES.app}/${ROUTES.dashboard}`);
		}
	}, [userProfileData])

	return (
		<div className='relative flex items-center justify-center w-full h-screen bg-accents-2 nm'>
			<picture className='absolute bottom-0 right-0 w-1/2 max-w-[700px]'>
				<img src={IntroductoryBg} className='w-full ml-auto' alt="Introductory Background" height='699' width='638' />
			</picture>
			<IntroductorySlider />
		</div>
	);
};
export default Index;


