import React from 'react';

const Footer = () => {
	return (
		<footer className='bg-[#F0F3F5] fixed bottom-0 w-full  p-4'>
			<div className='container mx-auto flex justify-end px-6'>
				<p className='px-4'>
					Powered by <span className='text-red-500 '>Brainvire Infotech Inc.</span>
				</p>
			</div>
		</footer>
	);
};

export default React.memo(Footer);
