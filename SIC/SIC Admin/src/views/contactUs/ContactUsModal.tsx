import React from 'react';
import Button from '@components/button/Button';
import { Cross } from '@components/icons';
import { ImageObj } from 'src/types/contactUs';

export type ContactUsDataProps = {
	onClose: () => void;
	description: string;
	media: ImageObj;
};

const ContactUsModal = ({ onClose, description, media }: ContactUsDataProps) => {
	const images = Object.values(media);
	return (
		<div id='contactUsModal' className={'fixed top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full grid place-content-center bg-black bg-opacity-30'}>
			<div className='relative w-full min-w-[30vw] max-w-[90vw] max-h-[90vh] shadow-lg'>
				{/* <!-- Modal content --> */}
				<div className='relative bg-white rounded-lg shadow'>
					<Button className='btn btn-large absolute right-0 top-2' onClick={onClose}>
						<Cross />
					</Button>
					<h3 className='text-xl font-semibold text-gray-900 text-start pt-5 pl-5'>Description</h3>
					<h4 className='p-5 pb-2 text-xl text-gray-800'>{description}</h4>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-5 p-5'>
						{images?.map((item) => {
							return <div key={item}>{item && <img src={item} alt='image' />}</div>;
						})}
					</div>
					{/* <!-- Modal footer --> */}
					<div className='flex items-center justify-end p-4 pb-8 space-x-4 rounded-b'>
						<Button className='btn btn-default btn-medium min-w-[100px] justify-center' onClick={onClose}>
							Close
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactUsModal;
