
export const PERMISSION_LIST = {
	Dashboard: {
		DashboardAccess: '',
	},
	SubAdmin: {
		ListAccess: 'SUB_ADMIN_LIST',
		AddAccess: 'SUB_ADMIN_ADD',
		EditAccess: 'SUB_ADMIN_EDIT',
		ChangeStatusAccess: 'SUB_ADMIN_CHANGE_STATUS',
		DeleteAccess: 'SUB_ADMIN_DELETE',
	},

	Role: {
		ListAccess: 'ADMIN_ROLE_LIST',
		AddAccess: 'ADMIN_ROLE_ADD',
		EditAccess: 'ADMIN_ROLE_UPDATE',
		ChangeStatusAccess: 'ROLE_CHANGE_STATUS',
		DeleteAccess: 'ADMIN_ROLE_DELETE',
	},
	Permission: {
		ListAccess: 'ADMIN_ROLE_PERMISSION_VIEW',
		createAccess: 'ADMIN_ROLE_PERMISSION_ADD',
	},
	Settings: {
		ListAccess: 'SETTINGS_LIST',
		EditAccess: 'SETTINGS_UPDATE',
	},

	Influencer: {
		ListAccess: 'INFLUENCER_LIST',
		AddAccess: 'INFLUENCER_ADD',
		EditAccess: 'INFLUNCER_UPDATE',
		DeleteAccess: 'INFLUNCER_DELETE',
		ViewAccess: 'INFLUNCER_VIEW',
		ChangeStatusAccess: 'INFLUENCER_CHANGE_STATUS',
	},
	ContactUs: {
		ListAccess: 'ENQUIRY_LIST',
	},
	CMS: {
		ListAccess: 'CMS_LIST',
		EditAccess: 'CMS_UPDATE',

	}
	,
	Catalogue: {
		ListAccess: 'FETCH_CATALOGUE',
		AddAccess: 'CREATE_CATALOGUE',
		EditAccess: 'UPDATE_CATALOGUE',
		DeleteAccess: 'DELETE_CATALOGUE',
	},
	brandUserRequest: {
		ListAccess: 'BRAND_USER_REQUEST_LIST',
		EditAccess: 'BRAND_USER_REQUEST_EDIT',
		DeleteAccess: 'BRAND_USER_REQUEST_DELETE',
		ViewAccess: 'BRAND_USER_REQUEST_VIEW'
	},
	manageBrandUser: {
		ListAccess: 'BRAND_USER_LIST',
		AddAccess: 'BRAND_USER_ADD',
		EditAccess: 'BRAND_USER_UPDATE',
		DeleteAccess: 'BRAND_USER_DELETE',
		ChangeStatusAccess: 'CHANGE_BRAND_STATUS',
		ViewAccess: 'BRAND_USER_VIEW',
	},
	PlanManagement: {
		ListAccess: 'PLAN_LIST',
		EditAccess: 'PLAN_UPDATE',
		AddAccess: 'PLAN_ADD',
		DeleteAccess: 'PLAN_DELETE',
		ChangeStatusAccess: 'PLAN_CHANGE_STATUS',
	},
	PlatformManagement: {
		ListAccess: 'PLATFORM_LIST',
		ChangeStatusAccess: 'PLATFORM_CHANGE_STATUS',
	}
};
