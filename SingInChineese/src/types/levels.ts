export type CreateLevel = {
	id: number;
	levelName: string;
	createdAt: string;
	noOfTopics: number;
};

export type LevelDataArr = {
	id: number;
	uuid: string;
	levelName: string;
	levelNumber: string;
	order: number;
	isActive: boolean;
	rewardStars: number;
};

export type AddEditLevel = {
	onClose: () => void;
	editData: LevelDataArr | null;
	disableData: boolean;
	onSubmit: () => void;
};

export type LevelForm = {
	levelName: string;
	levelNumber: number | string;
	rewardStars: number | string;
};

export type LevelResponse = {
	count: number;
	levels: LevelDataArr[];
};

export type SingleLevelResponse = {
	data: LevelDataArr;
	message: string;
	status: number;
};

export type LevelStatusResponse = {
	isActive: boolean;
	isForSop?: boolean;
};

export type DndLevelRowData = {
	dndItemRow: LevelDataArr[];
	showDetails: (data: LevelDataArr) => void;
	editRecord: (data: LevelDataArr) => void;
	setNewOrder: (value: LevelDataArr[]) => void;
	deleteLevelDataModal: (data: LevelDataArr) => void;
	setOrderChanged: (value: boolean) => void;
	onChangeStatus: (data: LevelDataArr) => void;
};
export type DndLevelSortableTableItem = {
	item: LevelDataArr;
	index: number;
	showDetails: (data: LevelDataArr) => void;
	editRecord: (data: LevelDataArr) => void;
	deleteLevelDataModal: (data: LevelDataArr) => void;
	onChangeStatus: (data: LevelDataArr) => void;
	count: number;
};
