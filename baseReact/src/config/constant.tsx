import React from 'react';

import { BannerIcon, ClipBoardIcon, Document, Email, Gift, Lock, PhoneCall, ProfileIcon, Question, SettingsSliders, User, ArrowRight, Marker, TimerIcon, SuggestionIcon, UserReportIcon, Star, Megaphone } from '@components/icons/icons';
import { uuid } from '@utils/helpers';
import { PERMISSION_LIST } from '@config/permission';
import { sidebarNavlinksArray } from '@type/common';
import { DataMapping } from '@framework/graphql/graphql';

const Dashboard = React.lazy(() => import('@views/dashboard'));
const SubAdmin = React.lazy(() => import('@views/subAdmin'));
const AddEditSubAdmin = React.lazy(() => import('@views/subAdmin/addEditSubAdmin'));
const State = React.lazy(() => import('@views/state'));
const AddEditState = React.lazy(() => import('@views/state/addEditState'));
const CMS = React.lazy(() => import('@views/CMS'));
const AddEditCms = React.lazy(() => import('@views/CMS/addEditCms'));
const AddSuggestion = React.lazy(() => import('@views/suggestion/addSuggestion'));
const FaqManagement = React.lazy(() => import('@views/faq'));
const Enquiry = React.lazy(() => import('@views/enquiry'));
const AddEditFaq = React.lazy(() => import('@views/faq/addEditFaq'));
const AddEnquiry = React.lazy(() => import('@views/enquiry/addEnquiry'));
const ManageCategory = React.lazy(() => import('@views/manageCategory'));
const Settings = React.lazy(() => import('@views/settingsPage'));
const Review = React.lazy(() => import('@views/review'));
const Country = React.lazy(() => import('@views/country'));
const AddEditCountry = React.lazy(() => import('@views/country/addEditCountry'));
const UserManagement = React.lazy(() => import('@views/userManagement'));
const Announcement = React.lazy(() => import('@views/announcement'));
const AddAnnouncement = React.lazy(() => import('@views/announcement/addAnnouncement'));
const City = React.lazy(() => import('@views/city'));
const AddEditCity = React.lazy(() => import('@views/city/addEditCity'));
const EventManagement = React.lazy(() => import('@views/eventsManagement'));
const AddEditEvents = React.lazy(() => import('@views/eventsManagement/addEditEvent'));
const ViewEvent = React.lazy(() => import('@views/viewEvent'));
const NotificationsTemplate = React.lazy(() => import('@views/notifications'));
const AddEditNotification = React.lazy(() => import('@views/notifications/addEditNotification'));
const AddEditCategory = React.lazy(() => import('@views/manageCategory/addEditCategory'));
const ViewNotification = React.lazy(() => import('@views/viewNotification'));
const Suggestion = React.lazy(() => import('@views/suggestion'));
const ManageRulesSets = React.lazy(() => import('@views/rulesSestsManagement'));
const AddEditRulesSets = React.lazy(() => import('@views/rulesSestsManagement/addEditRulesSet'));
const ViewAnnouncement = React.lazy(() => import('@views/viewAnnouncement'));
const RolePermissions = React.lazy(() => import('@views/rolePermissons'));
const CategoryTreeView = React.lazy(() => import('@views/manageCategory/categoryTreeView'));
const ManageOffer = React.lazy(() => import('@views/couponsManagement'));
const AddeditManageOffer = React.lazy(() => import('@views/couponsManagement/addEditCoupons'));
const ActivityTracking = React.lazy(() => import('@views/activityTracking'));
const EmailNotificationTemplate = React.lazy(() => import('@views/emailNotificationTemplate'));
const AddEditEmailTemplate = React.lazy(() => import('@views/emailNotificationTemplate/addEditEmailTemplate'));
const BsMedia = React.lazy(() => import('@views/bs-media/index'));
const UserReport = React.lazy(() => import('@views/userReport/index'));
const AddEditUser = React.lazy(() => import('@views/userManagement/addEditUser'));
const ViewUser = React.lazy(() => import('@views/userManagement/viewUser'));
const Banner = React.lazy(() => import('@views/banner/index'));
const AddEditBanner = React.lazy(() => import('@views/banner/addEditBanner'));
const UpdateProfileForm = React.lazy(() => import('@views/adminProfile/updateAdmin'));

export const sortOrder = 'desc';
export const sortBy = 'created_at';

export enum LogLevel {
	All = 0,
	Debug = 1,
	Info = 2,
	Warn = 3,
	Error = 4,
	Off = 5,
}


