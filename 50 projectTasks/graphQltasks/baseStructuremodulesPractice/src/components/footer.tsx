import React from 'react';

const Footer = () => {
	return (
		<footer className='bg-[#F0F3F5]  bottom-0 w-full flex justify-end p-4'>
			<p className='px-2'>
				Powered by <span className='text-red-500 '>Brainvire Infotech Inc.</span>
			</p>
		</footer>
	);
};

export default React.memo(Footer);
