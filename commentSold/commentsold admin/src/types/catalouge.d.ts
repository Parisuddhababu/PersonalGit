export type UserProps = {
	onSearchUser: (value: FilterUserProps) => void;
	clearSelectionUserMng: () => void;
	filterData: PaginationParams
};

export type FilterUserProps = {
	fullName: string;
	email: string;
	status: string;
	gender: string;
	phoneNo: string;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	fullName: string;
	email: string;
	status: number | null;
	gender: number | null;
	phoneNo: string;
};

export type UserChangeProps = {
	onClose: () => void;
	changeUserStatus: () => void;
};

export type CatalougeForm = {
	name?: string;
	url: string;
	description: string;
	sku: string;
	images: string;
	color: string;
	size: string;
	price: string;
};

export type PasswordChange = {
	oldPassword: string;
	newPassword: string;
};
export type ChangeUserPassword = {
	onClose: () => void;
	UserObj: UserDataArr;
	show?: boolean;
};

export type PaginationParamsList = {
    limit: number;
    page: number;
    sortBy: string;
    sortOrder: string;
    name:string;
};