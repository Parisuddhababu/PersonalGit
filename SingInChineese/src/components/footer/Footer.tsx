import React from 'react';

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<footer className='bg-gray-300 p-4'>
			<div className='text-right'>
				<p>&copy; {year}. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default React.memo(Footer);
