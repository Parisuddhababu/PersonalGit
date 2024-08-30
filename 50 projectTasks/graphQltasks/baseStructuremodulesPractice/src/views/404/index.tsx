import Button from '@components/button/button';
import { ArrowSmallLeft } from '@components/icons';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
	return (
		<div className='grid place-content-center bg-gray-50 h-screen w-screen'>
			<div className='bg-white shadow-xl rounded-xl p-16 text-center'>
				<h1 className='text-8xl font-bold'>404</h1>
				<h4 className='text-lg font-medium mb-5'>Page Not Found</h4>
				<p className='text-gray-400 text-xl mb-16 italic'>We can not find the page you are looking for.</p>
				<Link to='/'>
					<Button className='btn-large btn-primary btn-normal btn-icon uppercase' label=''>
						<span className='mr-1'>
							<ArrowSmallLeft className='text-xl' />
						</span>
						Back To Home
					</Button>
				</Link>
			</div>
		</div>
	);
};
export default NotFound;
