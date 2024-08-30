type TitleTranslate = {
	chinese: string;
	pinyin: string;
};

export type SpeechToText = {
	chinese: string;
};

export type CreateImageActivityForm = {
	levelId?: string;
	lessonId: string;
	topicId: string;
	activityTypeId: string;

	title: string;
	simplifiedTitle: TitleTranslate[];
	simplifiedFile: string;
	simplifiedBackgroundAudio: string;
	simplifiedAudio: string;
	simplifiedIsMicAllowed: boolean;
	simplifiedSpeechToTextFile: string;
	simplifiedSpeechToTextDataArray: SpeechToText[];

	traditionalTitle: TitleTranslate[];
	traditionalFile: string;
	traditionalBackgroundAudio: string;
	traditionalAudio: string;
	traditionalIsMicAllowed: boolean;
	traditionalSpeechToTextFile: string;
	traditionalSpeechToTextDataArray: SpeechToText[];

	isSkippable: boolean;
	isForSeasonal?: boolean;
};

type activityData = {
	simplifiedTitle: TitleTranslate[];
	simplifiedFile: string;
	simplifiedBackgroundAudio: string;
	simplifiedAudio: string;
	simplifiedIsMicAllowed: boolean;
	simplifiedSpeechToTextFile: string;
	simplifiedSpeechToTextDataArray: SpeechToText[];
	traditionalTitle: TitleTranslate[];
	traditionalFile: string;
	traditionalBackgroundAudio: string;
	traditionalAudio: string;
	traditionalIsMicAllowed: boolean;
	traditionalSpeechToTextFile: string;
	traditionalSpeechToTextDataArray: SpeechToText[];
};

export type ImageActivitySubmitData = {
	levelId?: string;
	lessonId: string;
	topicId: string;
	activityTypeId: string;
	title: string;
	activityData: activityData;
	isSkippable: boolean;
	isForSeasonal?: boolean;
	isMoving: boolean;
};
