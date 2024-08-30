import React from 'react';
import { Outlet } from 'react-router-dom';

const Content = () => {
	return (
		<main className='h-[100%] bg-white flex-1 overflow-auto [&>div:not(.nm,.modal)]:my-5 [&>div:not(.nm,.modal)]:mx-5 [&>div:not(.nm,.modal)]:md:mx-7'>
			<Outlet />
		</main>
	);
};

	export default React.memo(Content);
 