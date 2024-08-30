export type LoginResponse = {
	loginUser: {
		data: {
			token: string;
			user: {
				email: string;
				id: string;
			};
		};
		meta: {
			message: string;
			statusCode: number;
		};
	};
};

export type ForgotPasswordResponse = {
	forgotPassword: {
		id: number;
		message: string;
		link: string;
	};
};

export type ResetPasswordResponse = {
	resetPassword: {
		message: string;
	};
};

export type RolePermissionsDataArr = {
	id: string;
	module_id: number;
	permission_name: string;
	key: string;
	status: number;
	created_by: int;
	createdAt: string;
	updatedAt: string;
};
export type RolePermissionsData = {
	permissondata: RolePermissionsDataArr[];
	count: number;
};

export type CreateAndRolePermissionsData = {
	meta: MetaRes;
};

export type RoleResponse = {
	fetchRoles: {
		data: {
			Roledata: roleDataArr[];
		};
		meta: MetaRes;
	};
};

export type MetaRes = {
	message: string;
	status: string;
	statusCode: number;
};

export type RoleCreateRes = {
	createRole: {
		data: roleData;
		meta: MetaRes;
	};
};

export type RoleData = {
	Roledata: roleDataArr;
	count: number;
};

export type UpdateRoleStatusType = {
	updateStatusRole: {
		data: roleData;
		meta: MetaRes;
	};
};

export type UpdateRoleDataType = {
	updateRole: {
		data: roleData;
		meta: MetaRes;
	};
};

export type RoleDataArr = {
	created_at: string;
	key: string;
	role_name: string;
	status: number;
	updated_at: string;
	uuid: string;
	id: string;
};

export type roleDataArr = {
	id: number;
	uuid: string;
	status: number;
	role_name: string;
};
export type roleData = {
	Roledata: roleDataArr;
	count: number;
};
export type SettingsDataArr = {
	site_name: sring;
	tag_line: string;
	support_email: string;
	contact_email: string;
	contact_no: string;
	app_language: string;
	address: string;
	logo: string;
	favicon: string;
};
export type UserDataType = {
	userList: UserData;
	count: number;
};

export type UserData = {
	created_at: string;
	date_of_birth: string;
	email: string;
	first_name: string;
	gender: number;
	id: number;
	last_name: string;
	middle_name: string;
	phone_country_id: string;
	phone_no: string;
	profile_img: string;
	role: number;
	status: number;
	updated_at: string;
	user_name: string;
	user_role_id: number;
	uuid: string;
};

export type countryArrList = {
	country_code: string;
	name: string;
	status: number;
};
export type CountryDataArr = {
	id: number;
	country_code: string;
	status: number;
	created_at: string;
	updated_at: string;
	name: string;
	uuid: string;
};

export type CountryData = {
	countryData: CountryDataArr;
	count: number;
};

export type CountryDataArr = {
	id: number;
	uuid: string;
	name: string;
	country_code: string;
	status: string;
	created_at: string;
	updated_at: string;
};

export type CategoryDataArr = {
	id: number;
	uuid: string;
	category_name: string;
	parent_category: number;
	description: string;
	status: number;
	created_by: number;
	created_at: string;
	updated_at: string;
	parentData: {
		id: number;
		uuid: string;
		category_name: string;
		parent_category: number;
		description: string;
		status: number;
		created_by: number;
		created_at: string;
		updated_at: string;
	};
};

export type CategoryData = {
	Categorydata: CategoryDataArr;
	count: number;
};

export type categoryDataArr = {
	id: number;
	uuid: string;
	category_name: string;
	parent_category: number;
	description: string;
	status: number;
	created_by: number;
	created_at: string;
	updated_at: string;
	parentData: {
		id: number;
		uuid: string;
		category_name: string;
		parent_category: number;
		description: string;
		status: number;
		created_by: number;
		created_at: string;
		updated_at: string;
	};
};

export type categoryData = {
	Categorydata: CategoryDataArr;
	count: number;
};

export type ExculdeDataArr = {
	id: number;
	first_name: string;
	last_name: string;
	email: string;
	device_type: string;
	role: number;
	created_at: string;
};

export type AnnouncementDataArr = {
	id: number;
	title: string;
	status: number;
	created_at: string;
	annoucemnt_type: string;
	uuid: string;
	platform: string;
	start_date: string;
	end_date: string;
};

export type AnnouncementData = {
	announcementData: AnnouncementDataArr;
	count: number;
};
export type createAnnouncementRes = {
	createAnnouncement: {
		data: AnnouncementDataArr;
		meta: MetaRes;
	};
};
export type UserDataannounce = {
	created_at: string;
	date_of_birth: string;
	email: string;
	first_name: string;
	gender: number;
	id: number;
	last_name: string;
	middle_name: string;
	phone_country_id: string;
	phone_no: string;
	profile_img: string;
	role: number;
	status: number;
	updated_at: string;
	user_name: string;
	user_role_id: number;
	uuid: string;
	profile_img: string;
	device_type: string;
};
