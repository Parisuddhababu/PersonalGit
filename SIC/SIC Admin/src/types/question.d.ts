export type QuestionDataArr = {
	id: number;
	uuid: string;
	order: number;
	title: string;
	activityTypeId: number;
	levelId: string;
	activityTypeName: string;
	isActive: boolean;
};

export type QuestionData = {
	status: number;
	message: string;
	data: {
		record: number;
		data: QuestionDataArr[];
	};
};

export type DndQuestionRowData = {
	dndItemRow: QuestionDataArr[];
	editRecord: (data: QuestionDataArr) => void;
	setNewOrder: (value: QuestionDataArr[]) => void;
	deleteQuestionDataModal: (data: QuestionDataArr) => void;
	setOrderChanged: (value: boolean) => void;
	onChangeStatus: (data: QuestionDataArr) => void;
	onSelect: (data: string) => void;
	selectedActivities: string[];
	copyRecord: (data: string) => void;
};
export type DndQuestionSortableTableItem = {
	item: QuestionDataArr;
	index: number;
	editRecord: (data: QuestionDataArr) => void;
	deleteQuestionDataModal: (data: QuestionDataArr) => void;
	onChangeStatus: (data: QuestionDataArr) => void;
	count: number;
	onSelect: (data: string) => void;
	selectedActivities: string[];
	copyRecord: (data: string) => void;
};