export const LogMethods: Record<LogLevel, keyof Console> = {
	[LogLevel.All]: 'log',
	[LogLevel.Debug]: 'debug',
	[LogLevel.Info]: 'info',
	[LogLevel.Warn]: 'warn',
	[LogLevel.Error]: 'error',
	[LogLevel.Off]: 'log',
};

export const CONFIGCONSTANTS = {
	logLevel: LogLevel.All,
};

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

export const PAGE_LENGTH = 2;

export const DEFAULT_LIMIT = 10;
export const DEFAULT_PAGE = 1;

export const SHOW_PAGE_COUNT_ARR = [10, 20, 30, 40, 50];
export const SHOW_PAGE_COUNT_ARR1 = [
	{ name: '10', key: 10 },
	{ name: '20', key: 20 },
	{ name: '30', key: 30 },
];

export const STATUS_DRP = [
	{ name: 'Select Status', key: '' },
	{ name: 'Active', key: '1' },
	{ name: 'Inactive', key: '0' },
];
export const STATUS_RADIO = [
	{ name: 'Active', value: '1', key: uuid() },
	{ name: 'Inactive', value: '0', key: uuid() },
];
export const GENDER_DRP = [
	{ name: 'Male', key: 1 },
	{ name: 'Female', key: 2 },
	{ name: 'Other', key: 3 },
];
export const GENDER_DRP1 = [
	{ name: 'Female', value: '2', key: uuid() },
	{ name: 'Male', value: '1', key: uuid() },
	{ name: 'Other', value: '3', key: uuid() },
];
export const SuggestionCategoryDrpData = [
	{ name: 'Accepted', key: '7' },
	{ name: 'Rejected', key: '8' },
];

export const AnnouncementType = [
	{ name: 'Pending', key: '0' },
	{ name: 'In-Progress', key: '1' },
	{ name: 'Announced', key: '2' },
];
export const AnnouncementAddType = [
	{ name: 'Email', key: 'email' },
	{ name: 'Push', key: 'push' },
	{ name: 'Sms', key: 'sms' },
];
export const SettingsDrpData = [
	{ name: 'Default Language', key: '' },
	{ name: 'Es', key: '0' },
	{ name: 'En', key: '1' },
	{ name: 'Fr', key: '2' },
];

export const AnnouncementRole = [
	{ name: 'Customer', key: '0' },
	{ name: 'Admin', key: '1' },
	{ name: 'SuperAdmin', key: '2' },
];

export const AnnouncementPlatform = [
	{ name: 'All', key: 'all' },
	{ name: 'Android', key: 'android' },
	{ name: 'Ios', key: 'ios' },
	{ name: 'Web', key: 'web' },
];
export const SETTINGS_RADIO_SIDEBAR_OPTIONS = [
	{ name: 'onHover', value: '1', key: uuid() },
	{ name: 'Normal', value: '0', key: uuid() },
];

export const SETTINGS_RADIO_DEVICE_TRACKING_OPTIONS = [
	{ name: 'Single', value: 'single', key: uuid() },
	{ name: 'Multiple', value: 'multiple', key: uuid() },
];

export const imageUploadServerDrp = [
	{ name: '--Select Images Upload Server--', key: '' },
	{ name: 'Local Server', key: 'Local_Server' },
	{ name: 'S3 Server', key: 'S3_Server' },
	{ name: 'Both Server', key: 'Both_Server' },
];

