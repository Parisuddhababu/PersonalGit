import React from 'react';

import { Lock, PhoneCall, ProfileIcon, SettingsSliders, User, Document, PlanManagementIcon } from '@components/icons/icons';
import { uuid } from '@utils/helpers';
import { PERMISSION_LIST } from '@config/permission';
import { sidebarNavlinksArray } from '@type/common';

const Dashboard = React.lazy(() => import('@views/dashboard'));
const SubAdmin = React.lazy(() => import('@views/subAdmin'));
const AddEditSubAdmin = React.lazy(() => import('@views/subAdmin/addEditSubAdmin'));
const Settings = React.lazy(() => import('@views/settingsPage'));
const RolePermissions = React.lazy(() => import('@views/rolePermissons'));
const UpdateProfileForm = React.lazy(() => import('@views/adminProfile/updateAdmin'));
const Influencer = React.lazy(() => import('@views/Influencer/index'));
const AddEditInfluencer = React.lazy(() => import('@views/Influencer/AddEditInfluencer'));
const Catalogue = React.lazy(() => import('@views/catalogue/index'));
const AddEditCatalogue = React.lazy(() => import('@views/catalogue/AddEditCatalogue'));
const BrandUserRequestManagement = React.lazy(() => import('@views/BrandUserRequest/index'));
const AddEditBrandUserRequest = React.lazy(() => import('@views/BrandUserRequest/AddEditBrandUserRequest'));
const BrandUserManagement = React.lazy(() => import('@views/BrandUser/index'));
const AddEditBrandUser = React.lazy(() => import('@views/BrandUser/AddEditBrandUser'));
const ViewInfluencer = React.lazy(() => import('@views/Influencer/viewInfluencer'));
const ContactUs = React.lazy(() => import('@views/enquiry/index'));
const ViewCatelogueBrand = React.lazy(() => import('@views/BrandUser/viewCatelogue'));
const CMS = React.lazy(() => import('@views/cms/index'));
const AddEditCms = React.lazy(() => import('@views/cms/addEditCms'));
const PlanManagement = React.lazy(() => import('@views/planManagement/index'));
const AddEditPlan = React.lazy(() => import('@views/planManagement/AddEditPlan'));
const PlatformManagement = React.lazy(() => import('@views/platformManagement/index'));


export const sortOrder = 'desc';
export const sortBy = 'created_at';

export const DATE_FORMAT = {
	dateFormat: 'MM/dd/yyyy hh:mm:ss',
	dateShortFormat: 'MM/dd/yyyy',
	momentDateTime24Format: 'MM/DD/YYYY hh:mm:ss',
	momentDateTime12Format: 'MM/DD/YYYY h:mm A',
	momentTime24Format: 'hh:mm:ss',
	momentTime12Format: 'hh:mm A',
	momentDateOfBirth: 'DD/MM/YYYY',
	momentDateFormat: 'MM/DD/YYYY',
	DateHoursMinFormat: 'YYYY-MM-DD hh:mm',
	DateHoursMinSecFormat: 'YYYY-MM-DD hh:mm:ss',
	simpleDateFormat: 'YYYY-MM-DD',
};

export const KEYS = {
	authToken: 'authToken',
};
export const LOGOUT_WANRING_TEXT = 'Are you sure want to Logout ?';

export const DELETE_WARING_TEXT = 'Are you sure want to delete this record ?';

export const CHANGESTATUS_WARING_TEXT = 'Are you sure want to change status ?';

export const GROUP_DELETE_WARING_TEXT = 'Are you sure want to delete this records ?';

export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 1;

export const SHOW_PAGE_COUNT_ARR = [10, 20, 30, 40, 50];

export const STATUS_RADIO = [
	{ name: 'Active', value: '1', key: uuid() },
	{ name: 'Inactive', value: '0', key: uuid() },
];

export enum USER_STATUS {
	Active = 'ACTIVE',
	Inctive = 'INACTIVE',
	Suspended = 'SUSPENDED'
}

export enum GENDER {
	Male = 'MALE',
	Female = 'FEMALE',
    Other = 'OTHER',
}

