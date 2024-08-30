import { ROUTES } from '@config/constant';
import { t } from 'i18next';
import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Breadcrumb = () => {
	const location = useLocation();
	const moduleName = (pathname: string) => {
		let modulePath = '';
		if (pathname.split('/')[2].includes('-')) {
			const path = pathname.split('/')[2].split('-');
			path.forEach((i: string) => {
				modulePath = modulePath + i[0]?.toUpperCase() + i.slice(1) + '/ ';
				return modulePath;
			});
			return modulePath;
		} else {
			modulePath = pathname.split('/')[2][0]?.toUpperCase() + pathname.split('/')[2].slice(1);
			return modulePath;
		}
	};
	return (
		<div className='w-full bg-white py-3 px-4 border-b border-[#c8ced3] mb-2'>
			<nav className='flex ' aria-label='Breadcrumb'>
				<ol className='inline-flex items-center space-x-1 md:space-x-1'>
					<li className='inline-flex items-center'>
						<Link to={`/${ROUTES.app}/${ROUTES.settings}`} className='inline-flex items-center text-[#BF4848] text-sm   hover:underline dark:text-gray-400 dark:hover:text-white'>
							{t('Home')}
						</Link>
						<span className='ml-3 text-slate-500'>/</span>
					</li>
					<li>
						<div className='flex items-center'>
							<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 9 4-4-4-4' />
							<p className='ml-1 text-sm text-gray-700  md:ml-2 dark:text-gray-400 dark:hover:text-white'>
								{location.pathname.split('/')[3] !== 'list' && location.pathname.split('/')[3] !== undefined ? <NavLink to={`/${ROUTES.app}/${location.pathname.split('/')[2]}/list`} className='text-red-500'>{`${moduleName(location.pathname)}`}</NavLink> : `${moduleName(location.pathname)}`} {location.pathname.split('/')[3] !== undefined && <span> / {`${moduleName(location.pathname)} ${location.pathname.split('/')[3]}`} </span>}
							</p>
						</div>
					</li>
				</ol>
			</nav>
		</div>
	);
};

export default React.memo(Breadcrumb);
