import React from 'react';
import { useTranslation } from 'react-i18next';
import userManual from '@assets/images/user-manual/user-manual.png';
import productSupp from '@assets/images/user-manual/product-support.png';
import productSupp2 from '@assets/images/user-manual/product-support2.png';
import userManual2 from '@assets/images/user-manual/user-manual2.png';
import userManual3 from '@assets/images/user-manual/user-manual3.png';
import userManual4 from '@assets/images/user-manual/user-manual4.png';


const TechnicalManualsAndGuidesComponentList = () => {
	const { t } = useTranslation();
	return (
		<div className='p-5 my-5 border border-solid border-border-primary rounded-xl'>
			<div className='mb-5'>
				<h6 className='mb-2'>{t('Technical Manuals')}</h6>

				
				<div className='flex flex-wrap justify-between gap-4 md:gap-5 '>
					<div className='w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-14px)] flex flex-col items-center justify-center p-5 border border-solid border-border-primary rounded-xl hover:bg-accents-2'>
						<img className='mt-auto mb-5' src={userManual} alt="User Manual" />
						<p className='mt-auto text-base font-bold text-center md:text-lg'>{t('User Manual')}</p>
					</div>
					<div className='w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-14px)] flex flex-col items-center justify-center p-5 border border-solid border-border-primary rounded-xl hover:bg-accents-2'>
						<img className='mt-auto mb-5' src={productSupp} alt="User Manual" />
						<p className='mt-auto text-base font-bold text-center md:text-lg'>{t('Product Support')}</p>
					</div>
					<div className='w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-14px)] flex flex-col items-center justify-center p-5 border border-solid border-border-primary rounded-xl hover:bg-accents-2'>
						<img className='mt-auto mb-5' src={productSupp2} alt="User Manual" />
						<p className='mt-auto text-base font-bold text-center md:text-lg'>{t('Product Support')}</p>
					</div>
				</div>
			</div>

			<div>
				<h6 className='mb-2'>{t('Technical Manuals')}</h6>
				<div className='flex flex-wrap justify-between gap-4 md:gap-5 '>
					<div className='w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-14px)] flex flex-col items-center justify-center p-5 border border-solid border-border-primary rounded-xl hover:bg-accents-2'>
						<img className='mt-auto mb-5' src={userManual2} alt="User Manual" />
						<p className='mt-auto text-base font-bold text-center md:text-lg'>{t('User Manual')}</p>
					</div>
					<div className='w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-14px)] flex flex-col items-center justify-center p-5 border border-solid border-border-primary rounded-xl hover:bg-accents-2'>
						<img className='mt-auto mb-5' src={userManual3} alt="User Manual" />
						<p className='mt-auto text-base font-bold text-center md:text-lg'>{t('User Manual')}</p>
					</div>
					<div className='w-full md:w-[calc(50%-10px)] lg:w-[calc(33.3%-14px)] flex flex-col items-center justify-center p-5 border border-solid border-border-primary rounded-xl hover:bg-accents-2'>
						<img className='mt-auto mb-5' src={userManual4} alt="User Manual" />
						<p className='mt-auto text-base font-bold text-center md:text-lg'>{t('User Manual')}</p>
					</div>
				</div>
			</div>
		</div>
	);
};
export default TechnicalManualsAndGuidesComponentList;
