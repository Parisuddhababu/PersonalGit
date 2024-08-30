import Button from '@components/button/button';
import { Close, Info } from '@components/icons';
import { t } from 'i18next';
import React from 'react';
import { LogoutProps } from 'src/types/common';

const Logout = ({ onClose, onSubmit}: LogoutProps) => {
	return (
		<>
			<div id='changeStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={'fixed top-0 left- right-0 z-50  w-full p-6 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] backdrop-blur-sm backdrop-contrast-50 shadow-black shadow-2xl'}>
				<div className='flex justify-center'>
					<div className='relative w-[31rem] max-w-2xl max-h-full bg-white '>
						{/* <!-- Modal content --> */}
						<div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
							<div className='flex items-start justify-between p-4 border-b rounded-t bg-[#BB3F42]'>
								<h6 className='text-white'>
									<Info className='inline-block mr-1' />
									{t('Confirmation')}
								</h6>
								<Button onClick={onClose} label={t('')}>
									<Close className='mr-1 text-red-500' />
								</Button>
							</div>
						</div>

						<div className='p-6 space-y-6 text-center'>
							<p>{t('Are you sure you want to logout?')}</p>
						</div>
						{/* <!-- Modal footer --> */}
						<div className=' flex justify-end space-x-2 px-4 pb-4'>
							<Button onClick={onSubmit} className='btn-primary btn-normal ' type='submit' label={t('Yes')}></Button>
							<Button className='btn-warning btn-normal' onClick={onClose} label={t('No')}></Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};
export default Logout;
