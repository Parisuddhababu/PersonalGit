import { ROUTES } from '@config/constant';
import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import sidebarClass from './Sidebar.module.scss';
import cn from 'classnames';
import { Megaphone, Cross, Document, Flag, Globe, Home, ListCheck, Lock, Placement, Result, Setting, Store, Subscribe, User, UserPermission, Users, PhoneCall, Question, Picture, Info, CreditCard } from '@components/icons';
import { SidebarMenu, SidebarProps } from 'src/types/views';

const Sidebar = ({ isActive, setIsActive }: SidebarProps) => {
	const userRole = localStorage.getItem('role') as string;
	const sidebarNavigationList: SidebarMenu = [
		{ id: 1, title: 'Sub Admin Management', path: `${ROUTES.subAdmin}/${ROUTES.list}`, icon: User },
		{ id: 2, title: 'End Users Management', path: `${ROUTES.user}/${ROUTES.list}`, icon: Users },
		{ id: 3, title: 'Onboarding Management', path: `${ROUTES.onboarding}/${ROUTES.list}`, icon: Picture },
		{ id: 4, title: 'Sign On Placement', path: `${ROUTES.signOnPlacement}/${ROUTES.list}`, icon: Placement },
		{ id: 5, title: 'Exam Results', path: `${ROUTES.examResults}/${ROUTES.list}`, icon: Result },
		{ id: 6, title: 'Level Management', path: `${ROUTES.level}/${ROUTES.list}`, icon: ListCheck },
		{ id: 7, title: 'Subscription Management', path: `${ROUTES.subscription}/${ROUTES.list}`, icon: Subscribe },
		{ id: 8, title: 'Country Management', path: `${ROUTES.state}/${ROUTES.list}`, icon: Flag },
		{ id: 9, title: 'CMS Management', path: `${ROUTES.CMS}/${ROUTES.list}`, icon: Document },
		{ id: 10, title: 'Seasonal management', path: `${ROUTES.seasonalTopic}`, icon: Globe },
		{ id: 11, title: 'Vocabularies', path: `${ROUTES.vocabularies}/${ROUTES.list}`, icon: Info },
		{ id: 12, title: 'Flash Card Category', path: `${ROUTES.flashCard}`, icon: CreditCard },
		{ id: 13, title: 'Pet Store Management', path: `${ROUTES.petStore}/${ROUTES.list}`, icon: Store },
		{ id: 14, title: 'Sound Management', path: `${ROUTES.sound}/${ROUTES.list}`, icon: Megaphone },
		{ id: 15, title: 'Why It Works ?', path: `${ROUTES.whyItWorks}/${ROUTES.list}`, icon: Question },
		{ id: 16, title: 'Settings', path: `${ROUTES.settings}`, icon: Setting },
		{ id: 17, title: 'Contact Us', path: `${ROUTES.contactUs}/${ROUTES.list}`, icon: PhoneCall },
	];

	const pathClass = useCallback(
		({ isActive }: { isActive: boolean }) => {
			return `flex items-center font-medium p-3 text-sm text-white hover:bg-accent ${isActive ? 'bg-primary' : ''}`;
		},
		[isActive]
	);

	const array = +userRole === 1 ? [...sidebarNavigationList, { id: 17, title: 'Role Management', path: `${ROUTES.role}`, icon: Lock }, { id: 18, title: 'User Permissions', path: `${ROUTES.userPermissions}`, icon: UserPermission }] : sidebarNavigationList;

	return (
		<aside className={`${cn(sidebarClass['sidebar'])} ${isActive ? cn(sidebarClass['active']) : ''}`}>
			<span onClick={() => setIsActive(false)} className={`text-md h-10 w-10 grid place-content-center border rounded-full bg-white shadow text-primary absolute -right-12 top-4 lg:hidden ${!isActive ? 'hidden' : ''}`}>
				<Cross />
			</span>
			{/* Sidebar content */}
			<ul className='py-5 flex-1 overflow-auto'>
				<li className='mb-2' onClick={() => setIsActive(false)}>
					<NavLink to={ROUTES.dashboard} className={pathClass}>
						<Home className='mr-3' />
						Dashboard
					</NavLink>
				</li>
				{array?.map((navigation) => {
					return (
						<li className='mb-2' key={navigation.id} onClick={() => setIsActive(false)}>
							<NavLink to={navigation.path} className={pathClass}>
								<navigation.icon className='mr-3' />
								{navigation.title}
							</NavLink>
						</li>
					);
				})}
			</ul>
		</aside>
	);
};

export default React.memo(Sidebar);
