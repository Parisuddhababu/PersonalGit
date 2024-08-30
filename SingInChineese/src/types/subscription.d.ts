export type CreateSubscription = {
	subscriptionTypeId: string;
	name: string;
	description: string;
	price: number | string;
	allowedChildCount: number | string;
	isFreeTrialEnabled: boolean | string;
	freeTrialDuration: number | string;
	specialPrice?: number | string;
	specialNote?: string;
	priceDescription: string;
	playStoreId: string;
	appStoreId: string;
	buttonText: string;
};

export type SubscriptionArr = {
	id: number;
	uuid: string;
	planName: string;
	planDescription: string;
	planPrice: number;
	allowedChildCount: number;
	isFreeTrialEnabled: boolean;
	freeTrialDuration: number;
	subscriptionTypeId: number;
	playStoreId: number;
	appStoreId: number;
	isActive: boolean;
	order: number;
	priceDescription: string;
	createdAt: string;
	updatedAt: string;
	specialNote: string;
	specialPrice: number;
	buttonText: string;
};

export type AddEditSubscriptionData = {
	onSubmit: () => void;
	onClose: () => void;
	editData: SubscriptionArr | null;
	disableFields?: boolean;
};

export type SubscriptionStatusChange = {
	status: boolean;
};

export type SubscriptionData = {
	status: number;
	message: string;
	data: {
		record: number;
		data: SubscriptionArr[];
	};
};

export type DndSubscriptionRowData = {
	dndItemRow: SubscriptionArr[];
	showDetails: (data: SubscriptionArr) => void;
	editRecord: (data: SubscriptionArr) => void;
	setNewOrder: (value: SubscriptionArr[]) => void;
	deleteSubscription: (data: SubscriptionArr) => void;
	setOrderChanged: (value: boolean) => void;
	onChangeStatus: (data: SubscriptionArr) => void;
	setDisabled: (value: boolean) => void;
};
export type DndSubscriptionSortableTableItem = {
	item: SubscriptionArr;
	index: number;
	showDetails: (data: SubscriptionArr) => void;
	editRecord: (data: SubscriptionArr) => void;
	deleteSubscription: (data: SubscriptionArr) => void;
	onChangeStatus: (data: SubscriptionArr) => void;
	setDisabled: (value: boolean) => void;
	count: number;
};

export type DataToSubmit = {
	order: number;
	uuid: string;
}[];
