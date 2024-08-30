import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@components/button/button';
import { Info, Cross, Cross2, Info2 } from '@components/icons/icons';
import { CommonModelProps } from 'src/types/common';

const CommonModel = ({ onClose, action, show, warningText, disabled , isLoading }: CommonModelProps) => {
	const { t } = useTranslation();
	const [addClass, setAddClass] = useState(false);
	
	useEffect(() => {
		if (show) {
			setTimeout(() => {
				setAddClass(true);
			}, 100);
		}
	}, [show]);
	return (
		<>
			{isLoading && <div className='w-12 h-12 mx-auto rounded-[50%] border-solid border-4 border-[#E8E8EA] border-r-[#2575d6] animate-spin absolute left-[58%] top-[40%]'></div>}
			<div className={`${show ? '' : 'hidden'} absolute top-0 left-0 right-0 z-[1000] h-full bg-modal`}>
				{(warningText !== 'Are you sure want to delete this record ?') && (warningText !== 'Are you sure want to change status ?') &&
					<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '}  transition-all duration-300 `}>
						<div className='w-full mx-5 sm:max-w-[780px]'>
						
							<div className='relative bg-white shadow rounded-xl'>
								<div className='flex items-center justify-between px-5 py-6 border-b bg-accents-2 rounded-t-xl'>
									<div className='flex items-center '>
										<Info className='inline-block mr-3 fill-baseColor' fontSize='20' />
										<span className='text-xl font-bold text-baseColor'>{t('Confirmation')}</span>
									</div>
									<Button onClick={onClose} label={''}>
										<Cross className='text-error' fontSize='14'/>
									</Button>
								</div>
								<div className='p-5 space-y-6 font-normal text-center border-b border-solid border-border-primary'>
									<p>{t(warningText)}</p>
								</div>
			
								<div className='flex flex-col items-center justify-end p-5 md:space-x-3 md:flex-row'>
									<Button className='btn-primary btn-normal mb-2 md:mb-0 w-full md:w-auto min-w-[160px]' onClick={action} label={t('Yes')} disabled={disabled} title='Yes'/>
									<Button className='btn-secondary btn-normal w-full md:w-auto min-w-[160px]' onClick={onClose} label={t('No')} title='No'/>
								</div>
							</div>
						</div>
					</div>
				}
				{(warningText == 'Are you sure want to change status ?') &&
					<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '}  transition-all duration-300 `}>
						<div className='w-full mx-5 sm:max-w-[640px]'>
							<div className='relative p-5 text-center bg-white shadow rounded-xl md:p-7'>
								<div className='flex flex-col items-center mb-3'>
									<span className='p-[10px] bg-primary min-w-min rounded-full mb-3 overflow-hidden text-xl-44 md:text-6xl'><Info2 className='fill-white bg-primary' /></span>
									<h4>{t('Confirmation')}</h4>
								</div>
								<h6 className='font-semibold text-center mb-7 md:mb-10'>{t(warningText)}</h6>
								<div className='flex items-center justify-center space-x-5 md:flex-row'>
									<Button className='btn-primary btn-normal min-w-[86px]' onClick={action} label={t('Yes')} disabled={disabled} title='Yes'/>
									<Button className='btn-secondary btn-normal min-w-[86px]' onClick={onClose} label={t('No')} title='No' />
								</div>
							</div>
						</div>
					</div>
				}
				{(warningText == 'Are you sure want to delete this record ?') &&
					<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={`py-5 flex items-center justify-center h-full ${addClass ? '' : 'opacity-0 transform -translate-y-full scale-150 '}  transition-all duration-300 `}>
						<div className='w-full mx-5 sm:max-w-[640px]'>
							<div className='relative p-5 text-center bg-white shadow rounded-xl md:p-7'>
								<div className='flex justify-center mb-5'><span className='p-[22px] md:p-[26px] rounded-full bg-error text-xl-35 md:text-5xl'><Cross2 className='stroke-2 fill-white' /></span></div>
								<h6 className='font-bold text-center mb-7 md:mb-10'>{t(warningText)}</h6>
								<div className='flex items-center justify-center space-x-5 md:flex-row'>
									<Button className='btn-primary btn-normal min-w-[86px]' onClick={action} label={t('Yes')} disabled={disabled} title='Yes'/>
									<Button className='btn-secondary btn-normal min-w-[86px]' onClick={onClose} label={t('No')} title='No' />
								</div>
							</div>
						</div>
					</div>
				}
			</div>
		</>
	);
};

export default CommonModel;
