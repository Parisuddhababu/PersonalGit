import * as React from 'react';
import loaderAnimation from '@assets/images/loader.gif';

const Loader = () => (
	<div className='fixed h-screen w-screen grid place-content-center bg-gray-500 bg-opacity-70 top-0 left-0 z-50'>
		<div className='w-14 h-14 lg:w-28 lg:h-28 p-2 rounded-md bg-white shadow'>
			<img src={loaderAnimation} />
		</div>
	</div>
);

export default Loader;
