import React from 'react';

const getDefaultIcon = () => {
	return (
		<svg xmlns='http://www.w3.org/2000/svg' className='w-3 h-3 ml-1 text-gray-400' aria-hidden='true' fill='currentColor' viewBox='0 0 320 512'>
			<path d='M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z' />
		</svg>
	);
};

const getAscIcon = () => {
	return (
		<svg viewBox='0 0 24 24' fill='currentColor' className='ml-1 h-5 w-5 text-secondary'>
			<path d='M18.71,8.21a1,1,0,0,0-1.42,0l-4.58,4.58a1,1,0,0,1-1.42,0L6.71,8.21a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41l4.59,4.59a3,3,0,0,0,4.24,0l4.59-4.59A1,1,0,0,0,18.71,8.21Z' />
		</svg>
	);
};

const getDescIcon = () => {
	return (
		<svg viewBox='0 0 24 24' fill='currentColor' className='ml-1 h-5 w-5 text-secondary rotate-180'>
			<path d='M18.71,8.21a1,1,0,0,0-1.42,0l-4.58,4.58a1,1,0,0,1-1.42,0L6.71,8.21a1,1,0,0,0-1.42,0,1,1,0,0,0,0,1.41l4.59,4.59a3,3,0,0,0,4.24,0l4.59-4.59A1,1,0,0,0,18.71,8.21Z' />
		</svg>
	);
};

export { getDefaultIcon, getAscIcon, getDescIcon };