export const GENDER_DRP1 = [
	{ name: 'Female', value: GENDER.Female, key: uuid() },
	{ name: 'Male', value: GENDER.Male, key: uuid() },
	{ name: 'Other', value: GENDER.Other, key: uuid() },
];


export const ROUTES: { [key: string]: string } = {
	login: 'login',
	app: 'app',
	dashboard: 'dashboard',
	forgotPassword: 'forgot-password',
	resetPassword: 'reset-password',
	resetToken: 'token',
	subAdmin: 'sub-admin',
	brandUserRequest: 'brand-user-request',
	ManageBrandUser: 'manage-brand-user',
	settings: 'settings',
	user: 'manage-user',
	manageRulesSets: 'rules-sets',
	rolePermissions: 'role-permissions',
	profile: 'profile',
	reset: 'reset',
	userReport: 'user-report',
	list: 'list',
	add: 'add',
	edit: 'edit',
	view: 'view',
	treeview: 'treeview',
	influencer: 'influencer',
	catalouge: 'catalogue',
	enquiry: 'enquiry',
	cms: 'cms-management',
	planManagement: 'plan-management',
	platformManagement: 'platform-management',
	accessDenied: 'access-denied',
};

export const UPPERCASE_PATHS = ['cms']

export const RedirectPages = {
	dashBoard: '/app/dashboard',
	user: `/${ROUTES.app}/${ROUTES.user}`,
	role: `/${ROUTES.app}/${ROUTES.role}`,
	subAdmin: `/${ROUTES.app}/${ROUTES.subAdmin}`,
	settings: `/${ROUTES.app}/${ROUTES.settings}`,
	manageRulesSets: `/${ROUTES.app}/${ROUTES.manageRulesSets}`,
	rolePermissions: `/${ROUTES.app}/${ROUTES.rolePermissions}`,
	userReport: `/${ROUTES.app}/${ROUTES.userReport}`,
	influencer: `/${ROUTES.app}/${ROUTES.influencer}`,
	catalouge: `/${ROUTES.app}/${ROUTES.catalouge}`,
	brandUserRequest: `/${ROUTES.app}/${ROUTES.brandUserRequest}`,
	ManageBrandUser: `/${ROUTES.app}/${ROUTES.ManageBrandUser}`,
	enquiry: `/${ROUTES.app}/${ROUTES.enquiry}`,
	cms: `/${ROUTES.app}/${ROUTES.cms}`,
	planManagement: `/${ROUTES.app}/${ROUTES.planManagement}`,
	platformManagement: `/${ROUTES.app}/${ROUTES.platformManagement}`,
};

