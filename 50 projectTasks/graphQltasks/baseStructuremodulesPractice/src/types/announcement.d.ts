export type CreateAnnouncement = {
	title: string;
	annoucemntType: string;
	description: string;
	pushImage?: string;
	platform: string;
	userType: string;
	userFilter: string;
	startDate: string;
	endDate: string;
	userToExclude?: int[];
	onlySendTo?: int[];
};

export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	startDate: string;
	endDate: string;
};
export type FilterAnnouncementProps = {
	title: string;
	annoucemntType: string;
	platform: string;
	startDate: string;
	endDate: string;
	created_at: string;
	status: string | number | null;
};
export type AnnouncementProps = {
	onSearchAnnouncement: (value: FilterAnnouncementProps) => void;
};
export type PaginationParamsList = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	title: string;
	created_at: string;
	annoucemntType: string;
	platform: string;
	startDate: string;
	endDate: string;
	status: number | null;
};
