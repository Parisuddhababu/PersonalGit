import React from 'react';
import { TopCardProps } from '@type/dashboard';

const TopCard = ({ title, value }: TopCardProps) => {
	return (
		<div className='w-full'>
			<div className=' rounded-lg border-l-thick-1 border-primary border-y-default border-r-default border-y border-r bg-white mb-6'>
				<div className=' flex flex-col flex-auto flex-grow flex-shrink  pt-5 px-5'>
					<div>
						<h5 className='text-base-font-1 text-lg leading-5  font-medium mb-2'>{title}</h5>
						<h3 className='text-h1 leading-xl font-medium mb-2'>{value}</h3>
					</div>
				</div>
			</div>
		</div>
	);
};
export default TopCard;
