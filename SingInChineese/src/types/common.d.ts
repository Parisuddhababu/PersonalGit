export type ResetPasswordNavParams = {
	token: string;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	search: string;
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
};

export type ChangeStatusProps = {
	onClose: () => void;
	changeStatus: () => void;
};

export type DeleteDataProps = {
	onClose: () => void;
	deleteData: () => void;
	editData?: string;
	message?: string;
};

export type passwordFieldProps = {
	createdAt?: string;
	dateOfBirth?: string;
	email?: string;
	firstName?: string;
	gender?: number;
	id?: number;
	lastName?: string;
	middleName?: string;
	phoneCountryId?: string;
	phoneNo?: string;
	profileImg?: string;
	role?: number;
	status?: number | string;
	updatedAt?: string;
	userName?: string;
	userRoleId?: number;
	uuid?: string;
	birthYear?: string;
};

export type ChangePassword = {
	onClose: () => void;
	data: passwordFieldProps;
	onSubmitPassword: (content: { newPassword: string; confirmPassword: string }) => void;
};

export type ISuccessResponse<T> = {
	status: number;
	message: string;
	data: T;
};

export type IErrorResponse = {
	message: string;
	status: number;
};
