// seasonal topic
export type SeasonalTopicDataArr = {
	id: number;
	uuid: string;
	name: string;
	namePinging: string;
	nameSimplifiedChinese: string;
	nameTraditionalChinese: string;
	image: string;
	icon: string;
	rewardStars: number;
	startDate: string;
	endDate: string;
	order: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	createdBy: number;
};

export type AddEditSeasonalTopicData = {
	onClose: () => void;
	editData: SeasonalTopicDataArr | null;
	disableData: boolean;
	onSubmit: () => void;
};

export type CreateSeasonalTopic = {
	name: string;
	namePinging: string;
	nameTraditionalChinese: string;
	nameSimplifiedChinese: string;
	rewardStars: number | string;
	image: File | null;
	startDate: string;
	endDate: string;
	isForSeasonal: boolean;
	icon: File | null;
};

export type SeasonalTopicResponse = {
	status: number;
	message: string;
	data: {
		topicsList: SeasonalTopicDataArr[];
		count: number;
	};
};

export type ActivityKaraokeSeasonalData = {
	onSubmit: () => void;
	onClose: () => void;
	editData?: SeasonalTopicDataArr | null;
};

export type DndSeasonalTopicRowData = {
	dndItemRow: SeasonalTopicDataArr[];
	showDetails: (data: SeasonalTopicDataArr) => void;
	editRecord: (data: SeasonalTopicDataArr) => void;
	setNewOrder: (value: SeasonalTopicDataArr[]) => void;
	deleteLevelDataModal: (data: SeasonalTopicDataArr) => void;
	setOrderChanged: (value: boolean) => void;
	onChangeStatus: (data: SeasonalTopicDataArr) => void;
	addEditKaraokeSeasonal: (data: SeasonalTopicDataArr) => void;
};
export type DndSeasonalTopicSortableTableItem = {
	item: SeasonalTopicDataArr;
	index: number;
	showDetails: (data: SeasonalTopicDataArr) => void;
	editRecord: (data: SeasonalTopicDataArr) => void;
	deleteLevelDataModal: (data: SeasonalTopicDataArr) => void;
	onChangeStatus: (data: SeasonalTopicDataArr) => void;
	addEditKaraokeSeasonal: (data: SeasonalTopicDataArr) => void;
	count: number;
};

export type SeasonalLessonsDataArr = {
	id: number;
	uuid: string;
	name: string;
	namePinging: string;
	nameTraditionalChinese: string;
	nameSimplifiedChinese: string;
	vocabulary: string;
	vocabularyPinyin: string;
	vocabularyTraditionalChinese: string;
	vocabularySimplifiedChinese: string;
	sentences: string;
	sentencesPinyin: string;
	sentencesTraditionalChinese: string;
	sentencesSimplifiedChinese: string;
	order: number;
	rewardStars: number;
	isActive: boolean;
	topicId: string;
};

export type AddEditSeasonalLesson = {
	onClose: () => void;
	onSubmit: () => void;
	editData: SeasonalLessonsDataArr | null;
};

export type SeasonalLessonsData = {
	status: number;
	message: string;
	data: {
		lessons: SeasonalLessonsDataArr[];
		count: number;
	};
};

export type DndSeasonalLessonRowData = {
	dndItemRow: SeasonalLessonsDataArr[];
	showDetails: (data: SeasonalLessonsDataArr) => void;
	editRecord: (data: SeasonalLessonsDataArr) => void;
	setNewOrder: (value: SeasonalLessonsDataArr[]) => void;
	deleteLessonDataModal: (data: SeasonalLessonsDataArr) => void;
	setOrderChanged: (value: boolean) => void;
	onChangeStatus: (data: SeasonalLessonsDataArr) => void;
};
export type DndSeasonalLessonSortableTableItem = {
	item: SeasonalLessonsDataArr;
	index: number;
	showDetails: (data: SeasonalLessonsDataArr) => void;
	editRecord: (data: SeasonalLessonsDataArr) => void;
	deleteLessonDataModal: (data: SeasonalLessonsDataArr) => void;
	onChangeStatus: (data: SeasonalLessonsDataArr) => void;
	count: number;
};

// Seasonal Activities

export type DndSeasonalActivityRowData = {
	dndItemRow: SeasonalActivityDataArr[];
	editRecord: (data: SeasonalActivityDataArr) => void;
	setNewOrder: (value: SeasonalActivityDataArr[]) => void;
	deleteActivityDataModal: (data: SeasonalActivityDataArr) => void;
	setOrderChanged: (value: boolean) => void;
	onChangeStatus: (data: SeasonalActivityDataArr) => void;
	copyRecord: (data: string) => void;
	onSelect: (data: string) => void;
	selectedActivities: string[];
};
export type DndSeasonalActivitySortableTableItem = {
	item: SeasonalActivityDataArr;
	index: number;
	editRecord: (data: SeasonalActivityDataArr) => void;
	deleteActivityDataModal: (data: SeasonalActivityDataArr) => void;
	onChangeStatus: (data: SeasonalActivityDataArr) => void;
	copyRecord: (data: string) => void;
	count: number;
	onSelect: (data: string) => void;
	selectedActivities: string[];
};

export type SeasonalActivityDataArr = {
	id: number;
	uuid: string;
	order: number;
	activityTypeId: string;
	activityTypeName: string;
	isActive: boolean;
	isForSeasonal: boolean;
	title: string;
};
export type SeasonalActivityData = {
	status: number;
	message: string;
	data: {
		record: number;
		data: SeasonalActivityDataArr[];
	};
};

export type AddEditSeasonalActivityData = {
	onSubmit: () => void;
	onClose: () => void;
	activityUuid: string;
	url: string;
	toggleSeasonalActivity: (previousActivityUUID: string, previousActivityTypeUUID: string, nextActivityUUID: string, nextActivityTypeUUID: string) => void;
	topicId?: string;
	lessonId?: string;
	isMoving: boolean;
};
