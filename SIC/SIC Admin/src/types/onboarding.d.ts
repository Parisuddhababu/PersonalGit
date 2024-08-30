export type CreateOnboardingData = {
	title: string;
	androidLandscapeImage: string;
	iphoneLandscapeImage: string;
	ipadLandscapeImage: string;
};

export type OnboardingData = {
	status: number;
	message: string;
	data: {
		record: number;
		data: OnboardingDataArr[];
	};
};

export type OnboardingDataArr = {
	id: number;
	image: string;
	loadTime: number;
	title: string;
	uuid: string;
	order: number;
	fileType: number;
};

export type AddEditOnboardingData = {
	onSubmit: () => void;
	onClose: () => void;
	editData: OnboardingDataArr | null;
	disableData: boolean;
};

export type OnboardingAPIData = {
	files: { '1920x1080': string; '2388x1668': string; '2436x1125': string };
	title: string;
	fileType: number;
};

export type DndRowData = {
	dndItemRow: OnboardingDataArr[];
	showDetails: (data: OnboardingDataArr) => void;
	editRecord: (data: OnboardingDataArr) => void;
	setNewOrder: (value: OnboardingDataArr[]) => void;
	deleteTopicData: (data: OnboardingDataArr) => void;
	setDisableData: (value: boolean) => void;
	setOrderChanged: (value: boolean) => void;
};
export type DndSortableTableItem = {
	item: OnboardingDataArr;
	index: number;
	showDetails: (data: OnboardingDataArr) => void;
	editRecord: (data: OnboardingDataArr) => void;
	deleteTopicData: (data: OnboardingDataArr) => void;
	setDisableData: (value: boolean) => void;
	count: number;
};