export const ModuleNames = ['CMS Management', 'FAQ Management', 'ROLE', 'SUB ADMIN', 'EMAIL TEMPLATE', 'USER', 'SETTINGS', 'CATEGORY', 'Suggestion', 'EVENT MANAGEMENT', 'Entity Lock'];
export const ROUTES: { [key: string]: string } = {
	login: 'login',
	app: 'app',
	dashboard: 'dashboard',
	forgotPassword: 'forgot-password',
	resetPassword: 'reset-password',
	resetToken: 'token',
	subAdmin: 'sub-admin',
	state: 'state',
	faq: 'faq',
	settings: 'settings',
	CMS: 'cms',
	review: 'review',
	country: 'country',
	enquiry: 'enquiry',
	user: 'manage-user',
	banner: 'manage-banner',
	event: 'event',
	city: 'city',
	suggestion: 'suggestion',
	notifications: 'notification',
	manageRulesSets: 'rules-sets',
	announcement: 'announcement',
	rolePermissions: 'role-permissions',
	profile: 'profile',
	category: 'category',
	manageOffer: 'manage-offer',
	geg: 'geg',
	reset: 'reset',
	activityTracking: 'activity-tracking',
	email: 'email',
	bsMedia: 'bs-media',
	userReport: 'user-report',
	list: 'list',
	add: 'add',
	edit: 'edit',
	view: 'view',
	treeview: 'treeview',
};
export const RedirectPages = {
	dashBoard: '/app/dashboard',
	user: `/${ROUTES.app}/${ROUTES.user}`,
	role: `/${ROUTES.app}/${ROUTES.role}`,
	subAdmin: `/${ROUTES.app}/${ROUTES.subAdmin}`,
	cms: `/${ROUTES.app}/${ROUTES.CMS}`,
	suggestion: `/${ROUTES.app}/${ROUTES.suggestion}`,
	review: `/${ROUTES.app}/${ROUTES.review}`,
	country: `/${ROUTES.app}/${ROUTES.country}`,
	state: `/${ROUTES.app}/${ROUTES.state}`,
	city: `/${ROUTES.app}/${ROUTES.city}`,
	faq: `/${ROUTES.app}/${ROUTES.faq}`,
	enquiry: `/${ROUTES.app}/${ROUTES.enquiry}`,
	settings: `/${ROUTES.app}/${ROUTES.settings}`,
	events: `/${ROUTES.app}/${ROUTES.event}`,
	category: `/${ROUTES.app}/${ROUTES.category}`,
	notification: `/${ROUTES.app}/${ROUTES.notifications}`,
	banner: `/${ROUTES.app}/${ROUTES.banner}`,
	manageRulesSets: `/${ROUTES.app}/${ROUTES.manageRulesSets}`,
	announcement: `/${ROUTES.app}/${ROUTES.announcement}`,
	rolePermissions: `/${ROUTES.app}/${ROUTES.rolePermissions}`,
	manageOffer: `/${ROUTES.app}/${ROUTES.manageOffer}`,
	activityTracking: `/${ROUTES.app}/${ROUTES.activityTracking}`,
	email: `/${ROUTES.app}/${ROUTES.email}`,
	bsMedia: `/${ROUTES.app}/${ROUTES.bsMedia}`,
	userReport: `/${ROUTES.app}/${ROUTES.userReport}`,
};

