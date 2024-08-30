export type CreateFillBlanksActivity = {
	levelId?: string;
	topicId?: string;
	lessonId?: string;
	activityTypeId: string;
	title: string;
	imageSimplified: File | null;
	audioSimplified: File | null;
	optionSimplified: string;
	optionAudioSimplified: File | null;
	correctAnswerSimplified: string;
	correctAnswerAudioSimplified: File | null;
	traditionalCompleteActivityAudio: string;
	simplifiedCompleteActivityAudio: string;
	imageTraditional: File | null;
	audioTraditional: File | null;
	optionTraditional: string;
	optionAudioTraditional: File | null;
	correctAnswerTraditional: string;
	correctAnswerAudioTraditional: File | null;
	traditionalQuestionChinese: QuestionListData[];
	simplifiedQuestionChinese: QuestionListData[];
	isSkippable: boolean;
	sopLevelId?: string;
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

export type FillInTheBlanksActivitySubmitData = {
	levelId?: string;
	topicId?: string;
	lessonId?: string;
	activityTypeId?: string;
	title: string;
	traditionalQuestionsChinese: QuestionListData[];
	traditionalQuestionAudioUrl: string;
	traditionalImageUrl: string;
	traditionalAnswer: optionObject[];
	traditionalCorrectAnswer: string;
	traditionalOptions: optionObject[];
	traditionalCompleteActivityAudio: string;
	simplifiedQuestionsChinese: QuestionListData[];
	simplifiedQuestionAudioUrl: string;
	simplifiedImageUrl: string;
	simplifiedAnswer: optionObject[];
	simplifiedCorrectAnswer: string;
	simplifiedOptions: optionObject[];
	simplifiedCompleteActivityAudio: string;
	isSkippable: boolean;
	isForSeasonal?: boolean;
	isForSop?: boolean;
	isMoving: boolean;
	sopLevelId?: string;
};
