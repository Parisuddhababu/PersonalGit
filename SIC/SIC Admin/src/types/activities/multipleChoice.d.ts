export type CreateMultipleActivity = {
	levelId?: string;
	topicId?: string;
	lessonId?: string;
	activityTypeId: string;
	title: string;
	simplifiedQuestionChinese: [QuestionListData];
	imageSimplified: File | null;
	audioSimplified: File | null;
	optionSimplified: string;
	optionAudioSimplified: File | null;
	correctAnswerSimplified: string;
	correctAnswerAudioSimplified: File | null;
	traditionalQuestionChinese: [QuestionListData];
	imageTraditional: File | null;
	audioTraditional: File | null;
	optionTraditional: string;
	optionAudioTraditional: File | null;
	correctAnswerTraditional: string;
	correctAnswerAudioTraditional: File | null;
	isSkippable: boolean;
};

export type flashCardActivityList = {
	activityDataId: number;
	simplifiedImageUrl: string;
	simplifiedAudioUrl: string;
	simplifiedTitleChinese: string;
	simplifiedPronunciationText: string;
	traditionalImageUrl: string;
	traditionalAudioUrl: string;
	traditionalTitleChinese: string;
	traditionalPronunciationText: string;
	isTextToSpeech: boolean;
	englishTitle: string;
};

export type optionObject = {
	optionId: string;
	optionValue: string;
	optionFileUrl: string;
};

export type QuestionListData = {
	chinese: string;
	english: string;
	pinyin: string;
};

export type MultipleChoiceActivitySubmitData = {
	levelId?: string;
	activityId?: string;
	topicId?: string;
	lessonId?: string;
	activityTypeId?: string;

	title: string;
	traditionalQuestion: QuestionListData[];
	traditionalQuestionUrl: string;
	traditionalImageUrl: string;

	traditionalAnswer: optionObject;

	traditionalOptions: optionObject[];
	simplifiedQuestion: QuestionListData[];
	simplifiedAnswer: optionObject;
	simplifiedImageUrl: string;
	simplifiedOptions: optionObject[];
	simplifiedQuestionUrl: string;
	isSkippable: boolean;
	isForSeasonal?: boolean;
	isForSop?: boolean;
};