export const privateRoutes: { path: string; element: React.LazyExoticComponent<() => React.ReactElement>; permission?: string[] }[] = [
	{ path: ROUTES.dashboard, element: Dashboard },
	{ path: `${ROUTES.subAdmin}/${ROUTES.list}`, element: SubAdmin, permission: [PERMISSION_LIST.SubAdmin.ListAccess] },
	{ path: `${ROUTES.subAdmin}/add`, element: AddEditSubAdmin, permission: [PERMISSION_LIST.SubAdmin.AddAccess] },
	{ path: `${ROUTES.subAdmin}/edit/:id`, element: AddEditSubAdmin, permission: [PERMISSION_LIST.SubAdmin.EditAccess] },
	{ path: `${ROUTES.state}/list`, element: State, permission: [PERMISSION_LIST.State.ListAccess] },
	{ path: `${ROUTES.state}/add`, element: AddEditState, permission: [PERMISSION_LIST.State.AddAccess] },
	{ path: `${ROUTES.state}/edit/:id`, element: AddEditState, permission: [PERMISSION_LIST.State.EditAccess] },
	{ path: `${ROUTES.CMS}/list`, element: CMS, permission: [PERMISSION_LIST.CMS.ListAccess] },
	{ path: `${ROUTES.CMS}/add`, element: AddEditCms, permission: [PERMISSION_LIST.CMS.AddAccess] },
	{ path: `${ROUTES.CMS}/edit/:id`, element: AddEditCms, permission: [PERMISSION_LIST.CMS.EditAccess] },
	{ path: `${ROUTES.review}/list`, element: Review, permission: [PERMISSION_LIST.CMS.ListAccess] },
	{ path: `${ROUTES.country}/list`, element: Country, permission: [PERMISSION_LIST.Country.ListAccess] },
	{ path: `${ROUTES.country}/add`, element: AddEditCountry, permission: [PERMISSION_LIST.Country.AddAccess] },
	{ path: `${ROUTES.country}/edit/:id`, element: AddEditCountry, permission: [PERMISSION_LIST.Country.EditAccess] },
	{ path: `${ROUTES.faq}/list`, element: FaqManagement, permission: [PERMISSION_LIST.FAQ.ListAccess] },
	{ path: `${ROUTES.faq}/add`, element: AddEditFaq, permission: [PERMISSION_LIST.FAQ.AddAccess] },
	{ path: `${ROUTES.faq}/edit/:id`, element: AddEditFaq, permission: [PERMISSION_LIST.FAQ.EditAccess] },
	{ path: `${ROUTES.settings}`, element: Settings, permission: [] },
	{ path: `${ROUTES.enquiry}/list`, element: Enquiry, permission: [PERMISSION_LIST.Enquiry.ListAccess] },
	{ path: `${ROUTES.enquiry}/add`, element: AddEnquiry, permission: [PERMISSION_LIST.Enquiry.AddAccess] },
	{ path: `${ROUTES.suggestion}/list`, element: Suggestion, permission: [PERMISSION_LIST.Suggestion.ListAccess] },
	{ path: `${ROUTES.suggestion}/Add`, element: AddSuggestion, permission: [PERMISSION_LIST.Suggestion.AddAccess] },
	{ path: `${ROUTES.user}/list`, element: UserManagement, permission: [PERMISSION_LIST.UserManagement.ListAccess] },
	{ path: `${ROUTES.announcement}/list`, element: Announcement, permission: [PERMISSION_LIST.Announcement.AddAccess] },
	{ path: `${ROUTES.announcement}/add`, element: AddAnnouncement, permission: [PERMISSION_LIST.Announcement.AddAccess] },
	{ path: `${ROUTES.announcement}/view/:id`, element: ViewAnnouncement, permission: [PERMISSION_LIST.Announcement.ViewAccess] },
	{ path: `${ROUTES.user}/add`, element: AddEditUser, permission: [PERMISSION_LIST.UserManagement.AddAccess] },
	{ path: `${ROUTES.user}/edit/:id`, element: AddEditUser, permission: [PERMISSION_LIST.UserManagement.EditAccess] },
	{ path: `${ROUTES.user}/view/:id`, element: ViewUser, permission: [PERMISSION_LIST.UserManagement.ViewAccess] },
	{ path: `${ROUTES.city}/list`, element: City, permission: [PERMISSION_LIST.City.ListAccess] },
	{ path: `${ROUTES.city}/add`, element: AddEditCity, permission: [PERMISSION_LIST.City.AddAccess] },
	{ path: `${ROUTES.city}/edit/:id`, element: AddEditCity, permission: [PERMISSION_LIST.City.EditAccess] },
	{ path: `${ROUTES.banner}/list`, element: Banner, permission: [PERMISSION_LIST.Banner.ListAccess] },
	{ path: `${ROUTES.banner}/add`, element: AddEditBanner, permission: [PERMISSION_LIST.Banner.AddAccess] },
	{ path: `${ROUTES.banner}/edit/:id`, element: AddEditBanner, permission: [PERMISSION_LIST.Banner.EditAccess] },
	{ path: `${ROUTES.event}/list`, element: EventManagement, permission: [] },
	{ path: `${ROUTES.event}/edit/:id`, element: AddEditEvents, permission: [] },
	{ path: `${ROUTES.event}/view/:id`, element: ViewEvent, permission: [] },
	{ path: `${ROUTES.event}/add`, element: AddEditEvents, permission: [] },
	{ path: `${ROUTES.category}`, element: ManageCategory, permission: [] },
	{ path: `${ROUTES.category}/list`, element: ManageCategory, permission: [] },
	{ path: `${ROUTES.category}/edit/:id`, element: AddEditCategory, permission: [] },
	{ path: `${ROUTES.category}/add`, element: AddEditCategory, permission: [] },
	{ path: `${ROUTES.category}/treeview`, element: CategoryTreeView, permission: [] },
	{ path: `${ROUTES.notifications}/list`, element: NotificationsTemplate, permission: [] },
	{ path: `${ROUTES.notifications}/add`, element: AddEditNotification, permission: [] },
	{ path: `${ROUTES.notifications}/edit/:id`, element: AddEditNotification, permission: [] },
	{ path: `${ROUTES.notifications}/view/:id`, element: ViewNotification, permission: [] },
	{ path: `${ROUTES.suggestion}/list`, element: Suggestion, permission: [PERMISSION_LIST.Suggestion.ListAccess] },
	{ path: `${ROUTES.suggestion}/add`, element: AddSuggestion, permission: [PERMISSION_LIST.Suggestion.AddAccess] },
	{ path: `${ROUTES.manageRulesSets}/list`, element: ManageRulesSets, permission: [] },
	{ path: `${ROUTES.manageRulesSets}/add`, element: AddEditRulesSets, permission: [] },
	{ path: `${ROUTES.manageRulesSets}/edit/:id`, element: AddEditRulesSets, permission: [] },
	{ path: `${ROUTES.profile}`, element: UpdateProfileForm, permission: [] },
	{ path: `${ROUTES.rolePermissions}`, element: RolePermissions, permission: [PERMISSION_LIST.Role.ListAccess] },
	{ path: `${ROUTES.manageOffer}/list`, element: ManageOffer, permission: [PERMISSION_LIST.Coupon.ListAccess] },
	{ path: `${ROUTES.manageOffer}/add`, element: AddeditManageOffer, permission: [PERMISSION_LIST.Coupon.AddAccess] },
	{ path: `${ROUTES.manageOffer}/edit/:id`, element: AddeditManageOffer, permission: [PERMISSION_LIST.Coupon.EditAccess] },
	{ path: `${ROUTES.activityTracking}/list`, element: ActivityTracking },
	{ path: `${ROUTES.email}/list`, element: EmailNotificationTemplate, permission: [PERMISSION_LIST.EmailTemplate.ListAccess] },
	{ path: `${ROUTES.email}/add`, element: AddEditEmailTemplate, permission: [PERMISSION_LIST.EmailTemplate.AddAccess] },
	{ path: `${ROUTES.email}/edit/:id`, element: AddEditEmailTemplate, permission: [PERMISSION_LIST.EmailTemplate.EditAccess] },
	{ path: `${ROUTES.bsMedia}/list`, element: BsMedia, permission: [PERMISSION_LIST.BsMedia.ListAccess] },
	{ path: `${ROUTES.userReport}/list`, element: UserReport, permission: [PERMISSION_LIST.UserReport.ListAccess] },
];

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

