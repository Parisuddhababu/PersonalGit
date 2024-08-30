import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@components/button/button';
import logo from '@assets/images/coming-soon.png';
import UpdatedHeader from '@components/header/updatedHeader';

const ComingSoon = () => {
	const { t } = useTranslation();

	return (
		<>
			<UpdatedHeader />
			<div className='flex flex-col items-center justify-center min-h-[calc(100vh-205px)] border border-solid p-7 md:p-10 border-border-primary rounded-xl'>
				<h1 className='mb-2 text-center'>{t('Coming Soon..!')}</h1>
				<p className='mb-2 text-center'>{t('We are currently working on this page, We will be back soon.')}</p>
				<img className='mb-7' src={logo} alt="Coming Soon Image" />
				<Button className='w-full btn btn-primary md:w-[132px]' type='submit' label={t('Go Home')} title={`${t('Go Home')}`} />
			</div>
		</>
	);
};
export default ComingSoon;
