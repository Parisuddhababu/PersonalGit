export type AddEditSubAdmin = {
	onClose: () => void;
	editData: SubAdminArr | null;
	onSubmit: () => void;
	disabled: boolean;
};

export type CreateSubAdmin = {
	firstName: string;
	lastName: string;
	email: string;
	password?: string;
	confirmPassword?: string;
	roleId: string;
};

export type SubAdminArr = {
	userData: {
		id: number;
		uuid: string;
		firstName: string;
		lastName: string;
		email: string;
		isActive: boolean;
		createdAt: string;
	};
	roleData: {
		id: number;
		uuid: string;
		name: string;
		description: string;
	};
};

export type SubAdminData = {
	status: number;
	message: string;
	data: {
		subAdminList: SubAdminArr[];
		count: number;
	};
};