export const LANGUAGE_DROPDOWN_LIST = [
	{ data: 'en', content: 'EN' },
	{ data: 'es', content: 'ES' },
];
export const PROFILE_DROPDOWN_LIST = [
	{ content: 'Profile', icon: User, data: 'profile', route: `/${ROUTES.app}/${ROUTES.profile}` },
	{ content: 'Logout', icon: Lock, data: 'Logout' },
];
export const ANNOUNCEMENT_RADIO_TYPE_LIST = [
	{ name: 'Email', value: 0, key: uuid() },
	{ name: 'Push', value: 1, key: uuid() },
	{ name: 'SMS', value: 2, key: uuid() },
];
export const ANNOUNCEMENT_RADIO_PLATFORM_LIST = [
	{
		name: 'All',
		value: 'all',
		key: uuid(),
	},
	{
		name: 'Android',
		value: 'android',
		key: uuid(),
	},
	{
		name: 'Ios',
		value: 'ios',
		key: uuid(),
	},
	{
		name: 'Web',
		value: 'web',
		key: uuid(),
	},
];
export const ANNOUNCEMENT_RADIO_USER_TYPE_LIST = [
	{
		name: 'All',
		value: 'all',
		key: uuid(),
	},
	{
		name: 'Customer',
		value: 'customer',
		key: uuid(),
	},
	{
		name: 'Admin',
		value: 'admin',
		key: uuid(),
	},
	{
		name: 'SubAdmin',
		value: 'subAdmin',
		key: uuid(),
	},
];
export const ANNOUNCEMENT_RADIO_USER_FILTER_OPTIONS = [
	{ name: 'All', value: 'all', key: uuid() },
	{ name: 'User to Exclude', value: 'userToExclude', key: uuid() },
	{ name: 'Only Send To', value: 'onlySendTo', key: uuid() },
];
export const COUPON_RADIO_OPTION_COUPON_TYPE = [
	{ name: 'Percentage', value: 0, key: uuid() },
	{ name: 'Amount', value: 1, key: uuid() },
];
export const COUPON_RADIO_IS_REUSABLE_OPTIONS = [
	{ name: 'One Time', value: 0, key: uuid() },
	{ name: 'Multiple Time', value: 1, key: uuid() },
];
export const COUPON_RADIO_APPLICABLE_OPTIONS = [
	{ name: 'All', value: 0, key: uuid() },
	{ name: 'Selected users', value: 1, key: uuid() },
];
export const EVENTS_RADIO_IS_RECURRING_OPTIONS = [
	{ name: 'Never', value: 0, key: uuid() },
	{ name: 'Daily', value: 1, key: uuid() },
];

