import { ROUTES, SidebarValues } from '@config/constant';
import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import sidebarClass from './Sidebar.module.scss';
import cn from 'classnames';
import { Megaphone, Cross, Document, Flag, Globe, Home, ListCheck, Lock, Placement, Result, Setting, Store, User, UserPermission, Users, PhoneCall, Question, Picture, Info, CreditCard, Briefcase, UsersAlt, Play } from '@components/icons';
import { SidebarMenu, SidebarProps } from 'src/types/views';
import { permissionsArray } from '@config/permissions';
import RoleBaseGuard from '@components/roleGuard/roleGuard';

const Sidebar = ({ isActive, setIsActive }: SidebarProps) => {
	const userRole = localStorage.getItem('role') as string;
	const sidebarNavigationList: SidebarMenu = [
		{ id: 1, title: SidebarValues.subAdminModule, path: `${ROUTES.subAdmin}/${ROUTES.list}`, icon: User },
		{ id: 2, title: SidebarValues.endUsersModule, path: `${ROUTES.user}/${ROUTES.list}`, icon: Users, permissions: [permissionsArray.USER_MANAGEMENT.ListAccess] },
		{ id: 3, title: SidebarValues.onboardingModule, path: `${ROUTES.onboarding}/${ROUTES.list}`, icon: Picture, permissions: [permissionsArray.ONBOARDING_MANAGEMENT.ListAccess] },
		{ id: 4, title: SidebarValues.sopModule, path: `${ROUTES.signOnPlacement}/${ROUTES.list}`, icon: Placement, permissions: [permissionsArray.SOP_LEVEL_MANAGEMENT.ListAccess] },
		{ id: 5, title: SidebarValues.examResultModule, path: `${ROUTES.examResults}/${ROUTES.list}`, icon: Result, permissions: [permissionsArray.SOP_EXAM_RESULT.ViewAccess] },
		{ id: 6, title: SidebarValues.levelModule, path: `${ROUTES.level}/${ROUTES.list}`, icon: ListCheck, permissions: [permissionsArray.LEVEL_MANAGEMENT.ListAccess] },
		// commented code for future use
		// { id: 7, title: SidebarValues.subscriptionModule, path: `${ROUTES.subscription}/${ROUTES.list}`, icon: Subscribe, permissions: [permissionsArray.SUBSCRIPTION_MANAGEMENT.ListAccess] },
		{ id: 8, title: SidebarValues.countryModule, path: `${ROUTES.state}/${ROUTES.list}`, icon: Flag, permissions: [permissionsArray.COUNTRY_MANAGEMENT.ListAccess] },
		{ id: 9, title: SidebarValues.cmsModule, path: `${ROUTES.CMS}/${ROUTES.list}`, icon: Document, permissions: [permissionsArray.CMS_MANAGEMENT.ListAccess] },
		{ id: 10, title: SidebarValues.seasonalModule, path: `${ROUTES.seasonalTopic}`, icon: Globe, permissions: [permissionsArray.SEASONAL_TOPIC_MANAGEMENT.ListAccess] },
		{ id: 20, title: SidebarValues.schoolModule, path: `${ROUTES.school}/${ROUTES.list}`, icon: Briefcase, permissions: [permissionsArray.SCHOOL_MANAGEMENT.ListAccess] },
		{ id: 21, title: SidebarValues.teacherModule, path: `${ROUTES.teacher}/${ROUTES.list}`, icon: User, permissions: [permissionsArray.TEACHER_MANAGEMENT.ListAccess] },
		{ id: 22, title: SidebarValues.classModule, path: `${ROUTES.classroom}/${ROUTES.list}`, icon: ListCheck, permissions: [permissionsArray.CLASSROOM_MANAGEMENT.ListAccess] },
		{ id: 23, title: SidebarValues.studentModule, path: `${ROUTES.student}/${ROUTES.list}`, icon: UsersAlt, permissions: [permissionsArray.CHILD_MANAGEMENT.ListAccess] },
		{ id: 24, title: SidebarValues.videoModule, path: `${ROUTES.videos}/${ROUTES.list}`, icon: Play, permissions: [permissionsArray.VIDEO_MANAGEMENT.ListAccess] },
		{ id: 11, title: SidebarValues.vocabularyModule, path: `${ROUTES.vocabularies}/${ROUTES.list}`, icon: Info, permissions: [permissionsArray.VOCABULARY.ListAccess] },
		{ id: 12, title: SidebarValues.flashCardModule, path: `${ROUTES.flashCard}`, icon: CreditCard, permissions: [permissionsArray.CATEGORY_MANAGEMENT.ListAccess] },
		{ id: 13, title: SidebarValues.petStoreModule, path: `${ROUTES.petStore}/${ROUTES.list}`, icon: Store, permissions: [permissionsArray.PET_STORE_PRODUCT_MANAGEMENT.ListAccess] },
		{ id: 14, title: SidebarValues.soundModule, path: `${ROUTES.sound}/${ROUTES.list}`, icon: Megaphone, permissions: [permissionsArray.SOUND_MANAGEMENT.ListAccess] },
		{ id: 15, title: SidebarValues.whyItWorksModule, path: `${ROUTES.whyItWorks}/${ROUTES.list}`, icon: Question, permissions: [permissionsArray.WHY_IT_WORKS.ListAccess] },
		{ id: 16, title: SidebarValues.settingsModule, path: `${ROUTES.settings}`, icon: Setting, permissions: [permissionsArray.SETTINGS.UpdateAccess] },
		{ id: 17, title: SidebarValues.contactUsModule, path: `${ROUTES.contactUs}/${ROUTES.list}`, icon: PhoneCall },
	];

	const pathClass = useCallback(
		({ isActive }: { isActive: boolean }) => {
			return `flex items-center font-medium p-3 text-sm text-white hover:bg-accent ${isActive ? 'bg-primary' : ''}`;
		},
		[isActive]
	);

	const array = +userRole === 1 ? [...sidebarNavigationList, { id: 18, title: SidebarValues.rolesModule, path: `${ROUTES.role}`, icon: Lock }, { id: 19, title: SidebarValues.userPermissionModule, path: `${ROUTES.userPermissions}`, icon: UserPermission }] : sidebarNavigationList;

	/**
	 * Method to handle the active and inactive of the side bar.
	 */
	const sidebarHandler = useCallback(() => {
		setIsActive(false);
	}, []);

	return (
		<aside className={`${cn(sidebarClass['sidebar'])} ${isActive ? cn(sidebarClass['active']) : ''}`}>
			<button onClick={() => setIsActive(false)} className={`text-md h-10 w-10 grid place-content-center border rounded-full bg-white shadow text-primary absolute -right-12 top-4 lg:hidden ${!isActive ? 'hidden' : ''}`}>
				<Cross />
			</button>
			{/* Sidebar content */}
			<ul className='py-5 flex-1 overflow-auto'>
				<li className='mb-2'>
					<NavLink to={ROUTES.dashboard} className={pathClass} onClick={sidebarHandler}>
						<Home className='mr-3' />
						Dashboard
					</NavLink>
				</li>
				{array?.map((navigation) => {
					return (
						<RoleBaseGuard key={navigation.id} permissions={navigation.permissions}>
							<li className='mb-2'>
								<NavLink to={navigation.path} className={pathClass} onClick={sidebarHandler}>
									<navigation.icon className='mr-3' />
									{navigation.title}
								</NavLink>
							</li>
						</RoleBaseGuard>
					);
				})}
			</ul>
		</aside>
	);
};

export default React.memo(Sidebar);
