import { type } from 'os';

export type ColArrType = {
	name: string;
	sortable: boolean;
	fildName: string;
};
export type PaginationParams = {
	limit: number;
	page: number;
	bannerTitle: string;
	createdBy: string;
	status: number | null;
	sortBy: string;
	sortOrder: string;
};

export type BannerDataType = {
	id: number;
	banner_image: string;
	banner_title: string;
	created_by: string;
	created_at: string;
	status: number;
	User: {
		first_name: string;
	};
};
export type BannerData = {
	BannerData: BannerDataType;
	count: number;
};
export type BannerChangeProps = {
	onClose: () => void;
	changeRoleStatus: () => void;
};
export type BannerEditProps = {
	isShowAddEditForm: boolean;
	onHandleChange?: React.ChangeEventHandler<HTMLInputElement>;
	onSubmitBanner: () => void;
	onClose?: () => void;
	isBannerEditable: boolean;
	bannerObj: roleData;
};

export type InitialValueProps = {
	bannerTitle: string;
	createdBy: string;
	status: number | null | string;
};
export type FilterDataProps = {
	filterBanner?: (value: FilterDataProps) => void;
	bannerTitle: string;
	createdBy: string;
	status: string;
};
export type FilterDataHandlerProps = {
	filterBanner: () => void;
};
export type BannerProps = {
	filterBanner: (value: FilterBannerProps) => void;
};


  