export const SIDEBAR_NAVLINKS: sidebarNavlinksArray[] = [
	{
		to: `/${ROUTES.app}/${ROUTES.subAdmin}/${ROUTES.list}`,
		text: 'Manage Sub Admin',
		icon: <ProfileIcon />,
		redirectPage: RedirectPages.subAdmin,
		childRoutes: [],
		permissions: [PERMISSION_LIST.SubAdmin.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.user}/${ROUTES.list}`,
		text: 'Manage User',
		icon: <ProfileIcon />,
		redirectPage: RedirectPages.user,
		childRoutes: [],
		permissions: [PERMISSION_LIST.UserManagement.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.location}`,
		text: 'Manage Location',
		icon: <Marker />,
		redirectPage: '',
		childRoutes: [
			{
				to: `/${ROUTES.app}/${ROUTES.country}/${ROUTES.list}`,
				text: 'Manage Country',
				redirectPage: RedirectPages.country,
				icon: <ArrowRight />,
				permissions: [PERMISSION_LIST.Country.ListAccess],
			},
			{
				to: `/${ROUTES.app}/${ROUTES.state}/${ROUTES.list}`,
				text: 'Manage State',
				redirectPage: RedirectPages.state,
				icon: <ArrowRight />,
				permissions: [PERMISSION_LIST.State.ListAccess],
			},
			{
				to: `/${ROUTES.app}/${ROUTES.city}/${ROUTES.list}`,
				text: 'Manage City',
				redirectPage: RedirectPages.city,
				icon: <ArrowRight />,
				permissions: [PERMISSION_LIST.City.ListAccess],
			},
		],
		permissions: [PERMISSION_LIST.City.ListAccess, PERMISSION_LIST.State.ListAccess, PERMISSION_LIST.Country.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.CMS}/${ROUTES.list}`,
		text: 'CMS Management',
		icon: <Document />,
		redirectPage: RedirectPages.cms,
		childRoutes: [],
		permissions: [PERMISSION_LIST.CMS.ListAccess],
	},
	// {
	//   to: `/${ROUTES.app}/${ROUTES.category}/${ROUTES.list}`,
	//   text: 'Manage Category',
	//   icon: <Category />,
	//   redirectPage: RedirectPages.category,
	//   childRoutes: [],
	// permissions:[]

	// },
	{
		to: `/${ROUTES.app}/${ROUTES.email}/${ROUTES.list}`,
		text: 'Email',
		icon: <Email />,
		redirectPage: RedirectPages.email,
		childRoutes: [],
		permissions: [PERMISSION_LIST.EmailTemplate.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.faq}/${ROUTES.list}`,
		text: 'FAQ Management',
		icon: <Question />,
		redirectPage: RedirectPages.faq,
		childRoutes: [],
		permissions: [PERMISSION_LIST.FAQ.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.enquiry}/${ROUTES.list}`,
		text: 'Enquiry',
		icon: <PhoneCall />,
		redirectPage: RedirectPages.enquiry,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Enquiry.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.suggestion}/${ROUTES.list}`,
		text: 'Suggestion',
		icon: <SuggestionIcon />,
		redirectPage: RedirectPages.suggestion,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Suggestion.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.announcement}/list`,
		text: 'Announcement',
		icon: <Megaphone />,
		redirectPage: RedirectPages.announcement,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Announcement.ListAccess],
	},

	{
		to: `/${ROUTES.app}/${ROUTES.activityTracking}/${ROUTES.list}`,
		text: 'Activity Tracking',
		icon: <TimerIcon />,
		redirectPage: RedirectPages.activityTracking,
		childRoutes: [],
		permissions: [PERMISSION_LIST.ActivityTracking.ListAccess],
	},

	{
		to: `/${ROUTES.app}/${ROUTES.banner}/${ROUTES.list}`,
		text: 'Manage Banner',
		icon: <BannerIcon />,
		redirectPage: RedirectPages.banner,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Banner.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.manageOffer}/${ROUTES.list}`,
		text: 'Manage Offer',
		icon: <Gift />,
		redirectPage: RedirectPages.manageOffer,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Coupon.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.review}/${ROUTES.list}`,
		text: 'Review',
		icon: <Star />,
		redirectPage: RedirectPages.review,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Review.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.userReport}/${ROUTES.list}`,
		text: 'User Report',
		icon: <UserReportIcon />,
		redirectPage: RedirectPages.userReport,
		childRoutes: [],
		permissions: [PERMISSION_LIST.UserReport.ListAccess],
	},
	// {
	//   to: `/${ROUTES.app}/${ROUTES.manageRulesSets}/${ROUTES.list}`,
	//   text: 'Manage Rule Sets',
	//   icon: <ManageRulesSetsIcon />,
	//   redirectPage: RedirectPages.manageRulesSets,
	//   childRoutes: [],
	// permissions:[]

	// },
	// {
	//   to: `/${ROUTES.app}/${ROUTES.event}/${ROUTES.list}`,
	//   text: 'Event Management',
	//   icon: <DateCalendar />,
	//   redirectPage: RedirectPages.events,
	//   childRoutes: [],
	// permissions:[]

	// },
	{
		to: `/${ROUTES.app}/${ROUTES.rolePermissions}`,
		text: 'Role Permissions',
		icon: <Lock />,
		redirectPage: RedirectPages.rolePermissions,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Role.ListAccess, PERMISSION_LIST.Permission.ListAccess],
	},
	// {
	//   to: `/${ROUTES.app}/${ROUTES.notifications}/${ROUTES.list}`,
	//   text: 'Notification',
	//   icon: <Bell />,
	//   redirectPage: RedirectPages.notification,
	//   childRoutes: [],
	// permissions:[]

	// },
	{
		to: `/${ROUTES.app}/${ROUTES.bsMedia}/${ROUTES.list}`,
		text: 'Bs Media',
		icon: <ClipBoardIcon />,
		redirectPage: RedirectPages.bsMedia,
		childRoutes: [],
		permissions: [PERMISSION_LIST.BsMedia.ListAccess],
	},
	{
		to: `/${ROUTES.app}/${ROUTES.settings}`,
		text: 'Settings',
		icon: <SettingsSliders />,
		redirectPage: RedirectPages.settings,
		childRoutes: [],
		permissions: [PERMISSION_LIST.Settings.ListAccess],
	},
];