export const privateRoutes: { path: string; element: React.LazyExoticComponent<() => React.ReactElement>; permission?: string[] }[] = [
	{ path: ROUTES.dashboard, element: Dashboard },
	{ path: `${ROUTES.subAdmin}/${ROUTES.list}`, element: SubAdmin, permission: [PERMISSION_LIST.SubAdmin.ListAccess] },
	{ path: `${ROUTES.subAdmin}/add`, element: AddEditSubAdmin, permission: [PERMISSION_LIST.SubAdmin.AddAccess] },
	{ path: `${ROUTES.subAdmin}/edit/:id`, element: AddEditSubAdmin, permission: [PERMISSION_LIST.SubAdmin.EditAccess] },
	{ path: `${ROUTES.settings}`, element: Settings, permission: [] },
	{ path: `${ROUTES.profile}`, element: UpdateProfileForm, permission: [] },
	{ path: `${ROUTES.rolePermissions}`, element: RolePermissions, permission: [PERMISSION_LIST.Role.ListAccess] },
	{ path: `${ROUTES.influencer}/list`, element: Influencer, permission: [PERMISSION_LIST.Influencer.ListAccess] },
	{ path: `${ROUTES.influencer}/add`, element: AddEditInfluencer, permission: [PERMISSION_LIST.Influencer.AddAccess] },
	{ path: `${ROUTES.influencer}/edit/:id`, element: AddEditInfluencer, permission: [PERMISSION_LIST.Influencer.EditAccess] },
	{ path: `${ROUTES.catalouge}/list`, element: Catalogue, permission: [PERMISSION_LIST.Catalogue.ListAccess] },
	{ path: `${ROUTES.catalouge}/add`, element: AddEditCatalogue, permission: [PERMISSION_LIST.Catalogue.AddAccess] },
	{ path: `${ROUTES.catalouge}/edit/:id`, element: AddEditCatalogue, permission: [PERMISSION_LIST.Catalogue.EditAccess] },
	{ path: `${ROUTES.brandUserRequest}/list`, element: BrandUserRequestManagement, permission: [PERMISSION_LIST.brandUserRequest.ListAccess] },
	{ path: `${ROUTES.brandUserRequest}/add`, element: AddEditBrandUserRequest, permission: [] },
	{ path: `${ROUTES.brandUserRequest}/edit/:id`, element: AddEditBrandUserRequest, permission: [PERMISSION_LIST.brandUserRequest.EditAccess] },
	{ path: `${ROUTES.ManageBrandUser}/list`, element: BrandUserManagement, permission: [PERMISSION_LIST.manageBrandUser.ListAccess] },
	{ path: `${ROUTES.ManageBrandUser}/add`, element: AddEditBrandUser, permission: [PERMISSION_LIST.manageBrandUser.AddAccess] },
	{ path: `${ROUTES.ManageBrandUser}/edit/:id`, element: AddEditBrandUser, permission: [PERMISSION_LIST.manageBrandUser.EditAccess] },
	{ path: `${ROUTES.influencer}/view/:id`, element: ViewInfluencer, permission: [PERMISSION_LIST.Influencer.ViewAccess] },
	{ path: `${ROUTES.ManageBrandUser}/view/:id`, element: ViewCatelogueBrand, permission: [PERMISSION_LIST.manageBrandUser.ViewAccess] },
	{ path: `${ROUTES.enquiry}/list`, element: ContactUs, permission: [PERMISSION_LIST.ContactUs.ListAccess] },
	{ path: `${ROUTES.cms}/list`, element: CMS, permission: [PERMISSION_LIST.CMS.ListAccess] },
	{ path: `${ROUTES.cms}/edit/:id`, element: AddEditCms, permission: [PERMISSION_LIST.CMS.EditAccess] },
	{ path: `${ROUTES.planManagement}/list`, element: PlanManagement, permission: [PERMISSION_LIST.CMS.ListAccess] },
	{ path: `${ROUTES.planManagement}/add`, element: AddEditPlan, permission: [PERMISSION_LIST.PlanManagement.AddAccess] },
	{ path: `${ROUTES.planManagement}/edit/:id`, element: AddEditPlan, permission: [PERMISSION_LIST.PlanManagement.EditAccess] },
	{ path: `${ROUTES.platformManagement}/list`, element: PlatformManagement, permission: [PERMISSION_LIST.PlatformManagement.ListAccess]}
];

export const LANGUAGE_DROPDOWN_LIST = [
	{ data: 'en', content: 'EN' },
	{ data: 'es', content: 'ES' },
];
export const PROFILE_DROPDOWN_LIST = [
	{ content: 'Profile', icon: User, data: 'profile', route: `/${ROUTES.app}/${ROUTES.profile}` },
	{ content: 'Logout', icon: Lock, data: 'Logout' },
];

