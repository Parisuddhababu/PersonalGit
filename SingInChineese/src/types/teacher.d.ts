export type CreateTeacherData = {
	teacherFirstName: string;
	teacherLastName: string;
	teacherPhoneNumber: string;
	schoolId: string;
	teacherEmail: string;
	teacherPassword: string;
};

export type UpdateTeacherData = {
	teacherFirstName: string;
	teacherLastName: string;
	teacherPhoneNumber: string;
};

export type TeacherObj = {
	id: number;
	uuid: string;
	isActive: boolean;
	user: {
		id: number;
		uuid: string;
		teacherFirstName: string;
		teacherLastName: string;
		teacherPhoneNumber: string;
		teacherEmail: string;
	};
	school: {
		id: number;
		uuid: string;
		schoolName: string;
		city: string;
		state: string;
		country: string;
		address: string;
		isActive: boolean;
	};
	classroom: {
		uuid: string;
		name: string;
	}[];
};

export type TeacerData = {
	rows: TeacherObj[];
	count: number;
};