export const EMAIL_TEMPLATE_RADIO_TYPE_LIST = [
	{ name: 'Email', value: 1, key: uuid() },
	{ name: 'Push', value: 2, key: uuid() },
	{ name: 'SMS', value: 3, key: uuid() },
];

//Consts used in the SubAdmin Module.
export const USERFILTERTYPE = {
	userToExclude: 'userToExclude',
	onlySendTo: 'onlySendTo',
};

export const ANNOUCEMENTTYPE = {
	zero: '0',
	one: '1',
	two: '2',
};

export const FILE_TYPE: { [key: string]: string } = {
	image: 'image',
	audio: 'audio',
	video: 'video',
	application: 'application',
};

export const MODEL_TYPE: { [Key: string]: string } = {
	add: 'add',
	rename: 'rename',
	move: 'move',
	delete: 'delete',
};
export const ENQUIRYSTATUSDRP = [
	{ name: 'Select Status', key: '' },
	{ name: 'Working', key: 5 },
	{ name: 'Closed', key: 6 },
];
export const TEMPLATE_TYPE: { [key: string]: string } = {
	'1': 'Email',
	'2': 'Push',
	'3': 'SMS',
};

export const IMAGE_BASE_URL = process.env.REACT_APP_API_BASENODE;
export const UPLOAD_IMAGE_URL = process.env.REACT_APP_API_IMAGE_URL;
export const REACT_APP_API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY_URL;
export const REACT_APP_ENCRYPTION_DECRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_DECRYPTION_KEY;
export const NODE_ENV = process.env.NODE_ENV;

export const ACTIVE_FILE_TYPE: { [key: string]: string } = {
	everything: 'everything',
	image: 'image',
	audio: 'audio',
	video: 'video',
	document: 'application',
};

export const DOWLOAD_FILE_TYPE: { [key: string]: string } = {
	csv: 'csv',
	pdf: 'pdf',
	excel: 'xlsx',
};

export enum AcceptedImageFileType {
	'image/jpeg' = 'image/jpeg',
	'image/jpg' = 'image/jpg',
	'image/png' = 'image/png',
}
export const AcceptedFileSize = {
	fileSize: 2000000,
};

export const STATUS = {
	inactive: 0,
	active: 1,
	draft: 2,
	deleted: 3,
	Pending: 4,
	Working: 5,
	Closed: 6,
	Accepted: 7,
	Rejected: 8,
};

export const IS_ALL = true;

export const OFFER_TYPE = {
	percentage: 0,
	amount: 1,
};

export const APPLICABLE = {
	all: 0,
	selectedUser: 1,
};

export const OFFER_USAGE = {
	oneTime: 0,
	multipleTime: 1,
};

export const EXPORT_CSV_PDF_EXCEL_CONSTANTS: { [key: string]: string } = {
	suggestion: 'suggestion',
	user: 'user',
	offer: 'offers',
	activityTracking: 'activity-tracking',
	csv: 'csv',
	pdf: 'pdf',
	excel: 'excel',
	global: 'global',
	all: 'all',
};