export const SIDEBAR_NAVLINKS: sidebarNavlinksArray[] = [
	{
		to: `/${ROUTES.app}/${ROUTES.influencer}/list`,
		text: 'Influencer',
		icon: <User />,
		redirectPage: RedirectPages.influencer,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Influencer.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.enquiry}/${ROUTES.list}`,
		text: 'Enquiry',
		icon: <PhoneCall />,
		redirectPage: RedirectPages.enquiry,
		childRoutes: [],
		permissions: [PERMISSION_LIST.ContactUs.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.brandUserRequest}/${ROUTES.list}`,
		text: 'Brand User Request Management',
		icon: <ProfileIcon />,
		redirectPage: RedirectPages.brandUserRequest,
		childRoutes: [],
		permissions: [PERMISSION_LIST.brandUserRequest.ListAccess],
	},

	{
		to: `/${ROUTES.app}/${ROUTES.ManageBrandUser}/${ROUTES.list}`,
		text: 'Manage Brand User ',
		icon: <ProfileIcon />,
		redirectPage: RedirectPages.ManageBrandUser,
		childRoutes: [],
		permissions: [PERMISSION_LIST.manageBrandUser.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.subAdmin}/${ROUTES.list}`,
		text: 'Manage Sub Admin',
		icon: <ProfileIcon />,
		redirectPage: RedirectPages.subAdmin,
		childRoutes: [],
		permissions: [PERMISSION_LIST.SubAdmin.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.rolePermissions}`,
		text: 'Role Permissions',
		icon: <Lock />,
		redirectPage: RedirectPages.rolePermissions,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Role.ListAccess, PERMISSION_LIST.Permission.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.cms}/${ROUTES.list}`,
		text: 'CMS Management',
		icon: <Document />,
		redirectPage: RedirectPages.cms,
		childRoutes: [],
		permissions: [PERMISSION_LIST.CMS.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.planManagement}/${ROUTES.list}`,
		text: 'Plan Management',
		icon: <PlanManagementIcon />,
		redirectPage: RedirectPages.planManagement,
		childRoutes: [],
		permissions: [PERMISSION_LIST.PlanManagement.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.settings}`,
		text: 'Settings',
		icon: <SettingsSliders />,
		redirectPage: RedirectPages.settings,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Settings.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.platformManagement}/${ROUTES.list}`,
		text: 'Platform Management',
		icon: <PlanManagementIcon />,
		redirectPage: RedirectPages.platformManagement,
		childRoutes: [],
		permissions: [PERMISSION_LIST.PlatformManagement.ListAccess],
	},
];

export const IMAGE_BASE_URL = process.env.REACT_APP_API_BASENODE;
export const UPLOAD_IMAGE_URL = process.env.REACT_APP_API_IMAGE_URL;
export const REACT_APP_API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL;
export const REACT_APP_ENCRYPTION_DECRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_DECRYPTION_KEY;
export const NODE_ENV = process.env.NODE_ENV;

export const STATUS = {
	inactive: '0',
	active: '1',
	Approved: '2',
	Rejected: '3',
};

export const IS_ALL = true;

//For Common Pagiantion we have used this variables....
export const MAX_DISPLAY_PAGE_COUNT = 3;

export enum AccesibilityNames {
	Edit = 'Edit',
	View = 'View',
	Delete = 'Delete',
	ChangeStatus = 'Change Status',
	ChangePassword = 'Change Password',
	Dashboard = 'Dashboard',
	Status = 'Status',
	Entries = 'Entries',
	sortOrder = 'SortOrder',
	sortBy = 'sortBy',
	role = 'Role',
	gender = 'Gender',
	goToFirst = 'Go to first',
	gotoEnd = 'Go to end',
	next = 'Next',
	previous = 'Previous',
	profile = 'Profile',
}


export enum GenderEnum {
	Male = 1,
	Female = 2,
	Other = 3,
}

export enum BadgesColor {
	Pending = 'badge-secondary',
	Working = 'badge-success',
	Closed = 'badge-danger',
}

export enum BadgesCodeEnum {
	Pending = 4,
	Working = 5,
	Closed = 6,
}

export enum UserGenderEnum {
	Male = 1,
	Female = 2,
	other = 3
}

export const CK_EDITOR_CONFIGURATION = {
	readonly: false,
	autofocus: false,
	tabIndex: 1,
	askBeforePasteFromWord: false,
	askBeforePasteHTML: false,
	defaultActionOnPaste: 'insert_clear_html',
	placeholder: 'write something awesome ...',
	beautyHTML: true,

	toolbarButtonSize: 'large',
	uploader: { insertImageAsBase64URI: true },
	buttons: 'bold,italic,underline,strikethrough,eraser,ul,ol,font,fontsize,paragraph,lineHeight,superscript,subscript,spellcheck,cut,copy,paste,selectall,hr,table,link,indent,outdent,brush,undo,redo,source,align,image',
	disablePlugins: 'inline-popup,image-properties',
};
export const DEFAULT_STATUS = '1';


// REACT_APP_API_GATEWAY_URL=https://commentsoldapi.demo.brainvire.dev/gql
// REACT_APP_ENCRYPTION_DECRYPTION_KEY=ABCD