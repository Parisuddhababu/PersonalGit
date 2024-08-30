export type UserPropsData = {
	birthYear: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
};

export type UserListingData = {
	status: number;
	message: string;
	data: {
		record: number;
		totalRecord: number;
		data: UserData[];
	};
};

export type UserData = {
	birthYear: string;
	email: string;
	firstName: string;
	id: number;
	lastName: string;
	status: string;
	uuid: string;
	phone_number: string;
	loginType: string;
	createdAt: string;
	deletedAt: string;
	platform: string;
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	firstName: string;
	lastName: string;
	email: string;
	status: number | null;
	gender: number | null;
	phoneNo: string;
	search: string;
};

export type UserForm = {
	dateOfBirth: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	phoneCode: string | number;
};

export type UserDetails = {
	children: {
		record: number;
		data: {
			id: number;
			uuid: string;
			userId: number;
			fullName: string;
			avatarId: number;
			petId: number;
			birthDate: string;
			gender: string;
			language: string;
			starCount: number;
			profileImage: string;
			petLightning: number;
			petHeart: number;
			createdAt: string;
			updatedAt: string;
			createdBy: number;
			updatedBy: number;
			isActive: boolean;
		}[];
	};
	userDetail: { birthYear: string; email: string; firstName: string; id: number; lastName: string; phoneNumber: string; phoneCode: number; profileImage: string; status: string; uuid: string };
};

export type PasswordChange = {
	oldPassword: string;
	newPassword: string;
};
export type ChangeUserPassword = {
	onClose: () => void;
	userObj: UserDataArr;
};

export type AddEditUser = {
	onClose: () => void;
	editData: UserData | null;
	disableData: boolean;
	onSubmit: () => void;
};

export type ChangePasswordVariable = {
	newPassword: string;
	confirmPassword: string;
};

export type ChangePasswordUser = {
	onClose: () => void;
	data: userFiledProps;
	onSubmitPassword: (content: ChangePasswordVariable) => void;
};

export type UserStatusData = {
	action: string;
	value: boolean;
};
