import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowSmallLeft } from '@components/icons/icons';
import Button from '@components/button/button';

const AccessDenied = () => {
	return (
		<div className='grid place-content-center bg-gray-50 h-screen w-screen'>
			<div className='bg-white shadow-xl rounded-xl p-16 text-center'>
				<h1 className='text-8xl font-bold'>403</h1>
				<h4 className='text-lg font-medium mb-5'>Access Denied</h4>
				<p className='text-gray-400 text-xl mb-16 italic'>You cannot access the page you are looking for.</p>
				<Link to='/'>
					<Button className='btn-primary uppercase' label=''>
						<span className='mr-1 inline-block svg-icon w-4 h-4 '>
							<ArrowSmallLeft />
						</span>
						Back To Home
					</Button>
				</Link>
			</div>
		</div>
	);
};
export default AccessDenied;
