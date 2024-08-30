import { ROUTES } from '@config/constant';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AngleLeft, AngleRight, Cross, Document, Lock, Megaphone, MenuBurger, Settings } from '@components/icons';
import { SidebarProps } from 'src/types/views';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ isActive, setIsActive, show }: SidebarProps) => {
	const { t } = useTranslation();
	const [showIconsOnly, setShowIconsOnly] = useState(false);
	const toggleShowIconsOnly = () => {
		setShowIconsOnly(!showIconsOnly);
	};

	const sidebarNavigationList = [
		{
			id: 2,
			title: t('Settings'),
			path: `/${ROUTES.app}/${ROUTES.settings}`,
			icon: Settings,
		},
		{
			id: 3,
			title: t('Manage Category'),
			path: `/${ROUTES.app}/${ROUTES.category}`,
			icon: MenuBurger,
		},
		{
			id: 4,
			title: t('Role Permissions'),
			path: `/${ROUTES.app}/${ROUTES.role}`,
			icon: Lock,
		},
		{
			id: 5,
			title: t('Manage Banner'),
			path: `/${ROUTES.app}/${ROUTES.banner}`,
			icon: Document,
		},
		{
			id: 6,
			title: t('Announcement'),
			path: `/${ROUTES.app}/${ROUTES.announcements}`,
			icon: Megaphone,
		},
	];

	const [screenSize, setScreenSize] = useState(getCurrentDimension());
	function getCurrentDimension() {
		return {
			width: window.innerWidth,
			height: window.innerHeight,
		};
	}
	useEffect(() => {
		const updateDimension = () => {
			setScreenSize(getCurrentDimension());
		};
		window.addEventListener('resize', updateDimension);
		if (screenSize.width >= 1024) {
			document.getElementsByClassName('.');
		}
		return () => {
			window.removeEventListener('resize', updateDimension);
		};
	}, [screenSize]);
	return (
		<aside className={` fixed z-50   ${screenSize.width < 1024 && !show ? '!ml-[0px]' : ''} ${show ? 'min-w-[840px] h-full lg:ml-[0px]' : ' sm:ml-[-200px] '}  overflow-y-scroll  bg-slate-700 bg-opacity-30 backdrop-blur-sm   md:overflow-y-auto   sm:sticky md:top-0  transition-all duration-500  ${showIconsOnly ? 'sm:min-w-[50px]' : 'sm:min-w-[180px]'} `}>
			<span onClick={() => setIsActive(false)} className={`text-md h-10 w-10 grid place-content-center border rounded-full bg-white shadow text-primary absolute -right-12 top-4 lg:hidden ${!isActive ? 'hidden' : ''}`}>
				<Cross />
			</span>
			{/* Sidebar content */}
			<ul className='h-full realtive  fixed sm:sticky md:max-h-full overflow-y-auto bg-[#2F353A]'>
				{sidebarNavigationList?.map((module) => {
					return (
						<li className='mb-2 ' key={module.id} id={`${module.id}`}>
							<NavLink to={module.path} className={({ isActive }) => `flex items-center p-3 text-sm hover:bg-[#BB3F42] hover:text-[#ffffff] ${isActive ? 'bg-[#BB3F42] text-[#ffffff]' : 'sidebar-link'}`}>
								<module.icon className={`mr-3 sidebar-svg  hover:text-[#ffffff] ${window.location.pathname.includes(module.path) ? 'text-[#ffffff]' : ''} `} />
								{!showIconsOnly && <span className='text-white'>{module.title}</span>}
							</NavLink>
						</li>
					);
				})}

				<button onClick={toggleShowIconsOnly} className='text-white absolute bottom-0 right-0 flex justify-end mr-4 mb-4'>
					{showIconsOnly ? <AngleRight /> : <AngleLeft />}
				</button>
			</ul>
		</aside>
	);
};

export default React.memo(Sidebar);
