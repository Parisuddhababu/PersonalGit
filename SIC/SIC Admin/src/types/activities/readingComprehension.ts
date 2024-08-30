export type CreateReadingComprehensiveActivityForm = {
	levelId?: string;
	lessonId?: string;
	topicId?: string;
	activityTypeId?: string;

	title: string;

	phraseSimplified: [QnATranslate];

	phraseTraditional: [QnATranslate];

	audioSimplified: File | null;
	audioTraditional: File | null;

	isSkippable: boolean;
};

export type QnATranslate = {
	chinese: string;
	pinyin: string;
	english: string;
	audio: string;
};

export type QARecords = {
	activityDataId?: string;
	id: string;
	simplifiedPhrases: QnATranslate[];
	traditionalPhrases: QnATranslate[];
};
export type QARecordsData = {
	activityDataId: string;
	simplifiedPhrases: QnATranslate[];
	traditionalPhrases: QnATranslate[];
};

export type ReadingParagraphActivitySubmitData = {
	title: string;
	simplifiedFile: string;
	traditionalFile: string;
	activityData: QARecordsData[];
	isSkippable: boolean;
	isForSeasonal?: boolean;
	isForSop?: boolean;
};

export type DNDReadingParagraphOrderSort = {
	dndItemRow: QARecords[];
	editRecord: (data: QARecords) => void;
	setNewOrder: (value: QARecords[]) => void;
	deleteRecord: (data: QARecords) => void;
	editDisable: QARecords | null;
};

export type DndReadingParagraphSortableTableItem = {
	item: QARecords;
	index: number;
	editRecord: (data: QARecords) => void;
	deleteRecord: (data: QARecords) => void;
	editDisable: QARecords | null;
};
