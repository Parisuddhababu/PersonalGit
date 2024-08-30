export type PaginationParamsCoupon = {
	limit: number;
	page: number;
	sortBy: string;
	sortOrder: string;
	couponName: string;
	startTime?: string | Date;
	expireTime?: string | Date;
	status: number | null;
};
export type CouponColArrType = {
	name: string;
	sortable: boolean;
	fieldName: string;
};
export type CouponsManagementProps = {
	onSearchCoupon: (values: FilterCouponsProps) => void;
	clearSelectionCoupons:()=>void
};
export type FilterCouponsProps = {
	couponName: string;
	startTime?: string | Date;
	expireTime?: string | Date;
	status: string;
};
export type CreateUpdateCouponProps = {
	couponName: string;
	couponCode: string;
	startTime?: string;
	expireTime?: string;
	percentage?: number;
	radio?: string;
	couponType: string | number;
	isReusable: string | number;
	applicable: string | number;
};

export type UsersDataStructureType = {
	name: string;
	code: number;
};
