import React from 'react';

type Data = {
	percentage: number;
};
const LoadingPercentage = ({ percentage }: Data) => {
	return (
		<div className='progress bg-gray-100 flex items-center w-full rounded-lg h-2 mt-3'>
			<span className='h-full rounded-lg bg-success w-0' style={{ width: `${percentage}%` }}></span>
			<span className='ml-3 font-medium'>{percentage}%</span>
		</div>
	);
};
export default LoadingPercentage;
