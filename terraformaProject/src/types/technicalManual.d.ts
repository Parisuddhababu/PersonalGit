export type PaginationParams = {
	limit: number;
	page: number;
	sortField: string;
	sortOrder: string;
	search: string;
};
export type CreateTechnical = {
	image_url?: string
	name?: string
	description?: string
	parent_id?: string
};
export type Location = {
	location?: string
	city?: string
};
