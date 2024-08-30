import * as React from 'react';

const Loader = () => (
	<div className='fixed h-screen w-screen grid place-content-center bg-opacity-70 top-0 left-0 z-50'>
		<div className='h-14 w-14 border-y-4 animate-spin border-primary rounded-full'></div>
	</div>
);

export default Loader;
