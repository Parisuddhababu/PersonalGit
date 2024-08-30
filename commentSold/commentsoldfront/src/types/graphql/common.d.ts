export type MetaRes = {
	message: string;
	messageCode: string;
	status: string;
	statusCode: number;
	status: string;
	type: string;
	errors: { errorField: string; error: string; __typename: string }[];
	errorType: string;
};

export type PaginationParamsList = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	search?: string;
	name?: string;
};

