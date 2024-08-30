import React, { useEffect, useState } from 'react';
import Button from '@components/button/button';
import { ImageDataProps } from 'src/types/common';
import { BannerIcon, Cross } from '@components/icons/icons';
import { useTranslation } from 'react-i18next';

const ImageModel = ({ onClose, data, show }: ImageDataProps) => {
	const [addClass, setAddClass] = useState(false);
	const { t } = useTranslation();
	useEffect(() => {
		if (show) {
			setTimeout(() => {
				setAddClass(true);
			}, 100);
		}
	}, [show]);
	return (
		<div id='deleteDataModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`${show ? '' : 'hidden'} fixed top-0 left-0 right-0 z-50 h-full  bg-slate-200 bg-opacity-[2px] backdrop-blur-sm mx-3 `}>
			<div className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-opacity duration-300 `}>
				{/* <!-- Modal content --> */}
				<div className='relative min-w-full sm:min-w-[500px] mt-10 bg-white rounded-sm shadow dark:bg-gray-700'>
					<div className='flex items-start justify-between p-4 border-b rounded-t bg-primary dark:border-gray-600'>
						<div className='flex'>
							<BannerIcon className='mr-1 fill-white' fontSize='2em' />
							<h3 className='text-xl font-semibold text-white dark:text-white'> {t('View Image')} </h3>
						</div>
						<Button onClick={onClose} label={''} title={`${t('Close')}`} >
							<span className='text-xl-22'><Cross className='mr-1 text-error' /></span>
						</Button>
					</div>
					<div className='p-6 space-y-6 font-bold '>
						<div className='flex justify-center'>
							<img src={data} alt='image' height={300} width={300} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageModel;
