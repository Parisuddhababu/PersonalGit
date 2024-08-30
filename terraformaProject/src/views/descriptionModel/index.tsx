import React, { useEffect, useState } from 'react';
import Button from '@components/button/button';
import { DescriptionDataProps } from 'src/types/common';
import { Cross, Message } from '@components/icons/icons';
import { useTranslation } from 'react-i18next';

const DescriptionModel = ({ onClose, data, show }: DescriptionDataProps) => {
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
		<div id='deleteDataModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`${show ? '' : 'hidden'} fixed top-0 left-0 right-0 z-50 h-full  bg-slate-200 bg-opacity-[2px] backdrop-blur-sm mx-3`}>
			<div className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '} transition-transform duration-300 `}>
				{/* <!-- Modal content --> */}
				<div className='relative w-full mt-10 bg-white rounded-sm shadow sm:w-auto dark:bg-gray-700'>
					<div className='flex items-start justify-between p-4 border-b rounded-t bg-primary dark:border-gray-600'>
						<div className='flex items-center'>
							<Message className='mr-1 text-white fill-white' fontSize='1.2em' />
							<span className='text-[1.09rem] font-medium text-white  dark:text-white'>{t('Description')}</span>
						</div>
						<Button onClick={onClose} label={''} title={`${t('Close')}`}>
							<span className='text-xl-22'><Cross className='mr-1 text-error' /></span>
						</Button>
					</div>
					<div className='p-6 space-y-6 font-bold '>
						<div className='break-words'>{data}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DescriptionModel;
