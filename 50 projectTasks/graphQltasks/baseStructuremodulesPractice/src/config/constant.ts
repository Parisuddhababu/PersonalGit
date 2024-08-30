export const ROUTES: { [key: string]: string } = {
	login: 'login',
	app: 'app',
	dashboard: 'dashboard',
	forgotPassword: 'forgot-password',
	resetPassword: 'reset-password',
	resetToken: 'token',
	role: 'role',
	banner: 'banner',
	profile: 'profile',
	settings: 'settings',
	category: 'category',
	announcements: 'announcements',
};

export const KEYS = {
	authToken: 'authToken',
};

export const PAGE_LENGTH = 2;
export const SHOW_PAGE_COUNT_ARR = [10, 20, 40, 50];

export const Status_DropDown_select = [
	{ name: 'Active', key: '1' },
	{ name: 'Inactive', key: '0' },
];
export const Status_Announcement_Drp_select = [
	{ name: 'In-Progress', key: 1 },
	{ name: 'Announced', key: 0 },
];

export const ModuleNames = ['CMS Management', 'FAQ Management', 'Role', 'Sub Admin', 'Email Template', 'User', 'Settings', 'Category', 'Suggestion', 'Event Management', 'Entity Lock'];

export const ANNOUNCEMENT_TYPE = [
	{ name: 'email', key: 0 },
	{ name: 'push', key: 1 },
	{ name: 'SMS', key: 2 },
];
export const AnnouncementType = [
	{ name: 'Pending', key: '0' },
	{ name: 'In-Progress', key: '1' },
	{ name: 'Announced', key: '2' },
];
export const AnnouncementAddType = [
	{ name: 'email', key: 'email' },
	{ name: 'push', key: 'push' },
	{ name: 'sms', key: 'sms' },
];
export const AnnouncementPlatform = [
	{ name: 'all', key: 'all' },
	{ name: 'android', key: 'android' },
	{ name: 'ios', key: 'ios' },
	{ name: 'web', key: 'web' },
];

export const AnnouncementRole = [
	{ name: 'Customer', key: '0' },
	{ name: 'Admin', key: '1' },
	{ name: 'SuperAdmin', key: '2' },
];
export const SettingsDrpData = [
	{ name: 'Default Language', key: '' },
	{ name: 'Es', key: '0' },
	{ name: 'En', key: '1' },
	{ name: 'Fr', key: '2' },
];

export const RedirectPages = {
	dashBoard: '/app/dashboard',
	role: `/${ROUTES.app}/${ROUTES.role}`,
	settings: `/${ROUTES.app}/${ROUTES.settings}`,
	category: `/${ROUTES.app}/${ROUTES.category}`,
	banner: `/${ROUTES.app}/${ROUTES.banner}`,
	announcement: `/${ROUTES.app}/${ROUTES.announcement}`,
	profile: `/${ROUTES.app}/${ROUTES.profile}`,
};

export const DATE_FORMAT = {
	dateFormat: 'MM/dd/yyyy hh:mm:ss',
	dateShortFormat: 'MM/dd/yyyy',
	momentDateTime24Format: 'MM/DD/YYYY hh:mm:ss',
	momentDateTime12Format: 'MM/DD/YYYY h:mm A',
	momentTime24Format: 'hh:mm:ss',
	momentTime12Format: 'hh:mm A',
	momentDateFormat: 'MM/DD/YYYY',
	DateHoursMinFormat: 'YYYY-MM-DD hh:mm',
	simpleDateFormat: 'YYYY-MM-DD',
};
