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
};

export type optionObject = {
	optionId: string;
	option: string;
	optionAudio: string;
};

export type DragAndDropActivitySubmitData = {
	levelId?: string;
	topicId?: string;
	lessonId?: string;
	title: string;
	activityData: {
		simplifiedImage: string;
		simplifiedQuestion: string;
		simplifiedOptions: optionObject[];
		simplifiedAnswerOptions: { optionId: string; option: string }[];
		simplifiedCorrectAnswer: string;
		traditionalImage: string;
		traditionalQuestion: string;
		traditionalOptions: optionObject[];
		traditionalCorrectAnswer: string;
		traditionalAnswerOptions: { optionId: string; option: string }[];
		simplifiedQuestionUrl: string;
		traditionalQuestionUrl: string;
	};
	isSkippable: boolean;
	isForSeasonal?: boolean;
	isForSop?: boolean;
};
