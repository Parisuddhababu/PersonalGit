import { roleData } from '@type/role';

export type LoginResponse = {
	loginUser: {
		data: {
			token: string;
			user: {
				email: string;
				uuid: string;
				first_name: string;
				last_name: string;
				profile_img: string;
			};
			expiresIn: string;
			permissions: string[];
			refreshToken: string;
			expiresAt: string;
		};
		meta: MetaRes;
	};
};

export type ForgotPasswordResponse = {
	forgotPassword: {
		meta: MetaRes;
	};
};

export type ResetPasswordResponse = {
	resetPassword: {
		meta: MetaRes;
	};
};

export type RoleResponse = {
	fetchRoles: {
		data: {
			Roledata: roleDataArr[];
		};
		meta: MetaRes;
	};
};

export type DeleteRoleRes = {
	deleteRole: {
		data: roleData;
		meta: MetaRes;
	};
};

export type MetaRes = {
	message: string;
	messageCode: string;
	status: string;
	statusCode: number;
	status: string;
	type: string;
	errors: { errorField: string; error: string; __typename: string }[];
	errorType: string;
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

export type SubAdminData = {
	subAdminData: SubAdminDataArr;
	count: number;
};

export type UserDataType = {
	userList: UserData[];
	count: number;
};

export type SubAdminDataArr = {
	id: number;
	first_name: string;
	last_name: string;
	user_name: string;
	email: string;
	password: string;
	role: number;
	status: number;
	created_at: string;
	updated_at: string;
	uuid: string;
	serialNo: number;
	Role: {
		role_name: string;
	};
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

export type CatalougeData = {
	name: string
	url: string
	description: string
	sku: string
	images: string
	color: string
	size: string
	price: string
};

export type UpdateRoleStatusType = {
	updateRoleStatus: {
		data: roleData;
		meta: MetaRes;
	};
};

export type UpdateSubAdminStatusType = {
	changeSubAdminStatus: {
		data: SubAdminData;
		meta: MetaRes;
	};
};

export type DeleteSubAdminType = {
	deleteSubAdmin: {
		data: SubAdminData;
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
	uuid: string;
	serialNo: number;
	description: string;
};


export type CreateSubAdminRes = {
	createSubAdmin: {
		data: SubAdminData;
		meta: MetaRes;
	};
};

export type UpdateSubAdmin = {
	updateSubAdmin: {
		data: SubAdminData;
		meta: MetaRes;
	};
};


export type CreateCatalouge = {
	createProduct: {
		data: CatalougeData;
		meta: MetaRes;
	};
};

export type CreateInfluencer = {
	createUser: {
		data: UserData;
		meta: MetaRes;
	};
};
export type UpdateUser = {
	updateUser: {
		data: UserData;
		meta: MetaRes;
	};
};
export type UpdateCatalouge = {
	updateProduct: {
		data: CatalougeData;
		meta: MetaRes;
	};
};
export type updateUserProfile = {
	updateUserProfile: {
		data: UserData;
		meta: MetaRes;
	};
};
export type ChangeUserPasswordRes = {
	changeUserPassword: {
		meta: MetaRes;
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
	uuid: string;
};
export type RolePermissionsData = {
	permissondata: RolePermissionsDataArr[];
	count: number;
};

export type CreateAndRolePermissionsData = {
	meta: MetaRes;
};


