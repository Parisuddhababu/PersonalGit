export type RoleEditProps = {
	onClose: () => void;
	editData: RoleObj | null;
	disableData: boolean;
	onSubmit: () => void;
};

export type roleData = {
	createdAt: string;
	key: string;
	roleName: string;
	status: number;
	updatedAt: string;
	uuid: string;
	id: string;
};

export type RoleChangeProps = {
	onClose: () => void;
	changeRoleStatus: () => void;
};

export type RoleInput = {
	name: string;
	description: string;
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	search: string;
};

export type RoleListResponse = {
	status: number;
	message: string;
	data: [
		{
			description: string;
			id: number;
			isActive: boolean;
			name: string;
			uuid: string;
		}
	];
	count: number;
};

export type RoleObj = {
	description: string;
	id: number;
	isActive: boolean;
	name: string;
	uuid: string;
};

export type RoleUpdateApiResponse = {
	name: string;
	description: string;
};

export type RolePermissionChildList = {
	id: number;
	moduleName: string;
	permissions: { id: number; name: string; uuid: string }[];
	uuid: string;
}[];

export type RoleUpdate = {
	roleId: string;
	permissionIds: string[];
};

export type UserPermissionsUpdate = {
	userId: string;
	permissionIds: string[];
};
