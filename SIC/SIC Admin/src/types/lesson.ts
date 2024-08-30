import { LevelArr } from './exam';

export type DndListItem = {
	english: string;
	chinese: string;
	id: string;
};
export type DndItem = {
	dndItemList: DndListItem[];
	removeItem: (id: string) => void;
};
export type DndSortableListItem = {
	item: DndListItem;
	removeItem: (id: string) => void;
	count: number;
};

export type DndTableItem = {
	id: number;
	uuid: string;
	title?: string;
	image?: string;
	loadTime?: number;
	createdAt?: string;
	updatedAt?: string;
	levelName?: string;
	levelNumber?: number;
	order?: number;
	isActive?: boolean;
};

export type DndSOPRowData = {
	dndItemRow: LevelArr[];
	showDetails: (data: LevelArr) => void;
	editRecord: (data: LevelArr) => void;
	setNewOrder: (value: LevelArr[]) => void;
	deleteExamData: (data: LevelArr) => void;
	setOrderChanged: (value: boolean) => void;
	onChangeStatus: (value: LevelArr) => void;
};
export type DndSOPSortableTableItem = {
	item: LevelArr;
	index: number;
	showDetails: (data: LevelArr) => void;
	editRecord: (data: LevelArr) => void;
	deleteExamData: (data: LevelArr) => void;
	onChangeStatus: (data: LevelArr) => void;
	count: number;
};

export type DataToSubmit = {
	order: number;
	uuid: string;
}[];

export type OrderDataToSubmit = {
	order?: DataToSubmit;
	levels?: DataToSubmit;
	activities?: DataToSubmit;
	lessons?: DataToSubmit;
};
