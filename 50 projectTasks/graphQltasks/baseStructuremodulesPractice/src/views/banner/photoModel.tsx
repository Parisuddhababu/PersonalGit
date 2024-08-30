import { Close, Picture } from '@components/icons';
import React from 'react';
import { t } from 'i18next';
import { photoModelProps } from 'src/types/common';
import Button from '@components/button/button';
const PhotoModel = ({ onClose, data }: photoModelProps) => {
	return (
		<>
			<div id='changeUserStatusModel' tabIndex={-1} data-modal-show={true} aria-hidden='false' className={'fixed top-0 left- right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] backdrop-blur-sm backdrop-contrast-50'}>
				<div className='flex justify-center'>
					{/* <!-- Modal content --> */}
					<div className='relative w-full max-w-2xl max-h-full bg-white  '>
						<div className='flex items-start justify-between p-4 border-b rounded-t bg-[#BB3F42]'>
							<div className='flex items-center'>
								<Picture className='mr-3 text-white' />
								<h3 className='text-xl font-semibold text-white'>View Image</h3>
							</div>

							<Button onClick={onClose} label={t('')}>
								<Close className='mr-1 text-red-500' />
							</Button>
						</div>
						<div className='p-6 space-y-6'>
							<div className='text-center'>
								<img src={data} className='h-44 w-68 m-auto' alt='' />
							</div>
						</div>
						{/* <!-- Modal footer --> */}
						<div className='m-1 p-1 flex justify-end'>
							<Button onClick={onClose} className='btn btn-primary m-1' label={t('Close')}></Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default PhotoModel;
