export type CreateFlashCardActivity = {
	simplifiedImageUrl: File | null;
	simplifiedAudioUrl: File | null;
	simplifiedTitleChinese: string;
	simplifiedTitleEnglish: string;
	simplifiedPronunciationText?: string;
	traditionalImageUrl: File | null;
	traditionalAudioUrl: File | null;
	traditionalPronunciationText?: string;
	traditionalTitleChinese: string;
	traditionalTitleEnglish: string;
	title: string;
	categoryId: string;
};

export type flashCardActivityList = {
	activityDataId?: string;
	id: string;

	traditionalTitleEnglish: string;
	traditionalImageUrl?: string;
	traditionalAudioUrl: string;
	traditionalTitleChinese: string;
	traditionalPronunciationText?: string;
	simplifiedTitleEnglish: string;
	simplifiedImageUrl?: string;
	simplifiedAudioUrl: string;
	simplifiedTitleChinese: string;
	simplifiedPronunciationText?: string;
	isFlashCardText: boolean;
	isTextToSpeech: boolean;
	categoryId?: string;
};

export type FlashCardActivityData = {
	activityDataId: string;
	traditionalTitleEnglish: string;
	traditionalImageUrl?: string;
	traditionalAudioUrl: string;
	traditionalTitleChinese: string;
	traditionalPronunciationText?: string;
	simplifiedTitleEnglish: string;
	simplifiedImageUrl?: string;
	simplifiedAudioUrl: string;
	simplifiedTitleChinese: string;
	simplifiedPronunciationText?: string;
	isFlashCardText: boolean;
	isTextToSpeech: boolean;
	categoryId?: string;
};

export type FlashCardActivitySubmitData = {
	levelId?: string;
	topicId?: string;
	lessonId?: string;
	title: string;
	activityTypeId: string;
	activityData: FlashCardActivityData[];
	isSkippable: boolean;
	isForSeasonal?: boolean;
};

export type FlashCardTextArr = flashCardActivityList[];

export type DNDFlashCardOrderSort = {
	dndItemRow: flashCardActivityList[];
	editRecord: (data: flashCardActivityList) => void;
	setNewOrder: (value: flashCardActivityList[]) => void;
	deleteRecord: (data: string) => void;
	editDisable: flashCardActivityList | null;
};
export type DndFlashCardOrderSortableTableItem = {
	item: flashCardActivityList;
	index: number;
	editRecord: (data: flashCardActivityList) => void;
	deleteRecord: (data: string) => void;
	editDisable: flashCardActivityList | null;
};
