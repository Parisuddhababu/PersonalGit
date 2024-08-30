export type CreateClassroomrData = {
	schoolId: string;
	teacherId: string;
	topicIds?: string[];
	name: string;
	startDate: string;
	endDate: string;
};

export type ClassroomObj = {
	id: number;
	uuid: string;
	name: string;
	startDate: string;
	endDate: string;
	isActive: boolean;
	topics: string[];
	school: { uuid: string };
	teacher: {
		id: number;
		uuid: string;
		user: {
			firstName: string;
			lastName: string;
		};
	};
};

export type ClassroomData = {
	count: number;
	rows: ClassroomObj[];
};

export type AssignTeacherData = {
	onSubmit: () => void;
	onClose: () => void;
	editData: ClassroomObj | null;
	disabled?: boolean;
	isAssign?: boolean;
};

export type AssignTeacher = {
	schoolId: string;
	teacherId: string;
};

export type ClassroomGetData = AssignTeacher & {
	id: number;
	uuid: string;
	name: string;
	startDate: string;
	endDate: string;
	topics: { id: number; uuid: string; name: string }[];
};
