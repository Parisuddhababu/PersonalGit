import React from 'react';
import Button from '@components/button/Button';
import { DeleteDataProps } from 'src/types/common';
import { Cross, Exclamation } from '@components/icons';

const DeleteModel = ({ onClose, deleteData }: DeleteDataProps) => {
	return (
		<div id='deleteDataModel' className={'fixed top-0 left-0 right-0 z-50  w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-full max-h-full grid place-content-center bg-black bg-opacity-30'}>
			<div className='relative w-full min-w-[30vw] max-w-2xl max-h-full shadow-lg'>
				{/* <!-- Modal content --> */}
				<div className='relative bg-white rounded-lg shadow'>
					<Button className='btn btn-large absolute right-0 top-2' onClick={onClose}>
						<Cross />
					</Button>
					<h3 className='text-xxl font-semibold text-gray-900 text-center pt-8'>Confirm Delete</h3>
					<div className='p-6 space-y-2 text-xl text-gray-500 text-center'>
						<Exclamation className='text-5xl text-error' />
						<p>Are you sure you want to delete this record?</p>
					</div>
					{/* <!-- Modal footer --> */}
					<div className='flex items-center justify-center p-4 pb-8 space-x-4 rounded-b'>
						<Button className='btn btn-danger btn-large min-w-[100px] justify-center' onClick={deleteData}>
							Yes
						</Button>
						<Button className='btn btn-default btn-large min-w-[100px] justify-center' onClick={onClose}>
							No
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DeleteModel;
