export type ExamResultsArr = {
	id: number;
	uuid: string;
	firstName: string;
	lastName: string;
	email: string;
	birthYear: number;
	phoneNumber: string;
	isActive: boolean;
	childrenCount: number;
};
export type childDetailArr = {
	birthDate: string;
	fullName: string;
	gender: string;
	id: number;
	uuid: string;
};
export type childResult = {
	id: number;
	name: string;
	number: string;
	percentage: number;
	requiredPercentage: number;
	uuid: string;
}[];
export type AddEditExamResults = {
	onClose: () => void;
	editData: ExamResultsArr | null;
	disableData: boolean;
};

export type ExamResultsForm = {
	firstName: string;
	lastName: string;
	email: string;
	birthYear: number;
	phoneNumber: string;
};

export type ExamResultsResponse = {
	id: number;
	uuid: string;
	firstName: string;
	lastName: string;
	email: string;
	birthYear: number;
	phoneNumber: string;
	isActive: boolean;
	childrenCount: number;
}[];
