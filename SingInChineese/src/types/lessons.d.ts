export type CreateLesson = {
	name: string;
	title: [LessonTitleTranslate];
	sentencesData: [DndSentencesListing];
	rewardStars: number | string;
	levelId?: string;
	topicId?: string;
};

export type LessonsDataArr = {
	id: number;
	uuid: string;
	name: string;
	namePinging: string;
	nameTraditionalChinese: string;
	nameSimplifiedChinese: string;
	sentences: string;
	sentencesPinyin: string;
	sentencesTraditionalChinese: string;
	sentencesSimplifiedChinese: string;
	rewardStars: number;
	isActive: boolean;
	levelId: string;
	topicId: string;
};

export type AddEditLesson = {
	onClose: () => void;
	onSubmit: () => void;
	editData: LessonsDataArr | null;
};

export type LessonsData = {
	status: number;
	message: string;
	data: {
		lessons: LessonsDataArr[];
		count: number;
	};
};

export type DndLessonRowData = {
	dndItemRow: LessonsDataArr[];
	showDetails: (data: LessonsDataArr) => void;
	editRecord: (data: LessonsDataArr) => void;
	setNewOrder: (value: LessonsDataArr[]) => void;
	deleteLessonDataModal: (data: LessonsDataArr) => void;
	setOrderChanged: (value: boolean) => void;
	onChangeStatus: (data: LessonsDataArr) => void;
};
export type DndLessonSortableTableItem = {
	item: LessonsDataArr;
	index: number;
	showDetails: (data: LessonsDataArr) => void;
	editRecord: (data: LessonsDataArr) => void;
	deleteLessonDataModal: (data: LessonsDataArr) => void;
	onChangeStatus: (data: LessonsDataArr) => void;
	count: number;
};

export type LessonTitleTranslate = {
	pinyin: string;
	traditional: string;
	simplified: string;
};

type sentences = {
	sentences: string;
	sentencesPinging: string;
	sentencesTraditionalChinese: string;
	sentencesSimplifiedChinese: string;
};
export type LessonSubmitData = {
	name: string;
	title: LessonTitleTranslate[];
	sentences: sentences[];
	rewardStars: number | string;
	isForSeasonal?: boolean;
};
export type DndSentencesListing = {
	sentence: string;
	sentencePinging: string;
	sentenceTraditionalChinese: string;
	sentenceSimplifiedChinese: string;
};

export type lessonToggleId = {
	previousLessonUUID: string;
	nextLessonUUID: string;
};
