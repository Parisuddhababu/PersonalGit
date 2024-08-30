export type CreateAnnouncement = {
	title: string;
	announcementType: string;
	status: string | number;
	description: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	pushImage?: ImagePush | any;
	platform: string;
	userType: string;
	userFilter: string;
	startDate?: string;
	endDate?: string;
	userToExclude?: int[];
	onlySendTo?: int[];
};
export type ImagePush = {
	name: string | unknown;
};
export type PaginationParams = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
};
export type FilterAnnouncementProps = {
	title: string;
	startDate?: string | Date;
	endDate?: string | Date;
	announcementType: string;
	platform: string;
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
	startDate?: string | Date;
	endDate?: string | Date;
	announcementType: string;
	platform: string;
};
