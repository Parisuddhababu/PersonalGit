export type CreateDragAndDropActivity = {
	levelId?: string;
	topicId?: string;
	lessonId?: string;
	activityTypeId: string;
	title: string;
	simplifiedQuestionChinese: string;
	simplifiedImage: string;
	optionSimplified: string;
	optionAudioSimplified: string;
	simplifiedCorrectAnswer: string;
	traditionalQuestionAudio: string;
	simplifiedQuestionAudio: string;
	traditionalQuestionChinese: string;
	traditionalImage: string;
	optionTraditional: string;
	optionAudioTraditional: string;
	traditionalCorrectAnswer: string;
	isSkippable: boolean;
	traditionalCompleteActivityAudio: string;
	simplifiedCompleteActivityAudio: string;
	sopLevelId?: string;
};

export type optionObject = {
	optionId: string;
	option: string;
	optionAudio: string;
};

type answerObject = {
	optionId: string;
	option: string;
};

type activityData = {
	simplifiedImage: string;
	simplifiedQuestion: string;
	simplifiedOptions: optionObject[];
	simplifiedAnswerOptions: answerObject[];
	simplifiedCorrectAnswer: string;
	traditionalImage: string;
	traditionalQuestion: string;
	traditionalOptions: optionObject[];
	traditionalCorrectAnswer: string;
	traditionalAnswerOptions: answerObject[];
	simplifiedQuestionUrl: string;
	traditionalQuestionUrl: string;
	traditionalCompleteActivityAudio: string;
	simplifiedCompleteActivityAudio: string;
};

export type DragAndDropActivitySubmitData = {
	levelId?: string;
	topicId?: string;
	lessonId?: string;
	title: string;
	activityData: activityData;
	isSkippable: boolean;
	isForSeasonal?: boolean;
	isForSop?: boolean;
	isMoving: boolean;
	sopLevelId?: string;
};
