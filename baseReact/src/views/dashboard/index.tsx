import React from 'react';
import { Megaphone } from '@components/icons/icons';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
	const { t } = useTranslation();
	return (
		<div className='h-full flex justify-center items-center'>
			<div className=''>
				<div className='flex justify-center items-center text-primary opacity-70'>
					<span className='w-12 h-12 inline-block svg-icon mr-3'>
						<Megaphone />
					</span>
					<div>
						<h2>{t('COMING SOON...')}</h2>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Dashboard;
