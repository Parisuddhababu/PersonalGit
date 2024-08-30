import React from 'react';

const Footer = () => {
	return (
		<footer className='bg-white drop-shadow-outline p-4 md:pl-7 md:pr-5 md:py-5'>
			<div className='mx-auto text-left'>
				<p className='text-xs md:text-xs-14 text-light-grey'>Copyright &copy; 2023 Terra Forma Systems. All rights reserved.</p>
			</div>
		</footer>
	);
};

export default React.memo(Footer);