//Default status is used is used in some of the based on requirement ...
export const DEFAULT_STATUS = '1';

//Used in BS-MEDIA Module based on the const file we can manipulate the Data...
export enum addNewBsMediaConstant {
	add = 'add',
	rename = 'rename',
	move = 'move',
	delete = 'delete',
}

export const enum bsMediaViewDetailsConstant {
	image = 'image',
	audio = 'audio',
	video = 'video',
}

export const BsMediaDirectionDrpData = [
	{ name: 'Direction', key: '' },
	{ name: 'Ascending', key: 'asc' },
	{ name: 'Descending', key: 'desc' },
];
export const BsMediaOrderByDrpData = [
	{ name: 'Order By', key: '' },
	{ name: 'Title', key: 'name' },
	{ name: 'Size', key: 'size' },
];
//For default Offertype in Coupon Management module .
export const DEFAULT_OFFERTYPE = '0';

//For Common Pagiantion we have used this variables....
export const MAX_DISPLAY_PAGE_COUNT = 3;
export const ACCEPTED_FILETYPE_IN_ANNOUNCMENT: { [key: string]: string } = {
	'0': 'image/jpg,image/jpeg,image/png,application/*',
	'1': 'image/jpg,image/jpeg,image/png',
};
export const VALIDATION_FILETYPE_IN_ANNOUNCMENT: { [key: string]: string[] } = { '0': ['image/jpg', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv', 'text/plain', 'application/pdf'], '1': ['image/jpg', 'image/jpeg', 'image/png'] };
export const VALIDATION_ERROR_MESSAGES_IN_ANNOUNCEMENT: { [key: string]: string } = {
	'0': 'The email attachment must be a file of type: pdf, txt, doc, docx, xls, xlsx,csv, jpg, jpeg, png.',
	'1': 'The push image must be a file of type: jpeg, jpg, png.',
};
export const ANNOUNCEMENT_TYPE_LIST: { [key: string]: string } = {
	'0': 'email',
	'1': 'push',
	'2': 'sms',
};

export const PLATFORM: { [key: string]: string } = {
	email: 'Email',
	push: 'PUSH',
	sms: 'SMS',
};
export const HeaderNamesObj: { [key: string]: string } = {
	add: 'New Folder',
	rename: 'Rename Folder Or File',
	move: 'Move to destination folder',
};

export enum bsMediaNavTabs {
	everything = 'everything',
	image = 'image',
	video = 'video',
	audio = 'audio',
	document = 'document',
}
export enum AccesibilityNames {
	Edit = 'Edit',
	View = 'View',
	Delete = 'Delete',
	ChangeStatus = 'Change Status',
	ChangePassword = 'Change Password',
	Excel = 'Excel',
	PDF = 'PDF',
	CSV = 'CSv',
	Dashboard = 'Dashboard',
	Status = 'Status',
	Entries = 'Entries',
	sortOrder = 'SortOrder',
	sortBy = 'sortBy',
	annoucemntType = 'Annoucemnt Type',
	platform = 'Platform',
	countryId = 'country Id',
	stateId = 'State Id',
	role = 'Role',
	categoryId = 'Category Id',
	gender = 'Gender',
	goToFirst = 'Go to first',
	gotoEnd = 'Go to end',
	next = 'Next',
	previous = 'Previous',
	profile = 'Profile',
}

export const dataMapping: DataMapping = {
	userToExclude: 'User To Exclude',
	all: 'All',
	email: 'Email',
	onlySendTo: 'Only Send To',
	customer: 'Customer',
	subAdmin: 'SubAdmin',
	admin: 'Admin',
	android: 'Android',
	ios: 'Ios',
	web: 'Web',
};
export const EnquiryDrpData = [
	{ name: 'Select Status', key: '' },
	{ name: 'Close', key: '6' },
	{ name: 'Working', key: '5' },
	{ name: 'Pending', key: '4' },
];

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

export enum OfferTypeEnum {
	Amount = 1,
	Percentage = 0,
}

export enum OfferUsageEnum {
	'One Time' = 0,
	'Multiple Times' = 1,
}
export enum OfferApplicableEnum {
	'Selected Users' = 1,
	'All Users' = 0,
}
export enum UserGenderEnum {
	Male = 1,
	Female = 2,
	other = 3
}

export enum AnnouncementEnum {
	'In-Progress' = 1
}
