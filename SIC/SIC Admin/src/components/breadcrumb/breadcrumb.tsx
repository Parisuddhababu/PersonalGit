import { ROUTES } from '@config/constant';
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
	const location = useLocation();
	/**method that coverts the path name as our desired way  */
	const moduleName = (pathname: string) => {
		let modulePath = '';
		if (pathname.split('/')[2].includes('-')) {
			const path = pathname.split('/')[2].split('-');
			path.forEach((i: string) => {
				modulePath = modulePath + i[0].toUpperCase() + i.slice(1) + ' ';
				return modulePath;
			});
			return modulePath;
		} else {
			modulePath = pathname.split('/')[2][0].toUpperCase() + pathname.split('/')[2].slice(1);
			return modulePath;
		}
	};

	return (
		<div className='w-full bg-white rounded py-3 px-4 mb-4'>
			<p>
				<span>
					<NavLink to={`/${ROUTES.app}/${ROUTES.dashboard}`} className='text-primary hover:underline cursor-pointer '>
						Home
					</NavLink>
					<span className='m-[3px] text-slate-500 px-3'>/</span>
				</span>
				{location.pathname.split('/')[3] !== 'list' && location.pathname.split('/')[3] !== undefined ? (
					<NavLink to={`/${ROUTES.app}/${location.pathname.split('/')[2]}/list`} className='text-primary hover:underline'>
						{moduleName(location.pathname)}
					</NavLink>
				) : (
					<span className={`${location.pathname.split('/')[3] !== undefined ? 'text-primary' : 'text-slate-500'} cursor-pointer hover:underline`}>{moduleName(location.pathname)}</span>
				)}
				{location.pathname.split('/')[3] !== undefined && (
					<span className='text-slate-500 capitalize'>
						<span className='m-[3px] text-slate-500 ] px-3'>/</span>
						{location.pathname.split('/')[3] !== 'list' ? `${location.pathname.split('/')[3]} ${moduleName(location.pathname)} ` : ` ${moduleName(location.pathname)} ${location.pathname.split('/')[3]} `}
					</span>
				)}
			</p>
		</div>
	);
};

export default React.memo(Breadcrumb);
