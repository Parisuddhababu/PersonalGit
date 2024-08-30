export type CreateStudentData = UpdateStudentData & {
	schoolId: string;
	teacherId: string;
	classRoomId: string;
	parentEmail: string;
};

export type UpdateStudentData = {
	parentFirstName: string;
	parentLastName: string;
	childFirstName: string;
	childLastName: string;
	childDOB: string;
	childGender: string;
	childLanguage: string;
};

export type StudentObj = {
	id: number;
	uuid: string;
	childFirstName: string;
	childLastName: string;
	childId: string;
	birthDate: string;
	gender: string;
	language: string;
	avatarId: number;
	petId: number;
	starCount: number;
	petLevel: number;
	petWaterLevel: number;
	petFoodLevel: number;
	isActive: boolean;
	parent: {
		firstName: string;
		lastName: string;
	};
};

export type StudentData = {
	count: number;
	rows: {
		id: number;
		uuid: string;
		children: StudentObj;
	}[];
};

export type ChangeStudentStatus = {
	childId: string;
	isActive: boolean;
};

export type ImportChild = {
	file: File | null;
	schoolId: string;
	teacherId: string;
	classRoomId: string;
};

export type ChildDataProps = {
	onClose: () => void;
	childId: string;
};

export type StudentProgressData = {
	name: string;
	dateOfBirth: string;
	avatar: string;
	pet: string;
	starCount: number;
	totalStarCount;
	currentLevel: number;
	currentLevelLessons: number;
	currentLevelLeftLessons: number;
	totalCompletedLessons: number;
	totalVocabulary: number;
	totalSentence: number;
	totalCharacters: number;
	weeklySpentHours: number;
	totalSpentDays: number;
};

export type MoveChild = {
	classRoomId: string;
	childId: string;
	keepData: boolean;
};

export type Class = {
	onClose: () => void;
	onSubmit: () => void;
	schoolId: string;
	classId: string;
	childId: string;
};

export type StudentGetData = {
	id: number;
	firstName: string;
	lastName: string;
	birthDate: string;
	language: string;
	gender: string;
	parent: {
		firstName: string;
		lastName: string;
		email: StringConstructor;
	};
	school: {
		id: number;
		uuid: string;
	};
	teacher: {
		id: number;
		uuid: string;
	};
	classroom: {
		id: number;
		uuid: string;
	};
};
