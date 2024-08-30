import React from 'react';
import { TopCardProps } from '@type/dashboard';

const BottomCard = ({ title, value }: TopCardProps) => {
	return (
		<div className='realtive rounded-md  mb-6 text-white bg-primary'>
			<div className='flex flex-col'>
				<div className='p-5 pb-0'>
					<div className='text-center '>
						<h3 className='text-h1 leading-xl font-medium mb-2'>{value}</h3>
					</div>
				</div>
				<div className='my-4 text-center'>
					<h4 className='text-h3 leading-6 font-medium mb-2'>{title}</h4>
				</div>
			</div>
		</div>
	);
};
export default BottomCard;
