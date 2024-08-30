import { SpeechToText } from './image';

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
	simplifiedSpeechToTextDataArray: SpeechToText[];
	traditionalSpeechToTextDataArray: SpeechToText[];
	traditionalGameImageUrl: File | null;
	traditionalGameAudioUrl: File | null;
	simplifiedGameImageUrl: File | null;
	simplifiedGameAudioUrl: File | null;
};

export type flashCardActivityList = {
	activityDataId?: string;
	id: string;
	traditionalTitleEnglish: string;
	traditionalImageUrl?: string;
	traditionalAudioUrl: string;
	traditionalTitleChinese: string;
	traditionalPronunciationText?: string;
	traditionalSpeechToTextDataArray: SpeechToText[];
	simplifiedTitleEnglish: string;
	simplifiedImageUrl?: string;
	simplifiedAudioUrl: string;
	simplifiedTitleChinese: string;
	simplifiedPronunciationText?: string;
	simplifiedSpeechToTextDataArray: SpeechToText[];
	isFlashCardText: boolean;
	isTextToSpeech: boolean;
	categoryId?: string;
	traditionalGameImageUrl: string;
	traditionalGameAudioUrl: string;
	simplifiedGameImageUrl: string;
	simplifiedGameAudioUrl: string;
};

export type FlashCardActivityData = {
	activityDataId: string;
	traditionalTitleEnglish: string;
	traditionalImageUrl?: string;
	traditionalAudioUrl: string;
	traditionalTitleChinese: string;
	traditionalPronunciationText?: string;
	traditionalSpeechToTextDataArray: SpeechToText[];
	simplifiedTitleEnglish: string;
	simplifiedImageUrl?: string;
	simplifiedAudioUrl: string;
	simplifiedTitleChinese: string;
	simplifiedPronunciationText?: string;
	simplifiedSpeechToTextDataArray: SpeechToText[];
	isFlashCardText: boolean;
	isTextToSpeech: boolean;
	categoryId?: string;
	traditionalGameImageUrl: string;
	traditionalGameAudioUrl: string;
	simplifiedGameImageUrl: string;
	simplifiedGameAudioUrl: string;
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
	isMoving: boolean;
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