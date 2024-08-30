type TitleTranslate = {
	chinese: string;
	pinyin: string;
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

	traditionalTitle: TitleTranslate[];
	traditionalFile: string;
	traditionalBackgroundAudio: string;
	traditionalAudio: string;
	traditionalIsMicAllowed: boolean;
	traditionalSpeechToTextFile: string;

	isSkippable: boolean;
	isForSeasonal?: boolean;
};

export type ImageActivitySubmitData = {
	levelId?: string;
	lessonId: string;
	topicId: string;
	activityTypeId: string;
	title: string;
	activityData: {
		simplifiedTitle: TitleTranslate[];
		simplifiedFile: string;
		simplifiedBackgroundAudio: string;
		simplifiedAudio: string;
		simplifiedIsMicAllowed: boolean;
		simplifiedSpeechToTextFile: string;
		traditionalTitle: TitleTranslate[];
		traditionalFile: string;
		traditionalBackgroundAudio: string;
		traditionalAudio: string;
		traditionalIsMicAllowed: boolean;
		traditionalSpeechToTextFile: string;
	};
	isSkippable: boolean;
	isForSeasonal?: boolean;
};
