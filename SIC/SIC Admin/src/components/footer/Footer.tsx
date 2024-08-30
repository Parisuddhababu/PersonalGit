import React from 'react';

const Footer = () => {
	return (
		<footer className='bg-gray-300 p-4'>
			<div className='text-right'>
				<p>&copy; 2023. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default React.memo(Footer);
