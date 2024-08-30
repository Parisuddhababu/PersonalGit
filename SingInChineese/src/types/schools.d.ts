export type CreateSchoolData = {
	schoolName: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	contactPersonName: string;
	contactPersonPhoneNumber: string;
	contactEmail: string;
	schoolAdminUserPassword: string;
	paymentMode: number;
	paymentStartDate: string;
	paymentEndDate: string;
	amount: string | number;
	invoiceDate: string | null;
	invoiceUrl: string;
	invoiceNumber: string;
	paymentStatus: string | number;
	topicIds?: string[];
};

export type UpdateSchoolData = {
	schoolName: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	contactPersonName: string;
	contactPersonPhoneNumber: string;
	contactEmail: string;
	paymentMode: number;
	paymentStartDate: string;
	paymentEndDate: string;
	amount: string | number;
	invoiceDate: string | null;
	invoiceUrl: string;
	invoiceNumber: string;
	paymentStatus: string | number;
	topicIds: string[];
};

export type SchoolObj = {
	id: number;
	uuid: string;
	schoolName: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	schoolAdminId: number;
	user: {
		id: number;
		uuid: string;
		contactPersonName: string;
		contactPersonPhoneNumber: string;
		contactEmail: string;
		isActive: boolean;
	};
	topics: {
		id: number;
		name: string;
		uuid: string;
	}[];
	schoolPayment: {
		amount: number;
		paymentMode: number;
		paymentStatus: number;
		paymentStartDate: string;
		paymentEndDate: string;
		paymentDueDate: string;
		invoiceDate: string;
		invoiceUrl: string;
		invoiceNumber: string;
	};
	isActive: boolean;
	createdAt: string;
};

export type SchoolData = {
	rows: SchoolObj[];
	count: number;
};

export type TopicIds = {
	id: number;
	uuid: string;
	levelName: string;
	topics: { id: number; uuid: string; topicName: string }[];
}[];

export type SchoolDueDateObj = {
	id: number;
	uuid: string;
	schoolName: string;
	paymentEndDate: string;
	expireIn: number;
};

export type SchoolDueDateList = {
	status: number;
	message: string;
	data: {
		count: number;
		schools: SchoolDueDateObj[];
	};
};
