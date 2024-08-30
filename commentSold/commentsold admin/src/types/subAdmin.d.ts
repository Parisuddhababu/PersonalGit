export type FilterSubadminProps = {
	firstName?: string;
	lastName?: string;
	email?: string;
	status?: string;
	role?: string;
	search: string;
};

export type SubAdminProps = {
	onSearchSubAdmin: (value: FilterSubadminProps) => void;
	filterData: PaginationParams;
};

export type ColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
	type: 'image' | 'text' | 'date' | 'status' | 'action';
};

export type PaginationParams = {
	search: string;
};

export type SubAdminChangeProps = {
	onClose: () => void;
	changeRoleStatus: () => void;
};

export type DeleteSubAdminProps = {
	onClose: () => void;
	deleteSubAdmin: () => void;
};

export type ChangeSubAdminPassword = {
	onClose: () => void;
	subAdminObj: SubAdminDataArr;
	show?: boolean;
};

export type CreateSubAdmin = {
	firstName: string;
	lastName: string;
	email?: string;
	password: string;
	role: string;
	phoneNo: string;
	status: string;
	gender: string;
};
